#!/usr/bin/env ts-node

/**
 * Mail Service Test Script
 * 
 * This script tests the mail service configuration and sends a test email.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MailService } from '../common/mail/mail.service';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function testMailService() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║     📧 Mail Service Test Utility 📧       ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const mailService = app.get(MailService);

  try {
    let email = process.argv[2];

    if (!email) {
      email = await question('Enter recipient email address: ');
    }

    // Cleanup if passed via npm run
    if (email && email.includes('test-mail-service')) {
      // fallback if arg parsing gets messed up by npm
      email = process.argv[3];
    }

    if (!email || !email.includes('@')) {
      console.log('\n❌ Invalid email address provided.\n');
      console.log('Usage: npm run test:mail -- email@example.com\n');
      rl.close();
      await app.close();
      process.exit(1);
      return;
    }

    console.log('\n📤 Sending test email...\n');

    const emailOptions = {
      to: email,
      subject: 'EnglishOM - Test Email',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">✅ Mail Service Test</h1>
          <p>Congratulations! Your mail service is configured correctly.</p>
          <p>This is a test email sent from the EnglishOM backend system.</p>
          <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #6B7280; font-size: 14px;">
            This email was sent on ${new Date().toLocaleString()} from your EnglishOM development environment.
          </p>
          <p style="color: #6B7280; font-size: 14px;">
            If you did not request this test email, you can safely ignore it.
          </p>
        </div>
      `,
      textContent: `
EnglishOM Mail Service Test

Congratulations! Your mail service is configured correctly.

This is a test email sent from the EnglishOM backend system.

Sent on: ${new Date().toLocaleString()}
      `,
    };

    const result = await mailService.sendCustomEmail(emailOptions);

    if (result) {
      console.log('✅ Test email sent successfully!\n');
      console.log(`   Recipient: ${email}\n`);
      console.log('📬 Please check your inbox (and spam folder) for the test email.\n');
    } else {
      console.log('❌ Failed to send test email.\n');
      console.log('   Please check your mail service configuration.\n');
    }

    rl.close();
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error testing mail service:', error.message || error);
    console.log('\nPlease check your mail service configuration:\n');
    console.log('  • BREVO_API_KEY is set in .env');
    console.log('  • BREVO_FROM_EMAIL is a verified sender');
    console.log('  • BREVO_FROM_NAME is configured\n');

    rl.close();
    await app.close();
    process.exit(1);
  }
}

// Run the test
testMailService().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
