import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChatDocument = ChatConversation & Document;

@Schema({ _id: false })
export class ChatReadBy {
  @Prop({ default: false })
  user: boolean;

  @Prop({ default: false })
  admin: boolean;
}

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ required: true, enum: ['user', 'bot', 'admin'] })
  sender: string;

  @Prop({ required: true, maxlength: 1000 })
  content: string;

  @Prop({ default: 'unknown' })
  intent: string;

  @Prop({ default: 1 })
  confidence: number;

  @Prop({ type: ChatReadBy, default: () => ({ user: false, admin: false }) })
  readBy: ChatReadBy;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

@Schema({ timestamps: true })
export class ChatConversation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 'bot', enum: ['bot', 'admin'] })
  handledBy: string;

  @Prop({ default: Date.now })
  lastMessageAt: Date;

  @Prop({ type: [ChatMessageSchema], default: [] })
  messages: ChatMessage[];
}

export const ChatConversationSchema = SchemaFactory.createForClass(ChatConversation);

// Index for getting user's active conversation
ChatConversationSchema.index({ userId: 1, isActive: 1 });
