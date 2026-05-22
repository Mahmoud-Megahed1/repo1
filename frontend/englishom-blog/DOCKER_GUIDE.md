# 🐳 Docker Compose Guide - EnglishOM Blog System

**دليل شامل لاستخدام Docker و Docker Compose لنشر نظام مدونة EnglishOM**

---

## 📋 المتطلبات

### البرامج المطلوبة:
- **Docker** 20.10+ ([تحميل](https://www.docker.com/products/docker-desktop))
- **Docker Compose** 2.0+ (يأتي مع Docker Desktop)
- **Git** (لاستنساخ المشروع)

### التحقق من التثبيت:
```bash
docker --version
docker-compose --version
```

---

## 🚀 البدء السريع

### 1. استنساخ المشروع
```bash
git clone <repository-url> englishom-blog
cd englishom-blog
```

### 2. إنشاء ملف .env
```bash
cp .env.example .env
# ثم عدّل .env مع قيمك الخاصة
```

### 3. بدء الخدمات
```bash
docker-compose up -d
```

### 4. التحقق من الحالة
```bash
docker-compose ps
```

### 5. الوصول إلى التطبيق
```
http://localhost
```

---

## 📦 الخدمات المتضمنة

### 1. **MySQL Database** (db)
- **الصورة:** mysql:8.0
- **المنفذ:** 3306
- **قاعدة البيانات:** englishom_blog
- **المستخدم:** englishom_user

**الملفات:**
- `docker/mysql.cnf` - إعدادات MySQL
- `drizzle/*.sql` - ملفات Migration

### 2. **Node.js Application** (app)
- **الصورة:** مبنية من Dockerfile
- **المنفذ:** 3000
- **البيئة:** Production

**الملفات:**
- `Dockerfile` - تعريف الصورة
- `docker-compose.yml` - إعدادات الخدمة

### 3. **Nginx Reverse Proxy** (nginx)
- **الصورة:** nginx:alpine
- **المنفذ:** 80 (و 443 للـ HTTPS)
- **الوظيفة:** توجيه الطلبات وتخزين مؤقت

**الملفات:**
- `docker/nginx.conf` - إعدادات Nginx الرئيسية
- `docker/default.conf` - إعدادات الخادم الافتراضي

---

## 📝 ملفات الإعدادات

### docker-compose.yml
```yaml
# الملف الرئيسي الذي يحدد جميع الخدمات
# يتضمن:
# - db: خدمة MySQL
# - app: تطبيق Node.js
# - nginx: خادم Nginx
```

### Dockerfile
```dockerfile
# ملف بناء صورة التطبيق
# يستخدم بناء متعدد المراحل:
# - المرحلة 1: بناء التطبيق
# - المرحلة 2: صورة الإنتاج الخفيفة
```

### docker/nginx.conf
```nginx
# إعدادات Nginx الرئيسية
# يتضمن:
# - ضغط Gzip
# - تحديد المعدل (Rate Limiting)
# - رؤوس الأمان
```

### docker/default.conf
```nginx
# إعدادات الخادم الافتراضي
# يتضمن:
# - توجيه الطلبات إلى التطبيق
# - تخزين مؤقت للملفات الثابتة
# - معالجة الأخطاء
```

### docker/mysql.cnf
```ini
# إعدادات MySQL
# يتضمن:
# - ترميز UTF-8
# - إعدادات الأداء
# - إعدادات السجلات
```

---

## 🔧 الأوامر الشائعة

### بدء الخدمات
```bash
# بدء جميع الخدمات في الخلفية
docker-compose up -d

# بدء الخدمات مع عرض السجلات
docker-compose up

# بدء خدمة معينة
docker-compose up -d db
docker-compose up -d app
docker-compose up -d nginx
```

### إيقاف الخدمات
```bash
# إيقاف جميع الخدمات
docker-compose stop

# إيقاف خدمة معينة
docker-compose stop app

# إيقاف وحذف الحاويات
docker-compose down

# إيقاف وحذف الحاويات والأحجام
docker-compose down -v
```

### عرض السجلات
```bash
# عرض سجلات جميع الخدمات
docker-compose logs

# عرض سجلات خدمة معينة
docker-compose logs app
docker-compose logs db
docker-compose logs nginx

# عرض السجلات الحية
docker-compose logs -f app

# عرض آخر 100 سطر
docker-compose logs --tail 100 app
```

### حالة الخدمات
```bash
# عرض حالة جميع الخدمات
docker-compose ps

# عرض تفاصيل الخدمات
docker-compose ps -a
```

### إعادة بناء الصور
```bash
# إعادة بناء صورة التطبيق
docker-compose build

# إعادة بناء وبدء الخدمات
docker-compose up -d --build

# إعادة بناء خدمة معينة
docker-compose build app
```

### تنفيذ أوامر داخل الحاويات
```bash
# تنفيذ أمر في حاوية التطبيق
docker-compose exec app npm run db:check

# الدخول إلى shell الحاوية
docker-compose exec app sh

# تنفيذ أمر في قاعدة البيانات
docker-compose exec db mysql -u englishom_user -p englishom_blog
```

### إعادة تشغيل الخدمات
```bash
# إعادة تشغيل جميع الخدمات
docker-compose restart

# إعادة تشغيل خدمة معينة
docker-compose restart app
```

---

## 🔐 متغيرات البيئة

### ملف .env المطلوب

```bash
# ============================================================================
# Database Configuration
# ============================================================================
DB_ROOT_PASSWORD=root_password_change_me
DB_NAME=englishom_blog
DB_USER=englishom_user
DB_PASSWORD=user_password_change_me
DB_PORT=3306

# ============================================================================
# Application Configuration
# ============================================================================
JWT_SECRET=your_jwt_secret_here
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# ============================================================================
# Owner Information
# ============================================================================
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=EnglishOM Admin

# ============================================================================
# Manus Forge APIs
# ============================================================================
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# ============================================================================
# Analytics
# ============================================================================
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# ============================================================================
# Application
# ============================================================================
VITE_APP_TITLE=EnglishOM Blog
VITE_APP_LOGO=https://englishom.com/logo.png
```

---

## 🔍 استكشاف الأخطاء

### المشكلة: الخدمات لا تبدأ
```bash
# تحقق من السجلات
docker-compose logs

# تحقق من الأخطاء المحددة
docker-compose logs app
docker-compose logs db
```

### المشكلة: فشل الاتصال بقاعدة البيانات
```bash
# تحقق من أن قاعدة البيانات تعمل
docker-compose ps db

# تحقق من متغيرات البيئة
docker-compose exec app env | grep DATABASE

# اختبر الاتصال
docker-compose exec app npm run db:check
```

### المشكلة: المنفذ مستخدم بالفعل
```bash
# تحقق من العمليات على المنفذ
lsof -i :80
lsof -i :3000
lsof -i :3306

# غيّر المنفذ في docker-compose.yml
# أو أوقف الخدمة التي تستخدم المنفذ
```

### المشكلة: مساحة التخزين ممتلئة
```bash
# نظّف الصور والحاويات غير المستخدمة
docker system prune -a

# احذف الأحجام غير المستخدمة
docker volume prune
```

---

## 📊 المراقبة والصيانة

### عرض استخدام الموارد
```bash
# عرض استخدام CPU والذاكرة
docker stats

# عرض استخدام قرص التخزين
docker system df
```

### النسخ الاحتياطية

#### نسخ احتياطية لقاعدة البيانات
```bash
# إنشاء نسخة احتياطية
docker-compose exec db mysqldump \
  -u englishom_user -p englishom_blog > backup.sql

# استعادة من نسخة احتياطية
docker-compose exec -T db mysql \
  -u englishom_user -p englishom_blog < backup.sql
```

#### نسخ احتياطية للأحجام
```bash
# نسخ احتياطية للبيانات
docker run --rm \
  -v englishom-blog_db_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/db_backup.tar.gz -C /data .
```

---

## 🔒 الأمان

### أفضل الممارسات

1. **استخدم كلمات مرور قوية**
   ```bash
   # توليد كلمة مرور عشوائية
   openssl rand -base64 32
   ```

2. **لا تشارك ملف .env**
   ```bash
   # أضف إلى .gitignore
   echo ".env" >> .gitignore
   ```

3. **استخدم HTTPS في الإنتاج**
   - فعّل SSL في docker/default.conf
   - استخدم Let's Encrypt للشهادات المجانية

4. **حدّث الصور بانتظام**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

5. **قيّد الوصول**
   - استخدم جدران الحماية
   - قيّد المنافذ المفتوحة
   - استخدم شبكات Docker المخصصة

---

## 🚀 النشر على الإنتاج

### على خادم Linux

```bash
# 1. ثبّت Docker و Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. استنساخ المشروع
git clone <repository-url> /opt/englishom-blog
cd /opt/englishom-blog

# 3. أنشئ ملف .env
cp .env.example .env
# عدّل .env مع قيمك

# 4. بدء الخدمات
docker-compose up -d

# 5. تحقق من الحالة
docker-compose ps
```

### مع Nginx خارجي

```nginx
# /etc/nginx/sites-available/englishom.com
upstream docker_app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name englishom.com www.englishom.com;

    location / {
        proxy_pass http://docker_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📚 موارد إضافية

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## ✅ قائمة التحقق

- [ ] تثبيت Docker و Docker Compose
- [ ] استنساخ المشروع
- [ ] إنشاء ملف .env
- [ ] ملء جميع متغيرات البيئة
- [ ] بدء الخدمات: `docker-compose up -d`
- [ ] التحقق من الحالة: `docker-compose ps`
- [ ] اختبار قاعدة البيانات
- [ ] اختبار التطبيق: http://localhost
- [ ] عرض السجلات: `docker-compose logs`
- [ ] إعداد النسخ الاحتياطية
- [ ] إعداد المراقبة

---

**جاهز للنشر مع Docker! 🚀**
