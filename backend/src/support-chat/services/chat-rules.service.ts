import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChatRuleRepo } from '../repo/chat-rule.repo';
import { ChatRule } from '../schemas/chat-rule.schema';
import { CreateChatRuleDto, UpdateChatRuleDto } from '../dto/chat-rule.dto';
import { GetChatRulesDto } from '../dto/get-chat-rules.dto';

@Injectable()
export class ChatRulesService implements OnModuleInit {
    private activeRulesCache: ChatRule[] = [];

    constructor(private readonly chatRuleRepo: ChatRuleRepo) { }

    async onModuleInit() {
        await this.refreshCache();
    }

    async refreshCache() {
        this.activeRulesCache = await this.chatRuleRepo.findActiveRules();
    }

    getActiveRules() {
        return this.activeRulesCache;
    }

    async create(dto: CreateChatRuleDto) {
        const rule = await this.chatRuleRepo.create(dto);
        await this.refreshCache();
        return rule;
    }

    async findAll(query?: any) {
        // TODO: Implement filtering with query
        return this.chatRuleRepo.find({}, null); // No session
    }

    async update(id: string, dto: UpdateChatRuleDto) {
        const updated = await this.chatRuleRepo.findOneAndUpdate({ _id: id } as any, dto);
        await this.refreshCache();
        return updated;
    }

    async delete(id: string) {
        const deleted = await this.chatRuleRepo.findOneAndDelete({ _id: id } as any);
        await this.refreshCache();
        return deleted;
    }
}
