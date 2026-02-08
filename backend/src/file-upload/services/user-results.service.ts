import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { distance, closest } from 'fastest-levenshtein';
import { SpeakCompareTranscriptsDto } from '../dto/speak-compare-transcripts.dto';
import { TransformersAudioTranscribe } from '../../common/services/transformers-audio-transcribe.service';
import { FileUploadService } from '../file-upload.service';
import { User } from '../../user/models/user.schema';
import { UserService } from '../../user/user.service';
import { LESSONS } from '../../common/shared/enums';

@Injectable()
export class UserResultsService {
  private readonly logger = new Logger(UserResultsService.name);

  constructor(
    private readonly transformersAudioTranscribe: TransformersAudioTranscribe,
    private readonly fileUploadService: FileUploadService,
    private readonly userService: UserService,
  ) { }

  async compareSpeakTranscript(
    speakCompareTranscriptsDto: SpeakCompareTranscriptsDto,
    audioFile: Express.Multer.File,
    user: User,
  ) {
    const { sentenceText } = speakCompareTranscriptsDto;

    if (!audioFile) {
      throw new BadRequestException('Audio file is required');
    }

    const correctSentence = (sentenceText ?? '').trim();
    if (!correctSentence) {
      throw new BadRequestException('sentenceText is required and must be non-empty');
    }

    // Validate before transcription to avoid wasting resources
    this.validateAudioFileSize(audioFile);

    const userTranscript = await this.transcribeAudio(audioFile);

    if (!userTranscript.trim()) {
      throw new BadRequestException('Could not transcribe audio. Please try again.');
    }

    const similarityPercentage = this.calculateSimilarity(correctSentence, userTranscript);

    // Save the recording for persistence
    let audioUrl: string | null = null;
    try {
      // Save based on lesson type: TODAY -> single file, SPEAK -> granular
      let uploadResult;

      if (speakCompareTranscriptsDto.lesson_name === LESSONS.TODAY) {
        uploadResult = await this.fileUploadService.uploadUserAudio(
          audioFile,
          {
            level_name: speakCompareTranscriptsDto.level_name,
            day: speakCompareTranscriptsDto.day.toString(),
            lesson_name: LESSONS.SPEAK, // Legacy: "Today" expects SPEAK folder or similar? Wait, keeping it consistent with old behavior
          },
          user._id.toString(),
          {
            similarityPercentage,
            correctSentence,
            userTranscript,
            isPassed: similarityPercentage >= 70,
          }
        );
      } else {
        // Default (including SPEAK): Save unique files per sentence
        uploadResult = await this.fileUploadService.uploadUserSentenceAudio(
          audioFile,
          user._id.toString(),
          speakCompareTranscriptsDto.level_name,
          correctSentence,
          {
            similarityPercentage,
            correctSentence,
            userTranscript,
            isPassed: similarityPercentage >= 70,
          }
        );
      }
      audioUrl = uploadResult.url;

      // Persist the task completion with result
      await this.userService.markTaskAsCompleted(
        user._id.toString(),
        speakCompareTranscriptsDto.level_name,
        speakCompareTranscriptsDto.day,
        correctSentence, // Task Name often matches sentence or ID
        { audioUrl, userTranscript, correctSentence, similarityPercentage },
        similarityPercentage,
        similarityPercentage >= 70 ? 'Passed' : 'Try Again'
      );

    } catch (err) {
      console.error('CRITICAL: Failed to persist user sentence audio:', err);
      this.logger.error(`Failed to persist user sentence audio: ${err.message}`, err.stack);
      // Don't fail the comparison if save fails, just log it
    }

    return {
      similarityPercentage,
      correctSentence,
      userTranscript,
      isPassed: similarityPercentage >= 70,
      audioUrl, // Return the persisted URL
    };
  }

  private calculateSimilarity(originalText: string, spokenText: string): number {
    try {
      const normalize = (text: string) => {
        return text
          .toLowerCase()
          .replaceAll(/[^\w\s]/g, '') // Slightly faster than replaceAll
          .replaceAll(/\s+/g, ' ')
          .trim();
      };

      const normalizedOriginal = normalize(originalText);
      const normalizedSpoken = normalize(spokenText);

      if (!normalizedOriginal || !normalizedSpoken) return 0;

      // Method 1: Overall string similarity
      const dist = distance(normalizedOriginal, normalizedSpoken);
      const maxLen = Math.max(normalizedOriginal.length, normalizedSpoken.length);
      const overallSimilarity = 1 - (dist / maxLen);

      // Method 2: Word-by-word comparison
      const originalWords = normalizedOriginal.split(/\s+/);
      const spokenWords = normalizedSpoken.split(/\s+/);

      if (originalWords.length === 0) return 0;

      let wordMatches = 0;
      const DISTANCE_THRESHOLD = 2;

      for (const origWord of originalWords) {
        const closestWord = closest(origWord, spokenWords);
        const wordDist = distance(origWord, closestWord);

        if (wordDist <= DISTANCE_THRESHOLD) {
          wordMatches++;
        }
      }

      const wordSimilarity = wordMatches / originalWords.length;

      // Length penalty - penalize extra words (relaxed from 0.1 to 0.02)
      const lengthPenalty = spokenWords.length > originalWords.length
        ? Math.max(0.8, 1 - (spokenWords.length - originalWords.length) * 0.02)
        : 1;

      // Combine metrics (favor word-level accuracy)
      const finalScore = (
        overallSimilarity * 0.4 +
        wordSimilarity * 0.6
      ) * lengthPenalty;

      return Math.round(finalScore * 100);

    } catch (error) {
      this.logger.error(`Similarity calculation error: ${error.message}`);
      return 0;
    }
  }

  private async transcribeAudio(audioFile: Express.Multer.File): Promise<string> {
    this.logger.log(`Transcribing: ${audioFile.originalname} (${(audioFile.size / 1024).toFixed(2)} KB)`);

    // Removed model option - service now uses preloaded model
    const text = await this.transformersAudioTranscribe.transcribeAudio(audioFile.buffer);

    return text;
  }

  private validateAudioFileSize(audioFile: Express.Multer.File) {
    const MAX = 20 * 1024 * 1024; // 20MB
    if (audioFile.size > MAX) {
      throw new BadRequestException('Audio file is too large (max 20 MB)');
    }
  }
}