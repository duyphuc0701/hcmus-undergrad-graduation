# 🎓 Thiệp Mời Lễ Tốt Nghiệp — Nguyễn Duy Phúc

Trang web thiệp mời dự Lễ Tốt Nghiệp Đại học (1-page static web app), tối ưu cho cả điện thoại và máy tính, sẵn sàng deploy lên **GitHub Pages**.

## 📌 Thông tin sự kiện
- **Tân Cử Nhân:** Nguyễn Duy Phúc
- **Thời gian:** 11:00 – 13:00, Thứ Năm ngày 26/11/2026
- **Địa điểm:** Trường Đại học Khoa học Tự nhiên, Cơ sở 1 (227 Nguyễn Văn Cừ, Phường Chợ Quán, TP.HCM)
- **Liên hệ:** 0936 197 861

## ✨ Tính năng nổi bật
1. **Hiệu ứng mở phong bì & pháo giấy (Confetti):** Tạo cảm giác trang trọng và vui tươi ngay khi khách mời mở thiệp.
2. **Cá nhân hóa tên khách mời qua URL (`?to=...`):**
   - Nút **"✉️ Tạo link mời"** ở góc phải dưới giúp tạo nhanh link riêng cho từng người (ví dụ: `?to=Bạn+Minh` hoặc `?to=Anh+Tuấn`).
3. **Đồng hồ đếm ngược thời gian thực:** Đếm ngược từng giây đến `11:00 ngày 26/11/2026`.
4. **Thêm nhanh vào Lịch:** Hỗ trợ thêm 1 chạm vào **Google Calendar** hoặc tải file `.ics` cho Apple Calendar / Outlook.
5. **Bản đồ Google Maps & Hướng dẫn gửi xe:** Tích hợp bản đồ trực tiếp tại 227 Nguyễn Văn Cừ kèm chỉ dẫn cổng vào.
6. **Liên hệ 1 chạm:** Gọi điện trực tiếp (`tel:0936197861`), nhắn Zalo, hoặc sao chép số điện thoại / địa chỉ.

## 🚀 Hướng dẫn Deploy lên GitHub Pages

```bash
git add .
git commit -m "Initial graduation invitation web app"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

Sau khi push lên GitHub:
1. Vào repository trên GitHub -> **Settings** -> **Pages**.
2. Tại mục **Build and deployment** -> **Source**, chọn **Deploy from a branch**.
3. Chọn nhánh `main` (hoặc `master`) và thư mục `/ (root)`, nhấn **Save**.
4. Sau khoảng 1 phút, trang thiệp mời sẽ hoạt động tại: `https://<username>.github.io/<repo-name>/`
