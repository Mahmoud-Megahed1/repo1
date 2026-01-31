import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './constants/website-content';
import { ChatRulesService } from '../support-chat/services/chat-rules.service';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private chatRulesService: ChatRulesService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      console.warn('OPENAI_API_KEY is not defined in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: apiKey || 'dummy-key-to-prevent-startup-crash',
    });
  }

  async generateResponse(userMessage: string) {
    // 1. Check for Chatbot Rules (Priority)
    try {
      const activeRules = this.chatRulesService.getActiveRules();
      const lowerMessage = userMessage.toLowerCase().trim();

      // Sort rules by priority (highest first) if not already sorted
      // Assuming getActiveRules returns them sorted or we sort here if needed
      // Currently simple matching:

      for (const rule of activeRules) {
        if (!rule.isActive) continue;

        for (const keyword of rule.keywords) {
          const lowerKeyword = keyword.toLowerCase().trim();

          if (rule.matchType === 'exact') {
            if (lowerMessage === lowerKeyword) {
              return { reply: rule.response };
            }
          } else {
            // 'contains'
            if (lowerMessage.includes(lowerKeyword)) {
              return { reply: rule.response };
            }
          }
        }
      }
    } catch (err) {
      console.error('Error checking chat rules:', err);
      // Continue to AI if rules fail
    }

    // 2. Fallback to AI
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return { reply: "I'm sorry, my brain is offline right now (Missing API Key)." };
    }

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        model: 'gpt-4o-mini',
        temperature: 0.3, // Low temperature for strict adherence to context
        max_tokens: 300,
      });

      return { reply: completion.choices[0].message.content };
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new InternalServerErrorException('Failed to generate response');
    }
  }
}
