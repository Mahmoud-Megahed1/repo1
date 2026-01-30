import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatRulesService } from '../services/chat-rules.service';
import { CreateChatRuleDto, UpdateChatRuleDto } from '../dto/chat-rule.dto';
import { GetChatRulesDto } from '../dto/get-chat-rules.dto';
import { AdminJwtGuard } from '../../admin-auth/guards/admin-jwt.guard';
import { AdminRoles } from '../../admin-auth/decorators';
import { AdminRole } from '../../common/shared';

@UseGuards(AdminJwtGuard)
@Controller('admin/chat-rules')
export class ChatRulesController {
    constructor(private readonly chatRulesService: ChatRulesService) { }

    @Post()
    @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
    create(@Body() dto: CreateChatRuleDto) {
        return this.chatRulesService.create(dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.chatRulesService.findAll(req.query);
    }

    @Patch(':id')
    @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
    update(@Param('id') id: string, @Body() dto: UpdateChatRuleDto) {
        return this.chatRulesService.update(id, dto);
    }

    @Delete(':id')
    @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
    delete(@Param('id') id: string) {
        return this.chatRulesService.delete(id);
    }
}
