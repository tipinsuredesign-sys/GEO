# สรุปผลวิเคราะห์: ปัญหา Priority "HIGH" จาก Technical Onsite Audit เทียบกับ ElevateSEO Project Plan

**เว็บไซต์:** www.tipinsure.com
**วันที่ Audit:** 23 กันยายน 2026
**เอกสารอ้างอิง 2 ไฟล์:**
1. `2026-09-23 - www.tipinsure.com - Technical Onsite Audit.html` (รายงานผลตรวจ)
2. `Tipinsurance - ElevateSEO Project Plan .xlsx` (แผนงานแคมเปญของ Primal)

> เอกสารนี้ทำขึ้นเพื่อใช้เป็นคู่มือที่ปรึกษา สำหรับทีมในการตัดสินใจว่าจะแก้อะไรก่อน-หลัง และเชื่อมโยงว่าปัญหาแต่ละข้อไปตกอยู่ตรงไหนของแผนงาน

---

## 1. ภาพรวมสุขภาพเว็บไซต์ (Executive Summary)

รายงาน Audit พบปัญหาทั้งหมด **30 ข้อ** แบ่งเป็น:

| ระดับความสำคัญ | จำนวน |
|---|---|
| 🔴 HIGH | 13 |
| 🟡 MEDIUM | 15 |
| 🟢 LOW | 2 |

**คะแนนรายหมวด (Health Score):**

| หมวด | คะแนน | ระดับ |
|---|---|---|
| CH 01 – Crawlability & Indexing | 2/10 | 🔴 HIGH |
| CH 02 – Content Presentation in Search | 3/10 | 🔴 HIGH |
| CH 03 – AI Accessibility & GEO | 7/10 | 🟡 MEDIUM |
| CH 04 – On-Page Ranking Signals | 4/10 | 🟡 MEDIUM |
| CH 05 – Penalty & Risk Avoidance | 6/10 | 🟡 MEDIUM |

**ข้อสรุปเชิงกลยุทธ์:** ปัญหาที่หนักที่สุดกระจุกอยู่ที่ *ความสามารถของ Google ในการค้นเจอ เข้าถึง และจัดเก็บหน้าเว็บ (Crawl/Index)* ซึ่งเป็นฐานราก ถ้าฐานนี้พัง งานคอนเทนต์และ Backlink ที่ทำต่อไปจะไม่ให้ผลเต็มที่

---

## 2. ธีมร่วมที่ต้องเข้าใจก่อน: เว็บไซต์มี 2 โครงสร้าง

ปัญหา HIGH หลายข้อโยงกับข้อเท็จจริงเดียวกัน คือเว็บมีของเก่ากับของใหม่ปนกัน:

- **`ft.tipinsure.com`** = หน้าบ้านเวอร์ชันเก่า (legacy) ที่กำลังจะถูกปลดระวาง
- **`www.tipinsure.com`** = โครงสร้างใหม่ที่จะใช้แทน

ตัวเลขปัญหาก้อนใหญ่ (เช่น ลิงก์เสีย 22,061 จุด, URL ถูกบล็อก 10,380 รายการ) เกือบทั้งหมดอยู่บน `ft` **หลักการคือ: อย่าไปตามแก้ทีละจุดบน ft แต่ให้แก้ให้ถูกต้องบนโครงสร้าง `www` ตอนย้ายระบบ (migration)** ไม่งั้นจะเสียแรงแก้ของที่กำลังจะทิ้งอยู่ดี

---

## 3. รายละเอียดปัญหา HIGH ทั้ง 13 ข้อ

แต่ละข้อระบุ: ปัญหาคืออะไร / หลักฐาน / สิ่งที่ต้องทำ / ผู้รับผิดชอบหลัก

### 🔴 กลุ่ม A — Crawl & Index (ฐานรากสำคัญที่สุด)

**#06 XML Sitemap ยังไม่ถูกยืนยันว่า submit เข้า Google Search Console**
- ไฟล์ sitemap.xml เข้าถึงได้ปกติ แต่มีเพียง 13 URL และยืนยันไม่ได้ว่าถูกส่งเข้า GSC แล้วหรือยัง
- **ต้องทำ:** ตั้งค่า GSC ให้เรียบร้อย + submit sitemap
- **ผู้รับผิดชอบ:** Client/Primal (Technical/Dev)

**#07 หน้าเว็บสำคัญไม่ได้อยู่ใน sitemap.xml**
- sitemap มี 13 URL แต่เว็บจริงมี 34 หน้าบน www และ crawl เจอ 11,161 URL ที่ไม่มีใน sitemap เลย
- หน้าที่หายไป: หน้าโปรโมชัน 12 หน้า, หน้าใบเสนอราคา travel/health, หน้า landing คีย์เวิร์ดภาษาไทย
- แถมมี 2 URL ใน sitemap ที่ให้ผล 404 (`/tourist/product_detail/domestic`, `/inbound`)
- **ต้องทำ:** ทำ sitemap แบบ dynamic ให้ครอบคลุมทุกหน้าที่ต้องการ index + ลบ URL ที่ 404 ออก
- **ผู้รับผิดชอบ:** Dev

**#08 หน้าที่แบ่งหน้า (Pagination) ถูก crawl ไม่ได้**
- คลังข่าว/บทความอยู่บน ft, `/NewsAndActivities/` ทำ 302 ไป ft และ robots ของ ft บล็อก index_v2/index_v3 → บทความรายชิ้นไม่มีทางถูกค้นเจอ (8,134 URL โดนบล็อก)
- **ต้องทำ:** เปลี่ยนจาก "Load More"/infinite scroll เป็น Pagination จริง + ทำ self-referencing canonical + ย้ายมาโครงสร้าง www
- **ผู้รับผิดชอบ:** Dev

**#09 robots.txt บล็อกหน้าที่เราอยากให้ติด index**
- บน www: `Disallow: /pa/` บล็อกหมวดประกันอุบัติเหตุส่วนบุคคลทั้งหมด (ควรบล็อกแค่หน้า checkout)
- บน ft: กฎทั้งหมดเจาะจงเฉพาะ Googlebot (สะกดผิดด้วย "Googlebot-Moblie") และไม่มี User-agent: * → Google โดนจำกัดคนเดียว
- **ต้องทำ:** เอา `Disallow: /pa/` ออก เหลือบล็อกแค่ `/pa/step_2..4`; แก้ ft ให้ใช้ `User-agent: *`
- **ผู้รับผิดชอบ:** Dev

### 🔴 กลุ่ม B — URL / Redirect / Duplicate

**#05 หน้าแรกซ้ำซ้อนหลายเวอร์ชัน (Homepage Duplication)**
- `https://www.tipinsure.com/` และ `https://tipinsure.com/` ให้ผล 200 เหมือนกันเป๊ะ (byte-identical) ไม่มี redirect และไม่มี canonical; รวมทั้งเว็บมีหน้าซ้ำ 2,411 หน้า
- **ต้องทำ:** เลือกเวอร์ชันหลัก (แนะนำ www) → ทำ 301 redirect จากเวอร์ชันอื่นมาหลัก + ใส่ canonical + แก้ลิงก์ภายในให้ชี้เวอร์ชันเดียว
- **ผู้รับผิดชอบ:** Dev
- **โยงไป Excel:** ชีต `URL Redirect Status Optional`

**#13 หน้าที่ไม่มีอยู่จริงตอบ 302 (redirect กลับหน้าแรก) แทนที่จะเป็น 404**
- พิมพ์ URL มั่ว ๆ ระบบ 302 กลับหน้าแรก ไม่ได้ขึ้นหน้า not-found; redirect ภายในบน www เป็น 302 ทั้ง 61 จุด
- **ต้องทำ:** สร้างหน้า 404 แบบ custom และให้ตอบสถานะ 404 จริง
- **ผู้รับผิดชอบ:** Dev

**#14 ลิงก์ภายในชี้ไปหน้า 4xx (ลิงก์เสีย)**
- มี 27 URL ที่ตอบ 404 แต่ถูกลิงก์จาก 22,061 จุด; ตัวหนักคือลิงก์ cookie ใน footer (`/Home/cookie_privacy` = 17,485 จุด) และ typo `/motor/motor_step_1/ompulsory` (ตก "c")
- สาเหตุเชิงระบบ: routing เป็น case-sensitive (ตัวพิมพ์ใหญ่ 404 / พิมพ์เล็ก 200)
- **ต้องทำ:** แก้ลิงก์ให้ถูก, ทำ 301 ไปหน้าที่ถูกต้อง, ลบลิงก์ที่ไม่มีปลายทาง; แก้ที่ template footer ทีเดียวจบเยอะ
- **ผู้รับผิดชอบ:** Dev
- **โยงไป Excel:** ชีต `URL Redirect Status Optional`

**#16 robots.txt ยังไม่บล็อก URL ที่ไม่ควรให้ crawl**
- 9,373 URL (49.8% ของทั้งหมด) มี parameter เช่น `?lang=en`, `?gclid=`, `?gad_source=` สร้างหน้าซ้ำ และไม่มี canonical มาเก็บกวาด; ลิงก์ภายใน 35 จุดมี utm/_ga ทำให้ session attribution เพี้ยน
- **ต้องทำ:** เพิ่มกฎ parameter ใน robots.txt + ใส่ canonical ทุกหน้า + ลบ utm/_ga ออกจากลิงก์ภายใน (รายงานแนบไฟล์ robots.txt ฉบับแก้ไว้ให้แล้ว)
- **ผู้รับผิดชอบ:** Dev

### 🔴 กลุ่ม C — On-Page & Structure

**#04 รูปภาพมีขนาดใหญ่เกินไป**
- 43 รูปใหญ่เกิน 300 kB รวม 28.2 MB (อีก 82 รูปอยู่ช่วง 100–300 kB); รูปหนักสุด 2.53 MB; รูปหลายรูปใหญ่กว่าขนาดที่แสดงจริงหลายเท่า
- ผลกระทบ: หน้าแรกได้คะแนน PageSpeed มือถือ **33** และ Core Web Vitals ไม่ผ่าน โดยน้ำหนักรูปเป็นตัวถ่วงอันดับหนึ่ง
- **ต้องทำ:** บีบอัดทุกรูป > 300 kB, ตั้งเพดาน 300 kB สำหรับรูปใหม่, ย่อขนาดให้ตรงกับที่แสดงจริง, ใช้ WebP/AVIF, ใส่ width/height กัน layout shift
- **ผู้รับผิดชอบ:** Dev/Content (เครื่องมือ: shortpixel, squoosh, img-resize)

**#11 การทำ Internal Linking ยังไม่ดีพอ**
- หน้าแรกมีลิงก์ภายในจริงแค่ 11 ลิงก์; 16 จาก 34 หน้าบน www เข้าไม่ถึงจากหน้าแรก; ทั้งเว็บลึกแค่ 2 คลิก (ไม่มีลำดับชั้นหัวข้อ); 2,425 หน้าไม่มีลิงก์ออกเลย
- **ต้องทำ:** วางโครง internal link ให้เป็นลำดับชั้น/ไซโล, ใช้ anchor text ที่สื่อความ, ลิงก์เชิงบริบท (Primal จะส่ง URL หน้าเป้าหมายให้)
- **ผู้รับผิดชอบ:** Primal (SEO) + Dev

**#25 รูปภาพไม่มี Alt Tag**
- 1,240 รูปมี alt ว่าง และ 75 รูปไม่มี alt เลย; รูปที่ใช้ซ้ำมากสุดปรากฏบน 7,085 หน้า
- **ต้องทำ:** เขียน alt ที่สื่อความให้รูปสำคัญ, ตั้งชื่อไฟล์ให้สื่อความ, alt ไม่เกิน 100 ตัวอักษร (Primal จะส่ง alt text สำหรับหน้าเป้าหมาย)
- **ผู้รับผิดชอบ:** Primal (SEO) + Content

**#26 ไม่มี Structured Data (Schema) บนหน้าที่ควรมี**
- 28 จาก 34 หน้าบน www ไม่มี schema เลย; ที่ทำงานได้แล้วคือ FAQPage บนหน้า travel; ที่ขาด: Organization/LocalBusiness (ไม่มีเลยทั้งเว็บ), FAQ บนหน้า motor/health, BreadcrumbList, Offer บนหน้าโปรโมชัน
- **ต้องทำ:** ฝัง schema ที่เตรียมไว้ลงใน `<head>` ทุกหน้า
- **ผู้รับผิดชอบ:** Dev (Primal เตรียม markup ให้)

### 🔴 กลุ่ม D — Off-Site / Risk

**#29 มีลิงก์ไม่เป็นธรรมชาติชี้มาที่เว็บ (Unnatural Backlinks)**
- **หมายเหตุสำคัญ:** ยังไม่ได้ประเมินจริง — Onsite Audit นี้ไม่ได้วิเคราะห์ backlink ต้องใช้เครื่องมือ backlink (referring domain + anchor text) มาดูก่อน
- **ต้องทำ:** รันวิเคราะห์ backlink profile → ถ้าเจอลิงก์สแปม ให้ disavow ผ่าน GSC
- **ผู้รับผิดชอบ:** Primal (Outreach)
- **โยงไป Excel:** ชีต `Backlink Plan`

---

## 4. การเชื่อมโยงกับ ElevateSEO Project Plan (ไฟล์ Excel)

ไฟล์ Excel เป็น **โครงแผนงาน/ตัวติดตามความคืบหน้า** ของ Primal (18 ชีต) ส่วนใหญ่ยังเป็นเทมเพลตเปล่า รอกรอกข้อมูล จุดเชื่อมสำคัญ:

### 4.1 ประเด็นที่สำคัญที่สุด: การรับประกันผลลัพธ์เริ่มนับ "หลัง" แก้ Onsite เสร็จ
ชีต `Traffic Milestone` และ `Campaign Set Up Tracking` ระบุชัดว่าแคมเปญ 12 เดือน (อุตสาหกรรมแข่งขันสูง) และการการันตี traffic **เริ่มนับหลังจาก "Onsite Implementation Complete"** เท่านั้น

👉 **นั่นแปลว่า ปัญหา HIGH ทั้ง 13 ข้อนี้ = ด่านที่ต้องผ่านก่อน นาฬิกาแคมเปญถึงจะเริ่มเดิน** ยิ่งแก้ช้า การันตีผลยิ่งเลื่อนออกไป

Milestone ที่วางไว้ (หลังเริ่มแคมเปญ):
| Milestone | เดือน | Clicks | Visibility |
|---|---|---|---|
| M1 | ~ม.ค. | 1.3x | 1.4x |
| M2 | ~เม.ย. | 1.5x | 1.7x |
| M3 | ~ก.ค. | 1.8x | 2.0x |

### 4.2 ตารางแมปปัญหา HIGH ↔ ชีตใน Project Plan

| ปัญหา Audit (HIGH) | ชีต/งานใน Project Plan ที่เกี่ยวข้อง | สถานะในแผน |
|---|---|---|
| #06, #07 Sitemap/GSC | `Campaign Set Up Tracking` → "Google Search Console Set Up" | Not Started |
| #05, #13, #14 Redirect/Duplicate/ลิงก์เสีย | `URL Redirect Status Optional` (ตาราง QA 301) | ว่าง (รอกรอก) |
| #04, #11, #25, #26 On-page/รูป/schema/ลิงก์ | `Campaign Set Up Tracking` → "Onsite Audit & Recommendations", "Develop or Revise Onsite Content", "Onsite Implementation Complete" | Not Started |
| #29 Backlinks | `Backlink Plan` (Jan=Local Listings live, Feb-Mar Advertorials, Apr Digital PR, May+ Backlinks) | เพิ่งเริ่ม (Jan) |
| #26 LocalBusiness schema | `Client Data AM` → Local Listing + ชีต `GBP` | ว่าง (รอกรอก) |

### 4.3 สิ่งที่แผนต้องการจากฝั่งลูกค้า (ก่อนเริ่มได้)
ชีต `Client Data AM` ขอ: สิทธิ์เข้าถึง GSC / GA / GTM / Google Business Profile (เพิ่ม `analytics@primal.co.th` แบบสิทธิ์สูงสุด), ข้อมูล CMS/FTP, ข้อมูล Local Listing (ชื่อ/ที่อยู่/เบอร์/เวลาทำการ) — ข้อมูลชุดนี้จำเป็นต่อการแก้ #06 (GSC) และ #26 (LocalBusiness schema)

---

## 5. ลำดับการลงมือแนะนำ (Action Plan ในฐานะที่ปรึกษา)

จัดลำดับตาม "ผลกระทบ × ความง่าย" และตาม logic ที่ว่าต้องให้ Google เข้าถึงได้ก่อน:

**ระยะที่ 1 — เปิดทางให้ Google (ทำก่อน, ปลดล็อกทุกอย่าง)**
1. #09 แก้ robots.txt เอา `Disallow: /pa/` ออก + แก้ ft ให้ใช้ `User-agent: *`
2. #16 เพิ่มกฎ parameter ใน robots.txt + วาง canonical ทุกหน้า
3. #07 ทำ sitemap ให้ครบ + ลบ URL ที่ 404 (ทำให้ครบก่อน submit)
4. #06 ตั้ง GSC + submit sitemap
5. #05 เลือก homepage เวอร์ชันหลัก + ทำ 301

> หมายเหตุ: #07 ถูกดึงมาไว้ระยะ 1 ให้อยู่ก่อน #06 เพราะต้องทำ sitemap ให้ครบก่อนจึงค่อย submit เข้า GSC

**ระยะที่ 2 — โครงสร้าง URL + ความเร็ว**
6. #14 แก้ลิงก์เสีย โดยเริ่มจาก template footer (cookie link) ที่กระทบ 17,485 จุด
7. #13 ทำหน้า 404 จริง แทน 302
8. #04 บีบอัด/ย่อรูป (PageSpeed มือถือ 33, Core Web Vitals ไม่ผ่าน = ranking factor กระทบทุกหน้า)

> หมายเหตุ: #04 ถูกดึงมาไว้ระยะ 2 (จากเดิมระยะ 3) เพราะ Core Web Vitals เป็น ranking factor โดยตรง กระทบทุกหน้า และไม่ต้องรอ dependency อื่น

**ระยะที่ 3 — คุณภาพหน้า**
9. #26 ฝัง schema (Organization/LocalBusiness ก่อน)
10. #25 เติม alt text
11. #11 วางโครง internal linking

**ระยะที่ 4 — งานที่ผูกกับ migration และ off-site**
12. #08 เปลี่ยนเป็น Pagination จริง (ทำตอนย้ายมา www)
13. #29 รันวิเคราะห์ backlink แล้ว disavow ถ้าจำเป็น

> หมายเหตุ migration: ปัญหาบน `ft.tipinsure.com` (ก้อนใหญ่ของ #08, #09, #14) ให้แก้บนโครงสร้าง `www` ตอนย้ายระบบ ไม่ต้องไปตามแพตช์บน ft ที่กำลังจะเลิกใช้

---

## 6. ประเด็นที่ควรเช็ค/ยืนยันเพิ่ม (Open Items)

- **#06:** ยืนยันจากภายในว่า sitemap ถูก submit เข้า GSC จริงหรือยัง (crawl ภายนอกดูไม่ได้)
- **#29:** ยังไม่มีข้อมูล backlink จริง ต้องรันเครื่องมือก่อนถึงจะสรุปได้ว่ามีลิงก์สแปมจริงไหม
- **Excel:** ชีตแผนส่วนใหญ่ยังว่าง (Keywords, Target Keywords, Quarterly Growth, Redirect Status) — ต้องกรอกข้อมูลจริงก่อนเริ่มแคมเปญ
- **วันเริ่มแคมเปญ:** ในไฟล์ระบุ serial date (~ก.ย. 2026) แต่ช่อง "Onsite Implementation Completion Date" ยังเป็น "-" → ยังไม่มีกำหนดเสร็จ Onsite ที่ชัดเจน

---

*จัดทำเป็นเอกสารที่ปรึกษาภายในทีม โดยสรุปและเรียบเรียงจากไฟล์ Audit (HTML) และ Project Plan (Excel) — เนื้อหาถูกเรียบเรียงใหม่เพื่อความกระชับ ตัวเลขและข้อเท็จจริงอ้างอิงจากรายงานต้นฉบับ*

---

## ภาคผนวก ก — ปัญหา MEDIUM 15 ข้อ

> ระดับ MEDIUM ยังควรแก้ แต่จัดหลังจากปิดงาน HIGH แล้ว หลายข้อในกลุ่มนี้แก้ได้พร้อมกันตอน migration มา www หรือแก้ที่ template ทีเดียวจบ

### กลุ่ม Redirect / Error handling
**#01 มี internal redirect ที่ไม่ใช่ 301** — redirect ภายในบน www เป็น 302 (ชั่วคราว) ทั้งหมด และโยนผู้ใช้ข้ามไป host ft (เช่น `/CriticalIllness/step_1`); ทั้งเว็บมี 301 = 1,202 / 302 = 94 (94 นี้อยู่บน www 61 จุด) → **แก้:** เปลี่ยน 302 เป็น 301

**#02 มี internal JavaScript redirect** — ไม่เจอบน www; เจอ 208 จุดบน ft (redirect URL ที่มี fragment ไปหาเวอร์ชันไม่มี fragment) → **แก้:** เปลี่ยนเป็น 301 (จัดการตอน migration)

**#03 มี redirect chain / canonical chain** — URL ข่าวที่หายเดินผ่าน 2 hop (`index_v4` → 302 → ft → pageNotFound → 200); เจอ chain 9 จุด ตัวยาวสุดอยู่บน affinity subdomain (3,291 inlinks) → **แก้:** ทำ 301 ให้ถึงปลายทางใน 1 hop

**#12 หน้า error ไม่ตอบ 404 (soft 404)** — บาง path ตอบ 404 ถูกต้อง แต่ `/NewsAndActivities/index_v4/...` ตอบ 302 → ไป ft → จบที่ `/Error/pageNotFound` ที่ตอบ **200 OK** → Google อ่านเป็นหน้ามีจริง กลายเป็น soft 404; หน้า 404 ที่เสิร์ฟไม่มีข้อความ/ค้นหา/ลิงก์แนะนำ → **แก้:** ทำหน้า 404 custom ที่ตอบ 404 จริง (โยงกับ #13)

### กลุ่ม Language / URL
**#10 ไม่มี language path แยกภาษา** — เว็บใช้ URL เดียวกันทั้งไทย/อังกฤษ (`<html lang="th-TH">` ทุกหน้า), `/en` = 404, สลับภาษาผ่าน `?lang=en` แทน → **แก้:** ทำ subdirectory `/en/` แยกภาษา และลิงก์จากเมนูสลับภาษาตรง ๆ ไม่ผ่าน redirect

**#24 URL ไม่เป็นมิตรกับ search engine** — 3 ปัญหา: (1) case-sensitive (path ตัวใหญ่ 404, ตัวเล็ก 200 — 16 URL เสีย, 12,150 URL มีตัวพิมพ์ใหญ่), (2) ใช้ underscore แทน hyphen (11,894 URL), (3) URL ภาษาไทย/non-ASCII (11,373 URL) → **แก้:** ตั้งชื่อ URL เป็นตัวเล็ก-อังกฤษ-ใช้ dash, ทำ canonical + 301 จาก URL เก่า

### กลุ่ม Title / Meta / H1 (On-page templates)
**#18 Title ซ้ำกันหลายหน้า** — 12/34 หน้า www มี title ซ้ำ (8,755 หน้าทั้งเว็บ); 6 หน้าใช้ title แค่ "TIPINSURE" รวมหน้าแรก → **แก้:** เขียน title เฉพาะแต่ละหน้า 30–60 ตัวอักษร

**#19 Title ยาวเกิน 60 ตัวอักษร** — 13/34 หน้า www เกิน (6,395 ทั้งเว็บ); ยาวสุด 202 ตัวอักษร → **แก้:** ย่อให้อยู่ 30–60 ตัวอักษร

**#20 Title สั้นกว่า 30 ตัวอักษร** — 6/34 หน้า www (414 ทั้งเว็บ) ล้วนเป็น "TIPINSURE" (9 ตัวอักษร) รวมหน้าแรก → **แก้:** เขียน title ที่สื่อความ

**#21 Meta description ยาวเกิน 155 ตัวอักษร** — 18/34 หน้า www (6,919 ทั้งเว็บ); ยาวสุด 646 ตัวอักษร; หน้าแรกมี 2 description ต่อกันด้วย pipe (37 หน้ามี meta description ซ้อน) → **แก้:** เขียนใหม่ 70–155 ตัวอักษร หน้าละอัน

**#22 Meta description สั้นกว่า 70 ตัวอักษร** — 9/34 หน้า www (584 ทั้งเว็บ); สั้นสุด 32 ตัวอักษร ส่วนใหญ่เป็นหน้าโปรโมชันที่มีข้อเสนอแรงสุด → **แก้:** เขียนให้ยาว 70–155 ตัวอักษร

**#23 H1 หายไป** — หน้าแรกไม่มี H1 เลย (มีแต่ H2 สามตัว); 9,882 หน้าทั้งเว็บไม่มี H1; 23/34 หน้า www มี H1 ซ้ำกัน → **แก้:** ใส่ H1 เดียวต่อหน้า 20–70 ตัวอักษร สื่อหัวข้อ

### กลุ่มอื่น
**#15 External links เสีย / ไม่ปลอดภัย** — 59 external URL ตอบ 4xx ถูกลิงก์จาก 24,336 จุด (หนักสุดคือลิงก์ใน navigation ไปเว็บบริษัทแม่ dhipaya.co.th); และ 354 ลิงก์ใช้ `target="_blank"` โดยไม่มี `rel="noopener"` → **แก้:** ลบ/แทนลิงก์เสีย + เพิ่ม rel="noopener" ที่ template

**#27 มี Doorway Pages** — 4 URL คีย์เวิร์ดภาษาไทยเสิร์ฟเนื้อหาซ้ำกับหน้า funnel ที่มีอยู่ (byte-identical, ไม่มี canonical); อีกคู่คือ health/step_1/talisman กับ tiphealthcare → **แก้:** พิจารณาลบหน้า doorway หรือทำ canonical

**#28 ลบ Meta Keywords** — ทุกหน้ามี meta keywords (34 หน้า www, 11,172 ทั้งเว็บ) อยู่ใน layout ร่วม; Google เลิกใช้แท็กนี้ตั้งแต่ 2009 และยังเป็นการเปิดกลยุทธ์คีย์เวิร์ดให้คู่แข่ง → **แก้:** ลบ meta keywords หรือเหลือ 1 คีย์เวิร์ดต่อหน้า

---

## ภาคผนวก ข — ปัญหา LOW 2 ข้อ

**#17 ไม่มี llms.txt** — `tipinsure.com/llms.txt` ตอบ 404 ยังไม่มีไฟล์นี้บน host ใด; ช่วยให้ AI/LLM เข้าถึงเนื้อหาได้ดีขึ้น (เกี่ยวกับ GEO) → **แก้:** Primal จะเพิ่ม llms.txt ให้ **หลังจากทำ XML sitemap เสร็จก่อน**

**#30 คอนเทนต์ยังไม่ตาม E-E-A-T** — เนื้อหาไม่มีชื่อผู้เขียน/เครดิต/วันที่, ไม่มี Organization หรือ Person schema; ประกันเป็นหมวด YMYL (Your Money or Your Life) ที่ Google ให้น้ำหนัก E-E-A-T สูง → **แก้:** สร้าง Author Profile, ใส่ citation/แหล่งอ้างอิง, เพิ่ม FAQ, ทำ Google Business Profile ให้ครบ

---

## ภาคผนวก ค — สรุปตารางปัญหาทั้ง 30 ข้อ (Quick Reference)

| # | ปัญหา | ระดับ | หมวด |
|---|---|---|---|
| 01 | Internal redirects ไม่ใช่ 301 | 🟡 MED | Redirect |
| 02 | Internal JavaScript redirects | 🟡 MED | Redirect |
| 03 | Redirect / canonical chains | 🟡 MED | Redirect |
| 04 | รูปภาพใหญ่เกินไป | 🔴 HIGH | Speed/On-page |
| 05 | Homepage duplication | 🔴 HIGH | Duplicate |
| 06 | Sitemap ไม่ยืนยันว่าส่ง GSC | 🔴 HIGH | Crawl/Index |
| 07 | หน้าไม่อยู่ใน sitemap.xml | 🔴 HIGH | Crawl/Index |
| 08 | Pagination crawl ไม่ได้ | 🔴 HIGH | Crawl/Index |
| 09 | robots.txt บล็อกหน้าที่อยากได้ | 🔴 HIGH | Crawl/Index |
| 10 | ไม่มี language path | 🟡 MED | Language |
| 11 | Internal linking ไม่ดีพอ | 🔴 HIGH | On-page |
| 12 | หน้า error ไม่ตอบ 404 (soft 404) | 🟡 MED | Error handling |
| 13 | ตอบ 302 บนหน้าไม่มีจริง | 🔴 HIGH | Error handling |
| 14 | ลิงก์ภายในชี้ 4xx | 🔴 HIGH | Broken links |
| 15 | External links เสีย/ไม่ปลอดภัย | 🟡 MED | Broken links |
| 16 | robots.txt ไม่บล็อกที่ควรบล็อก | 🔴 HIGH | Crawl/Index |
| 17 | ไม่มี llms.txt | 🟢 LOW | GEO/AI |
| 18 | Title ซ้ำ | 🟡 MED | On-page |
| 19 | Title ยาวเกิน 60 | 🟡 MED | On-page |
| 20 | Title สั้นกว่า 30 | 🟡 MED | On-page |
| 21 | Meta description ยาวเกิน 155 | 🟡 MED | On-page |
| 22 | Meta description สั้นกว่า 70 | 🟡 MED | On-page |
| 23 | H1 หายไป/ซ้ำ | 🟡 MED | On-page |
| 24 | URL ไม่ SEO-friendly | 🟡 MED | URL |
| 25 | รูปไม่มี alt tag | 🔴 HIGH | On-page |
| 26 | ไม่มี Structured Data | 🔴 HIGH | Schema |
| 27 | Doorway pages | 🟡 MED | Duplicate |
| 28 | ลบ Meta Keywords | 🟡 MED | On-page |
| 29 | Unnatural backlinks | 🔴 HIGH | Off-site/Risk |
| 30 | คอนเทนต์ไม่ตาม E-E-A-T | 🟢 LOW | Content/Trust |

*รวม: 🔴 HIGH 13 ข้อ | 🟡 MEDIUM 15 ข้อ | 🟢 LOW 2 ข้อ = 30 ข้อ*
