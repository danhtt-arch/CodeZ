Design System & Layout Guideline

Dự án: CodeZ Academy
Mục đích: Định hướng thiết kế UI/UX và bố cục Frontend

1. Màu sắc chủ đạo (Color Palette)

Hệ thống sử dụng bộ 3 màu sắc tối giản, chuyên nghiệp và mang đậm tính công nghệ.

Màu chính (Primary): Xanh dương (Blue)

Hex: #0056D2 (Xanh đậm) / #2563EB (Xanh sáng)

Mục đích: Dùng cho các nút Call-to-Action (Đăng ký, Đăng nhập), các link liên kết, và các điểm nhấn thương hiệu (Brand identity).

Màu nền (Background): Trắng (White)

Hex: #FFFFFF (Trắng tinh) / #F8FAFC (Trắng xám nhẹ)

Mục đích: Màu nền chủ đạo cho toàn bộ website, tạo cảm giác sạch sẽ, rộng rãi và dễ đọc (White-space).

Màu chữ & Nhấn (Text & Accents): Đen (Black / Dark Gray)

Hex: #0F172A (Đen xám) / #333333

Mục đích: Dùng cho tiêu đề (Headings), văn bản (Body text) và nền footer.

2. Font chữ (Typography)

Sử dụng các font chữ Sans-serif hiện đại, dễ đọc trên màn hình điện tử (Lấy từ Google Fonts).

Heading Font (Tiêu đề): Montserrat hoặc Inter

Đặc điểm: Đậm, rõ nét, dùng cho H1, H2, H3.

Body Font (Văn bản thường): Roboto hoặc Open Sans

Đặc điểm: Dễ đọc, thoáng, dùng cho các đoạn văn bản mô tả, danh sách, nội dung bài học.

3. Bố cục các trang (Page Layouts)

3.1. Trang Chủ (Homepage)

Header: Logo (trái), Thanh điều hướng (Giới thiệu, Khóa học, Blog), Nút "Đăng nhập/Đăng ký" (phải).

Hero Banner:

Tiêu đề lớn: "Bắt đầu hành trình trở thành Lập trình viên chuyên nghiệp".

Sub-text mô tả ngắn gọn.

Nút CTA chính: "Khám phá khóa học" (Màu xanh dương).

Video Giới thiệu (Embedded Youtube):

Section chứa iframe video giới thiệu về CodeZ Academy.

Ví dụ mã nhúng:

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" title="CodeZ Academy Intro" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>


Section Khóa học nổi bật: Hiển thị 3-4 Card khóa học nổi bật nhất (Ảnh, Tên, Giá, Nút Đăng ký nhanh).

Footer: Màu đen, chứa các thông tin liên hệ, Links hỗ trợ, và Copyright.

3.2. Trang Về Chúng Tôi (About Us)

Header: (Giữ nguyên cấu trúc chung).

Section Câu chuyện thương hiệu: Hình ảnh đội ngũ và đoạn văn bản chia sẻ về tầm nhìn, sứ mệnh của CodeZ Academy.

Section Đội ngũ Giảng viên:

Bố cục dạng Grid (lưới).

Mỗi item gồm: Avatar (tròn), Tên giảng viên, Chức danh, Mô tả ngắn gọn về kinh nghiệm.

Footer: (Giữ nguyên cấu trúc chung).

3.3. Trang Chi tiết Khóa học (Course Detail)

Header: (Giữ nguyên cấu trúc chung).

Breadcrumb: Trang chủ > Khóa học > [Tên khóa học]

Section Tổng quan (Top):

Chia 2 cột:

Cột trái (70%): Tên khóa học (H1), Mô tả ngắn, Đánh giá (Số sao), Tên giảng viên.

Cột phải (30% - Sticky Card): Video/Ảnh cover khóa học, Giá tiền, Nút CTA lớn "Đăng ký ngay" (hoặc "Hủy đăng ký" nếu đã tham gia), Các lợi ích bao gồm (VD: Truy cập trọn đời, Cấp chứng chỉ).

Section Nội dung chi tiết (Bottom):

Tab 1: Tổng quan: Yêu cầu đầu vào, Những gì sẽ học được (Bullet points).

Tab 2: Giáo trình (Syllabus): Danh sách các chương và bài học (dạng Accordion đóng/mở).

Tab 3: Đánh giá: Review của học viên cũ.

Footer: (Giữ nguyên cấu trúc chung).