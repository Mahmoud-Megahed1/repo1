import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportChatController } from './support-chat.controller';
import { SupportChatService } from './support-chat.service';
import { ChatRule, ChatRuleSchema } from './schemas/chat-rule.schema';
import { ChatRulesController } from './controllers/chat-rules.controller';
import { ChatRulesService } from './services/chat-rules.service';
import { ChatRuleRepo } from './repo/chat-rule.repo';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { ChatConversation, ChatConversationSchema } from './schemas/chat.schema';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ChatConversation.name, schema: ChatConversationSchema },
            { name: ChatRule.name, schema: ChatRuleSchema },
        ]),
        UserModule,
        AdminAuthModule,
    ],
    controllers: [SupportChatController, ChatRulesController],
    providers: [SupportChatService, ChatRulesService, ChatRuleRepo],
    exports: [SupportChatService],
})
export class SupportChatModule { }
