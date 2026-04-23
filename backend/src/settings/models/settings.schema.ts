import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class Settings extends AbstractDocument {
  // Array of discounts (percentages) for subsequent course purchases.
  // Example: [15, 20] means 15% discount for 2nd course, 20% for 3rd course and onwards.
  @Prop({ type: [Number], default: [] })
  repurchaseDiscounts: number[];
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
