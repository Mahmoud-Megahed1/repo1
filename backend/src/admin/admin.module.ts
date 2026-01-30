import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRepo } from './repo/admin.repo';
import { AdminSeederService } from './services/admin-seeder.service';
import { DatabaseModule } from '../common/database/database.module';
import { Admin, AdminSchema } from './models/admin.schema';
import { UserModule } from '../user/user.module';
import { ConfigModule } from 'src/common/config/config.module';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { AdminLog, AdminLogSchema } from './models/admin-log.schema';
import { AdminLogService } from './services/admin-log.service';
import { AdminLogRepo } from './repo/admin-log.repo';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: AdminLog.name, schema: AdminLogSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => AdminAuthModule),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepo, AdminSeederService, AdminLogService, AdminLogRepo],
  exports: [AdminService, AdminRepo, AdminLogService, AdminLogRepo],
})
export class AdminModule { }
