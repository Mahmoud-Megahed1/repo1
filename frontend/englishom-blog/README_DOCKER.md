# 🐳 Docker Deployment Guide - EnglishOM Blog System

**دليل النشر باستخدام Docker و Docker Compose**

---

## 📦 ملفات Docker المتضمنة

```
englishom-delivery/
├── docker-compose.yml          ← للتطوير والاختبار
├── docker-compose.prod.yml     ← للإنتاج
├── Dockerfile                  ← بناء صورة التطبيق
├── .dockerignore               ← الملفات المستثناة من البناء
└── DOCKER_GUIDE.md             ← دليل شامل لـ Docker
```

---

## 🚀 البدء السريع مع Docker

### المتطلبات
- Docker 20.10+
- Docker Compose 2.0+

### الخطوات

#### 1. استخراج الملفات
```bash
tar -xzf englishom-blog-source-code.tar.gz
cd englishom-blog
```

#### 2. نسخ ملفات Docker
```bash
# انسخ ملفات docker-compose من مجلد التسليم
cp ../docker-compose.yml .
cp ../docker-compose.prod.yml .
cp ../Dockerfile .
cp ../.dockerignore .
```

#### 3. إنشاء ملف .env
```bash
# من ENV_CONFIGURATION_GUIDE.md
cat > .env << EOF
# Database
DB_ROOT_PASSWORD=your_root_password
DB_NAME=englishom_blog
DB_USER=englishom_user
DB_PASSWORD=your_db_password
DB_PORT=3306

# Application
JWT_SECRET=your_jwt_secret
VITE_APP_ID=your_app_id
# ... إضافة باقي المتغيرات
EOF
```

#### 4. بدء الخدمات
```bash
# للتطوير
docker-compose up -d

# للإنتاج
docker-compose -f docker-compose.prod.yml up -d
```

#### 5. التحقق من الحالة
```bash
docker-compose ps
```

#### 6. الوصول إلى التطبيق
```
http://localhost
```

---

## 📋 الخدمات المتضمنة

| الخدمة | الصورة | المنفذ | الوصف |
|--------|--------|--------|--------|
| **db** | mysql:8.0 | 3306 | قاعدة البيانات |
| **app** | Custom | 3000 | تطبيق Node.js |
| **nginx** | nginx:alpine | 80/443 | خادم الويب |
| **backup** | mysql:8.0 | - | النسخ الاحتياطية (الإنتاج فقط) |

---

## 🔧 الأوامر الشائعة

### بدء وإيقاف
```bash
# بدء الخدمات
docker-compose up -d

# إيقاف الخدمات
docker-compose stop

# إعادة تشغيل
docker-compose restart

# حذف الحاويات
docker-compose down
```

### السجلات والمراقبة
```bash
# عرض السجلات
docker-compose logs -f

# سجلات خدمة معينة
docker-compose logs -f app

# عرض الموارد المستخدمة
docker stats
```

### الصيانة
```bash
# إعادة بناء الصور
docker-compose build

# تنظيف الملفات غير المستخدمة
docker system prune -a

# نسخة احتياطية من قاعدة البيانات
docker-compose exec db mysqldump -u root -p englishom_blog > backup.sql
```

---

## 🔐 الأمان

### للإنتاج
1. **استخدم docker-compose.prod.yml**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **فعّل SSL/TLS**
   - استخدم Let's Encrypt
   - حدّث docker/default.conf

3. **استخدم كلمات مرور قوية**
   ```bash
   openssl rand -base64 32
   ```

4. **قيّد الوصول**
   - استخدم جدران الحماية
   - قيّد المنافذ المفتوحة

---

## 📊 الأداء

### تحسينات الإنتاج
- ضغط Gzip مفعّل
- تخزين مؤقت لـ Nginx
- إعدادات MySQL محسّنة
- تسجيل الأخطاء فقط

### المراقبة
```bash
# عرض استخدام الموارد
docker stats

# عرض مساحة التخزين
docker system df

# عرض السجلات
docker-compose logs --tail 100 app
```

---

## 🆘 استكشاف الأخطاء

### الخدمات لا تبدأ
```bash
# تحقق من السجلات
docker-compose logs

# تحقق من المنافذ
lsof -i :80
lsof -i :3000
lsof -i :3306
```

### فشل الاتصال بقاعدة البيانات
```bash
# اختبر الاتصال
docker-compose exec app npm run db:check

# تحقق من متغيرات البيئة
docker-compose exec app env | grep DATABASE
```

### مساحة التخزين ممتلئة
```bash
# نظّف الملفات غير المستخدمة
docker system prune -a

# احذف الأحجام القديمة
docker volume prune
```

---

## 📚 موارد إضافية

- **DOCKER_GUIDE.md** - دليل شامل
- **ENV_CONFIGURATION_GUIDE.md** - متغيرات البيئة
- **MYSQL_MIGRATIONS_FINAL.sql** - قاعدة البيانات
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)

---

## ✅ قائمة التحقق

- [ ] تثبيت Docker و Docker Compose
- [ ] استخراج الملفات
- [ ] نسخ ملفات Docker
- [ ] إنشاء ملف .env
- [ ] بدء الخدمات: `docker-compose up -d`
- [ ] التحقق من الحالة: `docker-compose ps`
- [ ] اختبار التطبيق: http://localhost
- [ ] عرض السجلات: `docker-compose logs`
- [ ] إعداد النسخ الاحتياطية
- [ ] إعداد SSL (للإنتاج)

---

**جاهز للنشر مع Docker! 🚀**
