import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LessonReviewChatDocument = LessonReviewChat & Document;

@Schema({ timestamps: true })
export class LessonReviewMessage {
    @Prop({ required: true, enum: ['user', 'assistant'] })
    role: string;

    @Prop({ required: true })
    content: string;

    @Prop({ default: Date.now })
    timestamp: Date;
}

export const LessonReviewMessageSchema = SchemaFactory.createForClass(LessonReviewMessage);

@Schema({ timestamps: true })
export class LessonReviewChat {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    userId: string;

    @Prop({ required: true })
    levelName: string;

    @Prop({ required: true })
    day: string;

    @Prop({ required: true })
    lessonName: string;

    @Prop({ type: [LessonReviewMessageSchema], default: [] })
    messages: LessonReviewMessage[];
}

export const LessonReviewChatSchema = SchemaFactory.createForClass(LessonReviewChat);

// Compound index to quickly find chat for specific lesson
LessonReviewChatSchema.index({ userId: 1, levelName: 1, day: 1, lessonName: 1 });
