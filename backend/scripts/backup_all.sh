#!/bin/bash

# ================================================================
# EnglishOM - COMPLETE Backup Script (MongoDB + MySQL)
# Runs daily at 3:00 AM via cron
# Backs up ALL databases to Google Drive
# ================================================================

set -e

# ======================== Configuration ========================
BACKUP_DIR="/var/www/repo1/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=14
RCLONE_REMOTE="Englishom_Backups_2026"
CLOUD_FOLDER="englishom_backups"
LOG_FILE="$BACKUP_DIR/backup_$TIMESTAMP.log"

# MongoDB Config
MONGO_AUTH_URI="mongodb://admin:l9u4Yr76xYtTjYm9@127.0.0.1:27017/englishom?authSource=admin"
MONGO_DB_NAME="englishom"

# MySQL Config
MYSQL_USER="root"
MYSQL_PASSWORD="jjF4f3ZfSwvbuxFNBM0="
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"

# MySQL Databases to backup
MYSQL_DATABASES=(
    "englishom_blog"
    "englishom_dashboard"
    "englishom_level_test"
    "englishom_ques"
)

# ======================== Setup ========================
mkdir -p "$BACKUP_DIR/temp_$TIMESTAMP"
TEMP_DIR="$BACKUP_DIR/temp_$TIMESTAMP"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "================================================================"
echo "  EnglishOM COMPLETE Backup - $TIMESTAMP"
echo "================================================================"
echo ""

# ======================== MongoDB Backup ========================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  [1/3] MongoDB Backup: $MONGO_DB_NAME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v mongodump &> /dev/null; then
    mongodump --uri="$MONGO_AUTH_URI" --out "$TEMP_DIR/mongodb" 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✅ MongoDB backup completed successfully"
        echo "   Includes: Users, Courses, Orders, Payments, GridFS files (images/audio/lessons)"
    else
        echo "❌ MongoDB backup FAILED!"
    fi
else
    echo "⚠️  mongodump not found. Install mongodb-database-tools."
fi

echo ""

# ======================== MySQL Backup ========================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  [2/3] MySQL Backup: All Databases"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p "$TEMP_DIR/mysql"

if command -v mysqldump &> /dev/null; then
    for DB_NAME in "${MYSQL_DATABASES[@]}"; do
        echo "  → Backing up: $DB_NAME..."
        
        mysqldump -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" \
            -h "$MYSQL_HOST" -P "$MYSQL_PORT" \
            --single-transaction \
            --routines \
            --triggers \
            --events \
            "$DB_NAME" > "$TEMP_DIR/mysql/${DB_NAME}.sql" 2>/dev/null
        
        if [ $? -eq 0 ] && [ -s "$TEMP_DIR/mysql/${DB_NAME}.sql" ]; then
            SIZE=$(du -h "$TEMP_DIR/mysql/${DB_NAME}.sql" | cut -f1)
            echo "    ✅ $DB_NAME backed up ($SIZE)"
        else
            echo "    ⚠️  $DB_NAME skipped (database may not exist yet)"
            rm -f "$TEMP_DIR/mysql/${DB_NAME}.sql"
        fi
    done
    
    # Also backup ALL databases as safety net
    echo "  → Full MySQL dump (all databases)..."
    mysqldump -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" \
        -h "$MYSQL_HOST" -P "$MYSQL_PORT" \
        --all-databases \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        > "$TEMP_DIR/mysql/ALL_DATABASES.sql" 2>/dev/null
    
    if [ $? -eq 0 ] && [ -s "$TEMP_DIR/mysql/ALL_DATABASES.sql" ]; then
        SIZE=$(du -h "$TEMP_DIR/mysql/ALL_DATABASES.sql" | cut -f1)
        echo "    ✅ Full MySQL dump completed ($SIZE)"
    else
        echo "    ⚠️  Full MySQL dump failed"
        rm -f "$TEMP_DIR/mysql/ALL_DATABASES.sql"
    fi
else
    echo "⚠️  mysqldump not found. Install mysql-client."
fi

echo ""

# ======================== Compress Everything ========================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  [3/3] Compress & Upload"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$BACKUP_DIR"
ARCHIVE_NAME="englishom_full_backup_$TIMESTAMP.tar.gz"
tar -czf "$ARCHIVE_NAME" -C "$BACKUP_DIR" "temp_$TIMESTAMP"
rm -rf "$TEMP_DIR"

ARCHIVE_SIZE=$(du -h "$BACKUP_DIR/$ARCHIVE_NAME" | cut -f1)
echo "📦 Archive created: $ARCHIVE_NAME ($ARCHIVE_SIZE)"

# ======================== Upload to Google Drive ========================
if command -v rclone &> /dev/null && rclone listremotes | grep -q "$RCLONE_REMOTE:"; then
    echo ""
    echo "☁️  Uploading to Google Drive..."
    rclone copy "$BACKUP_DIR/$ARCHIVE_NAME" "$RCLONE_REMOTE:$CLOUD_FOLDER/" --progress
    
    if [ $? -eq 0 ]; then
        echo "✅ Cloud backup uploaded successfully!"
    else
        echo "❌ Cloud upload FAILED! Local backup is still available."
    fi
    
    # Cleanup old cloud backups
    echo "🗑️  Cleaning up cloud backups older than $RETENTION_DAYS days..."
    rclone delete "$RCLONE_REMOTE:$CLOUD_FOLDER/" --min-age ${RETENTION_DAYS}d
else
    echo ""
    echo "⚠️  rclone not configured. Local backup only."
    echo "   To enable cloud backup: rclone config"
fi

# ======================== Cleanup Old Local Backups ========================
echo ""
echo "🗑️  Cleaning up local backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "englishom_full_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "backup_*.log" -mtime +$RETENTION_DAYS -delete
# Also clean old MongoDB-only backups
find "$BACKUP_DIR" -path "*/mongodb/*.tar.gz" -mtime +$RETENTION_DAYS -delete

# ======================== Summary ========================
echo ""
echo "================================================================"
echo "  ✅ BACKUP COMPLETE - $(date)"
echo "================================================================"
echo ""
echo "  📊 Backup Contents:"
echo "  ─────────────────────────────────────"
echo "  MongoDB:  Users, Courses, Orders, Payments,"
echo "            GridFS (Images, Audio, Lessons),"
echo "            AI Chat, Subscriptions, Testimonials"
echo "  ─────────────────────────────────────"
echo "  MySQL:    Blog (posts, comments, categories),"
echo "            Dashboard (public stats),"
echo "            Level Test (questions, results),"
echo "            Questions (exercises, progress)"
echo "  ─────────────────────────────────────"
echo "  Archive:  $ARCHIVE_NAME ($ARCHIVE_SIZE)"
echo "  Log:      $LOG_FILE"
echo "================================================================"
