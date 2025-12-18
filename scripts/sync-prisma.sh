#!/bin/bash
# bash scripts/sync-prisma.sh
# Script để sync Prisma schema với database và generate lại Prisma Client

echo "🔄 Bước 1: Merge Prisma schema files..."
npm run prisma:merge

echo ""
echo "📦 Bước 2: Đồng bộ schema với database (thêm các cột mới)..."
npm run prisma:push

echo ""
echo "⚙️  Bước 3: Generate lại Prisma Client..."
npm run prisma:generate

echo ""
echo "🔄 Bước 4: Xóa cache và dist..."
rm -rf node_modules/.cache

echo ""
echo "🔄 Bước 5: Xóa dist..."
rm -rf dist

echo ""
echo "🔄 Bước 6: Chạy server..."
npm run start:dev

echo ""
echo "✅ Hoàn thành! Prisma Client đã được generate lại với schema mới nhất."
echo "💡 Lưu ý: Nếu server đang chạy, bạn cần restart lại để load Prisma Client mới."

