import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepo } from '../../common/database/repo/abstract.repo';
import { AdminLog } from '../models/admin-log.schema';

@Injectable()
export class AdminLogRepo extends AbstractRepo<AdminLog> {
    constructor(
        @InjectModel(AdminLog.name) private readonly adminLogModel: Model<AdminLog>,
    ) {
        super(adminLogModel);
    }
}
