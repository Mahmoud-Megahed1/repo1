import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatConversation, ChatDocument, ChatMessage } from './schemas/chat.schema';
import { User } from '../user/models/user.schema';
import { UserRepo } from '../user/repo/user.repo';

import { ChatRulesService } from './services/chat-rules.service';

@Injectable()
export class SupportChatService {
    private readonly logger = new Logger(SupportChatService.name);
    private readonly MAX_MESSAGES = 200;

    constructor(
        @InjectModel(ChatConversation.name) private chatModel: Model<ChatDocument>,
        private userRepo: UserRepo,
        private readonly chatRulesService: ChatRulesService,
    ) { }

    async getHistory(user: User) {
        // ... (unchanged)
        // 1. Atomic Welcome Injection
        if (!user.hasSeenChatWelcome) {
            await this.injectWelcomeMessage(user._id.toString());
            // Update flag atomically to prevent double injection
            await this.userRepo.setSeenChatWelcome(user._id.toString());
        }

        // 2. Fetch Active Conversation
        const conversation = await this.chatModel.findOne(
            { userId: user._id.toString(), isActive: true },
            { messages: { $slice: -50 } } // Last 50 messages only for initial load
        ).lean();

        return conversation || { messages: [] };
    }

    async processUserMessage(user: User, content: String) {
        // ... (unchanged logic, calling analyzeMessage)
        const userId = user._id.toString();

        // 1. Get or Create Conversation
        let conversation = await this.chatModel.findOne({ userId, isActive: true });
        if (!conversation) {
            conversation = new this.chatModel({ userId, isActive: true });
        }

        // 2. Add User Message
        const userMsg: ChatMessage = {
            sender: 'user',
            content: content as string,
            intent: 'user_query',
            confidence: 1,
            readBy: { user: true, admin: false },
        };

        // 3. Rule Engine Analysis
        const botResponse = this.analyzeMessage(content as string);

        // 4. Update Conversation (Push both messages)
        const updateOps: any = {
            $push: { messages: { $each: [userMsg] } },
            $set: { lastMessageAt: new Date() },
        };

        if (conversation.handledBy === 'bot') {
            const botMsg: ChatMessage = {
                sender: 'bot',
                content: botResponse.reply,
                intent: botResponse.intent,
                confidence: botResponse.confidence,
                readBy: { user: false, admin: false },
            };
            // If confidence is low, flag for admin (future logic), currently just log
            if (botResponse.confidence < 0.4) {
                this.logger.log(`Low confidence bot reply for user ${userId}: ${botResponse.intent}`);
            }
            updateOps.$push.messages.$each.push(botMsg);
        }

        // 5. Enforce Hard Limit (Simple slice strategy for now, mostly handled by keeping the array reasonably sized)
        // Real "hard limit" with eviction usually requires $slice in update or separate pull, 
        // but for Phase 1, we just monitor. 
        // To strictly enforce 200, we'd use:
        // $push: { messages: { $each: [msg], $slice: -200 } }
        updateOps.$push.messages.$slice = -this.MAX_MESSAGES;

        const updated = await this.chatModel.findOneAndUpdate(
            { userId, isActive: true },
            updateOps,
            { new: true, upsert: true }
        ).lean();

        return updated;
    }

    private async injectWelcomeMessage(userId: string) {
        // Create new conversation with welcome message
        const welcomeMsg: ChatMessage = {
            sender: 'bot',
            content: 'Hello! I am your Englishom assistant. How can I help you today? You can ask about levels, subscription, or technical issues.',
            intent: 'welcome',
            confidence: 1,
            readBy: { user: false, admin: false },
        };

        await this.chatModel.create({
            userId,
            isActive: true,
            messages: [welcomeMsg],
        });
    }

    private analyzeMessage(content: string): { reply: string; intent: string; confidence: number } {
        const lower = content.trim().toLowerCase();

        // 0. Check Dynamic Rules (DB)
        const rules = this.chatRulesService.getActiveRules();

        for (const rule of rules) {
            let isMatch = false;

            if (rule.matchType === 'exact') {
                // Check if ANY keyword matches exactly the full input
                // Or should exact match mean input === keyword?
                // Plan said: input === single_keyword
                isMatch = rule.keywords.some(k => k.trim().toLowerCase() === lower);
            } else {
                // contains (OR logic)
                isMatch = rule.keywords.some(k => lower.includes(k.trim().toLowerCase()));
            }

            if (isMatch) {
                return {
                    reply: rule.response,
                    intent: 'dynamic_rule',
                    confidence: 0.95,
                };
            }
        }

        // Rule 1: Payment / Subscription
        if (lower.match(/price|cost|pay|subscription|money|card/)) {
            return {
                reply: 'To view our subscription plans, please visit the payment page. We accept Credit Cards, Vodafone Cash, and InstaPay.',
                intent: 'payment',
                confidence: 0.9,
            };
        }

        // Rule 2: Technical / Audio / Bug
        if (lower.match(/bug|error|problem|audio|sound|play|stuck|lock/)) {
            return {
                reply: 'I am sorry you are facing issues. Please try refreshing the page. If the problem persists, check your internet connection. If it implies a specific bug, please describe it.',
                intent: 'technical',
                confidence: 0.85,
            };
        }

        // Rule 3: Levels / Study
        if (lower.match(/level|study|how|start|lesson|speak|record/)) {
            return {
                reply: 'Englishom relies on self-learning. Listen to the recordings, practice speaking, and compare your voice. Levels open automatically as you progress.',
                intent: 'academic',
                confidence: 0.8,
            };
        }

        // Fallback
        return {
            reply: 'I am not sure I understand. Could you please clarify? You can also contact us via WhatsApp for direct support.',
            intent: 'unknown',
            confidence: 0.3, // Trigger logic for admin later
        };
    }
}
