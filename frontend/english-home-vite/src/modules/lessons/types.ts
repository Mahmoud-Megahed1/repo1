import type { LessonId, LevelId } from '@shared/types/entities';

export type LessonProps = {
  levelId: string;
  day: string;
};

export type LessonParams = {
  lesson_name: LessonId;
  level_name: LevelId;
  day: string;
};

export type ReadLesson = {
  id: string;
  soundSrc: string;
  transcript: string;
};

export type ListenLesson = {
  id: string;
  soundSrc: string;
  transcript: string;
  definitions: Array<{
    word: string;
    definition: string;
    soundSrc: string;
  }>;
};

export type PictureLesson = {
  id: string;
  pictureSrc: string;
  soundSrc: string;
  wordAr: string;
  wordEn: string;
  definition: string;
  examples: string[];
};

export type GrammarLesson = {
  id: string;
  nameEn: string;
  nameAr: string;
  definitionAr: string;
  definitionEn: string;
  useCases: {
    en: string[];
    ar: string[];
  };
  examples: string[];
  words?: string[];
  notes?: string;
};

export type QuestionAnswerLesson = {
  id: string;
  question: string;
  answer: string;
  questionSrc: string;
  answerSrc: string;
};

export type PhrasalVerbLesson = {
  id: string;
  exampleAr: string;
  exampleEn: string;
  sentence: string;
  soundSrc: string;
  pictureSrc: string;
};

export type TodayLesson = {
  id: string;
  title: string;
  description: string;
  soundSrc: string;
  instructions: Array<{
    word: string;
    definition: string;
  }>;
  sentences: string[];
};

export type WritingLesson = {
  id: string;
  sentences: string[];
};

export type SpeakLesson = {
  id: string;
  sentences: Array<{
    sentence: string;
    soundSrc: string;
  }>;
};

export type DailyTestLesson = {
  id: string;
  type: 'text' | 'audio' | 'image';
  question: string;
  answers: Array<{
    text: string;
    isCorrect: boolean;
  }>;
};

export type SpeakingResult = {
  similarityPercentage: number;
  correctSentence: string;
  userTranscript: string;
  isPassed: boolean;
};
