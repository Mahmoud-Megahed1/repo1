const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { PaymobController } = require('./dist/payment/paymob.controller');
const { UserRepo } = require('./dist/user/repo/user.repo');

async function test() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const controller = app.get(PaymobController);
    const userRepo = app.get(UserRepo);

    const user = await userRepo.findOne({ email: 'mahmoudmaghed30@gmail.com' });
    if (!user) {
      console.error('User not found in database!');
      await app.close();
      process.exit(1);
    }

    console.log('User object passed to controller:', {
      _id: user._id,
      email: user.email,
      adminRole: user.adminRole,
      role: user.role,
      constructorName: user.constructor.name
    });

    console.log('Calling controller.getDiscountEligibility...');
    const result = await controller.getDiscountEligibility(user);
    console.log('Result from controller:', result);

    await app.close();
  } catch (err) {
    console.error('Failed to run test:', err);
    process.exit(1);
  }
}

test();
