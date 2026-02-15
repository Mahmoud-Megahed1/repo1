import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { InactiveUserCronService } from './inactive-user-cron.service';
import { OrderAccessCronService } from './order-access-cron.service';
import { PendingOrderCleanupCronService } from './pending-order-cleanup-cron.service';
import { VoluntaryPauseCronService } from './voluntary-pause-cron.service';
import { CronController } from './cron.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../common/mail/mail.module';
import { AdminModule } from '../admin/admin.module';
import { ConfigModule } from '../common/config/config.module';
import { PaymentModule } from '../payment/paymob.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // nestjs cron module
    UserModule,
    MailModule,
    AdminModule,
    ConfigModule,
    PaymentModule,
    SubscriptionModule,
  ],
  controllers: [CronController],
  providers: [
    InactiveUserCronService,
    OrderAccessCronService,
    PendingOrderCleanupCronService,
    VoluntaryPauseCronService,
  ],
  exports: [
    InactiveUserCronService,
    OrderAccessCronService,
    PendingOrderCleanupCronService,
    VoluntaryPauseCronService,
  ],
})
export class CronModule { }
