# Englishom Placement Test - Project TODO

## Database & Schema
- [x] Create questions table with stage/level classification
- [x] Create test_results table to store student scores
- [x] Create test_answers table to track individual answers
- [x] Create admin_messages table for smart feedback messages
- [x] Create level_thresholds table for scoring rules
- [x] Run database migrations

## Test Interface - 5 Stages
- [x] Stage 1: Visual Recognition (Image + 5 text options, 2 sec timer)
- [x] Stage 2: Auditory Processing (Audio + 5 image options, 4 sec timer, 2 retries)
- [x] Stage 3: Spelling & Structure (Fill missing letter/word, 2 sec timer)
- [x] Stage 4: Reading Sprint (100-word story + comprehension questions)
- [x] Stage 5: Vocal Challenge (Speech recognition, 15 sec timer, 5 sentences)
- [x] Progress bar visualization (gray → bronze → silver → gold)
- [x] Timer display and management for each stage
- [x] Navigation between stages (no going back)

## Admin Dashboard
- [ ] Admin authentication and role-based access
- [ ] Question bank management interface
- [ ] Add/Edit/Delete questions for each stage
- [ ] Upload images and audio files for questions
- [ ] Configure timer settings per stage
- [ ] Manage smart feedback messages
- [ ] View student results and analytics
- [ ] Export results reports

## Scoring & Results System
- [x] Calculate scores per stage
- [x] Determine overall level (Beginner/Elementary/Intermediate/Upper-Intermediate/Advanced)
- [x] Apply scoring thresholds (90%+ / 70-89% / <69%)
- [x] Generate personalized feedback messages
- [x] Display results page with recommendations
- [x] Store test results in database

## Voice & Audio Features
- [x] Audio recording for Vocal Challenge stage
- [ ] Speech-to-text transcription
- [x] Audio playback for auditory stage
- [x] Microphone permission handling
- [ ] Audio file upload and storage

## UI & Localization
- [x] Bilingual support (Arabic/English) - i18n system created
- [x] Englishom branding and visual identity
- [x] Responsive design for all devices
- [ ] Accessibility features (ARIA labels, keyboard navigation)
- [x] Loading states and error handling

## Testing & Deployment
- [x] Unit tests for scoring logic (22 tests passing, 100%)
- [ ] Integration tests for test flow
- [ ] E2E tests for complete user journey
- [x] Deployment guide created (DEPLOYMENT.md)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deploy to production

## Database Seeding & Sample Data
- [x] Create seed script for test questions
- [x] Populate questions for all 5 stages (in seed script)
- [x] Create admin messages for all levels (in seed script)
- [x] Set up level thresholds (in seed script)

## Admin Features
- [x] Question management UI (add/edit/delete) - Interface created
- [ ] Image upload for visual questions
- [ ] Audio upload for auditory questions
- [ ] Message customization interface
- [ ] Results export (CSV/PDF)
- [ ] Analytics dashboard
- [ ] Wire error handling to admin actions
- [ ] Add ARIA labels to admin forms

## Accessibility & Polish
- [ ] Apply ARIA labels to interactive elements (buttons, forms, progress bars)
- [ ] Integrate keyboard navigation into test stages and admin UI
- [ ] Add screen reader announcements to test flow
- [ ] Wire error handling into test submission and audio flows
- [ ] Enhance loading/skeleton states in components
- [x] Mobile responsiveness testing (responsive design implemented)

## Documentation & Final
- [x] Setup guide (SETUP.md)
- [x] Deployment guide (DEPLOYMENT.md)
- [ ] API documentation in code (tRPC procedures)
- [x] Error codes documented
- [x] Database schema documented
- [x] Project structure documented

## Quality Assurance
- [ ] Mobile responsiveness QA (test on actual devices)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance profiling and optimization
- [ ] Security vulnerability scanning
- [ ] Load testing
- [ ] User acceptance testing

## NEW FEATURES - Language & Dark Mode
- [x] Add language toggle button to navbar (EN/AR)
- [x] Add dark mode toggle button to navbar
- [x] Implement dark mode theme colors (Tailwind dark: classes)
- [x] Save language preference to localStorage
- [x] Save dark mode preference to localStorage
- [x] Update Home page to support dark mode
- [ ] Apply dark mode to Test page
- [ ] Apply dark mode to Results page
- [ ] Apply dark mode to AdminDashboard page
- [ ] Apply dark mode to all stage components
- [x] Add translations for new UI elements
- [ ] Test language switching across all pages
- [ ] Test dark mode across all pages

## File Upload Features (NEW)
- [x] Add image file upload input to question panel
- [x] Add audio file upload input to question panel
- [x] Convert uploaded files to Base64
- [x] Display image preview after upload
- [x] Display audio player for uploaded audio
- [x] Include uploaded files in JSON export
- [x] Validate file types and sizes
- [x] Show upload progress indicator
