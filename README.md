# Clicknext Wallet

ระบบฝากถอนเงิน พัฒนาด้วย NestJS, Nuxt และ MySQL

## ความสามารถ

- เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
- ยืนยันตัวตนด้วย JWT
- แสดงยอดเงินคงเหลือ
- ฝาก ถอน และดูประวัติรายการ
- แก้ไขและลบรายการของผู้ใช้ที่เข้าสู่ระบบ
- ตรวจสอบยอดเงินก่อนถอน แก้ไข และลบรายการ
- รองรับหน้าจอคอมพิวเตอร์และมือถือ

## เครื่องมือที่ใช้

- Backend: NestJS และ TypeScript
- Frontend: Nuxt, Vue และ Pinia
- Database: MySQL 8
- เชื่อมต่อฐานข้อมูลด้วย mysql2

## เตรียมฐานข้อมูล

เปิด MySQL และนำเข้าไฟล์ clicknext.sql ผ่าน MySQL Workbench:

1. เลือก Server → Data Import
2. เลือก Import from Self-Contained File
3. เลือกไฟล์ clicknext.sql ที่โฟลเดอร์หลักของโปรเจกต์
4. กด Start Import

ไฟล์ SQL มีฐานข้อมูล clicknext พร้อมตารางและข้อมูลทดสอบ

ควรนำเข้าบนฐานข้อมูลสำหรับทดสอบ เนื่องจากไฟล์ SQL
มีคำสั่งสร้างตารางและอาจแทนที่ตารางชื่อเดิม

## ตั้งค่า Backend

ติดตั้ง Node.js และ npm ก่อนเริ่มใช้งาน
สำหรับ Nuxt ในโปรเจกต์นี้ ใช้ Node.js 22.21 ขึ้นไปในสาย 22
หรือ 24.11 ขึ้นไปในสาย 24

เปิด Terminal ที่โฟลเดอร์หลักของโปรเจกต์:

```bash
cd backend
npm install
```

คัดลอกไฟล์ backend/.env.example เป็น backend/.env
โดยเก็บไฟล์ .env.example เดิมไว้

หากใช้ PowerShell และอยู่ในโฟลเดอร์ backend ให้รัน:

```powershell
Copy-Item .env.example .env
```

แก้ค่าใน backend/.env:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=clicknext
JWT_SECRET=replace_with_a_long_random_secret
```

ตั้งค่า DB_HOST, DB_PORT, DB_USER, DB_PASSWORD และ DB_NAME
ให้ตรงกับ MySQL ของเครื่องที่ใช้งาน

DB_PASSWORD คือรหัสผ่าน MySQL ของเครื่อง
ไม่ใช่รหัสผ่านบัญชีทดสอบสำหรับเข้าเว็บไซต์

### สร้าง JWT_SECRET

รันคำสั่ง:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

คัดลอกข้อความสุ่มที่ได้ไปแทนค่า replace_with_a_long_random_secret
หลัง JWT_SECRET= ใน backend/.env แล้วบันทึกไฟล์

JWT_SECRET เป็นกุญแจลับสำหรับเซ็นและตรวจสอบ token
ส่วน JWT token ระบบจะสร้างให้อัตโนมัติเมื่อ Login สำเร็จ

หากเปลี่ยน JWT_SECRET ให้รีสตาร์ต Backend และ Login ใหม่

### เริ่ม Backend

รันในโฟลเดอร์ backend:

```bash
npm run start:dev
```

Backend ทำงานที่ http://localhost:3000

เมื่อเชื่อมต่อฐานข้อมูลสำเร็จจะแสดง DATABASE CONNECTED
ให้ปล่อย Terminal นี้ทำงานไว้

## เริ่ม Frontend

เปิด Terminal อีกหน้าที่โฟลเดอร์หลักของโปรเจกต์:

```bash
cd frontend
npm install
npm run dev
```

เปิดเว็บไซต์ที่ http://localhost:3001

ต้องเปิด Frontend, Backend และ MySQL ไว้ระหว่างใช้งาน

## บัญชีทดสอบ

หลังนำเข้าไฟล์ clicknext.sql สามารถเข้าสู่ระบบด้วย:

- Email: test@example.com
- Password: 123456

## ตรวจสอบ Build

รันคำสั่งต่อไปนี้แยกในโฟลเดอร์ backend และ frontend:

```bash
npm run build
```

## หมายเหตุ

- ไฟล์ .env ไม่ถูกเก็บใน Git
- ไฟล์ .env.example เป็นตัวอย่างสำหรับตั้งค่าในแต่ละเครื่อง
- ไฟล์ SQL มีข้อมูลสำหรับทดสอบ
- การตรวจสอบยอดเงินยังไม่ได้ล็อกธุรกรรมในฐานข้อมูล
  จึงยังไม่รับประกันยอดเมื่อมีคำขอเปลี่ยนแปลงพร้อมกันหลายคำขอ