import { Controller, Post, Body, UseGuards, Patch } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CurrentUser } from '../user-auth/decorator/get-curr-user.decorator';
import { UserJwtGuard } from '../user-auth/guards/user-jwt.guard';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminRoles } from '../admin-auth/decorators';
import { AdminRole } from '../common/shared';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @UseGuards(UserJwtGuard)
    @Post('reactivate')
    async reactivate(
        @CurrentUser('_id') userId: string,
        @Body() commitment: { willCare: boolean; willCommit: boolean },
    ) {
        return await this.subscriptionService.reactivate(userId, commitment);
    }

    @UseGuards(UserJwtGuard)
    @Post('voluntary-pause')
    async voluntaryPause(
        @CurrentUser('_id') userId: string,
        @Body('durationDays') durationDays: number,
    ) {
        return await this.subscriptionService.voluntaryPause(userId, durationDays);
    }

    @UseGuards(UserJwtGuard)
    @Post('voluntary-resume')
    async voluntaryResume(@CurrentUser('_id') userId: string) {
        return await this.subscriptionService.voluntaryResume(userId);
    }

    // Admin manual actions for a user
    @UseGuards(AdminJwtGuard)
    @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
    @Post('admin/pause')
    async adminPauseUser(
        @Body('userId') userId: string,
        @Body('durationDays') durationDays: number,
    ) {
        return await this.subscriptionService.voluntaryPause(userId, durationDays);
    }

    @UseGuards(AdminJwtGuard)
    @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
    @Post('admin/resume')
    async adminResumeUser(@Body('userId') userId: string) {
        return await this.subscriptionService.voluntaryResume(userId);
    }
}
