import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '../common/config/config.module';
import { MailModule } from '../common/mail/mail.module';

@Module({
    imports: [UserModule, ConfigModule, MailModule],
    controllers: [SubscriptionController],
    providers: [SubscriptionService],
    exports: [SubscriptionService],
})
export class SubscriptionModule { }
