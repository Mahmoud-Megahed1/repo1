import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';

export type ChatRuleDocument = ChatRule & AbstractDocument;

@Schema({ timestamps: true })
export class ChatRule extends AbstractDocument {
    @Prop({ type: [String], required: true })
    keywords: string[];

    @Prop({ required: true })
    response: string;

    @Prop({
        required: true,
        enum: ['exact', 'contains'],
        default: 'contains',
    })
    matchType: 'exact' | 'contains';

    @Prop({ default: 0 })
    priority: number;

    @Prop({ default: true })
    isActive: boolean;
}

export const ChatRuleSchema = SchemaFactory.createForClass(ChatRule);
