#!/bin/bash

# ===================================================
# MongoDB Backup Script with Google Drive Cloud Sync
# Runs daily at 3:00 AM via cron
# ===================================================

# Configuration
BACKUP_DIR="/var/www/repo1/backups/mongodb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="englishom"
# Authentication (extracted from backend/.env)
AUTH_URI="mongodb://admin:l9u4Yr76xYtTjYm9@127.0.0.1:27017/englishom?authSource=admin"
RETENTION_DAYS=7
RCLONE_REMOTE="Englishom_Backups_2026"  # Name of rclone remote for Google Drive
CLOUD_FOLDER="englishom_backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Perform backup
echo "==========================================="
echo "Starting backup for $DB_NAME at $TIMESTAMP..."
echo "==========================================="
mongodump --uri="$AUTH_URI" --out "$BACKUP_DIR/$TIMESTAMP"

# Compress backup
cd "$BACKUP_DIR"
tar -czf "$TIMESTAMP.tar.gz" "$TIMESTAMP"
rm -rf "$TIMESTAMP"

echo "✅ Local backup completed: $BACKUP_DIR/$TIMESTAMP.tar.gz"

# Upload to Google Drive (if rclone is configured)
if command -v rclone &> /dev/null && rclone listremotes | grep -q "$RCLONE_REMOTE:"; then
    echo "☁️  Uploading to Google Drive..."
    rclone copy "$BACKUP_DIR/$TIMESTAMP.tar.gz" "$RCLONE_REMOTE:$CLOUD_FOLDER/" --progress
    
    if [ $? -eq 0 ]; then
        echo "✅ Cloud backup completed successfully!"
    else
        echo "⚠️  Cloud backup failed. Check rclone configuration."
    fi
    
    # Cleanup old cloud backups (keep last 7)
    echo "🗑️  Cleaning up old cloud backups..."
    rclone delete "$RCLONE_REMOTE:$CLOUD_FOLDER/" --min-age ${RETENTION_DAYS}d
else
    echo "⚠️  rclone not configured. Skipping cloud backup."
    echo "   To enable cloud backup, run: rclone config"
fi

# Cleanup old local backups
echo "🗑️  Cleaning up local backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "==========================================="
echo "Backup process finished at $(date)"
echo "==========================================="
