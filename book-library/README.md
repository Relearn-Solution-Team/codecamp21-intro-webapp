# Book Library Web Application

ระบบจัดการหนังสือสำหรับการเรียนรู้การทำงานของ Web Application

## วัตถุประสงค์

โปรเจคนี้สร้างขึ้นเพื่อการเรียนรู้การทำงานของ Web Application โดยแสดงให้เห็นการทำงานร่วมกันของ:

- **HTML** - โครงสร้างหน้าเว็บ
- **CSS** - การจัดรูปแบบและดีไซน์
- **JavaScript** - การทำงานแบบ Interactive
- **API** - การเชื่อมต่อระหว่าง Frontend และ Backend
- **Database** - การจัดเก็บข้อมูลแบบถาวร

## โครงสร้างโปรเจค

```
book-library/
├── web/                    # Frontend
│   ├── index.html         # หน้าแรก
│   ├── list/
│   │   └── index.html     # หน้ารายการหนังสือ
│   ├── js/
│   │   ├── book-data.js   # จัดการข้อมูลและการเชื่อมต่อ API
│   │   └── book-library.js # ฟังก์ชันหลักของแอป
│   └── styles/
│       └── library.css    # ไฟล์ CSS
└── api/                   # Backend
    ├── src/
    │   └── index.js       # Express.js server
    ├── config/
    │   └── database.js    # การตั้งค่า MySQL database
    ├── package.json       # Dependencies
    └── README.md          # คู่มือการตั้งค่า API
```

## ฟีเจอร์ที่มี

1. **แสดงรายการหนังสือ** - ดูข้อมูลหนังสือทั้งหมด
2. **แสดงแบบการ์ด** - ดูหนังสือในรูปแบบการ์ดที่สวยงาม
3. **แสดงแบบตาราง** - ดูข้อมูลในรูปแบบตารางที่ครบถ้วน
4. **เพิ่มรายการโปรด** - เพิ่มหนังสือที่ชอบลงในรายการโปรด
5. **ให้คะแนนหนังสือ** - ให้คะแนนหนังสือที่อ่านแล้ว

## วิธีติดตั้งและใช้งาน

### 1. ตั้งค่า Database

1. สร้าง MySQL database cluster บน Digital Ocean
2. ดูรายละเอียดการตั้งค่าใน `api/README.md`

### 2. ติดตั้ง Backend

```bash
cd book-library/api
npm install
```

สร้างไฟล์ `.env` และกำหนดค่าการเชื่อมต่อ database:

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

เริ่มต้น server:

```bash
npm start
```

Backend จะทำงานที่ `http://localhost:3001`

### 3. เปิด Frontend

เปิดไฟล์ `book-library/web/index.html` ในเบราว์เซอร์ หรือใช้ Live Server

### 4. ทดสอบฟีเจอร์

- ดูรายการหนังสือที่หน้าแรก
- คลิก "ดูรายการหนังสือ" เพื่อไปยังหน้ารายการ
- สลับระหว่างการแสดงแบบการ์ดและตาราง
- คลิกปุ่ม "เพิ่มโปรด" เพื่อเพิ่มหนังสือลงในรายการโปรด
- คลิกปุ่ม "ให้คะแนน" เพื่อให้คะแนนหนังสือ

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

### ตาราง book

- `id` - รหัสหนังสือ
- `ISBN` - เลข ISBN
- `title` - ชื่อหนังสือ
- `category_id` - รหัสหมวดหมู่

### ตาราง category

- `id` - รหัสหมวดหมู่
- `name` - ชื่อหมวดหมู่

### ตาราง book_favourite

- `id` - รหัสรายการโปรด
- `book_id` - รหัสหนังสือ
- `created_at` - วันที่สร้าง

### ตาราง book_rating

- `id` - รหัสคะแนน
- `book_id` - รหัสหนังสือ
- `rating` - คะแนน (1-5)

## เทคโนโลยีที่ใช้

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MySQL (Digital Ocean Managed Database)
- **API**: RESTful API

## การพัฒนาเพิ่มเติม

ฟีเจอร์ที่สามารถเพิ่มได้ในอนาคต:

- การค้นหาหนังสือ
- การกรองตามหมวดหมู่
- การเรียงลำดับข้อมูล
- การเพิ่มหนังสือใหม่
- การแก้ไขข้อมูลหนังสือ
- การลบหนังสือ
- ระบบผู้ใช้และการเข้าสู่ระบบ
- การจัดการข้อมูลแบบ Real-time
- การ Backup และ Restore ข้อมูล

## หมายเหตุ

โปรเจคนี้ใช้ MySQL database บน Digital Ocean เพื่อเก็บข้อมูลแบบถาวร ข้อมูลจะไม่หายไปเมื่อ restart server
