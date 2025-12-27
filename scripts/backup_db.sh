#!/bin/bash

# 1. Tự động lấy đường dẫn thư mục dự án Heroic
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# 2. Cấu hình Database
DB_HOST="127.0.0.1"
DB_PORT="5432"
DB_NAME="heroic_db"
DB_USER="heroic_admin"
export PGPASSWORD="rootRoot" 

# Đường dẫn pg_dump trên máy Mac của bạn
PG_DUMP_PATH="/opt/homebrew/opt/postgresql@16/bin/pg_dump"

# Thư mục lưu trữ: /Users/phanha/Desktop/Project/Heroic/database/backups
# BACKUP_DIR="$PROJECT_ROOT/database/backups"
BACKUP_DIR="/Users/phanha/Desktop/Project/Heroic/backup_db"
mkdir -p "$BACKUP_DIR"

# 3. Tạo tên file kèm ngày giờ
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
FILE_NAME="$BACKUP_DIR/${DB_NAME}_backup_$TIMESTAMP.sql"

echo "⏳ Đang tiến hành backup database dự án Heroic..."

# 4. Thực hiện lệnh backup
$PG_DUMP_PATH -h $DB_HOST -p $DB_PORT -U $DB_USER -F p -b -v -f "$FILE_NAME" $DB_NAME

# 5. Kiểm tra kết quả
if [ $? -eq 0 ]; then
  echo "------------------------------------------"
  echo "✅ BACKUP THÀNH CÔNG!"
  echo "📂 Vị trí: database/backups/$(basename "$FILE_NAME")"
  echo "------------------------------------------"
else
  echo "❌ BACKUP THẤT BẠI!"
fi

unset PGPASSWORD