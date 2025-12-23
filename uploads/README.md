# Thư mục Uploads

⚠️ **LƯU Ý:** Thư mục này chỉ là fallback. File upload mặc định được lưu vào `~/Desktop/Heroic-Uploads`

## 📍 Vị trí mặc định (đã thay đổi)

**Mặc định (Local Development & Docker):**
```
~/Desktop/Heroic-Uploads/    ← ĐÂY LÀ NƠI LƯU ẢNH MẶC ĐỊNH!
```

**Fallback (nếu Desktop không tồn tại):**
```
heroic-api/
└── uploads/          ← Fallback - chỉ dùng nếu Desktop không tồn tại
    ├── .gitkeep
    └── [các file upload sẽ xuất hiện ở đây nếu fallback]
```

## 🔍 Cách truy cập

### Xem file đã upload (mặc định):
```bash
# Mở Finder → Desktop → Heroic-Uploads
# Hoặc dùng terminal:
ls -la ~/Desktop/Heroic-Uploads
```

### Xem file trong project (fallback):
```bash
cd /Users/phanha/Desktop/Project/Heroic/heroic-api/uploads
ls -la
```

### Xem file trong Docker container:
```bash
docker exec -it heroic-api sh
ls -la /app/uploads
```

## 📝 Lưu ý

- **Đã sửa:** File upload mặc định được lưu vào `~/Desktop/Heroic-Uploads` để dễ truy cập
- Thư mục `uploads/` trong project chỉ là fallback (nếu Desktop không tồn tại)
- Có thể tùy chỉnh bằng biến môi trường `UPLOAD_PATH`
- Files sẽ không bị mất khi container bị xóa (vì mount từ host)
- Thư mục này đã được thêm vào `.gitignore` để không commit lên git

## 🔧 Cấu hình

Để thay đổi đường dẫn lưu file, set biến môi trường:
```bash
export UPLOAD_PATH=/custom/path/to/uploads
```

