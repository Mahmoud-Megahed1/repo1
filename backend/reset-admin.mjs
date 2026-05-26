// Reset Super Admin Password Script
// Run: node reset-admin.mjs

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read DATABASE_URL from .env file
const envPath = resolve('/var/www/repo1/backend/.env');
const envContent = readFileSync(envPath, 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);

if (!dbUrlMatch) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

const DATABASE_URL = dbUrlMatch[1].trim();
const NEW_PASSWORD = 'Admin@2026!';

async function resetAdmin() {
  const client = new MongoClient(DATABASE_URL);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const adminsCollection = db.collection('admins');
    
    // Find super admin
    const superAdmin = await adminsCollection.findOne({ adminRole: 'super' });
    
    if (superAdmin) {
      console.log(`📋 Found Super Admin: ${superAdmin.email}`);
      
      // Reset password
      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
      await adminsCollection.updateOne(
        { _id: superAdmin._id },
        { $set: { password: hashedPassword } }
      );
      
      console.log('');
      console.log('✅ Password reset successfully!');
      console.log(`📧 Email: ${superAdmin.email}`);
      console.log(`🔑 New Password: ${NEW_PASSWORD}`);
    } else {
      console.log('⚠️ No Super Admin found. Creating one...');
      
      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
      await adminsCollection.insertOne({
        email: 'superadmin@englishom.com',
        firstName: 'Super',
        lastName: 'Admin',
        password: hashedPassword,
        adminRole: 'super',
        role: 'admin',
        isActive: true,
        lastActivity: new Date(),
        country: 'unknown',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log('');
      console.log('✅ Super Admin created successfully!');
      console.log('📧 Email: superadmin@englishom.com');
      console.log(`🔑 Password: ${NEW_PASSWORD}`);
    }
    
    // List all admins
    console.log('\n📋 All admins in database:');
    const allAdmins = await adminsCollection.find({}).toArray();
    allAdmins.forEach(a => {
      console.log(`  - ${a.email} | Role: ${a.adminRole} | Active: ${a.isActive}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

resetAdmin();
