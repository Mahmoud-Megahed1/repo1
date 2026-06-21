const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/englishom';

console.log('Connecting to:', dbUrl);

mongoose.connect(dbUrl).then(async () => {
  console.log('Connected to Database successfully!');

  // 1. Get user
  const user = await mongoose.connection.db.collection('users').findOne({ email: 'mahmoudmaghed30@gmail.com' });
  if (!user) {
    console.log('User not found!');
    process.exit(0);
  }
  console.log('User found:', {
    _id: user._id,
    email: user.email,
    adminRole: user.adminRole,
    role: user.role
  });

  // 2. Get completed orders
  const orders = await mongoose.connection.db.collection('orders').find({
    userId: user._id,
    paymentStatus: 'COMPLETED'
  }).toArray();

  console.log(`Found ${orders.length} completed orders for user:`);
  orders.forEach(o => {
    console.log(`- Order: level=${o.levelName}, status=${o.paymentStatus}, date=${o.createdAt}`);
  });

  // 3. Get Settings
  const settings = await mongoose.connection.db.collection('settings').findOne({});
  console.log('Global Settings:', settings);

  // 4. Calculate discount
  const previousPurchasesCount = orders.length;
  console.log('Previous purchases count:', previousPurchasesCount);

  if (previousPurchasesCount > 0) {
    const discounts = settings?.repurchaseDiscounts || [];
    console.log('Repurchase discounts array:', discounts);
    if (discounts.length > 0) {
      const discountIndex = Math.min(previousPurchasesCount - 1, discounts.length - 1);
      const discountPercentage = discounts[discountIndex];
      console.log(`Calculated discountIndex: ${discountIndex}, discountPercentage: ${discountPercentage}%`);
    } else {
      console.log('No discounts in settings');
    }
  } else {
    console.log('No previous purchases, so no loyalty discount');
  }

  process.exit(0);
}).catch(err => {
  console.error('Connection failed:', err);
  process.exit(1);
});
