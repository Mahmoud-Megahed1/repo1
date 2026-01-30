#!/usr/bin/env ts-node

/**
 * Interactive Seeder CLI
 * 
 * This script provides a command-line interface for seeding the database
 * with test data for development purposes.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from '../common/seeds/seeder.service';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function showMenu() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║     🌱 EnglishOM Database Seeder 🌱      ║');
  console.log('╚════════════════════════════════════════════╝\n');
  console.log('Select an option:');
  console.log('  1. Seed All Data');
  console.log('  2. Seed Admins Only');
  console.log('  3. Seed Users Only');
  console.log('  4. Seed Courses Only');
  console.log('  5. Seed Orders Only');
  console.log('  6. Clear All Seeded Data');
  console.log('  7. Seed Super Test User');
  console.log('  8. Show Help');
  console.log('  0. Exit\n');
}

async function showHelp() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║            Seeder Help Guide               ║');
  console.log('╚════════════════════════════════════════════╝\n');
  console.log('Available Commands:');
  console.log('  npm run seed              - Interactive seeder (this menu)');
  console.log('  npm run seed:all          - Seed all data at once');
  console.log('  npm run seed:clear        - Clear all seeded data');
  console.log('  npm run seed:admins       - Seed test admins only');
  console.log('  npm run seed:users        - Seed test users only');
  console.log('  npm run seed:courses      - Seed courses only');
  console.log('  npm run seed:orders       - Seed orders only');
  console.log('  npm run seed:help         - Show this help\n');
  
  console.log('Seeded Data Details:');
  console.log('  • Admins: Test admins with different roles (SUPER, MANAGER, OPERATOR, VIEW)');
  console.log('  • Users: Test users with various verification states');
  console.log('  • Courses: Complete course structure with levels and content');
  console.log('  • Orders: Sample orders with different payment statuses\n');
  
  console.log('Note: Seeding is only available in development mode (NODE_ENV !== production)\n');
}

async function runSeeder() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  try {
    const args = process.argv.slice(2);
    const command = args[0];

    if (command === 'seed-all') {
      console.log('\n🌱 Seeding all data...\n');
      await seederService.seedTestData();
      console.log('\n✅ All data seeded successfully!\n');
      await app.close();
      process.exit(0);
      return;
    }

    if (command === 'clear') {
      console.log('\n🗑️  Clearing all seeded data...\n');
      await seederService.clearAllData();
      console.log('\n✅ All seeded data cleared successfully!\n');
      await app.close();
      process.exit(0);
      return;
    }

    if (command === 'admins') {
      console.log('\n🌱 Seeding admins...\n');
      await seederService['seedAdmins']();
      console.log('\n✅ Admins seeded successfully!\n');
      await app.close();
      process.exit(0);
      return;
    }

    if (command === 'users') {
      console.log('\n🌱 Seeding users...\n');
      await seederService['seedUsers']();
      console.log('\n✅ Users seeded successfully!\n');
      await app.close();
      process.exit(0);
      return;
    }

    if (command === 'courses') {
      console.log('\n🌱 Seeding courses...\n');
      await seederService['seedCourses']();
      console.log('\n✅ Courses seeded successfully!\n');
      await app.close();
      process.exit(0);
      return;
    }

    if (command === 'orders') {
      console.log('\n🌱 Seeding orders...\n');
      await seederService['seedOrders']();
      console.log('\n✅ Orders seeded successfully!\n');
      await app.close();
      process.exit(0);
      return;
    }

    if (command === 'help') {
      showHelp();
      await app.close();
      process.exit(0);
      return;
    }

    // Interactive mode
    let running = true;
    while (running) {
      await showMenu();
      const choice = await question('Enter your choice: ');

      switch (choice.trim()) {
        case '1':
          console.log('\n🌱 Seeding all data...\n');
          await seederService.seedTestData();
          console.log('\n✅ All data seeded successfully!');
          break;

        case '2':
          console.log('\n🌱 Seeding admins...\n');
          await seederService['seedAdmins']();
          console.log('\n✅ Admins seeded successfully!');
          break;

        case '3':
          console.log('\n🌱 Seeding users...\n');
          await seederService['seedUsers']();
          console.log('\n✅ Users seeded successfully!');
          break;

        case '4':
          console.log('\n🌱 Seeding courses...\n');
          await seederService['seedCourses']();
          console.log('\n✅ Courses seeded successfully!');
          break;

        case '5':
          console.log('\n🌱 Seeding orders...\n');
          await seederService['seedOrders']();
          console.log('\n✅ Orders seeded successfully!');
          break;

        case '6':
          console.log('\n🗑️  Clearing all seeded data...\n');
          await seederService.clearAllData();
          console.log('\n✅ All seeded data cleared successfully!');
          break;

        case '7':
          console.log('\n🌱 Seeding super test user...\n');
          const result = await seederService.seedSuperTestUser();
          console.log('\n✅ Super test user seeded:');
          console.log(`   Email: ${result.email}`);
          console.log(`   Password: Password123!`);
          console.log(`   Note: User has full access to all levels and certificates`);
          break;

        case '8':
          showHelp();
          break;

        case '0':
          console.log('\n👋 Goodbye!\n');
          running = false;
          break;

        default:
          console.log('\n❌ Invalid option. Please try again.');
      }
    }

    rl.close();
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    rl.close();
    await app.close();
    process.exit(1);
  }
}

// Run the seeder
runSeeder().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
