-- =============================================
-- Cập nhật danh mục theo địa lý TP.HCM
-- Chạy trong Supabase SQL Editor
-- =============================================

-- 1. Xoá danh mục bài viết cũ (giữ danh mục dự án)
delete from danh_muc where loai = 'bai-viet';

-- 2. Thêm danh mục địa lý mới
insert into danh_muc (ten, slug, loai, mo_ta, thu_tu) values
  ('Khu Đông HCM',          'khu-dong',            'bai-viet', 'TP. Thủ Đức, Quận 2, Quận 9 — trung tâm BDS cao cấp phía Đông', 1),
  ('Khu Nam HCM',           'khu-nam',             'bai-viet', 'Quận 7, Nhà Bè, Bình Chánh — khu đô thị kiểu mẫu Phú Mỹ Hưng', 2),
  ('Khu Tây HCM',           'khu-tay',             'bai-viet', 'Bình Tân, Tân Phú, Bình Chánh — thị trường dân số đông, giá vừa tầm', 3),
  ('Khu Bắc HCM',           'khu-bac',             'bai-viet', 'Gò Vấp, Bình Thạnh, Tân Bình, Quận 12 — khu vực phát triển nhanh', 4),
  ('Phân Tích Thị Trường',  'phan-tich-thi-truong','bai-viet', 'Xu hướng giá, lãi suất, quy hoạch và chính sách BDS', 5),
  ('Kinh Nghiệm & Pháp Lý', 'kinh-nghiem-phap-ly', 'bai-viet', 'Hướng dẫn mua nhà, thủ tục pháp lý, vay vốn ngân hàng', 6);

-- 3. Gán lại danh mục cho 9 bài viết hiện có
-- Khu Đông: The Global City, Lumière, MT Eastmark, Eaton Park, Masteri Centre Point, Biệt thự Thảo Điền
update bai_viet set danh_muc_id = (select id from danh_muc where slug = 'khu-dong')
where slug in (
  'the-global-city-hinh-anh-thuc-te-canal-festive',
  'cat-noc-thap-cuoi-lumiere-riverside',
  'phap-ly-mt-eastmark-city',
  'eaton-park-mo-ban-giai-doan-tiep-theo',
  'tieu-chuan-ban-giao-masteri-centre-point-thuc-te',
  'su-giao-thoa-bong-do-anh-sang-biet-thu-thao-dien'
);

-- Phân Tích Thị Trường: Vành đai 3, Lãi suất, Mảng xanh
update bai_viet set danh_muc_id = (select id from danh_muc where slug = 'phan-tich-thi-truong')
where slug in (
  'vanh-dai-3-tphcm-dong-luc-chung-cu-vung-ven',
  'lai-suat-vay-mua-nha-ha-nhiet-thoi-diem-vang',
  'mang-xanh-du-an-xu-huong-tat-yeu-can-ho-the-he-moi'
);

-- 4. Kiểm tra
select d.ten as danh_muc, count(b.id) as so_bai
from danh_muc d
left join bai_viet b on b.danh_muc_id = d.id
where d.loai = 'bai-viet'
group by d.ten, d.thu_tu
order by d.thu_tu;
