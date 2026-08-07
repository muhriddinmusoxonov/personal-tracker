# Xarajatlarim — hisob-kitob avtomatlashtirish tizimi

Stack: **NestJS** (backend) + **NuxtJS 3 + Nuxt UI** (frontend) + **MongoDB** (Mongoose)

## Papka strukturasi

```
expense-tracker/
├── backend/     # NestJS API
└── frontend/    # Nuxt 3 UI
```

## Funksiyalar (spetsifikatsiyaga mos)

1. **Auth** — email/parol bilan ro'yxatdan o'tish va kirish (JWT).
2. **Report page** — kun/hafta/oy/yil filtri, Balance/Kirim/Chiqim kartalari, category bo'yicha diagramma (Doughnut chart), Excel eksport (checkbox filtrlari bilan: davr, Personal/Company, Kirim/Chiqim, kategoriyalar).
3. **Add page** — sana, Balance (Personal/Company), Kirim/Chiqim, kategoriya (faqat chiqim uchun, icon bilan), miqdor **kalkulyator ifodasi** sifatida (`25000*3`), izoh, chek/skrinshot yuklash + **Claude Vision AI** orqali avtomatik summani va kategoriyani aniqlash.
4. **List page** — sana/Balance/Kirim-chiqim filtri, har bir tranzaksiya kengaytiriladi (chek rasmi, to'lov turi, balance turi ko'rinadi).

## Ma'lumotlar modeli

- `User` — email, parol hash, ism
- `Category` — nom, icon, turi (income/expense/both), egasi
- `Balance` — har bir foydalanuvchi uchun bitta hujjat: `personalCash`, `personalCard`, `companyCash`, `companyCard`
- `Transaction` — direction (income/expense), balanceType (personal/company), paymentType (cash/card), category, amount, rawExpression, occurredAt (soniyagacha aniq), receiptUrl, aiAnalysis

## Ishga tushirish

### Backend

```bash
cd backend
npm install
cp .env.example .env   # MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY ni to'ldiring
npm run start:dev
```

API: `http://localhost:3000/api`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: `http://localhost:3001` (yoki Nuxt ko'rsatgan portda)

`frontend/nuxt.config.ts` dagi `NUXT_PUBLIC_API_BASE` env orqali backend manzilini sozlash mumkin.

## AI chek tahlili qanday ishlaydi

`Add` sahifasida chek/skrinshot yuklanganda va "AI orqali aniqlash" belgilansa, backend rasmni base64 formatda Claude API'ga (`claude-sonnet-4-6` vision) yuboradi va JSON qaytaradi: `amount`, `merchant`, `date`, `suggestedCategory`. Bu qiymatlar avtomatik forma bilan bog'lanadi, foydalanuvchi tasdiqlaydi.

`ANTHROPIC_API_KEY` `.env` faylida bo'lishi shart — aks holda bu funksiya o'chirilgan holatda ishlaydi (foydalanuvchi qo'lda kiritishi kerak bo'ladi).

## Keyingi qadamlar (tavsiya)

- Refresh token va parolni tiklash (forgot password) qo'shish
- Валюта konvertatsiyasi (USD/UZS) — hozircha `Balance.currency` maydoni tayyor, lekin konvertatsiya logikasi yo'q
- Category qo'shish/tahrirlash uchun alohida sahifa (backend API tayyor: `POST/PATCH/DELETE /categories`)
- Pagination — `list` sahifasida hozircha barcha natijalar bir yo'la qaytadi
- Testlar (unit/e2e)
