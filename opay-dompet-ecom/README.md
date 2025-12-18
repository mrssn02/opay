# O-Pay — Next.js E-commerce + Dompet Digital (Demo)

Template Next.js (App Router) bertema dompet digital:
- Login/Register (cookie session JWT)
- Wallet + Ledger (saldo aman & tercatat)
- Request **Deposit** / **Withdraw**
- **Admin panel**: ACC deposit/WD, kelola rekening deposit, ubah nomor CS WhatsApp
- Tombol **CS WhatsApp** di semua halaman (nomor diubah dari admin)

## 1) Jalankan lokal

### Prasyarat
- Node.js 18+
- PostgreSQL

### Setup
```bash
cp .env.example .env
npm install
```

Isi `DATABASE_URL` dan `JWT_SECRET` di `.env`, lalu:
```bash
npx prisma db push
npm run seed
npm run dev
```

Buka: http://localhost:3000

**Admin default (seed):**
- email: `admin@opay.local`
- password: `admin123`

## 2) Deploy ke GitHub + Vercel

### Upload ke GitHub
1. Buat repo baru
2. Push source code ini ke repo tersebut

### Deploy Vercel
1. Import repo GitHub di Vercel
2. Tambahkan database Postgres (mis. Vercel Postgres / Neon / Supabase)
3. Set env vars di Vercel Project Settings:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_NAME` (opsional)

4. **Build Command**:
   - Default: Vercel akan pakai `npm run build`.
   - Untuk auto sync schema (tanpa migrations), set Build Command ke:
     ```bash
     npm run vercel-build
     ```
   Ini akan menjalankan `prisma db push` sebelum `next build`.

> Catatan: `prisma db push` cocok untuk demo. Untuk production, sebaiknya gunakan migrations + `prisma migrate deploy`.

## 3) Alur deposit/withdraw (realistis)
- User membuat request Deposit/Withdraw → status `PENDING`
- Admin melakukan approve/reject
- Saat approve:
  - saldo wallet berubah **dalam transaksi DB**
  - ledger dibuat (audit trail)

## 4) Lokasi fitur penting
- User Dashboard: `/dashboard`
- Admin Panel: `/admin`
  - Deposits: `/admin/deposits`
  - Withdraws: `/admin/withdraws`
  - Rekening Deposit: `/admin/deposit-accounts`
  - Settings (WA CS): `/admin/settings`

## Legal
Gunakan template ini untuk kebutuhan legal & aman. Jangan dipakai untuk penipuan, pencucian uang, atau aktivitas ilegal lainnya.
