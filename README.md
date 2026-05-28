# SAA 2025 — Sun Asterisk Awards Platform

Nền tảng trao giải nội bộ Sun Asterisk 2025, bao gồm trang giới thiệu giải thưởng, hệ thống Sun\* Kudos Live Board và xác thực người dùng.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 |
| Database / Auth | Supabase (PostgreSQL + Supabase Auth) |
| Visualization | D3 v7 |
| Testing | Vitest |

## Prerequisites

Cài đặt các công cụ sau trước khi bắt đầu:

- **Node.js** ≥ 20 — [nodejs.org](https://nodejs.org)
- **Docker Desktop** (bắt buộc để chạy Supabase local) — [docker.com](https://www.docker.com/products/docker-desktop)
- **Supabase CLI** — cài qua npm hoặc brew:
  ```bash
  npm install -g supabase
  # hoặc
  brew install supabase/tap/supabase
  ```

## Quick Start

### 1. Clone & cài đặt dependencies

```bash
git clone <repo-url>
cd saa-project-demo-momorph
npm install
```

### 2. Khởi động Supabase local

Đảm bảo Docker Desktop đang chạy, sau đó:

```bash
npx supabase start
```

Lệnh này sẽ khởi động toàn bộ Supabase stack (PostgreSQL, Auth, Storage, ...) trên local. Kết thúc sẽ in ra thông tin:

```
API URL: http://127.0.0.1:54321
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
anon key: eyJhbGci...   ← copy giá trị này
```

### 3. Cấu hình biến môi trường

```bash
cp .env.local.template .env.local
```

Mở `.env.local` và điền `anon key` vừa lấy được:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key từ bước trên>

# Google OAuth — xem hướng dẫn bên dưới nếu cần
SUPABASE_AUTH_GOOGLE_CLIENT_ID=
SUPABASE_AUTH_GOOGLE_SECRET=
```

### 4. Apply database migrations & seed data

```bash
npx supabase db reset
```

Lệnh này tự động chạy toàn bộ migration trong `supabase/migrations/` và load seed data.

### 5. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

---

## Cấu trúc project

```
├── app/                     # Next.js App Router pages
│   ├── login/               # Trang đăng nhập (public)
│   ├── home/                # Trang chủ (protected)
│   ├── sun-kudos/           # Sun* Kudos Live Board (protected)
│   ├── awards-information/  # Thông tin giải thưởng (protected)
│   ├── profile/             # Trang cá nhân (protected)
│   └── admin/               # Trang admin (protected)
├── components/              # React components theo từng feature
│   ├── login/
│   ├── sun-kudos/
│   └── ...
├── lib/                     # Business logic, queries, actions
│   └── kudos/               # Supabase queries & server actions
├── hooks/                   # Custom React hooks
├── supabase/
│   ├── config.toml          # Cấu hình Supabase local
│   └── migrations/          # SQL migration files
├── public/                  # Static assets
└── __tests__/               # Vitest test files
```

## Các trang chính

| URL | Mô tả | Yêu cầu auth |
|---|---|---|
| `/login` | Đăng nhập (email/password, Google OAuth) | Không |
| `/home` | Trang chủ, countdown, danh mục giải thưởng | Có |
| `/sun-kudos` | Kudos Live Board (D3 graph, realtime feed) | Có |
| `/awards-information` | Thông tin chi tiết các hạng mục giải | Có |
| `/profile` | Trang cá nhân | Có |
| `/admin` | Quản trị | Có |

## Scripts

```bash
npm run dev        # Chạy development server (localhost:3000)
npm run build      # Build production
npm run start      # Chạy production build
npm run lint       # Kiểm tra linting
npm run test       # Chạy test suite (Vitest)
npm run test:watch # Chạy test ở watch mode
```

## Cấu hình Google OAuth (tuỳ chọn)

Nếu muốn đăng nhập bằng Google:

1. Tạo project trên [Google Cloud Console](https://console.cloud.google.com/)
2. Vào **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
3. Thêm **Authorized redirect URI**: `http://127.0.0.1:54321/auth/v1/callback`
4. Copy **Client ID** và **Client Secret** vào `.env.local`:
   ```env
   SUPABASE_AUTH_GOOGLE_CLIENT_ID=<your-client-id>
   SUPABASE_AUTH_GOOGLE_SECRET=<your-client-secret>
   ```
5. Restart Supabase: `npx supabase stop && npx supabase start`

## Quản lý database (Supabase)

```bash
# Xem trạng thái các service
npx supabase status

# Dừng Supabase
npx supabase stop

# Reset DB về trạng thái ban đầu (chạy lại toàn bộ migration + seed)
npx supabase db reset

# Mở Supabase Studio (UI quản lý DB)
# Sau khi supabase start, truy cập: http://127.0.0.1:54323
```

## Xử lý lỗi thường gặp

**`supabase start` bị treo / lỗi Docker**
→ Đảm bảo Docker Desktop đang chạy và có ít nhất 4GB RAM được cấp cho Docker.

**Lỗi `NEXT_PUBLIC_SUPABASE_ANON_KEY` chưa được set**
→ Chạy `npx supabase status` để lấy lại `anon key`, sau đó cập nhật `.env.local`.

**Lỗi authentication callback**
→ Kiểm tra `additional_redirect_urls` trong `supabase/config.toml`, đảm bảo `http://localhost:3000/auth/callback` có trong danh sách.

**Port conflict (54321, 54322, 54323)**
→ Dừng Supabase bằng `npx supabase stop`, kiểm tra process đang chiếm port, sau đó start lại.

## Deploy lên Supabase Cloud

### 1. Tạo project trên Supabase Cloud

1. Đăng nhập tại [supabase.com](https://supabase.com) → **New project**
2. Ghi lại **Project URL** và **anon key** từ **Project Settings → API**

### 2. Link project với Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref <project-id>
```

> `project-id` là chuỗi ký tự trong URL: `https://supabase.com/dashboard/project/<project-id>`

### 3. Cấu hình biến môi trường cho cloud

Tạo hoặc cập nhật `.env.local` với thông tin từ Supabase Cloud:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key từ Project Settings → API>

# Google OAuth (nếu dùng)
SUPABASE_AUTH_GOOGLE_CLIENT_ID=<your-client-id>
SUPABASE_AUTH_GOOGLE_SECRET=<your-client-secret>
```

### 4. Push database migrations

```bash
npx supabase db push
```

Lệnh này apply tất cả migration trong `supabase/migrations/` lên cloud (schema + lookup data).

### 5. Seed demo data lên cloud

```bash
npx supabase db query --linked -f supabase/seed.sql
```

Lệnh này tạo toàn bộ demo data: auth users, profiles, kudos, likes, prizes.

### 6. Cấu hình Google OAuth cho cloud (nếu dùng)

1. Trên Google Cloud Console, thêm **Authorized redirect URI**:
   ```
   https://<project-id>.supabase.co/auth/v1/callback
   ```
2. Trên Supabase Dashboard → **Authentication → Providers → Google**, nhập Client ID và Secret
3. Thêm production URL vào **Authentication → URL Configuration**:
   - **Site URL**: `https://<your-domain>`
   - **Redirect URLs**: `https://<your-domain>/auth/callback`

### 7. Cập nhật database sau này

```bash
# Tạo migration mới
npx supabase migration new <tên-thay-đổi>
# Viết SQL vào file vừa tạo trong supabase/migrations/

# Test local trước
npx supabase db reset

# Push lên cloud
npx supabase db push
```

> **Lưu ý:** Không sửa trực tiếp migration đã push. Mọi thay đổi schema phải tạo migration mới.

---

## Đóng góp

1. Tạo branch từ `main` theo quy ước: `feature/<slug>`, `fix/<slug>`
2. Commit theo [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
3. Chạy `npm run lint` và `npm run test` trước khi tạo PR
4. Không commit file `.env.local` hoặc thông tin nhạy cảm
