#!/bin/bash
# Script để start PostgreSQL container với docker-compose

# Kiểm tra Docker daemon có chạy không
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon không chạy. Vui lòng start Docker Desktop trước."
    exit 1
fi

# Kiểm tra file .env.development có tồn tại không
ENV_FILE="${ENV_FILE:-.env.development}"
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  File $ENV_FILE không tồn tại. Đang tìm file .env.development..."
    if [ ! -f ".env.development" ]; then
        echo "❌ Không tìm thấy file .env.development. Vui lòng tạo file .env.development với các biến môi trường cần thiết."
        exit 1
    fi
    ENV_FILE=".env.development"
fi

echo "🐳 Đang start PostgreSQL container..."
export ENV_FILE="$ENV_FILE"
docker-compose up -d postgres

# Đợi PostgreSQL sẵn sàng
echo "⏳ Đang đợi PostgreSQL sẵn sàng..."
sleep 5

# Kiểm tra container có chạy không
if docker ps | grep -q heroic-postgres; then
    echo "✅ PostgreSQL container đã được start thành công!"
else
    echo "❌ PostgreSQL container không thể start. Kiểm tra logs:"
    docker-compose logs postgres
    exit 1
fi
