import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './constants/website-content';
import { ChatRulesService } from '../support-chat/services/chat-rules.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ThemeService } from '../theme/theme.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LessonReviewChat, LessonReviewChatDocument } from './schemas/lesson-review-chat.schema';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private chatRulesService: ChatRulesService,
    private fileUploadService: FileUploadService,
    private themeService: ThemeService,
    @InjectModel(LessonReviewChat.name) private lessonChatModel: Model<LessonReviewChatDocument>,
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
    // 0. Check Theme Settings
    const theme = await this.themeService.findCurrentTheme();
    if (theme && theme.showSupportChat === false) {
      return { reply: "Chat support is currently disabled by the administrator." };
    }

    // 1. Check for Chatbot Rules (Priority)
    try {
      const activeRules = this.chatRulesService.getActiveRules();
      const lowerMessage = userMessage.toLowerCase().trim();

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
      let finalSystemPrompt = SYSTEM_PROMPT;
      if (theme && theme.aiKnowledgeContext) {
        finalSystemPrompt += `\n\nADDITIONAL KNOWLEDGE BASE:\n${theme.aiKnowledgeContext}\nUse this information to answer user questions if relevant.`;
      }

      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: finalSystemPrompt },
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

  async getLessonReviewHistory(userId: string, levelName: string, day: string, lessonName: string) {
    const chat = await this.lessonChatModel.findOne({ userId, levelName, day, lessonName });
    return chat ? chat.messages : [];
  }

  async generateLessonReviewResponse(userId: string, params: { message: string; levelName: string; day: string; lessonName: string }) {
    // 0. Check Theme Settings
    const theme = await this.themeService.findCurrentTheme();
    if (theme && theme.showAIReviewChat === false) {
      return { reply: "AI Lesson Review is currently disabled by the administrator." };
    }

    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      return { reply: "I'm sorry, my brain is offline right now (Missing API Key)." };
    }

    try {
      // 1. Retrieve Lesson Content
      const lessonData = await this.fileUploadService.getContentByName({
        level_name: params.levelName as any,
        day: params.day,
        lesson_name: params.lessonName as any
      });

      let lessonContextString = "No specific lesson content found.";
      let aiInstructions = "";

      if (lessonData && lessonData.data && lessonData.data.length > 0) {
        const lesson = lessonData.data[0];
        lessonContextString = JSON.stringify(lesson);
        if (lesson.aiInstructions) {
          aiInstructions = `\n\nSPECIAL INSTRUCTIONS FOR AI:\n${lesson.aiInstructions}`;
        }
      }

      // 2. Retrieve Chat History for Context
      const history = await this.getLessonReviewHistory(userId, params.levelName, params.day, params.lessonName);
      // Format history for OpenAI (last 6 messages for context window)
      const recentHistory = history.slice(-6).map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }));

      // 3. Build Prompt
      let systemPromptWithContext = `${SYSTEM_PROMPT}

      CURRENT LESSON CONTEXT:
      The user has just completed the following lesson. Use this content to guide the review. 
      Ask questions about the vocabulary, sentences, or concepts found here.

      ${lessonContextString}

      ${aiInstructions}
      `;

      if (theme && theme.aiKnowledgeContext) {
        systemPromptWithContext += `\n\nADDITIONAL KNOWLEDGE BASE:\n${theme.aiKnowledgeContext}`;
      }

      const messages: any[] = [
        { role: 'system', content: systemPromptWithContext },
        ...recentHistory,
        { role: 'user', content: params.message },
      ];

      const completion = await this.openai.chat.completions.create({
        messages: messages,
        model: 'gpt-4o-mini',
        temperature: 0.5,
        max_tokens: 400,
      });

      const reply = completion.choices[0].message.content;

      // 4. Save History
      await this.lessonChatModel.findOneAndUpdate(
        { userId, levelName: params.levelName, day: params.day, lessonName: params.lessonName },
        {
          $push: {
            messages: {
              $each: [
                { role: 'user', content: params.message },
                { role: 'assistant', content: reply }
              ]
            }
          }
        },
        { upsert: true, new: true }
      );

      return { reply };

    } catch (error) {
      console.error('Lesson Review AI Error:', error);
      throw new InternalServerErrorException('Failed to generate lesson review');
    }
  }
}
