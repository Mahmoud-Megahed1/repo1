import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { AbstractSchema, AbstractDocument } from '../common/database/abstract.schema';

export type ThemeDocument = HydratedDocument<Theme>;

@Schema({ timestamps: true, id: true })
export class Theme extends AbstractDocument {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty()
  @Prop({ required: true })
  endDate: Date;

  @ApiProperty()
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Prop({ type: Object, default: {} })
  assets: {
    backgroundImage?: string;
    logo?: string;
  };

  @ApiProperty()
  @Prop({ type: Object, default: {} })
  styles: {
    primaryColor?: string;
    secondaryColor?: string;
  };

  // AI Chat Settings
  @ApiProperty({ description: 'Show/hide the support chat widget' })
  @Prop({ default: true })
  showSupportChat: boolean;

  @ApiProperty({ description: 'Show/hide the AI lesson review chat' })
  @Prop({ default: true })
  showAIReviewChat: boolean;

  @ApiProperty({ description: 'Additional context/knowledge for the AI to use (e.g., uploaded document content)' })
  @Prop({ default: '' })
  aiKnowledgeContext: string;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);
