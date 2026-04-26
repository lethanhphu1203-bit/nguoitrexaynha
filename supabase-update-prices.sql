-- =============================================
-- Cập nhật giá chính xác cho 8 dự án (T4/2026)
-- Nguồn: batdongsan.com.vn, infocanho.com, empirecityvn.com
-- =============================================

-- 1. The Global City (Masterise Homes)
update du_an set
  gia_tu = '120 - 180 tr/m²',
  mo_ta  = 'Đại đô thị phức hợp 117ha tại An Phú - TP. Thủ Đức. Căn hộ từ 120-150 tr/m², các căn view trung tâm và nhạc nước lên đến 170-180 tr/m². Masteri Grand View CT7 là phân khu mới nhất hiện đang mở bán.',
  dia_chi = 'Xa lộ Hà Nội, Phường An Phú',
  quan_huyen = 'TP. Thủ Đức',
  thanh_pho = 'TP. Hồ Chí Minh'
where slug = 'the-global-city';

-- 2. Lumière Riverside (Masterise Homes)
update du_an set
  gia_tu = '105 - 110 tr/m²',
  mo_ta  = 'Căn hộ cao cấp phong cách Pháp tại Thảo Điền. Giá thị trường thứ cấp hiện từ 105-110 tr/m². Căn 1PN từ 7 tỷ, căn 2PN từ 10-12 tỷ tùy view. Đã bàn giao, sổ hồng từng căn.',
  dia_chi = 'Xa lộ Hà Nội, Phường An Phú',
  quan_huyen = 'TP. Thủ Đức',
  thanh_pho = 'TP. Hồ Chí Minh'
where slug = 'lumiere-riverside';

-- 3. Empire City (Keppel Land)
update du_an set
  gia_tu = '183 - 283 tr/m²',
  mo_ta  = 'Tổ hợp đa năng biểu tượng tại Thủ Thiêm. Giá căn hộ 183-283 tr/m², tăng mạnh trong 2025. Tilia Residences 1PN từ 10.8 tỷ; Cove Residences 2PN từ 21 tỷ. Tháp 88 tầng dự kiến cao nhất Việt Nam.',
  dia_chi = 'Khu đô thị mới Thủ Thiêm',
  quan_huyen = 'TP. Thủ Đức',
  thanh_pho = 'TP. Hồ Chí Minh'
where slug = 'empire-city';

-- 4. The River Thu Thiem (Refico)
update du_an set
  gia_tu = '140 - 200 tr/m²',
  mo_ta  = 'Căn hộ luxury mặt tiền sông Sài Gòn tại Thủ Thiêm. Giá thứ cấp 140-180 tr/m², các căn river view private elevator lên tới 200 tr/m². 3 tháp (12-18 tầng), 525 căn. Đã bàn giao từ 2022.',
  dia_chi = 'Khu đô thị mới Thủ Thiêm',
  quan_huyen = 'TP. Thủ Đức',
  thanh_pho = 'TP. Hồ Chí Minh'
where slug = 'the-river-thu-thiem';

-- 5. D'Edge Thao Dien (CapitaLand)
update du_an set
  gia_tu = '95 - 157 tr/m²',
  mo_ta  = 'Căn hộ boutique 22 tầng tại Thảo Điền do CapitaLand phát triển. Giá thứ cấp 95-157 tr/m² tùy tầng và view. Căn 2PN (90-93m²) từ 12 tỷ; căn 3PN river view từ 21 tỷ. Hồ bơi tràn bờ tầng thượng.',
  dia_chi = 'Nguyễn Văn Hưởng, Phường Thảo Điền',
  quan_huyen = 'TP. Thủ Đức',
  thanh_pho = 'TP. Hồ Chí Minh'
where slug = 'dedge-thao-dien';

-- 6. The Metropole Thu Thiem (SonKim Land)
update du_an set
  gia_tu = '250 - 360 tr/m²',
  mo_ta  = 'Tổ hợp căn hộ hạng sang tại trung tâm Thủ Thiêm, view trực diện Q.1 và sông Sài Gòn. Giá tăng 72.7% trong năm 2025, hiện phổ biến ~360 tr/m². Phase 4 (The OpusK) từ 10.000 USD/m². Gồm 4 phân khu: The Opera, The Crest, The Galleria, The OpusK.',
  dia_chi = '33 Trần Bạch Đằng, Khu đô thị mới Thủ Thiêm',
  quan_huyen = 'TP. Thủ Đức',
  thanh_pho = 'TP. Hồ Chí Minh'
where slug = 'the-metropole-thu-thiem';

-- 7. Eaton Park (Gamuda Land)
update du_an set
  gia_tu = '125 - 145 tr/m²',
  mo_ta  = 'Căn hộ chuẩn Singapore tại mặt tiền Mai Chí Thọ, TP. Thủ Đức. Giá 125-145 tr/m² (~5.000-5.800 USD/m²). Căn 1PN (55m²) từ 5.5 tỷ; 2PN (76m²) từ 7.5 tỷ; 3PN (105m²) từ 12 tỷ. Mật độ cây xanh 70%, 2.400 căn.',
  dia_chi = 'Mai Chí Thọ, Phường An Phú',
  quan_huyen = 'TP. Thủ Đức',
  thanh_pho = 'TP. Hồ Chí Minh'
where slug = 'eaton-park';

-- 8. Masteri Centre Point (Masterise Homes)
update du_an set
  gia_tu = '50 - 68 tr/m²',
  mo_ta  = 'Căn hộ thông minh tại trung tâm Vinhomes Grand Park, Quận 9. Giá thứ cấp 50-68 tr/m². Căn 1PN từ 3.5 tỷ; căn 2PN (72m²) từ 4-4.9 tỷ. Tích hợp Smart Home, kết nối Vành đai 2 và cao tốc Long Thành.',
  dia_chi = 'Nguyễn Xiển - Long Thạnh Mỹ',
  quan_huyen = 'Quận 9',
  thanh_pho = 'TP. Hồ Chí Minh'
where slug = 'masteri-centre-point';

-- Kiểm tra kết quả
select ten, gia_tu, quan_huyen, thanh_pho from du_an order by thu_tu;
