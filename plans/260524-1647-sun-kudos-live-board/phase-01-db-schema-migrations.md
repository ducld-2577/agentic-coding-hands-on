# Phase 01 — DB Schema & Migrations

**Status:** ✅ DONE | **Priority:** P0 | **Blocks:** All phases

## Context Links
- Specs: MoMorph screen `MaZUn5xHXZ` — 64 specs
- Clarifications: [clarifications.md](./clarifications.md)

## Overview
Create Supabase migration files from scratch. No existing schema.  
Two files: schema + seed data.

## Tables

### departments
```
id SERIAL PK | name TEXT UNIQUE
```
Seed: CEVC1, CEVC2, CEVC3, CEVC4, CEVC10, OPD, Infra, Engineering, Product, Design

### kudos_categories
```
id SERIAL PK | name TEXT UNIQUE
```
Seed: IDOL GIỚI TRẺ, TOP TALENT, TOP PROJECT, BEST MANAGER, MVP, SIGNATURE CREATOR

### kudos_hashtags
```
id SERIAL PK | name TEXT UNIQUE
```
Seed: #High-performing, #BE PROFESSIONAL, #BE OPTIMISTIC, #BE A TEAM, #THINK OUTSIDE THE BOX, #GET RISKY, #GO FAST, #WASSHOI, #Dedicated, #Inspiring

### profiles
```
id UUID FK → auth.users PK
full_name TEXT NOT NULL
avatar_url TEXT
department_id INTEGER FK → departments
badge_title TEXT          -- 'New Hero' | 'Rising Hero' | 'Legend Hero' | NULL
star_level SMALLINT DEFAULT 0  -- 0–3, computed from kudos_received_count
kudos_received_count INTEGER DEFAULT 0
kudos_sent_count INTEGER DEFAULT 0
hearts_received INTEGER DEFAULT 0
created_at TIMESTAMPTZ DEFAULT NOW()
```

### kudos
```
id UUID DEFAULT gen_random_uuid() PK
sender_id UUID FK → profiles NOT NULL
receiver_id UUID FK → profiles NOT NULL
content TEXT NOT NULL
category_id INTEGER FK → kudos_categories
image_urls TEXT[] DEFAULT '{}'
like_count INTEGER DEFAULT 0
created_at TIMESTAMPTZ DEFAULT NOW()
```

### kudos_to_hashtags
```
kudos_id UUID FK → kudos ON DELETE CASCADE
hashtag_id INTEGER FK → kudos_hashtags
PK(kudos_id, hashtag_id)
```

### kudos_likes
```
id UUID DEFAULT gen_random_uuid() PK
kudos_id UUID FK → kudos ON DELETE CASCADE
user_id UUID FK → profiles
is_special_day BOOLEAN DEFAULT FALSE
hearts_added SMALLINT DEFAULT 1   -- 1 normal, 2 special day
created_at TIMESTAMPTZ DEFAULT NOW()
UNIQUE(kudos_id, user_id)
```

### secret_boxes
```
id UUID DEFAULT gen_random_uuid() PK
user_id UUID FK → profiles
is_opened BOOLEAN DEFAULT FALSE
prize_description TEXT
opened_at TIMESTAMPTZ
created_at TIMESTAMPTZ DEFAULT NOW()
```

### prize_recipients  ← powers D.3 sidebar list
```
id UUID DEFAULT gen_random_uuid() PK
user_id UUID FK → profiles
prize_description TEXT NOT NULL     -- e.g. 'Nhận được 1 áo phông SAA'
received_at TIMESTAMPTZ DEFAULT NOW()
```

## Badge/Star Logic
| kudos_received_count | star_level | badge_title |
|---|---|---|
| 0–9 | 0 | NULL |
| 10–19 | 1 | New Hero |
| 20–49 | 2 | Rising Hero |
| ≥50 | 3 | Legend Hero |

Hover tooltip text (from spec B.3.2):
- 1★ New Hero: "Sunner đã nhận được 10 Kudos và bắt đầu lan tỏa năng lượng ấm áp đến mọi người xung quanh."
- 2★ Rising Hero: "Sunner đã nhận được 20 Kudos và chứng minh sức ảnh hưởng của mình qua những hành động lan tỏa tích cực mỗi ngày."
- 3★ Legend Hero: "Sunner đã nhận được 50 Kudos và trở thành hình mẫu của sự công nhận, sẻ chia và lan tỏa tinh thần Sun*."

## Files to Create
- `supabase/migrations/20260524000001_kudos_schema.sql`
- `supabase/migrations/20260524000002_kudos_seed.sql`

## Seed Data Requirements
- 10 departments
- 6 kudos categories
- 10 hashtags
- 15 user profiles (names from Spotlight: Đỗ Hoàng Hiệp, Nguyễn Văn Quy, Dương Thúy An, Mai Phương Thúy, Nguyễn Bá Chức, Nguyễn Hoàng Linh, Lê Kiều Trang, + 8 more)
- 25+ kudos (varied: categories, hashtags, like counts)
- 40+ kudos_likes (distributed across users)
- 5 secret_boxes per user (some opened)
- 5 prize_recipients

**Note:** `auth.users` is managed by Supabase — seed profiles with hardcoded UUIDs, bypass FK in seed with `OVERRIDING SYSTEM VALUE` or insert directly.

## Success Criteria
- [ ] `supabase db reset` runs without errors
- [ ] All tables created with correct constraints
- [ ] Seed data visible in Supabase Studio
- [ ] Querying `kudos` with joins to `profiles`, `departments`, `kudos_hashtags` returns expected data
