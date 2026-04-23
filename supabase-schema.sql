-- =============================================
-- NGUOITREXAYNHA - Supabase Schema
-- Chạy file này trong Supabase SQL Editor
-- =============================================

-- Bật extension uuid
create extension if not exists "uuid-ossp";

-- Xoá bảng cũ nếu có (đúng thứ tự để tránh lỗi foreign key)
drop table if exists bai_viet cascade;
drop table if exists du_an cascade;
drop table if exists banners cascade;
drop table if exists menu_items cascade;
drop table if exists lien_he cascade;
drop table if exists cau_hinh cascade;
drop table if exists danh_muc cascade;

-- =============================================
-- 1. DANH MỤC (Categories)
-- =============================================
create table danh_muc (
  id uuid primary key default uuid_generate_v4(),
  ten text not null,
  slug text not null unique,
  mo_ta text,
  loai text check (loai in ('bai-viet', 'du-an', 'chung')) default 'chung',
  thu_tu int default 0,
  created_at timestamptz default now()
);

-- =============================================
-- 2. BÀI VIẾT
-- =============================================
create table bai_viet (
  id uuid primary key default uuid_generate_v4(),
  tieu_de text not null,
  slug text not null unique,
  mo_ta text,
  noi_dung text,
  anh_dai_dien text,
  tac_gia text default 'Admin',
  danh_muc_id uuid references danh_muc(id) on delete set null,
  tags text[] default '{}',
  trang_thai text check (trang_thai in ('nhap', 'xuat-ban')) default 'nhap',
  luot_xem int default 0,
  thu_tu_noi_bat int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);

-- =============================================
-- 3. DỰ ÁN
-- =============================================
create table du_an (
  id uuid primary key default uuid_generate_v4(),
  ten text not null,
  slug text not null unique,
  mo_ta text,
  noi_dung text,
  anh_dai_dien text,
  anh_gallery text[] default '{}',
  dia_chi text,
  quan_huyen text,
  thanh_pho text,
  dien_tich text,
  so_tang text,
  nam_hoan_thanh text,
  gia_tu text,
  danh_muc_id uuid references danh_muc(id) on delete set null,
  tags text[] default '{}',
  trang_thai text check (trang_thai in ('nhap', 'xuat-ban', 'hoan-thanh')) default 'nhap',
  noi_bat boolean default false,
  thu_tu int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- 4. BANNERS (trang chủ)
-- =============================================
create table banners (
  id uuid primary key default uuid_generate_v4(),
  tieu_de text,
  mo_ta text,
  anh text not null,
  duong_dan text,
  vi_tri text check (vi_tri in ('trang-chu', 'bai-viet', 'du-an')) default 'trang-chu',
  thu_tu int default 0,
  kich_hoat boolean default true,
  created_at timestamptz default now()
);

-- =============================================
-- 5. MENU
-- =============================================
create table menu_items (
  id uuid primary key default uuid_generate_v4(),
  ten text not null,
  duong_dan text not null,
  parent_id uuid references menu_items(id) on delete cascade,
  vi_tri text check (vi_tri in ('header', 'footer')) default 'header',
  thu_tu int default 0,
  kich_hoat boolean default true,
  created_at timestamptz default now()
);

-- =============================================
-- 6. LIÊN HỆ (Contact form submissions)
-- =============================================
create table lien_he (
  id uuid primary key default uuid_generate_v4(),
  ho_ten text not null,
  email text,
  so_dien_thoai text,
  chu_de text,
  noi_dung text not null,
  da_doc boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- 7. CẤU HÌNH WEBSITE
-- =============================================
create table cau_hinh (
  id uuid primary key default uuid_generate_v4(),
  khoa text not null unique,
  gia_tri text,
  mo_ta text,
  nhom text default 'chung'
);

-- Dữ liệu mặc định
insert into cau_hinh (khoa, gia_tri, mo_ta, nhom) values
  ('ten_website', 'Người Trẻ Xây Nhà', 'Tên website', 'chung'),
  ('mo_ta_website', 'Nền tảng kết nối người trẻ với giải pháp nhà ở thông minh', 'Mô tả website', 'chung'),
  ('logo', '', 'URL logo', 'chung'),
  ('favicon', '', 'URL favicon', 'chung'),
  ('email_lien_he', '', 'Email liên hệ', 'lien-he'),
  ('so_dien_thoai', '', 'Số điện thoại', 'lien-he'),
  ('dia_chi', '', 'Địa chỉ văn phòng', 'lien-he'),
  ('facebook', '', 'Link Facebook', 'mang-xa-hoi'),
  ('instagram', '', 'Link Instagram', 'mang-xa-hoi'),
  ('youtube', '', 'Link YouTube', 'mang-xa-hoi'),
  ('zalo', '', 'Số Zalo', 'mang-xa-hoi'),
  ('google_analytics', '', 'Google Analytics ID', 'seo'),
  ('meta_keywords', '', 'Meta keywords mặc định', 'seo');

-- Menu mặc định
insert into menu_items (ten, duong_dan, vi_tri, thu_tu) values
  ('Trang chủ', '/', 'header', 1),
  ('Dự án', '/du-an', 'header', 2),
  ('Bài viết', '/bai-viet', 'header', 3),
  ('Liên hệ', '/lien-he', 'header', 4),
  ('Về chúng tôi', '/gioi-thieu', 'footer', 1),
  ('Chính sách bảo mật', '/chinh-sach-bao-mat', 'footer', 2);

-- Danh mục mặc định
insert into danh_muc (ten, slug, loai, thu_tu) values
  ('Kiến trúc đương đại', 'kien-truc-duong-dai', 'bai-viet', 1),
  ('Nội thất', 'noi-that', 'bai-viet', 2),
  ('Vật liệu xây dựng', 'vat-lieu-xay-dung', 'bai-viet', 3),
  ('Kinh nghiệm xây nhà', 'kinh-nghiem-xay-nha', 'bai-viet', 4),
  ('Nhà phố', 'nha-pho', 'du-an', 1),
  ('Biệt thự', 'biet-thu', 'du-an', 2),
  ('Căn hộ', 'can-ho', 'du-an', 3),
  ('Nhà vườn', 'nha-vuon', 'du-an', 4);

-- =============================================
-- Storage bucket cho ảnh
-- =============================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Policies (xoá cũ trước nếu có)
drop policy if exists "Public read media" on storage.objects;
drop policy if exists "Auth upload media" on storage.objects;
drop policy if exists "Auth update media" on storage.objects;
drop policy if exists "Auth delete media" on storage.objects;

create policy "Public read media" on storage.objects
  for select using (bucket_id = 'media');

create policy "Auth upload media" on storage.objects
  for insert with check (bucket_id = 'media');

create policy "Auth update media" on storage.objects
  for update using (bucket_id = 'media');

create policy "Auth delete media" on storage.objects
  for delete using (bucket_id = 'media');

-- =============================================
-- Auto-update updated_at
-- =============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists bai_viet_updated_at on bai_viet;
drop trigger if exists du_an_updated_at on du_an;

create trigger bai_viet_updated_at
  before update on bai_viet
  for each row execute function update_updated_at();

create trigger du_an_updated_at
  before update on du_an
  for each row execute function update_updated_at();
