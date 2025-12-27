#!/bin/bash
# Cấp quyền chmod +x scripts/restore_db.sh

# 1. Cấu hình đường dẫn
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_HOST="127.0.0.1"
DB_PORT="5432"
DB_NAME="heroic_db"
DB_USER="heroic_admin"
export PGPASSWORD="rootRoot"

# Sử dụng pg_dump bản 16 như đã cài đặt
PSQL_PATH="/opt/homebrew/opt/postgresql@16/bin/psql"
BACKUP_DIR="$PROJECT_ROOT/database/backups"

echo "--- 🛠️ KHÔI PHỤC DATABASE DỰ ÁN HEROIC ---"

# 2. Hiển thị danh sách các file backup hiện có để người dùng chọn
echo "Danh sách các bản backup trong thư mục database/backups/:"
ls -1 "$BACKUP_DIR" | grep .sql
echo "------------------------------------------"
echo "Nhập tên file bạn muốn khôi phục (ví dụ: heroic_db_backup_2025-12-27.sql):"
read FILE_NAME

FILE_PATH="$BACKUP_DIR/$FILE_NAME"

# 3. Kiểm tra file có tồn tại không
if [ ! -f "$FILE_PATH" ]; then
    echo "❌ Lỗi: Không tìm thấy file $FILE_PATH"
    exit 1
fi

echo "⚠️  CẢNH BÁO: Thao tác này sẽ ghi đè dữ liệu hiện tại!"
echo "Bạn có chắc chắn muốn khôi phục từ file: $FILE_NAME? (y/n)"
read CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ Đã hủy thao tác."
    exit 0
fi

# 4. Thực hiện Restore
echo "⏳ Đang khôi phục dữ liệu..."

# Lệnh này sẽ thực thi file SQL vào database
$PSQL_PATH -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$FILE_PATH"

if [ $? -eq 0 ]; then
  echo "------------------------------------------"
  echo "✅ KHÔI PHỤC THÀNH CÔNG!"
  echo "------------------------------------------"
else
  echo "❌ KHÔI PHỤC THẤT BẠI!"
fi

unset PGPASSWORD