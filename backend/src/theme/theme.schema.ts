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
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);
