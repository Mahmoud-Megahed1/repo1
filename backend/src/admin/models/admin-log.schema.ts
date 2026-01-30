import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class AdminLog extends AbstractDocument {
    @Prop({ type: SchemaTypes.ObjectId, ref: 'Admin', required: true })
    adminId: Types.ObjectId;

    @Prop({ required: true })
    action: string; // e.g., 'DELETE_COURSE'

    @Prop({ type: SchemaTypes.ObjectId, required: true })
    targetUserId: Types.ObjectId;

    @Prop({ type: Object })
    metadata: any;
}

export const AdminLogSchema = SchemaFactory.createForClass(AdminLog);
