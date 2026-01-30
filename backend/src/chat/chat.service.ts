import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './constants/website-content';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(userMessage: string) {
    if (!process.env.OPENAI_API_KEY) {
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
