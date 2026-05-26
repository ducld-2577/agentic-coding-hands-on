# Phase 02 – Data Layer & Asset Acquisition (Track B)

**Priority:** High — must complete before phase-05 (integration)  
**Status:** ✅ Complete

## Overview

Extend `AWARD_CATEGORIES` with detail fields, download Figma images for keyvisual and award cards.

## 1. Extend award-categories.ts

File: `lib/data/award-categories.ts`

Add interface `AwardDetail extends AwardCategory`:

```typescript
export interface AwardDetail extends AwardCategory {
  count: string
  unit: string
  value: string
  valueSuffix: string
  valueAlt?: string        // Signature 2025 tập thể
  valueAltSuffix?: string
  descriptionLong: string
  detailImageSrc: string   // /awards-information/<slug>.png
}
```

Export `AWARD_DETAILS: AwardDetail[]` with this data (from spec + Figma node tree):

| slug | title | count | unit | value | valueSuffix | notes |
|------|-------|-------|------|-------|-------------|-------|
| top-talent | Top Talent | 10 | Cá nhân | 7.000.000 VNĐ | cho mỗi giải thưởng | desc from Figma |
| top-project | Top Project | 02 | Tập thể | 15.000.000 VNĐ | cho mỗi giải thưởng | desc = placeholder TODO |
| top-project-leader | Top Project Leader | 03 | Cá nhân | 7.000.000 VNĐ | cho mỗi giải thưởng | desc = placeholder TODO |
| best-manager | Best Manager | 01 | Cá nhân | 10.000.000 VNĐ | cho mỗi giải thưởng | desc = placeholder TODO |
| signature-creator | Signature 2025 — Creator | 01 | Cá nhân hoặc tập thể | 5.000.000 VNĐ | cho giải cá nhân | valueAlt=8.000.000 VNĐ / valueAltSuffix=cho giải tập thể |
| mvp | MVP (Most Valuable Person) | 01 | — | 15.000.000 VNĐ | — | desc = placeholder TODO |

**Description texts (from Figma node tree):**

- `top-talent`: "Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể."
- `signature-creator`: "Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ. Trong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần "Creator" đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị."
- `top-project`, `top-project-leader`, `best-manager`, `mvp`: **TODO — Figma instances show Top Talent placeholder. Mark with `// TODO: replace with actual description` comment.**

## 2. Download images from Figma

Create directory: `public/awards-information/`

### Keyvisual background
- Figma node: `2167:5138` (inside group `313:8437` "3_Keyvisual")
- Save as: `/public/awards-information/keyvisual-bg.png`
- Tool: `mcp__momorph__get_figma_image` with `nodeIds: ["2167:5138"]`, `scale: 1`, `format: "png"`
- Fallback if Figma export fails: use `/public/login/keyvisual-bg.png`

### Award card images (Picture-Award, 336×336px container)
Each award card uses a two-layer composition:
- Layer 1 (background fill): `Rectangle 5` inside the Picture-Award instance
- Layer 2 (name overlay): per-award rectangle (component node IDs below)

Export each Picture-Award instance as a flat image:

| slug | Instance node ID | Save as |
|------|-----------------|---------|
| top-talent | `I313:8467;214:2525` | `/public/awards-information/top-talent.png` |
| top-project | `I313:8468;214:2617` | `/public/awards-information/top-project.png` |
| top-project-leader | `I313:8469;214:2525` | `/public/awards-information/top-project-leader.png` |
| best-manager | `I313:8470;214:2617` | `/public/awards-information/best-manager.png` |
| signature-creator | `313:8473` | `/public/awards-information/signature-creator.png` |
| mvp | `I313:8510;214:2617` | `/public/awards-information/mvp.png` |

Tool: `mcp__momorph__get_figma_image` with each `nodeId`, `scale: 2`, `format: "png"`  
Fallback: use existing `/public/awards/*.png` text logos with ring background overlay (same approach as HomeAwardCard).

### Root Further Logo (for KV section)
- Already available: `MM_MEDIA_Root Further Logo`, 338×150px, media node `2789:12915`
- Use existing `/public/login/Root_Further_Logo.png`

## Todo

- [ ] Add `AwardDetail` interface to `award-categories.ts`
- [ ] Add `AWARD_DETAILS` array with all 6 awards
- [ ] Create `/public/awards-information/` directory
- [ ] Download keyvisual image from Figma node `2167:5138`
- [ ] Download 6 award card images from Figma instance nodes
- [ ] Verify downloaded images match 336×336px display size
