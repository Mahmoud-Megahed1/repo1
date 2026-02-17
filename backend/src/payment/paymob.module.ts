// filepath: /mnt/DATA/Englishom/src/payment/paymob.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { PaymobService } from './paymob.service';
import { TamaraService } from './tamara.service';
import { CourseModule } from '../course/course.module';
import { ConfigModule } from '@nestjs/config';
import { TamaraController } from './tamara.controller';
import { DatabaseModule } from '../common/database/database.module';
import { OrderRepo } from './repo/order.repo';
import { Order, OrderSchema } from './models/order.schema';
import { UserModule } from '../user/user.module';
import { OrderService } from '../common/shared/services/order.service';
import { PaymobController } from './paymob.controller';
import { MailModule } from '../common/mail/mail.module';

// filepath: /mnt/DATA/Englishom/src/payment/paymob.module.ts
@Module({
  providers: [
    PaymobService,
    TamaraService,
    OrderRepo,
    {
      provide: OrderService,
      useExisting: OrderRepo,
    },
  ],
  controllers: [PaymobController, TamaraController],
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CourseModule),
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MailModule,
    ConfigModule,
  ],
  exports: [PaymobService, TamaraService, OrderRepo, OrderService],
})
export class PaymentModule { }
