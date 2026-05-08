import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

export enum TestimonialStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop()
  avatar: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: TestimonialStatus, default: TestimonialStatus.PENDING })
  status: TestimonialStatus;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
