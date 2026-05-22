# EnglishOM Ques - English Learning Quiz Platform

A fast-paced, interactive English learning quiz platform built for Englishom.com. Test your English knowledge across proficiency levels from A1 (Beginner) to C2 (Proficiency).

## Features

### 🎯 Quiz Interface (`/ques`)
- **Interactive Questions**: Multiple-choice questions with 4 options (A, B, C, D)
- **Timed Challenges**: 10-second countdown timer per question with auto-advance on timeout
- **Progress Tracking**: Visual progress bar showing current question and total count
- **Instant Feedback**: Immediate visual feedback on correct/incorrect answers
- **Level Selection**: Choose from 6 proficiency levels (A1-C2)
- **Performance Summary**: Detailed results showing score, accuracy %, and average response time

### 🛡️ Admin Dashboard (`/admin`)
- **Role-Based Access**: Admin-only interface protected by user authentication
- **Question Management**: Add, edit, and delete questions
- **Level Filtering**: Filter questions by proficiency level
- **Statistics**: View total questions and breakdown by level
- **Form Validation**: Comprehensive validation for question creation/editing

### 🎨 Design & Branding
- **Englishom.com Integration**: Matches the visual identity of Englishom.com
- **Inter Font**: Uses Inter font family for consistent typography
- **Brand Colors**: Accent color `oklch(0.43 0.04 42)` matching Englishom.com
- **Responsive Design**: Mobile-first approach with full responsiveness
- **Light Theme**: Clean, light background with proper contrast

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Backend**: Express 4 with tRPC 11
- **Database**: MySQL with Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Authentication**: Manus OAuth
- **Testing**: Vitest

## Project Structure

```
englishom-ques/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Landing page
│   │   │   ├── Quiz.tsx          # Quiz interface
│   │   │   └── AdminDashboard.tsx # Admin panel
│   │   ├── App.tsx               # Route configuration
│   │   ├── lib/trpc.ts           # tRPC client setup
│   │   └── index.css             # Global styles
│   └── index.html
├── server/
│   ├── routers.ts                # tRPC procedures
│   ├── db.ts                     # Database queries
│   ├── quiz.test.ts              # Backend tests
│   └── auth.logout.test.ts       # Auth tests
├── drizzle/
│   ├── schema.ts                 # Database schema
│   └── migrations/               # SQL migrations
├── scripts/
│   └── seed-questions.mjs        # Sample data seeding
└── package.json
```

## Database Schema

### Questions Table
```sql
CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  choiceA TEXT NOT NULL,
  choiceB TEXT NOT NULL,
  choiceC TEXT NOT NULL,
  choiceD TEXT NOT NULL,
  correctAnswer VARCHAR(1) NOT NULL, -- A, B, C, or D
  level ENUM('A1','A2','B1','B2','C1','C2') NOT NULL,
  category VARCHAR(100),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);
```

### Test Results Table
```sql
CREATE TABLE testResults (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  level ENUM('A1','A2','B1','B2','C1','C2') NOT NULL,
  totalQuestions INT NOT NULL,
  correctAnswers INT NOT NULL,
  accuracy INT NOT NULL,
  averageResponseTime INT,
  completedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## API Endpoints

### Public Procedures
- `quiz.getQuestionsByLevel` - Fetch questions by proficiency level

### Protected Procedures (Authenticated Users)
- `quiz.submitTestResult` - Save quiz results

### Admin Procedures (Admin Only)
- `admin.getAllQuestions` - Get all questions
- `admin.createQuestion` - Create a new question
- `admin.updateQuestion` - Update an existing question
- `admin.deleteQuestion` - Delete a question

## Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm check
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Seeding Sample Questions

To populate the database with sample questions:

```bash
# Set environment variables
export DATABASE_URL="mysql://user:password@localhost/englishom_ques"

# Run seed script
node scripts/seed-questions.mjs
```

## Routes

| Route | Purpose | Authentication |
|-------|---------|-----------------|
| `/` | Home page with features overview | Public |
| `/ques` | Quiz interface | Public |
| `/admin` | Admin dashboard | Admin only |

## Quiz Flow

1. **Level Selection**: User selects proficiency level (A1-C2)
2. **Question Display**: 10 questions appear one at a time
3. **Timed Response**: 10-second countdown timer per question
4. **Auto-Advance**: Automatically moves to next question on answer or timeout
5. **Results**: Shows final score, accuracy %, and average response time
6. **Save Results**: If authenticated, results are saved to database

## Admin Features

### Question Management
- Add new questions with validation
- Edit existing questions
- Delete questions
- View all questions with filtering

### Statistics
- Total number of questions
- Questions breakdown by level
- Quick overview of question database

## Security Features

- **Role-Based Access Control**: Admin procedures protected by user role
- **Authentication Required**: Quiz results require user authentication
- **Input Validation**: All form inputs validated on client and server
- **SQL Injection Protection**: Using parameterized queries with Drizzle ORM

## Performance Considerations

- **Lazy Loading**: Questions fetched on-demand
- **Optimized Build**: Production build with code splitting
- **Responsive Design**: Mobile-optimized interface
- **Fast Interactions**: Instant visual feedback on user actions

## Future Enhancements

- [ ] Question randomization and shuffle
- [ ] Prevent question repeats in same session
- [ ] Search functionality for questions
- [ ] Category filtering
- [ ] Bulk import/export questions
- [ ] Leaderboard
- [ ] User progress tracking
- [ ] Difficulty-based question selection
- [ ] Keyboard navigation support
- [ ] Sound effects and animations

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` environment variable
- Check MySQL server is running
- Ensure database user has proper permissions

### Quiz Not Loading Questions
- Check admin has added questions to database
- Verify selected level has questions
- Check browser console for errors

### Admin Access Denied
- Ensure user is logged in
- Verify user has admin role in database
- Check `role` field in users table

## Support

For issues or questions, contact the Englishom team or check the project documentation.

## License

© 2026 Englishom. All rights reserved.
