# EnglishOM Blog System - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the EnglishOM Blog System to your Namecheap hosting environment and integrating it with englishom.com.

---

## Prerequisites

- Node.js 18+ installed
- MySQL 5.7+ or MariaDB 10.3+
- npm or pnpm package manager
- Git for version control

---

## Step 1: Database Setup on Namecheap

### Create Database
1. Log in to your Namecheap cPanel
2. Navigate to **MySQL Databases**
3. Create a new database named `englishom_blog`
4. Create a database user with full privileges
5. Note the connection credentials

### Import Migrations
```bash
# Download the migration files from the project
# Then execute them in order:

mysql -h your-host -u your-user -p your-database < drizzle/0001_shiny_newton_destine.sql
mysql -h your-host -u your-user -p your-database < drizzle/0002_absurd_boom_boom.sql
```

---

## Step 2: Environment Configuration

Create a `.env.production` file with the following variables:

```env
# Database
DATABASE_URL=mysql://username:password@hostname:3306/englishom_blog

# Authentication
JWT_SECRET=your-jwt-secret-key
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-app-id

# Owner Information
OWNER_NAME=Your Name
OWNER_OPEN_ID=your-open-id

# API Keys
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# Analytics
VITE_ANALYTICS_WEBSITE_ID=your-analytics-id
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im

# App Configuration
VITE_APP_TITLE=EnglishOM Blog
VITE_APP_LOGO=/logo.png
```

---

## Step 3: Build & Deploy

### Build the Project
```bash
cd /home/ubuntu/englishom-blog
pnpm install
pnpm build
```

### Upload to Namecheap
```bash
# Create a production-ready package
tar -czf englishom-blog.tar.gz dist/ node_modules/ package.json

# Upload via FTP or SSH
scp englishom-blog.tar.gz user@your-host:/path/to/public_html/
```

### Start the Application
```bash
# SSH into your server
ssh user@your-host

# Navigate to the directory
cd /path/to/public_html

# Extract the files
tar -xzf englishom-blog.tar.gz

# Start the application
NODE_ENV=production node dist/index.js
```

---

## Step 4: Configure Reverse Proxy (Nginx/Apache)

### For Nginx
```nginx
server {
    listen 80;
    server_name blog.englishom.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### For Apache
```apache
<VirtualHost *:80>
    ServerName blog.englishom.com
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

---

## Step 5: SSL Certificate

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot certonly --nginx -d blog.englishom.com

# Auto-renew certificates
sudo certbot renew --dry-run
```

---

## Step 6: Process Management

### Using PM2
```bash
# Install PM2
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'englishom-blog',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
```

---

## Step 7: Monitoring & Logs

### View Logs
```bash
# PM2 logs
pm2 logs englishom-blog

# Application logs
tail -f /path/to/app/.manus-logs/devserver.log
```

### Monitor Performance
```bash
# CPU and Memory usage
pm2 monit

# Database connections
mysql -h your-host -u your-user -p your-database -e "SHOW PROCESSLIST;"
```

---

## Step 8: Integration with englishom.com

### API Endpoints
The blog API is available at:
- **Base URL**: `https://blog.englishom.com/api/trpc`
- **WebSocket**: `wss://blog.englishom.com/api/trpc`

### Example Integration
```javascript
// In your englishom.com frontend
import { trpc } from '@/lib/trpc';

// Fetch blog posts
const { data: posts } = await trpc.blog.posts.list.useQuery({
  limit: 10,
  categoryId: 1
});

// Display in your website
posts.forEach(post => {
  console.log(`${post.titleEn} - ${post.slug}`);
});
```

---

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
mysql -h your-host -u your-user -p your-database -e "SELECT 1;"
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 node dist/index.js
```

---

## Backup & Recovery

### Database Backup
```bash
# Daily backup
mysqldump -h your-host -u your-user -p your-database > backup-$(date +%Y%m%d).sql

# Automated backup (cron job)
0 2 * * * mysqldump -h your-host -u your-user -p your-database > /backups/blog-$(date +\%Y\%m\%d).sql
```

### Restore Database
```bash
mysql -h your-host -u your-user -p your-database < backup-20260510.sql
```

---

## Performance Optimization

### Enable Caching
```bash
# Redis caching
npm install redis

# Configure in .env
REDIS_URL=redis://localhost:6379
```

### Database Optimization
```sql
-- Create indexes for faster queries
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(categoryId);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_comments_post ON blog_comments(postId);
```

### CDN Configuration
```bash
# Upload images to CDN
# Update image URLs in database to point to CDN

UPDATE blog_posts 
SET featuredImageUrl = REPLACE(featuredImageUrl, 'localhost', 'cdn.englishom.com')
WHERE featuredImageUrl LIKE '%localhost%';
```

---

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set strong database passwords
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Enable CORS properly
- [ ] Use environment variables for secrets
- [ ] Regular backups
- [ ] Monitor access logs
- [ ] Enable two-factor authentication for admin accounts

---

## Support & Maintenance

For issues or questions:
1. Check the logs in `.manus-logs/`
2. Review the API documentation
3. Contact the development team

---

## Version History

- **v1.0.0** (2026-05-10): Initial release with full blog system, email notifications, and admin dashboard
