# CodeZ Academy

Website học lập trình trực tuyến: HTML + Tailwind CSS (CDN) + JavaScript thuần, backend là Supabase (Postgres + Auth). Không cần build.

## Cấu trúc

```
index.html          Trang chủ (hero, video, khóa học nổi bật đọc từ Supabase)
about.html          Về chúng tôi (tầm nhìn, sứ mệnh, giảng viên, Google Map)
detail.html         Khóa học: xem danh sách, đăng ký, hủy đăng ký, "Khóa học của tôi"
login.html          Đăng nhập (Supabase Auth)
register.html       Tạo tài khoản (Supabase Auth)
js/app.js           Dùng chung: cấu hình Supabase, navbar, footer, trạng thái đăng nhập, tiện ích
js/tailwind-config.js  Màu sắc và font theo DESIGN.md
css/style.css       CSS dùng chung (logo, ô nhập, khung video/map)
images/logo.png     Logo
supabase-setup.sql  Tạo bảng, RLS, dữ liệu mẫu
PRD.md, DESIGN.md   Yêu cầu sản phẩm và hướng dẫn thiết kế
```

Navbar và footer chỉ viết một lần trong `js/app.js` và được chèn vào `<div id="site-header">` / `<div id="site-footer">` của từng trang. Muốn thêm mục menu thì sửa mảng `NAV` trong file đó.

## Chạy trên máy

Mở bằng server tĩnh (video YouTube và email xác nhận cần địa chỉ `http://`, không chạy tốt với `file://`):

```bash
python -m http.server 5500
```

Rồi mở `http://localhost:5500`.

## Thiết lập Supabase (làm một lần)

1. **Chạy SQL:** Supabase Dashboard > SQL Editor > dán toàn bộ `supabase-setup.sql` > Run. File chạy lại nhiều lần vẫn an toàn.
2. **Cấu hình Auth** (Dashboard > Authentication):
   - *URL Configuration > Site URL*: đặt địa chỉ web của bạn (khi thử trên máy: `http://localhost:5500`). Thêm cùng địa chỉ vào *Redirect URLs*. Nếu không, link trong email xác nhận sẽ dẫn tới địa chỉ mặc định không tồn tại.
   - *Sign In / Providers > Email*: mặc định bật "Confirm email" (người dùng phải bấm link trong email). Khi thử nghiệm có thể tắt để đăng ký xong dùng được ngay.
3. **Cấu hình khóa:** `SUPABASE_URL` và `SUPABASE_ANON_KEY` nằm đầu file `js/app.js`. Chỉ dùng khóa `anon`/publishable. Không bao giờ đưa Database password hay khóa `service_role` vào mã chạy ở trình duyệt.

## Luồng chức năng

| Chức năng | Cách hoạt động |
|---|---|
| Xem khóa học | `select` bảng `courses` (trang chủ lấy 3 khóa đầu; `detail.html` lấy tất cả) |
| Đăng ký khóa học | Form trên `detail.html`, `insert` vào `registrations`, trả về **Mã ID đăng ký**. Nếu đã đăng nhập, đăng ký được gắn với tài khoản (`user_id`) |
| Hủy đăng ký | Nhập Mã ID ở `detail.html`, hoặc bấm "Hủy đăng ký" trong mục "Khóa học của tôi" (có hộp xác nhận) |
| Tài khoản | `login.html` / `register.html`; tên người dùng và nút Đăng xuất hiện trên navbar |

## Lưu ý bảo mật

Policy mặc định trong `supabase-setup.sql` là bản demo: ai biết mã ID đều hủy được đăng ký, và danh sách đăng ký (họ tên, số điện thoại) đọc được công khai. Trước khi mở cho người dùng thật, hãy dùng phiên bản chặt chẽ được ghi chú ngay trong file SQL.
