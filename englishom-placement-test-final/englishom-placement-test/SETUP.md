# Englishom Placement Test - Setup & Usage Guide

## Overview

Englishom Placement Test is a comprehensive English language proficiency assessment platform featuring 5 interactive stages, intelligent scoring, and personalized feedback. The platform supports both Arabic and English interfaces.

## Features

### 5 Assessment Stages
1. **Visual Recognition** - Match images with words (2s per question)
2. **Auditory Processing** - Identify sounds and words (4s per question, 2 retries)
3. **Spelling & Structure** - Complete words and sentences (2s per question)
4. **Reading Sprint** - Comprehension questions (60s per question)
5. **Vocal Challenge** - Audio recording and evaluation (15s per question)

### Proficiency Levels
- Beginner (0-59%)
- Elementary (60-69%)
- Intermediate (70-79%)
- Upper-Intermediate (80-89%)
- Advanced (90-100%)

### Key Features
- ✅ Real-time progress tracking
- ✅ Per-stage score calculation
- ✅ Automatic level determination
- ✅ Personalized feedback messages
- ✅ Admin dashboard for results management
- ✅ Bilingual support (English/Arabic)
- ✅ Audio recording with microphone support
- ✅ Responsive design for all devices

## Project Structure

```
englishom-placement-test/
├── client/                          # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Test.tsx            # Main test orchestrator
│   │   │   ├── Results.tsx         # Results display
│   │   │   ├── AdminDashboard.tsx  # Admin panel
│   │   │   └── test/               # Individual stage components
│   │   │       ├── VisualRecognition.tsx
│   │   │       ├── AuditoryProcessing.tsx
│   │   │       ├── SpellingStructure.tsx
│   │   │       ├── ReadingSprint.tsx
│   │   │       └── VocalChallenge.tsx
│   │   ├── contexts/
│   │   │   ├── TestContext.tsx     # Test state management
│   │   │   └── LanguageContext.tsx # Language/i18n management
│   │   ├── lib/
│   │   │   └── i18n.ts            # Translations
│   │   └── App.tsx                 # Main app component
├── server/                          # Express backend
│   ├── routers.ts                  # tRPC procedures
│   ├── db.ts                       # Database helpers
│   └── seed-questions.mjs          # Database seeding script
├── drizzle/                         # Database schema
│   └── schema.ts                   # Table definitions
└── shared/                          # Shared types and constants
```

## Database Schema

### Tables

**questions**
- id, stage, level, questionText, imageUrl, audioUrl, correctAnswer, options

**testResults**
- id, studentName, studentEmail, totalScore, overallLevel, visualScore, auditoryScore, spellingScore, readingScore, vocalScore, completedAt

**testAnswers**
- id, testResultId, questionId, stage, userAnswer, isCorrect, timeSpent

**adminMessages**
- id, level, titleEn, titleAr, messageEn, messageAr, recommendationEn, recommendationAr

**levelThresholds**
- id, level, minScore, maxScore

**users**
- id, openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm 10+
- MySQL/TiDB database

### Installation

1. **Install dependencies**
   ```bash
   cd /home/ubuntu/englishom-placement-test
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   # Database connection
   DATABASE_URL=mysql://user:password@host:port/database
   
   # OAuth
   VITE_APP_ID=your_app_id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   
   # Other required vars are auto-injected
   ```

3. **Run database migrations**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

4. **Seed test data**
   ```bash
   node server/seed-questions.mjs
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

The app will be available at `http://localhost:3000`

## Usage

### For Students

1. **Start Test**
   - Visit home page and click "Start Your Test Now"
   - Enter name and email
   - Click "Start Test"

2. **Complete Each Stage**
   - Read instructions carefully
   - Answer questions within time limits
   - Cannot go back to previous stages
   - Progress bar shows current position

3. **View Results**
   - Automatic level determination
   - Personalized feedback message
   - Recommendations based on level
   - Option to retake test

### For Admins

1. **Access Admin Dashboard**
   - Navigate to `/admin` (requires admin role)
   - Three tabs: Question Bank, Student Results, Feedback Messages

2. **Manage Questions**
   - Add new questions for each stage
   - Edit existing questions
   - Delete questions
   - Upload images/audio files

3. **View Results**
   - See all student test results
   - Filter by level or date
   - Export results (future feature)

4. **Customize Messages**
   - Edit feedback messages for each level
   - Customize recommendations
   - Support both English and Arabic

## API Endpoints

### Public Procedures
- `test.getQuestionsByStage` - Get questions for a specific stage
- `test.submitTest` - Submit test answers and get results
- `test.getResult` - Get test results by ID

### Admin Procedures
- `admin.getAllResults` - Get all test results (admin only)
- `admin.addQuestion` - Add new question (admin only)
- `admin.updateQuestion` - Update question (admin only)
- `admin.deleteQuestion` - Delete question (admin only)

## Scoring System

### Per-Stage Scoring
- Each stage has 10 questions
- Score = (Correct Answers / Total Questions) × 100

### Overall Score
- Average of all 5 stages
- Overall Level = Determined by score thresholds

### Level Thresholds
| Level | Score Range |
|-------|------------|
| Beginner | 0-59% |
| Elementary | 60-69% |
| Intermediate | 70-79% |
| Upper-Intermediate | 80-89% |
| Advanced | 90-100% |

## Internationalization (i18n)

The platform supports English and Arabic with RTL support for Arabic.

### Language Switching
- Use `useLanguage()` hook to access language context
- `t()` function for translations
- `isRTL` flag for RTL layout

### Adding Translations
1. Edit `client/src/lib/i18n.ts`
2. Add key-value pairs to `translations` object
3. Use `t('key.path')` in components

## Testing

### Run Tests
```bash
pnpm test
```

### Test Coverage
- Scoring logic tests
- Stage navigation tests
- Level determination tests
- Database query tests

## Deployment

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Environment Variables for Production
- Set all required environment variables
- Use strong database credentials
- Enable HTTPS
- Configure CORS properly

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database is running
- Ensure user has proper permissions

### Microphone Not Working
- Check browser permissions
- Ensure HTTPS is used (required for microphone access)
- Test microphone in browser settings

### Questions Not Loading
- Verify seed script was run
- Check database has questions for the stage
- Check browser console for errors

### Authentication Issues
- Verify OAuth credentials
- Check VITE_APP_ID is correct
- Ensure OAuth server is accessible

## Future Enhancements

- [ ] Speech-to-text for Vocal Challenge
- [ ] Advanced analytics dashboard
- [ ] Batch import questions from CSV
- [ ] Certificate generation
- [ ] Progress tracking over time
- [ ] Comparison with other students
- [ ] Mobile app
- [ ] Video tutorials for each stage

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in browser console
3. Check server logs
4. Contact support team

## License

© 2026 Englishom. All rights reserved.
