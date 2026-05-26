-- Sun* Kudos Live Board — Seed Data
-- Demo users, kudos, likes, prizes for local development

-- ─────────────────────────────────────────────
-- Auth users (local Supabase only)
-- ─────────────────────────────────────────────

INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, confirmation_token, recovery_token,
  email_change_token_new, email_change
) VALUES
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','do.hoang.hiep@sunasterisk.com',  crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Đỗ Hoàng Hiệp"}',  false,'','','',''),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','nguyen.van.quy@sunasterisk.com',   crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Nguyễn Văn Quy"}',  false,'','','',''),
  ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','duong.thuy.an@sunasterisk.com',    crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Dương Thúy An"}',   false,'','','',''),
  ('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','mai.phuong.thuy@sunasterisk.com',  crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Mai Phương Thúy"}', false,'','','',''),
  ('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','nguyen.ba.chuc@sunasterisk.com',   crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Nguyễn Bá Chức"}', false,'','','',''),
  ('00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','nguyen.hoang.linh@sunasterisk.com',crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Nguyễn Hoàng Linh"}',false,'','','',''),
  ('00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','le.kieu.trang@sunasterisk.com',    crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Lê Kiều Trang"}',   false,'','','',''),
  ('00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','huynh.duong.xuan@sunasterisk.com', crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Huỳnh Dương Xuân"}',false,'','','',''),
  ('00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','tran.minh.khoa@sunasterisk.com',   crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Trần Minh Khoa"}',  false,'','','',''),
  ('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','pham.thi.lan@sunasterisk.com',     crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Phạm Thị Lan"}',   false,'','','',''),
  ('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000000','authenticated','authenticated','vo.thi.hoa@sunasterisk.com',       crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Võ Thị Hoa"}',     false,'','','',''),
  ('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000000','authenticated','authenticated','bui.van.thanh@sunasterisk.com',    crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Bùi Văn Thành"}',  false,'','','',''),
  ('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000000','authenticated','authenticated','nguyen.thi.thu@sunasterisk.com',   crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Nguyễn Thị Thu"}', false,'','','',''),
  ('00000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000000','authenticated','authenticated','hoang.van.duc@sunasterisk.com',    crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Hoàng Văn Đức"}',  false,'','','',''),
  ('00000000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000000','authenticated','authenticated','tran.thi.mai@sunasterisk.com',     crypt('Demo1234!',gen_salt('bf')),NOW(),NOW(),NOW(),'{"provider":"google","providers":["google"]}','{"full_name":"Trần Thị Mai"}',   false,'','','','')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- Lookup data
-- ─────────────────────────────────────────────

INSERT INTO departments (name) VALUES
  ('CEVC1'),('CEVC2'),('CEVC3'),('CEVC4'),('CEVC10'),
  ('OPD'),('Infra'),('Engineering'),('Product'),('Design')
ON CONFLICT (name) DO NOTHING;

INSERT INTO kudos_categories (name) VALUES
  ('IDOL GIỚI TRẺ'),('TOP TALENT'),('TOP PROJECT'),
  ('BEST MANAGER'),('MVP'),('SIGNATURE CREATOR')
ON CONFLICT (name) DO NOTHING;

INSERT INTO kudos_hashtags (name) VALUES
  ('High-performing'),('BE PROFESSIONAL'),('BE OPTIMISTIC'),
  ('BE A TEAM'),('THINK OUTSIDE THE BOX'),('GET RISKY'),
  ('GO FAST'),('WASSHOI'),('Dedicated'),('Inspiring')
ON CONFLICT (name) DO NOTHING;

-- ─────────────────────────────────────────────
-- Profiles
-- kudos_received_count drives badge/star_level
-- ─────────────────────────────────────────────

INSERT INTO profiles (id, full_name, department_id, kudos_received_count, kudos_sent_count, hearts_received, star_level, badge_title) VALUES
  -- Legend Hero (≥50 kudos)
  ('00000000-0000-0000-0000-000000000008', 'Huỳnh Dương Xuân',   (SELECT id FROM departments WHERE name='CEVC10'), 55, 8,  110, 3, 'Legend Hero'),
  ('00000000-0000-0000-0000-000000000001', 'Đỗ Hoàng Hiệp',      (SELECT id FROM departments WHERE name='CEVC2'),  52, 10, 104, 3, 'Legend Hero'),
  -- Rising Hero (≥20 kudos)
  ('00000000-0000-0000-0000-000000000002', 'Nguyễn Văn Quy',     (SELECT id FROM departments WHERE name='CEVC3'),  28, 12, 56,  2, 'Rising Hero'),
  ('00000000-0000-0000-0000-000000000005', 'Nguyễn Bá Chức',     (SELECT id FROM departments WHERE name='OPD'),    22, 6,  44,  2, 'Rising Hero'),
  -- New Hero (≥10 kudos)
  ('00000000-0000-0000-0000-000000000003', 'Dương Thúy An',      (SELECT id FROM departments WHERE name='CEVC4'),  15, 9,  30,  1, 'New Hero'),
  ('00000000-0000-0000-0000-000000000004', 'Mai Phương Thúy',    (SELECT id FROM departments WHERE name='Design'),  12, 7,  24,  1, 'New Hero'),
  ('00000000-0000-0000-0000-000000000006', 'Nguyễn Hoàng Linh',  (SELECT id FROM departments WHERE name='CEVC1'),  11, 5,  22,  1, 'New Hero'),
  ('00000000-0000-0000-0000-000000000007', 'Lê Kiều Trang',      (SELECT id FROM departments WHERE name='Product'), 10, 4,  20,  1, 'New Hero'),
  -- No badge (<10 kudos)
  ('00000000-0000-0000-0000-000000000009', 'Trần Minh Khoa',     (SELECT id FROM departments WHERE name='Infra'),   7, 15, 14,  0, NULL),
  ('00000000-0000-0000-0000-000000000010', 'Phạm Thị Lan',       (SELECT id FROM departments WHERE name='Engineering'),5,11,10, 0, NULL),
  ('00000000-0000-0000-0000-000000000011', 'Võ Thị Hoa',         (SELECT id FROM departments WHERE name='CEVC2'),   4, 8,  8,   0, NULL),
  ('00000000-0000-0000-0000-000000000012', 'Bùi Văn Thành',      (SELECT id FROM departments WHERE name='CEVC3'),   3, 6,  6,   0, NULL),
  ('00000000-0000-0000-0000-000000000013', 'Nguyễn Thị Thu',     (SELECT id FROM departments WHERE name='OPD'),     2, 4,  4,   0, NULL),
  ('00000000-0000-0000-0000-000000000014', 'Hoàng Văn Đức',      (SELECT id FROM departments WHERE name='CEVC4'),   1, 3,  2,   0, NULL),
  ('00000000-0000-0000-0000-000000000015', 'Trần Thị Mai',       (SELECT id FROM departments WHERE name='Design'),  0, 2,  0,   0, NULL)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- Kudos (30 entries, varied categories, times, counts)
-- ─────────────────────────────────────────────

INSERT INTO kudos (id, sender_id, receiver_id, content, category_id, like_count, created_at) VALUES
  -- High-like kudos (for Highlight carousel top-5)
  ('b0000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000008',
   'Cảm ơn bạn vì sự cống hiến không ngừng nghỉ. Bạn luôn là người đầu tiên đứng ra giải quyết mọi vấn đề và truyền cảm hứng cho cả team. Rất tự hào được làm việc cùng bạn!',
   (SELECT id FROM kudos_categories WHERE name='IDOL GIỚI TRẺ'), 1000, NOW() - INTERVAL '2 hours'),
  ('b0000001-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001',
   'Anh Hiệp ơi, cảm ơn anh đã luôn support em trong suốt dự án. Cách anh handle pressure và dẫn dắt team thật sự rất ấn tượng. Em học được rất nhiều từ anh!',
   (SELECT id FROM kudos_categories WHERE name='TOP TALENT'), 850, NOW() - INTERVAL '3 hours'),
  ('b0000001-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000002',
   'Quy ơi, cảm ơn bạn đã review code của mình rất kỹ càng và tận tâm. Những comment của bạn giúp mình improve rất nhiều. Bạn thật sự là một senior developer tuyệt vời!',
   (SELECT id FROM kudos_categories WHERE name='MVP'), 720, NOW() - INTERVAL '5 hours'),
  ('b0000001-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000003',
   'Chị An ơi, cảm ơn chị đã luôn quan tâm và giúp đỡ em. Design của chị luôn xuất sắc và rất user-friendly. Em rất học hỏi được nhiều điều từ chị!',
   (SELECT id FROM kudos_categories WHERE name='SIGNATURE CREATOR'), 680, NOW() - INTERVAL '6 hours'),
  ('b0000001-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000005',
   'Anh Chức ơi, cảm ơn anh đã dẫn dắt team qua một sprint đầy thử thách. Cách anh manage timeline và communicate với stakeholders rất chuyên nghiệp. Anh là người quản lý mà mọi team member đều tin tưởng!',
   (SELECT id FROM kudos_categories WHERE name='BEST MANAGER'), 610, NOW() - INTERVAL '8 hours'),
  -- Regular kudos
  ('b0000001-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000004',
   'Thúy ơi, cảm ơn bạn đã support mình trong việc onboarding team member mới. Bạn rất kiên nhẫn và tận tâm!',
   (SELECT id FROM kudos_categories WHERE name='TOP TALENT'), 45, NOW() - INTERVAL '10 hours'),
  ('b0000001-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000006',
   'Linh ơi, cảm ơn bạn đã luôn nhiệt tình chia sẻ kiến thức. Bài presentation hôm nay của bạn rất hay và dễ hiểu!',
   (SELECT id FROM kudos_categories WHERE name='IDOL GIỚI TRẺ'), 38, NOW() - INTERVAL '12 hours'),
  ('b0000001-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000007',
   'Trang ơi, cảm ơn bạn đã luôn sẵn lòng giúp đỡ team khi có vấn đề phát sinh. Bạn thật sự là một team player tuyệt vời!',
   (SELECT id FROM kudos_categories WHERE name='MVP'), 29, NOW() - INTERVAL '1 day'),
  ('b0000001-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000009',
   'Khoa ơi, cảm ơn bạn đã xử lý rất nhanh incident hôm qua. Nhờ có bạn mà hệ thống được restore trong thời gian ngắn nhất!',
   (SELECT id FROM kudos_categories WHERE name='TOP PROJECT'), 22, NOW() - INTERVAL '1 day 2 hours'),
  ('b0000001-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000010',
   'Lan ơi, cảm ơn bạn đã luôn deliver đúng deadline và chất lượng rất cao. Bạn là backbone của team!',
   (SELECT id FROM kudos_categories WHERE name='TOP TALENT'), 18, NOW() - INTERVAL '1 day 5 hours'),
  ('b0000001-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000011',
   'Hoa ơi, cảm ơn bạn đã tổ chức buổi team building rất vui và ý nghĩa. Cả team ai cũng thích!',
   (SELECT id FROM kudos_categories WHERE name='IDOL GIỚI TRẺ'), 15, NOW() - INTERVAL '2 days'),
  ('b0000001-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000012',
   'Thành ơi, cảm ơn bạn đã review và góp ý cho design của mình rất constructive. Bạn có cái nhìn rất sắc bén!',
   (SELECT id FROM kudos_categories WHERE name='SIGNATURE CREATOR'), 12, NOW() - INTERVAL '2 days 3 hours'),
  ('b0000001-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000013',
   'Thu ơi, cảm ơn bạn đã luôn positive và mang lại năng lượng tốt cho team mỗi ngày!',
   (SELECT id FROM kudos_categories WHERE name='IDOL GIỚI TRẺ'), 9, NOW() - INTERVAL '3 days'),
  ('b0000001-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000014',
   'Đức ơi, cảm ơn bạn đã troubleshoot rất nhanh vấn đề performance hôm qua. Kỹ năng của bạn thật sự impressive!',
   (SELECT id FROM kudos_categories WHERE name='TOP PROJECT'), 7, NOW() - INTERVAL '3 days 6 hours'),
  ('b0000001-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000015',
   'Mai ơi, cảm ơn bạn đã luôn willing to learn và grow. Bạn tiến bộ rất nhanh và chúng tôi rất tự hào về bạn!',
   (SELECT id FROM kudos_categories WHERE name='TOP TALENT'), 5, NOW() - INTERVAL '4 days'),
  ('b0000001-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000001',
   'Cảm ơn anh Hiệp đã luôn mentor và chỉ bảo tận tình. Anh là nguồn cảm hứng lớn của em!',
   (SELECT id FROM kudos_categories WHERE name='BEST MANAGER'), 65, NOW() - INTERVAL '4 days 2 hours'),
  ('b0000001-0000-0000-0000-000000000017','00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000008',
   'Cảm ơn bạn Xuân đã luôn deliver chất lượng cao và đúng hạn. Team rất tin tưởng bạn!',
   (SELECT id FROM kudos_categories WHERE name='MVP'), 78, NOW() - INTERVAL '5 days'),
  ('b0000001-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000002',
   'Anh Quy ơi, code review của anh luôn rất chi tiết và giúp mình học hỏi rất nhiều. Cảm ơn anh rất nhiều!',
   (SELECT id FROM kudos_categories WHERE name='TOP TALENT'), 42, NOW() - INTERVAL '5 days 4 hours'),
  ('b0000001-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000003',
   'Chị An ơi, UX/UI của chị luôn đẹp và user-friendly. Em học được rất nhiều từ cách chị approach design!',
   (SELECT id FROM kudos_categories WHERE name='SIGNATURE CREATOR'), 33, NOW() - INTERVAL '6 days'),
  ('b0000001-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000005',
   'Anh Chức ơi, cảm ơn anh đã luôn protect team và đấu tranh cho quyền lợi của mọi người. Anh là người manager lý tưởng!',
   (SELECT id FROM kudos_categories WHERE name='BEST MANAGER'), 88, NOW() - INTERVAL '6 days 3 hours'),
  ('b0000001-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000006',
   'Linh ơi, bài demo hôm qua của bạn rất ấn tượng. Client rất hài lòng và đó là nhờ công bạn chuẩn bị kỹ!',
   (SELECT id FROM kudos_categories WHERE name='TOP PROJECT'), 26, NOW() - INTERVAL '7 days'),
  ('b0000001-0000-0000-0000-000000000022','00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000004',
   'Thúy ơi, cách bạn onboard member mới rất professional và thoughtful. Mọi người đều cảm thấy welcome!',
   (SELECT id FROM kudos_categories WHERE name='IDOL GIỚI TRẺ'), 19, NOW() - INTERVAL '7 days 5 hours'),
  ('b0000001-0000-0000-0000-000000000023','00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000007',
   'Trang ơi, cảm ơn bạn đã chia sẻ kiến thức về accessibility trong buổi workshop. Rất bổ ích!',
   (SELECT id FROM kudos_categories WHERE name='TOP TALENT'), 14, NOW() - INTERVAL '8 days'),
  ('b0000001-0000-0000-0000-000000000024','00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000009',
   'Khoa ơi, infrastructure setup của bạn cho project mới rất solid. Zero downtime trong suốt launch!',
   (SELECT id FROM kudos_categories WHERE name='TOP PROJECT'), 31, NOW() - INTERVAL '8 days 2 hours'),
  ('b0000001-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000008',
   'Xuân ơi, cảm ơn bạn đã luôn bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của bạn đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3',
   (SELECT id FROM kudos_categories WHERE name='IDOL GIỚI TRẺ'), 920, NOW() - INTERVAL '1 hour'),
  ('b0000001-0000-0000-0000-000000000026','00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000001',
   'Anh Hiệp ơi, technical leadership của anh trong project Q1 xuất sắc lắm. Team deliver được vì có anh!',
   (SELECT id FROM kudos_categories WHERE name='TOP PROJECT'), 55, NOW() - INTERVAL '9 days'),
  ('b0000001-0000-0000-0000-000000000027','00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000002',
   'Quy ơi, architecture design cho microservices của bạn rất elegant. Cả team đều học được nhiều từ bạn!',
   (SELECT id FROM kudos_categories WHERE name='MVP'), 47, NOW() - INTERVAL '9 days 3 hours'),
  ('b0000001-0000-0000-0000-000000000028','00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000003',
   'Chị An ơi, prototype của chị làm khách hàng WOW từ cái nhìn đầu tiên. Rất proud chị!',
   (SELECT id FROM kudos_categories WHERE name='SIGNATURE CREATOR'), 37, NOW() - INTERVAL '10 days'),
  ('b0000001-0000-0000-0000-000000000029','00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000005',
   'Anh Chức ơi, cảm ơn anh đã luôn defend cho technical debt reduction. Codebase ngày càng clean hơn nhờ anh!',
   (SELECT id FROM kudos_categories WHERE name='BEST MANAGER'), 62, NOW() - INTERVAL '10 days 4 hours'),
  ('b0000001-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000006',
   'Linh ơi, cảm ơn bạn đã luôn document mọi thứ rất kỹ. New joiners đều rất appreciate bạn!',
   (SELECT id FROM kudos_categories WHERE name='TOP TALENT'), 11, NOW() - INTERVAL '11 days')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- Kudos ↔ Hashtags
-- ─────────────────────────────────────────────

INSERT INTO kudos_to_hashtags (kudos_id, hashtag_id)
SELECT k.id, h.id FROM (VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Dedicated'),
  ('b0000001-0000-0000-0000-000000000001', 'Inspiring'),
  ('b0000001-0000-0000-0000-000000000001', 'BE PROFESSIONAL'),
  ('b0000001-0000-0000-0000-000000000002', 'High-performing'),
  ('b0000001-0000-0000-0000-000000000003', 'BE A TEAM'),
  ('b0000001-0000-0000-0000-000000000003', 'Dedicated'),
  ('b0000001-0000-0000-0000-000000000004', 'THINK OUTSIDE THE BOX'),
  ('b0000001-0000-0000-0000-000000000005', 'High-performing'),
  ('b0000001-0000-0000-0000-000000000005', 'BE PROFESSIONAL'),
  ('b0000001-0000-0000-0000-000000000006', 'BE A TEAM'),
  ('b0000001-0000-0000-0000-000000000007', 'Inspiring'),
  ('b0000001-0000-0000-0000-000000000008', 'BE OPTIMISTIC'),
  ('b0000001-0000-0000-0000-000000000009', 'GET RISKY'),
  ('b0000001-0000-0000-0000-000000000010', 'High-performing'),
  ('b0000001-0000-0000-0000-000000000016', 'Inspiring'),
  ('b0000001-0000-0000-0000-000000000016', 'BE PROFESSIONAL'),
  ('b0000001-0000-0000-0000-000000000017', 'Dedicated'),
  ('b0000001-0000-0000-0000-000000000020', 'High-performing'),
  ('b0000001-0000-0000-0000-000000000025', 'Dedicated'),
  ('b0000001-0000-0000-0000-000000000025', 'Inspiring'),
  ('b0000001-0000-0000-0000-000000000025', 'BE PROFESSIONAL'),
  ('b0000001-0000-0000-0000-000000000025', 'BE A TEAM'),
  ('b0000001-0000-0000-0000-000000000026', 'High-performing'),
  ('b0000001-0000-0000-0000-000000000027', 'THINK OUTSIDE THE BOX'),
  ('b0000001-0000-0000-0000-000000000029', 'BE PROFESSIONAL')
) AS vals(kid, hname)
JOIN kudos k ON k.id = vals.kid::UUID
JOIN kudos_hashtags h ON h.name = vals.hname
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- Kudos likes (distributed across users)
-- top-5 kudos by like_count already set above
-- ─────────────────────────────────────────────

INSERT INTO kudos_likes (kudos_id, user_id, hearts_added) VALUES
  ('b0000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001',1),
  ('b0000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002',1),
  ('b0000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003',1),
  ('b0000001-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003',1),
  ('b0000001-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000004',1),
  ('b0000001-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001',1),
  ('b0000001-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000005',1),
  ('b0000001-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000006',1),
  ('b0000001-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000007',1),
  ('b0000001-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000008',1),
  ('b0000001-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000009',1),
  ('b0000001-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000010',1),
  ('b0000001-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000001',1),
  ('b0000001-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000002',1),
  ('b0000001-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000003',2),
  ('b0000001-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000009',1),
  ('b0000001-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000010',1),
  ('b0000001-0000-0000-0000-000000000017','00000000-0000-0000-0000-000000000011',1),
  ('b0000001-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000012',1),
  ('b0000001-0000-0000-0000-000000000029','00000000-0000-0000-0000-000000000013',1)
ON CONFLICT (kudos_id, user_id) DO NOTHING;

-- ─────────────────────────────────────────────
-- Secret boxes (for demo user 00000000-...-0001)
-- ─────────────────────────────────────────────

INSERT INTO secret_boxes (user_id, is_opened, prize_description, opened_at) VALUES
  ('00000000-0000-0000-0000-000000000001', true,  'Áo phông SAA 2025 limited edition', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000001', true,  'Voucher Grab 200k', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000000000001', false, 'Bí ẩn — chưa mở', NULL),
  ('00000000-0000-0000-0000-000000000008', true,  'Cúp kỷ niệm SAA 2025', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000008', false, 'Bí ẩn — chưa mở', NULL),
  ('00000000-0000-0000-0000-000000000008', false, 'Bí ẩn — chưa mở', NULL),
  ('00000000-0000-0000-0000-000000000002', false, 'Bí ẩn — chưa mở', NULL),
  ('00000000-0000-0000-0000-000000000005', true,  'Thẻ quà FPT Play', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- Prize recipients (D.3 sidebar list)
-- ─────────────────────────────────────────────

INSERT INTO prize_recipients (user_id, prize_description, received_at) VALUES
  ('00000000-0000-0000-0000-000000000008', 'Nhận được 1 áo phông SAA', NOW() - INTERVAL '30 minutes'),
  ('00000000-0000-0000-0000-000000000001', 'Nhận được voucher Grab 200k', NOW() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0000-000000000005', 'Nhận được cúp kỷ niệm SAA 2025', NOW() - INTERVAL '4 hours'),
  ('00000000-0000-0000-0000-000000000002', 'Nhận được thẻ quà Shopee 500k', NOW() - INTERVAL '6 hours'),
  ('00000000-0000-0000-0000-000000000003', 'Nhận được headphone Sony WH-1000XM5', NOW() - INTERVAL '8 hours')
ON CONFLICT DO NOTHING;
