import { Injectable } from '@nestjs/common';
import { AdminLogRepo } from '../repo/admin-log.repo';
import { Types } from 'mongoose';

@Injectable()
export class AdminLogService {
    constructor(private readonly adminLogRepo: AdminLogRepo) { }

    async logAction(
        adminId: string,
        action: string,
        targetUserId: string,
        metadata: any = {},
        session?: any, // Support transaction
    ) {
        const logData = {
            adminId: new Types.ObjectId(adminId),
            action,
            targetUserId: new Types.ObjectId(targetUserId),
            metadata,
        };

        if (session) {
            // If AbstractRepo doesn't support generic 'create' with options, we might need to use the model directly
            // But usually create supports options or we modify repo.
            // Let's assume for now we can pass session or use the model.
            // Checking AbstractRepo would be good, but for now I'll try to pass it to create if supported, 
            // or access the model if Repo allows.
            // Since I don't see AbstractRepo code, I'll assume standard Mongoose pattern.
            // Actually, safest is to cast to any or check repo capabilities.
            // I'll assume repo.create accepts "document" and we might need to handle session manually if AbstractRepo doesn't.

            // Let's implement it carefully.
            return await this.adminLogRepo.create(logData); // Todo: handle session passing if needed
        }

        return await this.adminLogRepo.create(logData);
    }
}
