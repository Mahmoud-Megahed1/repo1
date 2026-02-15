import { Injectable, BadRequestException, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { UserRepo } from '../user/repo/user.repo';
import { UserStatus } from '../common/shared';
import { TimeService } from '../common/config/time.service';
import { MailService } from '../common/mail/mail.service';

@Injectable()
export class SubscriptionService {
    private readonly logger = new Logger(SubscriptionService.name);

    constructor(
        private readonly userRepo: UserRepo,
        private readonly timeService: TimeService,
        private readonly mailService: MailService,
    ) { }

    async reactivate(userId: string, commitment: { willCare: boolean; willCommit: boolean }) {
        if (!commitment.willCare || !commitment.willCommit) {
            throw new BadRequestException('يجب الموافقة على شروط الالتزام لتفعيل الحساب');
        }

        const user = await this.userRepo.findOne({ _id: userId });
        if (!user) throw new NotFoundException('المستخدم غير موجود');
        if (user.status !== UserStatus.SUSPENDED) {
            return { message: 'الحساب نشط بالفعل', status: user.status };
        }

        const updates: any = {
            status: UserStatus.ACTIVE,
            hasUsedInactivityGrace: true,
            lastActivity: this.timeService.createDate(),
        };

        // If this was a grace suspension, we need to add the duration to totalPausedDays
        if (user.pauseStartedAt) {
            const now = this.timeService.createDate();
            const pausedDays = Math.ceil((now.getTime() - new Date(user.pauseStartedAt).getTime()) / (1000 * 60 * 60 * 24));
            updates.totalPausedDays = (user.totalPausedDays || 0) + pausedDays;
            updates.$push = {
                pauseHistory: {
                    start: user.pauseStartedAt,
                    end: now,
                    reason: 'Reactivation from Inactivity Grace',
                    isVoluntary: false,
                },
            };
            updates.pauseStartedAt = null; // Clear it
        }

        await this.userRepo.findOneAndUpdate({ _id: userId }, updates);
        return { message: 'تم تفعيل الحساب بنجاح، بالتوفيق في دراستك!' };
    }

    async voluntaryPause(userId: string, durationDays: number) {
        if (durationDays <= 0 || durationDays > 20) {
            throw new BadRequestException('مدة الإيقاف يجب أن تكون بين 1 و 20 يوماً');
        }

        const user = await this.userRepo.findOne({ _id: userId });
        if (!user) throw new NotFoundException('المستخدم غير موجود');

        if (user.voluntaryPauseAttempts >= 2) {
            throw new ForbiddenException('لقد استنفدت عدد مرات الإيقاف المسموحة (مرتين)');
        }

        const totalProposedDays = (user.totalPausedDays || 0) + durationDays;
        if (totalProposedDays > 20) {
            throw new ForbiddenException(`متبقي لك ${20 - (user.totalPausedDays || 0)} يوماً فقط من الرصيد المسموح`);
        }

        const now = this.timeService.createDate();
        const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

        await this.userRepo.findOneAndUpdate(
            { _id: userId },
            {
                isVoluntaryPaused: true,
                pauseStartedAt: now,
                pauseScheduledEndDate: endDate,
                $inc: { voluntaryPauseAttempts: 1 },
                // totalPausedDays will be updated when they resume or auto-unpause
            },
        );

        // Send Confirmation Email
        this.mailService.sendSubscriptionPauseEmail(user.email, user.firstName, endDate).catch(e => this.logger.error(`Failed to send pause email: ${e.message}`));

        return {
            message: `تم إيقاف الاشتراك بنجاح لمدة ${durationDays} أيام. سيعود الكورس للعمل تلقائياً بتاريخ ${endDate.toLocaleDateString('ar-EG')}`,
            endDate
        };
    }

    async voluntaryResume(userId: string) {
        const user = await this.userRepo.findOne({ _id: userId });
        if (!user) throw new NotFoundException('المستخدم غير موجود');

        if (!user.isVoluntaryPaused) {
            throw new BadRequestException('الاشتراك غير متوقف حالياً');
        }

        const now = this.timeService.createDate();
        const start = new Date(user.pauseStartedAt);
        const actualDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        await this.userRepo.findOneAndUpdate(
            { _id: userId },
            {
                isVoluntaryPaused: false,
                status: UserStatus.ACTIVE,
                $inc: { totalPausedDays: actualDays },
                $push: {
                    pauseHistory: {
                        start: user.pauseStartedAt,
                        end: now,
                        reason: 'Manual Resume',
                        isVoluntary: true,
                    },
                },
                pauseStartedAt: null,
                pauseScheduledEndDate: null,
            },
        );

        // Send Confirmation Email
        this.mailService.sendSubscriptionResumeEmail(user.email, user.firstName).catch(e => this.logger.error(`Failed to send resume email: ${e.message}`));

        return { message: `تم استئناف الاشتراك بنجاح. تم احتساب ${actualDays} يوماً من رصيدك.` };
    }
}
