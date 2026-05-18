require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apiKey = process.env.BREVO_API_KEY;
const targetEmail = 'mahmoudmaghed30@gmail.com';
const userName = 'Mahmoud Megahed';

async function sendEmail(subject, htmlContent) {
  if (!apiKey) {
    console.error('❌ BREVO_API_KEY is not set in .env file!');
    return;
  }
  
  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: 'Englishom', email: 'no-reply@englishom.com' },
      to: [{ email: targetEmail }],
      subject: subject,
      htmlContent: htmlContent
    }, {
      headers: { 
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    console.log(`✅ Sent: ${subject}`);
  } catch (err) {
    console.error(`❌ Failed: ${subject}`, err.response?.data || err.message);
  }
}

async function run() {
  console.log(`Sending real email templates to ${targetEmail} directly via Brevo API...`);

  // 1. Welcome Email
  const welcomeHtml = `
      <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; text-align: right;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2c3e50; margin: 0;">أهلاً بك في عائلة Englishom!</h1>
          <p style="font-size: 18px; color: #007bff; margin-top: 10px;">رحلة الإتقان تبدأ الآن! 🚀</p>
        </div>
        <div style="color: #555555; line-height: 1.8; font-size: 16px;">
          <p>أهلاً <strong>${userName}</strong>،</p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-weight: bold; font-size: 18px;">هل أنت مستعد لأول خطوة؟</p>
            <a href="https://englishom.com/ar/app/levels" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 10px;">ابدأ التعلم الآن</a>
          </div>
        </div>
      </div>
  `;
  await sendEmail('أهلاً بك في عائلة Englishom.. رحلة الإتقان تبدأ الآن! 🚀', welcomeHtml);

  // 2. Payment Success Email
  try {
    const paymentPath = path.join(__dirname, 'src/payment/templates/payment-success-email-template.html');
    let paymentHtml = fs.readFileSync(paymentPath, 'utf-8');
    paymentHtml = paymentHtml
      .replace(/{{userName}}/g, userName)
      .replace(/{{levelName}}/g, 'Level 1')
      .replace(/{{amount}}/g, '500')
      .replace(/{{paymentDate}}/g, '2026/05/18')
      .replace(/{{orderId}}/g, 'TEST_ORDER_123')
      .replace(/{{courseUrl}}/g, 'https://englishom.com/ar/app/levels');
    await sendEmail('🎉 تم الدفع بنجاح - مرحباً بك في مستوى Level 1!', paymentHtml);
  } catch(e) { console.log('Skipping payment template: ', e.message); }

  // 3. Inactive 5 Days Email
  const inactiveHtml = `
      <div class="container" dir="rtl" style="font-family: Arial; text-align: right; padding: 20px;">
          <div class="header">
              <div class="emoji">✨📚</div>
              <h1>لاحظنا انقطاعك 5 أيام</h1>
          </div>
          <div class="content">
              <p>أهلاً <strong>${userName}</strong>،</p>
              <p>لقد لاحظنا انقطاعك عن الدراسة لمدة <span class="highlight">5 أيام</span>، ونريد تذكيرك بأن رحلتك في إتقان اللغة الإنجليزية لا زالت بانتظارك! 🌟</p>
              <div style="text-align: center;">
                  <a href="https://englishom.com/ar/app/levels" style="background-color: #764ba2; color: white; padding: 15px 35px; text-decoration: none; border-radius: 30px; display: inline-block;">أكمل رحلة التعلم الآن</a>
              </div>
          </div>
      </div>
  `;
  await sendEmail('Englishom: لاحظنا انقطاعك 5 أيام .. اشتقنا لك!', inactiveHtml);

  // 4. Suspension Email
  const suspensionHtml = `
      <div class="container" dir="rtl" style="font-family: Arial; text-align: right; padding: 20px;">
          <div class="header" style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
              <h1>تم إيقاف الاشتراك مؤقتاً (فرصة حماية الاشتراك)</h1>
          </div>
          <div class="content" style="padding: 20px;">
              <p>أهلاً <strong>${userName}</strong>،</p>
              <p style="color: #ef4444; background: #fef2f2; padding: 15px;">مؤقتاً بسبب الانقطاع عن الدراسة لأكثر Englishom تنبيه هام: نود إبلاغك بأنه تم تعليق حسابك في من 15 يوماً</p>
              <div style="text-align: center;">
                  <a href="https://englishom.com/ar/contact" style="background-color: #6366f1; color: white; padding: 15px 35px; text-decoration: none; border-radius: 30px; display: inline-block;">تواصل مع الدعم الآن</a>
              </div>
          </div>
      </div>
  `;
  await sendEmail('Englishom: تم إيقاف الاشتراك مؤقتاً (فرصة حماية الاشتراك)', suspensionHtml);

  console.log('✅ Done! Check your email inbox (and spam folder).');
}

run();
