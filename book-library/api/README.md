# Book Library API

API สำหรับระบบจัดการหนังสือที่ใช้ MySQL database

## การตั้งค่า

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `api/` และกำหนดค่าต่อไปนี้:

```env
PORT=3001
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=your-mysql-host.digitalocean.com
DB_PORT=25060
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=book_library
DB_SSL=true
```

### 3. การตั้งค่า Digital Ocean Managed Database

1. เข้าไปที่ Digital Ocean Dashboard
2. ไปที่ Databases > Create Database Cluster
3. เลือก MySQL
4. เลือก Region ที่เหมาะสม
5. ตั้งค่า Database Name: `book_library`
6. ตั้งค่า Username และ Password
7. หลังจากสร้างเสร็จ ให้ดู Connection Details

### 4. ข้อมูลการเชื่อมต่อ

จาก Digital Ocean Database Dashboard คุณจะได้ข้อมูลเหล่านี้:

- **Host**: `your-cluster-name.db.ondigitalocean.com`
- **Port**: `25060` (default สำหรับ Digital Ocean)
- **Database**: `book_library`
- **Username**: `doadmin` (default)
- **Password**: ที่คุณตั้งไว้
- **SSL**: ต้องเปิดใช้งาน

### 5. เริ่มต้นใช้งาน

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check

- `GET /api/health` - ตรวจสอบสถานะ API และการเชื่อมต่อ database

### หนังสือ

- `GET /api/books` - ดึงรายการหนังสือทั้งหมด
- `GET /api/books/with-details` - ดึงหนังสือพร้อมรายการโปรดและคะแนน

### หมวดหมู่

- `GET /api/categories` - ดึงรายการหมวดหมู่

### รายการโปรด

- `GET /api/favourites` - ดึงรายการโปรด
- `POST /api/favourites/:bookId` - เพิ่ม/ลบหนังสือจากรายการโปรด

### คะแนน

- `GET /api/ratings` - ดึงคะแนนหนังสือ
- `POST /api/ratings/:bookId` - ให้คะแนนหนังสือ

## โครงสร้างฐานข้อมูล

### ตาราง categories

```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);
```

### ตาราง books

```sql
CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ISBN VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### ตาราง book_favourites

```sql
CREATE TABLE book_favourites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
```

### ตาราง book_ratings

```sql
CREATE TABLE book_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
```

## การแก้ไขปัญหา

### 1. Database Connection Error

ตรวจสอบ:

- ข้อมูลการเชื่อมต่อใน `.env` ถูกต้อง
- Database cluster ทำงานอยู่
- Firewall settings อนุญาตการเชื่อมต่อ
- SSL certificate ถูกต้อง

### 2. SSL Connection Issues

สำหรับ Digital Ocean Managed Database:

```env
DB_SSL=true
```

### 3. Port Issues

Digital Ocean MySQL ใช้ port 25060 โดย default

### 4. Database Not Found

ตรวจสอบว่า database `book_library` ถูกสร้างแล้ว

## การพัฒนาเพิ่มเติม

### เพิ่ม Indexes

```sql
-- เพิ่ม index สำหรับการค้นหา
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_category ON books(category_id);
CREATE INDEX idx_favourites_book ON book_favourites(book_id);
CREATE INDEX idx_ratings_book ON book_ratings(book_id);
```

### เพิ่ม Constraints

```sql
-- เพิ่ม unique constraint สำหรับ ISBN
ALTER TABLE books ADD CONSTRAINT unique_isbn UNIQUE (ISBN);

-- เพิ่ม unique constraint สำหรับ rating ต่อหนังสือ
ALTER TABLE book_ratings ADD CONSTRAINT unique_book_rating UNIQUE (book_id);
```

## Security Considerations

1. **Environment Variables**: อย่า commit ไฟล์ `.env` ลง git
2. **SSL**: ใช้ SSL connection เสมอสำหรับ production
3. **Connection Pooling**: ใช้ connection pool เพื่อประสิทธิภาพ
4. **Input Validation**: ตรวจสอบ input จาก user เสมอ
5. **Error Handling**: ไม่เปิดเผยข้อมูล database ใน error messages
