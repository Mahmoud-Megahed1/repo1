import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Level_Name } from 'src/common/shared/enums';
import { AbstractDocument } from '../../common/database/abstract.schema';

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret._id = ret._id.toString();
      return ret;
    },
  },
})
export class Course extends AbstractDocument {
  @Prop({ required: true, unique: true, enum: Level_Name })
  level_name: Level_Name;

  @Prop({ required: true })
  titleAr: string;

  @Prop({ type: String })
  descriptionAr: string;

  @Prop({ required: true })
  titleEn: string;

  @Prop({ type: String })
  descriptionEn: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: Number, default: null })
  originalPrice: number; // السعر قبل الخصم - يظهر مشطوبًا في واجهة الطالب

  @Prop({ required: true, type: Boolean, default: true })
  isAvailable: boolean;

  @Prop({ type: Boolean, default: true })
  showPrice: boolean;

  @Prop({ type: Boolean, default: false })
  isTrialEnabled: boolean;

  @Prop({ required: true, type: Number, default: 50 })
  daysCount: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
