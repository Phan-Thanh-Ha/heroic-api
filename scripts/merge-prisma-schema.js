#!/usr/bin/env node

/**
 * Script để merge các file Prisma schema từ các folder con vào schema.prisma chính
 * 
 * Cấu trúc:
 * - prisma/schema.prisma: File chính (chứa generator, datasource)
 * - prisma/locations/*.prisma: Các file model riêng lẻ
 * 
 * Cách dùng:
 * - npm run prisma:merge (tự động merge trước khi generate)
 * - Hoặc chạy: node scripts/merge-prisma-schema.js
 */

const fs = require('fs');
const path = require('path');

const SCHEMA_DIR = path.join(__dirname, '../prisma');
const MAIN_SCHEMA_FILE = path.join(SCHEMA_DIR, 'schema.prisma');
const SCHEMA_PARTS_DIR = SCHEMA_DIR;


async function mergeSchemas() {
  console.log('🔄 Đang merge Prisma schema files...\n');

  // Đọc file schema.prisma chính (chứa generator và datasource)
  let mainSchema = fs.readFileSync(MAIN_SCHEMA_FILE, 'utf-8');
  
  // Tách phần header (generator + datasource) - lấy đến khi gặp model đầu tiên hoặc hết file
  // Tìm vị trí model đầu tiên
  const modelIndex = mainSchema.search(/^model\s+\w/m);
  let header = mainSchema;
  
  if (modelIndex !== -1) {
    // Nếu có model, lấy phần trước model đầu tiên
    header = mainSchema.substring(0, modelIndex).trim();
  }
  
  // Đảm bảo header có generator và datasource
  if (!header.includes('generator') || !header.includes('datasource')) {
    // Nếu không có, thêm lại
    header = `generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
}`;
  }
  
  // Hàm đệ quy để tìm tất cả file .prisma
  function findPrismaFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findPrismaFiles(filePath, fileList);
      } else if (file.endsWith('.prisma') && file !== 'schema.prisma') {
        const relativePath = path.relative(SCHEMA_DIR, filePath);
        fileList.push(relativePath);
      }
    });
    return fileList;
  }

  // Tìm tất cả các file .prisma (trừ schema.prisma chính)
  const schemaFiles = findPrismaFiles(SCHEMA_DIR);

  if (schemaFiles.length === 0) {
    console.log('⚠️  Không tìm thấy file schema nào để merge.');
    return;
  }

  console.log(`📁 Tìm thấy ${schemaFiles.length} file schema:`);
  schemaFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');

  // Đọc và merge tất cả các file
  let mergedContent = header + '\n\n';
  
  // Sắp xếp file để đảm bảo thứ tự (locations trước, sau đó các module khác)
  const sortedFiles = schemaFiles.sort((a, b) => {
    // Ưu tiên locations trước
    if (a.includes('locations') && !b.includes('locations')) return -1;
    if (!a.includes('locations') && b.includes('locations')) return 1;
    return a.localeCompare(b);
  });

  for (const file of sortedFiles) {
    const content = fs.readFileSync(path.join(SCHEMA_DIR, file), 'utf-8');
    // Loại bỏ generator và datasource nếu có trong file con
    const cleanContent = content
      .replace(/generator\s+\w+\s*\{[\s\S]*?\}\s*/g, '')
      .replace(/datasource\s+\w+\s*\{[\s\S]*?\}\s*/g, '')
      .trim();
    
    if (cleanContent) {
      mergedContent += cleanContent + '\n\n';
    }
  }

  // Ghi lại file schema.prisma
  fs.writeFileSync(MAIN_SCHEMA_FILE, mergedContent.trim() + '\n', 'utf-8');
  
  console.log('✅ Merge schema thành công!');
  console.log(`📝 File: ${MAIN_SCHEMA_FILE}\n`);
}

// Chạy merge
mergeSchemas().catch(error => {
  console.error('❌ Lỗi khi merge schema:', error);
  process.exit(1);
});

