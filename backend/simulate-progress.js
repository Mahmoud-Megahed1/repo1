const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGO_URI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/englishom?directConnection=true';

async function simulate() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  const email = 'mahmoudmaghed30@gmail.com';
  const levelName = 'LEVEL_A1';
  const daysToComplete = 50;

  // 1. Find User
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    console.error(`User with email ${email} not found!`);
    process.exit(1);
  }
  console.log(`Found user: ${user.firstName} ${user.lastName} (${user._id})`);

  // 2. Ensure UserLevel exists
  const userLevel = await db.collection('userlevels').findOne({ userId: user._id, levelName });
  if (!userLevel) {
    console.log(`User does not have access to ${levelName}. Creating UserLevel...`);
    await db.collection('userlevels').insertOne({
      userId: user._id,
      levelName,
    });
  } else {
    console.log(`User already has access to ${levelName}.`);
  }

  // 3. Get Days for Level_A1
  const days = await db.collection('days').find({ levelName, dayNumber: { $lte: daysToComplete } }).toArray();
  if (days.length === 0) {
    console.error(`No days found for level ${levelName}!`);
    process.exit(1);
  }
  console.log(`Found ${days.length} days for ${levelName} up to day ${daysToComplete}.`);

  // 4. Upsert UserProgress for each day
  let completedCount = 0;
  for (const day of days) {
    const progress = await db.collection('userprogresses').findOne({ userId: user._id, dayId: day._id });
    const mockResult = {
      isPassed: true,
      score: 100,
      questions: []
    };

    if (!progress) {
      await db.collection('userprogresses').insertOne({
        userId: user._id,
        dayId: day._id,
        completed: true,
        completedAt: new Date(),
        dailyTestResult: mockResult
      });
      completedCount++;
    } else if (!progress.completed) {
      await db.collection('userprogresses').updateOne(
        { _id: progress._id },
        { 
          $set: { 
            completed: true, 
            completedAt: new Date(),
            dailyTestResult: progress.dailyTestResult || mockResult
          } 
        }
      );
      completedCount++;
    }
  }

  console.log(`Successfully completed ${completedCount} new days. Total days completed: ${days.length}.`);
  console.log(`Simulation finished for ${email}. You can now check the dashboard!`);
  
  process.exit(0);
}

simulate().catch(err => {
  console.error(err);
  process.exit(1);
});
