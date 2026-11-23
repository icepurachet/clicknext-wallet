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

ใช้ MySQL สำหรับทดสอบในเครื่อง โดยนำเข้าไฟล์ clicknext.sql
ผ่าน MySQL Workbench:

1. เลือก Server → Data Import
2. เลือก Import from Self-Contained File
3. เลือกไฟล์ clicknext.sql
4. กด Start Import

ควรนำเข้าบนฐานข้อมูลสำหรับทดสอบ เนื่องจากไฟล์ SQL
มีคำสั่งสร้างตารางและอาจแทนที่ตารางชื่อเดิม

## ตั้งค่า Backend

เปิด Terminal ที่โฟลเดอร์หลักของโปรเจกต์:

```bash
cd backend
npm install
```

คัดลอกไฟล์ .env.example เป็น .env
แล้วแก้ DB_HOST, DB_PORT, DB_USER, DB_PASSWORD และ DB_NAME
ให้ตรงกับ MySQL ในเครื่อง พร้อมกำหนด JWT_SECRET เป็นค่าสุ่มที่ยาว

เริ่ม Backend:

```bash
npm run start:dev
```

Backend ทำงานที่ http://localhost:3000

## เริ่ม Frontend

เปิด Terminal อีกหน้าที่โฟลเดอร์หลักของโปรเจกต์:

```bash
cd frontend
npm install
npm run dev
```

เปิดเว็บไซต์ที่ http://localhost:3001

ต้องเปิด Backend และ MySQL ไว้ระหว่างใช้งาน

## บัญชีทดสอบ

- Email: test@example.com
- Password: 123456

## ตรวจสอบ Build

รันคำสั่งต่อไปนี้แยกในโฟลเดอร์ backend และ frontend:

```bash
npm run build
```

## หมายเหตุ

- ไฟล์ .env ไม่ถูกเก็บใน Git
- ไฟล์ SQL มีข้อมูลสำหรับทดสอบ
- การตรวจสอบยอดเงินปัจจุบันยังไม่ได้ล็อกธุรกรรม
  เพื่อรองรับคำขอแก้ไขยอดพร้อมกันหลายคำขอ