import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './constants/website-content';
import { ChatRulesService } from '../support-chat/services/chat-rules.service';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private chatRulesService: ChatRulesService,
    private fileUploadService: FileUploadService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      console.warn('OPENAI_API_KEY is not defined in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: apiKey || 'dummy-key-to-prevent-startup-crash',
    });
  }

  async generateResponse(userMessage: string) {
    // 1. Check for Chatbot Rules (Priority)
    try {
      const activeRules = this.chatRulesService.getActiveRules();
      const lowerMessage = userMessage.toLowerCase().trim();

      // Sort rules by priority (highest first) if not already sorted
      // Assuming getActiveRules returns them sorted or we sort here if needed
      // Currently simple matching:

      for (const rule of activeRules) {
        if (!rule.isActive) continue;

        for (const keyword of rule.keywords) {
          const lowerKeyword = keyword.toLowerCase().trim();

          if (rule.matchType === 'exact') {
            if (lowerMessage === lowerKeyword) {
              return { reply: rule.response };
            }
          } else {
            // 'contains'
            if (lowerMessage.includes(lowerKeyword)) {
              return { reply: rule.response };
            }
          }
        }
      }
    } catch (err) {
      console.error('Error checking chat rules:', err);
      // Continue to AI if rules fail
    }

    // 2. Fallback to AI
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return { reply: "I'm sorry, my brain is offline right now (Missing API Key)." };
    }

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        model: 'gpt-4o-mini',
        temperature: 0.3, // Low temperature for strict adherence to context
        max_tokens: 300,
      });

      return { reply: completion.choices[0].message.content };
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new InternalServerErrorException('Failed to generate response');
    }
  }

  async generateLessonReviewResponse(params: { message: string; levelName: string; day: string; lessonName: string }) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      return { reply: "I'm sorry, my brain is offline right now (Missing API Key)." };
    }

    try {
      // 1. Retrieve Lesson Content
      // Map frontend camelCase to backend snake_case for DTO if necessary, assuming FileUploadService expects snake_case in DTO or arguments
      // Looking at FileUploadService.getContentByName(uploadFileDTO: UploadFileDTO), DTO has level_name, day, lesson_name

      const lessonData = await this.fileUploadService.getContentByName({
        level_name: params.levelName as any,
        day: params.day,
        lesson_name: params.lessonName as any
      });

      let lessonContextString = "No specific lesson content found.";
      let aiInstructions = "";

      if (lessonData && lessonData.data && lessonData.data.length > 0) {
        const lesson = lessonData.data[0];
        lessonContextString = JSON.stringify(lesson);
        // Extract optional AI instructions if they exist in the lesson object
        if (lesson.aiInstructions) {
          aiInstructions = `\n\nSPECIAL INSTRUCTIONS FOR AI:\n${lesson.aiInstructions}`;
        }
      }

      // 2. Build Prompt
      const systemPromptWithContext = `${SYSTEM_PROMPT}
      
      CURRENT LESSON CONTEXT:
      The user has just completed the following lesson. Use this content to guide the review. 
      Ask questions about the vocabulary, sentences, or concepts found here.
      
      ${lessonContextString}

      ${aiInstructions}
      `;

      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPromptWithContext },
          { role: 'user', content: params.message },
        ],
        model: 'gpt-4o-mini',
        temperature: 0.5, // Slightly higher for more natural conversation
        max_tokens: 400,
      });

      return { reply: completion.choices[0].message.content };

    } catch (error) {
      console.error('Lesson Review AI Error:', error);
      throw new InternalServerErrorException('Failed to generate lesson review');
    }
  }
}
