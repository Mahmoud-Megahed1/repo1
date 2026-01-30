import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepo } from '../../common/database/repo/abstract.repo';
import { ChatRule, ChatRuleDocument } from '../schemas/chat-rule.schema';

@Injectable()
export class ChatRuleRepo extends AbstractRepo<ChatRuleDocument> {
    constructor(
        @InjectModel(ChatRule.name) private readonly chatRuleModel: Model<ChatRuleDocument>,
    ) {
        super(chatRuleModel);
    }

    async findActiveRules() {
        return this.chatRuleModel.find({ isActive: true }).sort({ priority: -1 }).lean();
    }
}
