# EnglishOM Blog System - Environment Variables Configuration Guide

## Overview

This document provides a complete guide to all environment variables required for the EnglishOM Blog System. Copy the values from this guide to your `.env` file.

---

## Database Configuration

### DATABASE_URL
**Type:** Connection String  
**Required:** Yes  
**Description:** MySQL database connection string

**Format:**
```
mysql://username:password@host:port/database_name
```

**Examples:**
- **Local Development:**
  ```
  mysql://root:password@localhost:3306/englishom_blog
  ```

- **Namecheap cPanel:**
  ```
  mysql://cpaneluser_dbuser:password@hostname.mysql.db:3306/cpaneluser_englishom
  ```

- **AWS RDS:**
  ```
  mysql://admin:password@englishom-db.c9akciq32.us-east-1.rds.amazonaws.com:3306/englishom_blog
  ```

---

## Authentication & Security

### JWT_SECRET
**Type:** String (Base64 encoded)  
**Required:** Yes  
**Description:** Secret key for signing JWT session cookies

**How to Generate:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) | Select-Object -First 32
```

**Example:**
```
JWT_SECRET=abcdef1234567890ABCDEF1234567890ABCDEF1234567890
```

---

## Manus OAuth Configuration

### VITE_APP_ID
**Type:** String  
**Required:** Yes  
**Description:** OAuth application ID from Manus platform

**Where to Find:**
1. Log in to Manus platform
2. Go to Settings → Applications
3. Copy your Application ID

**Example:**
```
VITE_APP_ID=app_1234567890abcdef
```

### OAUTH_SERVER_URL
**Type:** URL  
**Required:** Yes  
**Description:** Manus OAuth server endpoint

**Value:**
```
OAUTH_SERVER_URL=https://api.manus.im
```

### VITE_OAUTH_PORTAL_URL
**Type:** URL  
**Required:** Yes  
**Description:** Manus OAuth login portal

**Value:**
```
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

---

## Owner Information

### OWNER_OPEN_ID
**Type:** String  
**Required:** Yes  
**Description:** Your unique identifier from Manus OAuth

**Where to Find:**
1. Log in to Manus platform
2. Go to Account Settings → Profile
3. Copy your Open ID

**Example:**
```
OWNER_OPEN_ID=user_1234567890abcdef
```

### OWNER_NAME
**Type:** String  
**Required:** Yes  
**Description:** Display name for blog owner/admin

**Example:**
```
OWNER_NAME=EnglishOM Admin
```

---

## Manus Forge APIs (Built-in Services)

These APIs are provided by Manus and include LLM, storage, notifications, and more.

### BUILT_IN_FORGE_API_URL
**Type:** URL  
**Required:** Yes  
**Description:** Base URL for Manus Forge APIs

**Value:**
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
```

### BUILT_IN_FORGE_API_KEY
**Type:** String (Secret)  
**Required:** Yes  
**Description:** Server-side API key for Manus Forge (keep secret)

**Where to Find:**
1. Log in to Manus platform
2. Go to Settings → API Keys
3. Copy your Server API Key

**Example:**
```
BUILT_IN_FORGE_API_KEY=your_secret_key_here
```

### VITE_FRONTEND_FORGE_API_KEY
**Type:** String  
**Required:** Yes  
**Description:** Client-side API key for Manus Forge (can be exposed)

**Where to Find:**
1. Log in to Manus platform
2. Go to Settings → API Keys
3. Copy your Frontend API Key

**Example:**
```
VITE_FRONTEND_FORGE_API_KEY=pk_live_1234567890abcdef1234567890abcdef
```

### VITE_FRONTEND_FORGE_API_URL
**Type:** URL  
**Required:** Yes  
**Description:** Manus Forge API URL for frontend

**Value:**
```
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

---

## Analytics Configuration

### VITE_ANALYTICS_ENDPOINT
**Type:** URL  
**Required:** Yes  
**Description:** Analytics service endpoint for tracking

**Value:**
```
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
```

### VITE_ANALYTICS_WEBSITE_ID
**Type:** String  
**Required:** Yes  
**Description:** Unique identifier for your website in analytics

**Where to Find:**
1. Log in to Manus platform
2. Go to Analytics → Websites
3. Copy your Website ID

**Example:**
```
VITE_ANALYTICS_WEBSITE_ID=site_1234567890abcdef
```

---

## Application Configuration

### VITE_APP_TITLE
**Type:** String  
**Required:** Yes  
**Description:** Application title (shown in browser tab and header)

**Example:**
```
VITE_APP_TITLE=EnglishOM Blog
```

### VITE_APP_LOGO
**Type:** URL  
**Required:** Yes  
**Description:** Logo URL for branding

**Example:**
```
VITE_APP_LOGO=https://englishom.com/logo.png
```

---

## Node Environment

### NODE_ENV
**Type:** Enum  
**Required:** Yes  
**Description:** Application environment

**Options:**
- `development` - Local development
- `staging` - Staging/testing
- `production` - Production deployment

**Example:**
```
NODE_ENV=production
```

---

## Optional: Email Service (SendGrid)

If you want to enable email notifications for newsletter subscribers:

### SENDGRID_API_KEY
**Type:** String (Secret)  
**Required:** No (optional)  
**Description:** SendGrid API key for sending emails

**Where to Get:**
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Go to Settings → API Keys
3. Create a new API Key

**Example:**
```
SENDGRID_API_KEY=SG.1234567890abcdef1234567890abcdef1234567890abcdef
```

### SENDGRID_FROM_EMAIL
**Type:** Email Address  
**Required:** No (optional)  
**Description:** Email address to send from

**Example:**
```
SENDGRID_FROM_EMAIL=noreply@englishom.com
```

---

## Optional: AWS S3 (Direct Access)

**Note:** The system uses Manus Forge for storage by default. Only configure these if you need direct S3 access:

### AWS_S3_BUCKET
**Type:** String  
**Required:** No (optional)  
**Description:** S3 bucket name

**Example:**
```
AWS_S3_BUCKET=englishom-blog-assets
```

### AWS_REGION
**Type:** String  
**Required:** No (optional)  
**Description:** AWS region

**Example:**
```
AWS_REGION=us-east-1
```

### AWS_ACCESS_KEY_ID
**Type:** String (Secret)  
**Required:** No (optional)  
**Description:** AWS access key

**Example:**
```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
```

### AWS_SECRET_ACCESS_KEY
**Type:** String (Secret)  
**Required:** No (optional)  
**Description:** AWS secret key

**Example:**
```
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

---

## Optional: External Integrations

### GOOGLE_ANALYTICS_ID
**Type:** String  
**Required:** No (optional)  
**Description:** Google Analytics tracking ID

**Example:**
```
GOOGLE_ANALYTICS_ID=UA-123456789-1
```

### STRIPE_API_KEY
**Type:** String (Secret)  
**Required:** No (optional)  
**Description:** Stripe API key (if adding payments)

**Example:**
```
STRIPE_API_KEY=your_stripe_secret_key_here
```

### STRIPE_WEBHOOK_SECRET
**Type:** String (Secret)  
**Required:** No (optional)  
**Description:** Stripe webhook secret

**Example:**
```
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef1234567890abcdef
```

---

## Complete .env Template

Create a `.env` file in the project root with these values:

```bash
# Database
DATABASE_URL=mysql://user:password@localhost:3306/englishom_blog

# Security
JWT_SECRET=your_generated_jwt_secret_here

# Manus OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Owner Info
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=EnglishOM Admin

# Manus Forge APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# Application
VITE_APP_TITLE=EnglishOM Blog
VITE_APP_LOGO=https://englishom.com/logo.png

# Environment
NODE_ENV=production
```

---

## Deployment Checklist

- [ ] Database URL configured and tested
- [ ] JWT_SECRET generated and set
- [ ] VITE_APP_ID obtained from Manus
- [ ] OWNER_OPEN_ID obtained from Manus
- [ ] BUILT_IN_FORGE_API_KEY obtained from Manus
- [ ] VITE_FRONTEND_FORGE_API_KEY obtained from Manus
- [ ] OWNER_NAME set to your organization
- [ ] VITE_APP_TITLE set to your blog title
- [ ] VITE_APP_LOGO URL configured
- [ ] All required variables filled in
- [ ] .env file is in .gitignore (not committed)
- [ ] Tested database connection
- [ ] Tested OAuth connection
- [ ] Ready for deployment

---

## Security Best Practices

1. **Never commit .env to version control** - Add to `.gitignore`
2. **Use strong secrets** - Generate using `openssl rand -base64 32`
3. **Rotate keys regularly** - Update API keys every 90 days
4. **Use different keys per environment** - Dev, staging, and production
5. **Monitor API usage** - Set up alerts for unusual activity
6. **Restrict API key permissions** - Use least privilege principle
7. **Use environment-specific values** - Never use production keys in development

---

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL format is correct
- Check MySQL server is running
- Confirm username and password
- Ensure database exists

### OAuth Login Issues
- Verify VITE_APP_ID is correct
- Check OAUTH_SERVER_URL is accessible
- Confirm OWNER_OPEN_ID is valid
- Clear browser cookies and try again

### API Key Errors
- Verify API keys are not expired
- Check API keys have correct permissions
- Ensure keys are for the correct environment
- Regenerate keys if needed

---

## Support

For more information, refer to:
- [Manus Documentation](https://docs.manus.im)
- [Project README](./README.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Database Structure](./DATABASE_STRUCTURE.md)
