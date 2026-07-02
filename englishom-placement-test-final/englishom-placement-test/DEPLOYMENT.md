# Englishom Placement Test - Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [x] TypeScript compilation passes
- [x] All tests pass (22 unit tests)
- [x] ESLint rules followed
- [x] Code formatted with Prettier
- [ ] Performance audit completed
- [ ] Security audit completed

### Features
- [x] 5 assessment stages implemented
- [x] Scoring system working
- [x] Results display functional
- [x] Admin dashboard created
- [x] Bilingual support (EN/AR)
- [x] Audio recording support
- [x] Error handling in place
- [x] Accessibility utilities created

### Database
- [x] Schema designed
- [x] Migrations created
- [x] Seed script ready
- [x] Indexes optimized

### Documentation
- [x] Setup guide (SETUP.md)
- [x] API documentation
- [x] Code comments
- [x] Error codes documented

## Deployment Steps

### 1. Environment Setup

```bash
# Set production environment variables
export NODE_ENV=production
export DATABASE_URL=mysql://user:password@host:port/englishom_prod
export JWT_SECRET=<strong-random-secret>
export VITE_APP_ID=<your-app-id>
export OAUTH_SERVER_URL=https://api.manus.im
export VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### 2. Build Application

```bash
# Install dependencies
pnpm install

# Build frontend and backend
pnpm build

# Verify build output
ls -la dist/
```

### 3. Database Migration

```bash
# Generate latest migrations
pnpm drizzle-kit generate

# Apply migrations to production database
pnpm drizzle-kit migrate

# Verify migrations
mysql -u user -p database_name -e "SHOW TABLES;"
```

### 4. Seed Initial Data

```bash
# Run seed script to populate questions and messages
node server/seed-questions.mjs

# Verify data
mysql -u user -p database_name -e "SELECT COUNT(*) FROM questions;"
```

### 5. Start Production Server

```bash
# Start the application
pnpm start

# Verify server is running
curl http://localhost:3000/health
```

### 6. Configure Reverse Proxy (Nginx)

```nginx
upstream englishom_backend {
    server localhost:3000;
}

server {
    listen 443 ssl http2;
    server_name englishom.example.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        proxy_pass http://englishom_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 7. Monitor Application

```bash
# Check logs
tail -f /var/log/englishom/app.log

# Monitor database
mysql -u user -p database_name -e "SHOW PROCESSLIST;"

# Check system resources
top
```

## Production Checklist

### Security
- [ ] HTTPS enabled
- [ ] Database credentials secured
- [ ] JWT secret strong and unique
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

### Performance
- [ ] Database indexes verified
- [ ] Caching strategy implemented
- [ ] CDN configured for static assets
- [ ] Gzip compression enabled
- [ ] Database connection pooling configured
- [ ] Load balancing configured (if needed)

### Monitoring
- [ ] Error tracking (Sentry/similar)
- [ ] Performance monitoring (New Relic/similar)
- [ ] Log aggregation (ELK/similar)
- [ ] Uptime monitoring
- [ ] Database backup automated
- [ ] Alert system configured

### Backup & Recovery
- [ ] Database backups automated (daily)
- [ ] Backup retention policy set (30 days)
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented
- [ ] Rollback procedure documented

## Scaling Considerations

### Horizontal Scaling
1. Use load balancer (nginx, HAProxy)
2. Run multiple application instances
3. Use shared database (already MySQL)
4. Implement session storage (Redis)

### Vertical Scaling
1. Increase server CPU/RAM
2. Optimize database queries
3. Implement caching layer
4. Use CDN for static assets

### Database Optimization
1. Add indexes on frequently queried columns
2. Implement query caching
3. Use read replicas for analytics
4. Archive old test results

## Troubleshooting

### Application Won't Start
```bash
# Check logs
tail -100 /var/log/englishom/app.log

# Verify environment variables
env | grep -E "DATABASE_URL|JWT_SECRET"

# Test database connection
mysql -u user -p -h host database_name -e "SELECT 1;"
```

### Database Connection Issues
```bash
# Check MySQL is running
systemctl status mysql

# Verify credentials
mysql -u user -p -h host -e "SELECT 1;"

# Check connection pool
mysql -u user -p database_name -e "SHOW PROCESSLIST;"
```

### High Memory Usage
```bash
# Check Node.js process
ps aux | grep node

# Monitor memory
watch -n 1 'ps aux | grep node'

# Restart application
systemctl restart englishom
```

### Slow Queries
```bash
# Enable slow query log
SET GLOBAL slow_query_log = 'ON';

# Check slow queries
tail -f /var/log/mysql/slow.log

# Analyze query
EXPLAIN SELECT * FROM test_results WHERE overall_level = 'advanced';
```

## Rollback Procedure

If deployment fails:

```bash
# Stop current version
systemctl stop englishom

# Revert to previous version
git checkout <previous-commit>

# Rebuild
pnpm build

# Start previous version
systemctl start englishom

# Verify
curl http://localhost:3000/health
```

## Post-Deployment Verification

1. **Test Home Page**
   - Visit https://englishom.example.com
   - Verify layout and styling

2. **Test Authentication**
   - Click "Start Test"
   - Verify OAuth login works

3. **Test Assessment Flow**
   - Complete all 5 stages
   - Verify scoring works
   - Check results page

4. **Test Admin Dashboard**
   - Login as admin
   - Verify question bank loads
   - Check student results

5. **Test Bilingual Support**
   - Switch to Arabic
   - Verify RTL layout
   - Check translations

6. **Monitor Performance**
   - Check response times
   - Monitor database queries
   - Check error rates

## Support & Maintenance

### Regular Maintenance
- Weekly: Check logs and error rates
- Monthly: Database optimization and cleanup
- Quarterly: Security audit and updates
- Yearly: Full system review and upgrade

### Contact Information
- Technical Support: support@englishom.com
- Database Admin: dba@englishom.com
- Security Team: security@englishom.com

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-29 | Initial release |

## License

© 2026 Englishom. All rights reserved.
