# EnglishOM - Backend API

A comprehensive NestJS-based backend system for an English learning platform with advanced features including AI-powered speech assessment, payment integration, and role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Seeding](#database-seeding)
- [Cron Jobs](#cron-jobs)
- [Deployment](#deployment)
- [Documentation](#documentation)

## ✨ Features

### Core Features

- **User Authentication & Authorization**

  - Email/Password authentication with email verification
  - OAuth integration (Google & Facebook)
  - JWT-based authentication
  - Single device login enforcement
  - Password reset functionality
  - User suspension system

- **Admin System**

  - Role-based access control (SUPER, MANAGER, OPERATOR, VIEW)
  - Separate admin authentication
  - Protected admin creation and management
  - Comprehensive admin dashboard

- **Course Management**

  - Complete course CRUD operations
  - Multi-level course structure
  - Content upload and management

- **Payment Integration**

  - PayMob payment gateway integration
  - Order management system
  - Automated payment verification
  - Order access management

- **AI-Powered Features**

  - Speech assessment using Whisper AI models
  - Audio transcription (free, offline-capable)
  - Multiple model support for speed vs accuracy

- **Email Service**
  - Brevo (SendInBlue) integration
  - Template-based emails
  - OTP verification
  - Password reset emails

### System Features

- **Automated Cron Jobs**

  - Inactive user cleanup
  - Order access management
  - Pending order cleanup

- **Dashboard & Analytics**

  - User statistics
  - Order analytics
  - Activity monitoring

- **Security**
  - Rate limiting with @nestjs/throttler
  - Helmet for HTTP security headers
  - Input validation with class-validator
  - CORS configuration

## 🛠 Tech Stack

### Core Framework

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** & **Mongoose** - databaseMongoDB ODM

### Key Dependencies

- **Authentication**: @nestjs/jwt, @nestjs/passport, passport-jwt, passport-google-oauth20, passport-facebook
- **AI/ML**: @xenova/transformers (Whisper models for speech assessment)
- **File Storage**: GridFS (MongoDB native file storage)
- **Payment**: PayMob integration
- **Email**: @getbrevo/brevo, nodemailer
- **Validation**: class-validator, class-transformer, joi
- **Scheduling**: @nestjs/schedule
- **Media Processing**: ffmpeg-static, fluent-ffmpeg
- **Security**: helmet, bcrypt, @nestjs/throttler

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn
- Brevo account (for email service)
- PayMob account (for payment processing)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd Englishom-Backed-
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
# Copy .env.example to .env and configure
cp .env.example .env
```

4. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

### Available Scripts

```bash
# Development
npm run start              # Start the application
npm run start:dev          # Start in watch mode
npm run start:debug        # Start in debug mode
npm run start:prod         # Start production build

# Build
npm run build              # Build the project
npm run vercel-build       # Build for Vercel deployment

# Code Quality
npm run format             # Format code with Prettier
npm run lint               # Lint and fix code

# Database Seeding
npm run seed               # Interactive seeder
npm run seed:all           # Seed all data
npm run seed:clear         # Clear all seeded data
npm run seed:admins        # Seed admins only
npm run seed:users         # Seed users only
npm run seed:courses       # Seed courses only
npm run seed:orders        # Seed orders only
npm run seed:help          # Show seeder help

# Testing
npm run test:mail          # Test mail service
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
MONGODB_URI=mongodb://localhost:27017/englishom

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=7d

# Brevo Email Service
BREVO_API_KEY=your-brevo-api-key
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_FROM_NAME=EnglishOM

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/user-auth/google/callback

# OAuth - Facebook
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/user-auth/facebook/callback

# PayMob
PAYMOB_API_KEY=your-paymob-api-key
PAYMOB_INTEGRATION_ID=your-integration-id
PAYMOB_IFRAME_ID=your-iframe-id

# Frontend URLs
FRONTEND_URL=http://localhost:3001
OAUTH_SUCCESS_REDIRECT=http://localhost:3001/auth/success
OAUTH_FAILURE_REDIRECT=http://localhost:3001/auth/failure

# Admin
DEFAULT_SUPER_ADMIN_EMAIL=admin@englishom.com
DEFAULT_SUPER_ADMIN_PASSWORD=your-super-admin-password
```

## 📚 API Documentation

### Main Endpoints

#### Authentication

- `POST /api/user-auth/signup` - User registration
- `POST /api/user-auth/login` - User login
- `POST /api/user-auth/verify-email` - Verify email with OTP
- `POST /api/user-auth/forgot-password` - Request password reset
- `POST /api/user-auth/reset-password` - Reset password
- `GET /api/user-auth/google` - Google OAuth login
- `GET /api/user-auth/facebook` - Facebook OAuth login

#### Admin Authentication

- `POST /api/admin-auth/login` - Admin login
- `POST /api/admin-auth/signup` - Create new admin (SUPER only)

#### Users

- `GET /api/user` - Get all users (Admin only)
- `GET /api/user/:id` - Get user by ID
- `PATCH /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user

#### Courses

- `GET /api/course` - Get all courses
- `GET /api/course/:id` - Get course by ID
- `POST /api/course` - Create course (Admin only)
- `PATCH /api/course/:id` - Update course (Admin only)
- `DELETE /api/course/:id` - Delete course (Admin only)

#### Payments

- `POST /api/paymob/create-order` - Create payment order
- `POST /api/paymob/callback` - PayMob callback handler

#### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics (Admin only)

#### File Upload

- `POST /api/file-upload/upload` - Upload file to GridFS
- `POST /api/file-upload/speak-assessment` - AI speech assessment

For detailed API documentation, refer to the [docs/AUTHENTICATION_FLOWS_COMPLETE_GUIDE.md](docs/AUTHENTICATION_FLOWS_COMPLETE_GUIDE.md) file.

## 📁 Project Structure

```
├── src/
│   ├── admin/              # Admin management module
│   ├── admin-auth/         # Admin authentication module
│   ├── common/             # Shared utilities, services, and config
│   │   ├── config/         # Configuration files
│   │   ├── database/       # Database connection
│   │   ├── filters/        # Exception filters
│   │   ├── interceptors/   # Custom interceptors
│   │   ├── mail/           # Email service
│   │   ├── models/         # Shared models
│   │   ├── seeds/          # Database seeders
│   │   └── services/       # Shared services (AI, utils)
│   ├── course/             # Course management module
│   ├── cron/               # Scheduled jobs
│   ├── dashboard/          # Analytics and dashboard
│   ├── file-upload/        # File upload and S3 integration
│   ├── payment/            # Payment integration (PayMob)
│   ├── user/               # User management module
│   ├── user-auth/          # User authentication module
│   ├── app.module.ts       # Root application module
│   └── main.ts             # Application entry point
├── docs/                   # Documentation files
├── ecosystem.config.js     # PM2 configuration
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🌱 Database Seeding

The project includes a comprehensive seeding system for development and testing:

### Interactive Seeder

```bash
npm run seed
```

This launches an interactive CLI that allows you to:

- Seed specific data types (admins, users, courses, orders)
- Seed all data at once
- Clear all seeded data
- View seeding status

### Seeder Details

- **Admins**: Creates test admins with different roles (SUPER, MANAGER, OPERATOR, VIEW)
- **Users**: Creates test users with various verification states
- **Courses**: Seeds complete course structure with levels and content
- **Orders**: Generates sample orders with different statuses

For more information, see [docs/DEVELOPMENT_SEEDER.md](docs/DEVELOPMENT_SEEDER.md)

## ⏰ Cron Jobs

The system includes automated cron jobs for maintenance:

1. **Inactive User Cleanup** - Removes unverified users after 24 hours
2. **Order Access Management** - Manages course access based on orders
3. **Pending Order Cleanup** - Cleans up expired pending orders

For detailed information, see [docs/CRON_JOB_GUIDE.md](docs/CRON_JOB_GUIDE.md)

## 🚢 Deployment

### PM2 Deployment

The project includes PM2 configuration for production deployment:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js

# Monitor the application
pm2 monit

# View logs
pm2 logs
```

### Environment Setup

1. Ensure all environment variables are properly configured
2. Build the project: `npm run build`
3. Start with PM2: `pm2 start ecosystem.config.js`
4. Set up Nginx as reverse proxy (recommended)

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 📖 Documentation

Detailed documentation is available in the `docs/` directory:

- [Admin System](docs/ADMIN_SYSTEM.md) - Admin roles and permissions
- [Authentication Flows](docs/AUTHENTICATION_FLOWS_COMPLETE_GUIDE.md) - Complete auth guide
- [Cron Jobs](docs/CRON_JOB_GUIDE.md) - Scheduled tasks documentation
- [Dashboard Usage](docs/DASHBOARD_USAGE_GUIDE.md) - Dashboard features and usage
- [Development Seeder](docs/DEVELOPMENT_SEEDER.md) - Database seeding guide
- [Single Device Login](docs/SINGLE_DEVICE_LOGIN.md) - Session management
- [Speech Assessment](docs/SPEAK_ASSESSMENT_IMPLEMENTATION.md) - AI speech features
- [Transformers AI](docs/TRANSFORMERS_AI_GUIDE.md) - AI/ML integration guide
- [User Suspension](docs/USER_SUSPENSION_SYSTEM.md) - User management features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT License grants you the freedom to use, modify, and distribute this software with minimal restrictions.

## 👥 Support

For support and questions, please contact the development team.

---
