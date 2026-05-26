## Session 2026-05-24

- Q: DB migration — create from scratch or existing? → A: Tạo migration từ đầu (profiles, kudos, kudos_likes, departments, hashtags, secret_boxes, prizes + seed data)
- Q: Award badge hover state ('New Hero', 'Legend Hero') → A: Tooltip với mô tả danh hiệu tương ứng
- Q: Spotlight board implementation → A: D3.js / canvas word scatter với pan/zoom thật sự
- Q: Kudos submission dialog (A.1) → A: Implement basic dialog: chọn người nhận, nhập nội dung, chọn category, upload ảnh
- Q: Profile hover (721:5827) → A: Yellow ring on avatar (confirmed from Figma screenshot)
- Q: Hashtag dropdown → A: Multi-select max 5, dark bg, checkmarks on selected
- Q: Phòng ban dropdown → A: Single-select, dark bg with yellow border, department list
- Q: Kudos card background → A: Warm cream/beige (#F5F0E8 approx), rounded card
- Q: Hashtag color in card → A: Red/orange (#E84A4A approx) for hashtag text
- Q: "IDOL GIỚI TRẺ" field → A: Kudos category (separate from #hashtags), displayed above content with edit icon
- Q: Section D.2 "10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT" → A: Hidden in Figma (hidden="true"), only D.3 "10 SUNNER NHẬN QUÀ MỚI NHẤT" is visible
- Q: Secret Box dialog scope → A: Implement "Mở quà" button that opens dialog (basic, per linkedFrameId 1466:7676 pattern)
- Q: Infinite scroll vs pagination for All Kudos → A: Infinity scroll (per spec C description)
