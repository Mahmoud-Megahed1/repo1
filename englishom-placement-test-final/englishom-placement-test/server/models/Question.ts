import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  stage: 'visual' | 'auditory' | 'spelling' | 'reading' | 'vocal';
  level: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced';
  questionText: string;
  imageData?: string; // Base64 encoded image
  audioData?: string; // Base64 encoded audio
  correctAnswer: string;
  options: string[];
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    stage: {
      type: String,
      enum: ['visual', 'auditory', 'spelling', 'reading', 'vocal'],
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced'],
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    imageData: {
      type: String, // Base64 string
      default: undefined,
    },
    audioData: {
      type: String, // Base64 string
      default: undefined,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
