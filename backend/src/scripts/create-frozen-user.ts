import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserRepo } from '../user/repo/user.repo';
import { SubscriptionService } from '../subscription/subscription.service';
import { Role, UserStatus } from '../common/shared';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

async function createFrozenUser() {
    const logger = new Logger('CreateFrozenUser');
    const app = await NestFactory.createApplicationContext(AppModule);
    const userRepo = app.get(UserRepo);
    const subscriptionService = app.get(SubscriptionService);

    const email = 'frozen_test@englishom.com';
    const password = 'FrozenPassword123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        logger.log(`Checking if user ${email} exists...`);
        let user = await userRepo.findOne({ email });

        if (!user) {
            logger.log(`Creating user ${email}...`);
            user = await userRepo.create({
                email,
                firstName: 'Frozen',
                lastName: 'TestUser',
                password: hashedPassword,
                isVerified: true,
                role: Role.USER,
                status: UserStatus.ACTIVE,
                strategy: 'local',
                country: 'Egypt',
                lastActivity: new Date(),
            } as any);
            logger.log(`User created with ID: ${user._id}`);
        } else {
            logger.log(`User ${email} already exists.`);
        }

        logger.log(`Freezing user for 20 days...`);
        // voluntaryPause(userId, durationDays)
        const result = await subscriptionService.voluntaryPause(user._id.toString(), 20);

        logger.log('✅ Success!');
        logger.log(`Email: ${email}`);
        logger.log(`Password: ${password}`);
        logger.log(`Result: ${result.message}`);

    } catch (error) {
        logger.error(`Error: ${error.message}`);
    } finally {
        await app.close();
    }
}

createFrozenUser();
