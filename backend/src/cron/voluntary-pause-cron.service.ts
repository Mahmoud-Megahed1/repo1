import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserRepo } from '../user/repo/user.repo';
import { SubscriptionService } from '../subscription/subscription.service';
import { TimeService } from '../common/config/time.service';

@Injectable()
export class VoluntaryPauseCronService {
    private readonly logger = new Logger(VoluntaryPauseCronService.name);

    constructor(
        private readonly userRepo: UserRepo,
        private readonly subscriptionService: SubscriptionService,
        private readonly timeService: TimeService,
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleAutoResume() {
        const now = this.timeService.createDate();

        // Find users who are voluntarily paused and their scheduled end date has passed
        const pausedUsers = await this.userRepo.find({
            isVoluntaryPaused: true,
            pauseScheduledEndDate: { $lte: now },
        });

        if (pausedUsers.length === 0) return;

        this.logger.log(`Found ${pausedUsers.length} users ready for auto-resume`);

        for (const user of pausedUsers) {
            try {
                await this.subscriptionService.voluntaryResume(user._id.toString());
                this.logger.log(`Successfully auto-resumed user: ${user.email}`);
            } catch (error) {
                this.logger.error(`Failed to auto-resume user ${user.email}: ${error.message}`);
            }
        }
    }
}
