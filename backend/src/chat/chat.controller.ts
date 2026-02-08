import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserJwtGuard } from '../user-auth/guards/user-jwt.guard';
import { CurrentUser } from '../user-auth/decorator/get-curr-user.decorator';
import { User } from '../user/models/user.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(@Body() body: { message: string }) {
    return this.chatService.generateResponse(body.message);
  }

  @UseGuards(UserJwtGuard)
  @Get('lesson-review')
  async getLessonReviewHistory(
    @CurrentUser() user: User,
    @Query('levelName') levelName: string,
    @Query('day') day: string,
    @Query('lessonName') lessonName: string
  ) {
    return this.chatService.getLessonReviewHistory(user._id.toString(), levelName, day, lessonName);
  }

  @UseGuards(UserJwtGuard)
  @Post('lesson-review')
  @HttpCode(HttpStatus.OK)
  async lessonReview(
    @CurrentUser() user: User,
    @Body() body: { message: string; levelName: string; day: string; lessonName: string }
  ) {
    return this.chatService.generateLessonReviewResponse(user._id.toString(), body);
  }
}
