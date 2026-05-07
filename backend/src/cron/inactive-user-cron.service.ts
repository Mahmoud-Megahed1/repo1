import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserRepo } from '../user/repo/user.repo';
import { MailService } from '../common/mail/mail.service';
import { Role, UserStatus } from '../common/shared';
import { TimeService } from '../common/config/time.service';
import { EmailMessages } from '../common/shared/const';
import { UserProcessingResult } from './interface/user-proccessing-result.interface';
import { LevelAccessService } from '../common/services/level-access.service'; // FIXED: Import properly
import { ClusterHelper } from '../common/services/cluster-helper.service';

@Injectable()
export class InactiveUserCronService {
  private readonly logger = new Logger(InactiveUserCronService.name);
  private readonly emailTemplate: string;
  private readonly suspensionEmailTemplate: string;

  private readonly BATCH_SIZE = 100;
  private readonly DB_BATCH_DELAY_MS = 2000; // 2 seconds between DB batches
  private readonly EMAIL_DELAY_MS = 100; // 100ms between emails
  private readonly EMAIL_RETRY_COUNT = 3;

  constructor(
    private readonly userRepo: UserRepo,
    private readonly emailService: MailService,
    private readonly timeService: TimeService,
    private readonly levelAccessService: LevelAccessService, // FIXED: Inject properly
    private readonly clusterHelper: ClusterHelper, // PREVENT CRON JOB INTERFERENCE
  ) {
    this.emailTemplate = this.getEmailTemplate();
    this.suspensionEmailTemplate = this.getSuspensionEmailTemplate();
  }

  /**
   * 5 AM every day, Riyadh time
   * Sends motivational emails to users inactive for 5+ days
   * Suspends accounts inactive for 15+ days
   */
  @Cron(CronExpression.EVERY_DAY_AT_5AM, {
    name: 'check-inactive-users',
    timeZone: 'Asia/Riyadh',
  })
  async handleInactiveUsers() {


    // inverted check to exit early
    if (!this.clusterHelper.isPrimary()) {
      this.logger.log('Skipping check-inactive-users job on non-primary instance');
      return;
    }

    const startTime = this.timeService.createDate();
    this.logger.log('🔄 Starting inactive user management job...');

    try {
      // Calculate dates correctly
      const now = startTime;
      const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

      // Stats tracking
      const stats = {
        motivationSuccess: 0,
        motivationFailure: 0,
        suspensionSuccess: 0,
        suspensionFailure: 0,
        totalProcessed: 0,
        dbQueries: 0,
      };

      // Process in batches to prevent memory issues
      let skip = 0;
      let hasMoreUsers = true;

      while (hasMoreUsers) {
        stats.dbQueries++;

        // Get batch of users
        const allInactiveUsers = await this.userRepo.find({
          lastActivity: { $lt: fiveDaysAgo }, // Inactive for 5+ days
          role: { $ne: Role.ADMIN },
          isVerified: true,
          status: UserStatus.ACTIVE,
        });

        const users = allInactiveUsers
          .sort((a, b) => new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()) // Process oldest first
          .slice(skip, skip + this.BATCH_SIZE);

        if (users.length === 0) {
          hasMoreUsers = false;
          break;
        }

        this.logger.log(`📊 Processing batch ${Math.floor(skip / this.BATCH_SIZE) + 1} (${users.length} users)`);

        // Process batch
        for (const user of users) {
          stats.totalProcessed++;
          const result = await this.processSingleUser(user, now, fifteenDaysAgo);

          // Update stats
          if (result.motivation?.success) stats.motivationSuccess++;
          if (result.motivation?.failure) stats.motivationFailure++;
          if (result.suspension?.success) stats.suspensionSuccess++;
          if (result.suspension?.failure) stats.suspensionFailure++;

          // Rate limiting between emails
          if (result.sentEmail) {
            await this.delay(this.EMAIL_DELAY_MS);
          }
        }

        skip += this.BATCH_SIZE;

        // Rate limiting between database batches
        if (hasMoreUsers) {
          await this.delay(this.DB_BATCH_DELAY_MS);
        }
      }

      // Log completion
      const duration = (Date.now() - startTime.getTime()) / 1000;
      this.logger.log(`✅ Job completed in ${duration.toFixed(2)}s`);
      this.logger.log(`📊 Database queries: ${stats.dbQueries}`);
      this.logger.log(`👥 Total users processed: ${stats.totalProcessed}`);
      this.logger.log(`📧 Motivation emails: ${stats.motivationSuccess} sent, ${stats.motivationFailure} failed`);
      this.logger.log(`⚠️ Suspensions: ${stats.suspensionSuccess} successful, ${stats.suspensionFailure} failed`);

      if (stats.totalProcessed > 0) {
        const successRate = ((stats.motivationSuccess + stats.suspensionSuccess) /
          stats.totalProcessed * 100).toFixed(1);
        this.logger.log(`🎯 Success rate: ${successRate}%`);
      }

    } catch (error) {
      this.logger.error(`💥 Critical error in inactive user job: ${error.message}`);
      this.logger.error(error.stack);
    }
  }

  /**
   * Process a single user
   */
  private async processSingleUser(
    user: any,
    now: Date,
    fifteenDaysAgo: Date
  ): Promise<UserProcessingResult> {
    const userLastActivity = new Date(user.lastActivity);
    const diffInDays = Math.floor(
      (now.getTime() - userLastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    const result: UserProcessingResult = {
      sentEmail: false,
      motivation: null,
      suspension: null
    };

    // --- Suspension check (>= 15 days) ---
    if (diffInDays >= 15) {
      try {
        const isFirstSuspension = !user.hasUsedInactivityGrace;

        await this.userRepo.findOneAndUpdate(
          { _id: user._id },
          {
            status: UserStatus.SUSPENDED,
            suspendedAt: now,
            suspensionReason: isFirstSuspension
              ? 'إيقاف مؤقت (فرصة حماية الاشتراك للمرة الأولى)'
              : EmailMessages.SuspensionReasonMessage,
            pauseStartedAt: isFirstSuspension ? now : undefined,
            // We set hasUsedInactivityGrace here to true so it only happens once
            hasUsedInactivityGrace: true,
          },
        );

        await this.sendSuspensionEmail(user, isFirstSuspension);
        result.suspension = { success: true };
        result.sentEmail = true;
        this.logger.debug(`⚠️ User suspended: ${user.email} (${diffInDays} days inactive, First: ${isFirstSuspension})`);
      } catch (error) {
        result.suspension = { failure: true, error: error.message };
        this.logger.error(`❌ Failed to suspend ${user.email}: ${error.message}`);
      }
      return result;
    }

    // --- Dynamic alerts for Day 5 and Day 10 ---
    if (diffInDays === 5 || diffInDays === 10) {
      try {
        await this.sendMotivationalEmail(user, diffInDays);
        result.motivation = { success: true };
        result.sentEmail = true;
        this.logger.debug(`✉️ Day ${diffInDays} alert sent to: ${user.email}`);
      } catch (error) {
        result.motivation = { failure: true, error: error.message };
        this.logger.error(`❌ Failed to send Day ${diffInDays} email to ${user.email}: ${error.message}`);
      }
    }

    return result;
  }

  private async sendMotivationalEmail(user: any, absentDays: number): Promise<void> {
    let daysLeftText = 'بعض الأيام';

    try {
      const info = await this.levelAccessService.getLatestAccessInfo(user._id.toString());
      if (info && info.daysLeft > 0) {
        daysLeftText = `${info.daysLeft} يوم`;
      }
    } catch (error) {
      this.logger.warn(`Could not get level access info for ${user.email}: ${error.message}`);
    }

    const title = absentDays === 5
      ? `لاحظنا انقطاعك 5 أيام`
      : `لاحظنا انقطاعك 10 أيام`;

    const personalizedEmail = this.emailTemplate
      .replaceAll('{{dynamicTitle}}', title)
      .replaceAll('{{userName}}', user.firstName || 'طالبنا العزيز')
      .replaceAll('{{daysLeft}}', daysLeftText)
      .replaceAll('{{absentDays}}', absentDays.toString())
      .replaceAll(
        '{{loginUrl}}',
        'https://englishom.com/ar/app/levels',
      );

    await this.sendEmailWithRetry({
      to: user.email,
      subject: `Englishom: ${title} .. اشتقنا لك!`,
      htmlContent: personalizedEmail,
    });
  }

  private async sendSuspensionEmail(user: any, isGrace: boolean): Promise<void> {
    const title = isGrace
      ? 'تم إيقاف الاشتراك مؤقتاً (فرصة حماية الاشتراك)'
      : 'نأسف لاضطررنا لإيقاف الاشتراك بعد انقطاع 15 يوم';

    const suspensionEmail = this.suspensionEmailTemplate
      .replaceAll('{{dynamicTitle}}', title)
      .replaceAll('{{userName}}', user.firstName || 'طالبنا العزيز')
      .replaceAll(
        '{{supportUrl}}',
        'https://englishom.com/ar/app/levels', // Redirect to app levels page
      );

    await this.sendEmailWithRetry({
      to: user.email,
      subject: `Englishom: ${title}`,
      htmlContent: suspensionEmail,
    });
  }

  private async sendEmailWithRetry(
    mailOptions: any,
    retries = this.EMAIL_RETRY_COUNT
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.emailService.sendCustomEmail(mailOptions);
        return;
      } catch (error) {
        if (attempt === retries) {
          throw new Error(`Failed to send email after ${retries} attempts: ${error.message}`);
        }
        await this.delay(1000 * attempt); // Exponential backoff
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }





  private getEmailTemplate(): string {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <style>
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            text-align: right;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #ffffff;
            padding: 30px 20px;
            border-bottom: 1px solid #eee;
        }
        .emoji {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
        }
        .footer {
            background: #f8f9fa;
            text-align: center;
            color: #666;
            font-size: 14px;
            padding: 20px;
            border-radius: 0 0 10px 10px;
        }
        .highlight {
            color: #764ba2;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="emoji">✨📚</div>
            <h1>{{dynamicTitle}}</h1>
        </div>
        <div class="content">
            <p>أهلاً <strong>{{userName}}</strong>،</p>
            
            <p>لقد لاحظنا انقطاعك عن الدراسة لمدة <span class="highlight">{{absentDays}} أيام</span>، ونريد تذكيرك بأن رحلتك في إتقان اللغة الإنجليزية لا زالت بانتظارك! 🌟</p>
            <p><strong>تنبيه هيدز أب:</strong> متبقي لك <span class="highlight">{{daysLeft}}</span> في صلاحية الوصول الحالية لهذا المستوى.</p>
            
            <p><strong>لا تدع ما بنيته من تقدم يضيع!</strong> كل يوم تدريب هو خطوة حقيقية نحو أهدافك، سواء كانت للعمل، السفر، أو التطوير الشخصي. الالتزام هو سر النجاح.</p>
            
            <p>تذكر ما ينتظرك عند عودتك:</p>
            <ul style="list-style-type: none; padding-right: 0;">
                <li>🎯 خطة تعليمية مخصصة لك</li>
                <li>� تتبع دقيق لمدى تطورك</li>
                <li>🏆 شهادات معتمدة عند إتمام المستويات</li>
                <li>💪 تدريبات صوتية وبناء ثقة حقيقية</li>
            </ul>
            
            <p>حتى 10 دقائق من الممارسة يومياً تصنع فرقاً شاسعاً مع الوقت. مستشارك مستر محمود وفريق العمل بانتظار عودتك القوية! 🚀</p>
            
            <div style="text-align: center;">
                <a href="{{loginUrl}}" class="cta-button">أكمل رحلة التعلم الآن</a>
            </div>
            
            <p>نحن نؤمن بقدرتك على الاحتراف. عد إلينا لنكمل هذه الرحلة الممتعة معاً!</p>
            
            <p>استمر في التعلم.. استمر في النمو! ❤️</p>
            
            <p>مع كل التشجيع،<br>
            <strong>عائلة Englishom</strong></p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Englishom. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>
`;
  }

  private getSuspensionEmailTemplate(): string {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <style>
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            text-align: right;
        }
        .header {
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #ffffff;
            padding: 30px 20px;
            border-bottom: 1px solid #eee;
        }
        .emoji {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
        }
        .warning-box {
            background: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            color: #c53030;
        }
        .footer {
            background: #f8f9fa;
            text-align: center;
            color: #666;
            font-size: 14px;
            padding: 20px;
            border-radius: 0 0 10px 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="emoji">⚠️🔒</div>
            <h1>{{dynamicTitle}}</h1>
        </div>
        <div class="content">
            <p>أهلاً <strong>{{userName}}</strong>،</p>
            
            <div class="warning-box">
                <strong>تنبيه هام:</strong> نود إبلاغك بأنه تم تعليق حسابك في Englishom مؤقتاً بسبب الانقطاع عن الدراسة لأكثر من 15 يوماً.
            </div>
            
            <p>نحن نقدر ظروف الحياة وضيق الوقت، ولذلك قمنا بتعليق الحساب لحماية مجهودك وضمان عدم هدر أيام اشتراكك أثناء غيابك. حسابك آمن ويمكن تفعيله بسهولة!</p>
            
            <h3>🔄 كيف تستعيد حسابك؟</h3>
            <ul style="list-style-type: none; padding-right: 0;">
                <li>📞 تواصل مع فريق الدعم الفني</li>
                <li>💬 استخدم ميزة الدردشة المباشرة في الموقع</li>
                <li>📧 أرسل لنا رسالة توضح رغبتك في العودة</li>
                <li>🌐 قم بزيارة مركز الدعم والمساعدة</li>
            </ul>
            
            <p><strong>لماذا تم تعليق الحساب؟</strong></p>
            <p>يتم تعليق الحسابات تلقائياً بعد 15 يوماً من الانقطاع لحماية استقرار تعلمك ولضمان تواصلنا معك قبل استئناف الدراسة، مما يساعدنا في تقديم أفضل تجربة ممكنة.</p>
            
            <p><strong>تقدمك في أمان تام! 🛡️</strong></p>
            <p>لا تقلق، جميع بياناتك وشهاداتك ومستوياتك التي أتممتها محفوظة لدينا ولن تضيع، وستعود كما كانت فور تفعيل الحساب.</p>
            
            <div style="text-align: center;">
                <a href="{{supportUrl}}" class="cta-button">تواصل مع الدعم الآن</a>
            </div>
            
            <p>نحن ننتظر عودتك بشوق لمواصلة رحلة التميز في اللغة الإنجليزية.</p>
            
            <p>شكراً لتفهمك! 🙏</p>
            
            <p>مع أطيب التحيات،<br>
            <strong>عائلة Englishom</strong></p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Englishom. لدعم متعلمي الإنجليزية حول العالم.</p>
            <p>هذه رسالة تلقائية، يرجى عدم الرد عليها مباشرة.</p>
        </div>
    </div>
</body>
</html>
`;
  }
}
