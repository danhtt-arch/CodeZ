Product Requirements Document (PRD)

Dự án: CodeZ Academy - Nền tảng học lập trình trực tuyến
Người viết: Product Manager
Ngày cập nhật: 12/10/2026
Trạng thái: Draft

1. Tổng quan dự án (Project Overview)

CodeZ Academy là một nền tảng học trực tuyến chuyên cung cấp các khóa học lập trình từ cơ bản đến nâng cao. Mục tiêu của dự án là tạo ra một môi trường học tập dễ sử dụng, giúp người học dễ dàng tiếp cận kiến thức công nghệ thông tin, theo dõi tiến độ và nâng cao kỹ năng thực chiến.

1.1. Mục tiêu kinh doanh

Xây dựng nền tảng vững chắc với các tính năng cốt lõi (MVP) để nhanh chóng ra mắt thị trường.

Thu hút 1000 học viên đăng ký trong 3 tháng đầu tiên.

1.2. Đối tượng người dùng

Học viên: Sinh viên, người đi làm muốn chuyển ngành, hoặc lập trình viên muốn nâng cao kỹ năng.

Admin/Giảng viên: Người quản lý nội dung và các khóa học.

2. Các tính năng chính (Key Features)

Dưới đây là các tính năng cốt lõi cho giai đoạn phát triển đầu tiên (Phase 1).

2.1. Xem khóa học (View Courses)

Mô tả: Người dùng (chưa đăng nhập hoặc đã đăng nhập) đều có thể xem danh sách các khóa học hiện có và xem chi tiết từng khóa học.

Yêu cầu chi tiết:

Hiển thị danh sách khóa học dưới dạng Grid/List kèm ảnh cover, tên khóa học, giảng viên, và giá tiền.

Trang chi tiết khóa học hiển thị: Mô tả, nội dung giáo trình (syllabus), yêu cầu đầu vào, và kết quả đạt được.

Có chức năng tìm kiếm và lọc khóa học theo danh mục (Frontend, Backend, Mobile...).

2.2. Đăng ký khóa học (Enroll/Register)

Mô tả: Học viên có thể ghi danh vào một khóa học cụ thể.

Yêu cầu chi tiết:

Nút Call-to-Action (CTA) "Đăng ký ngay" hiển thị nổi bật trên trang chi tiết khóa học.

Nếu người dùng chưa đăng nhập, hệ thống yêu cầu đăng nhập/đăng ký tài khoản.

Sau khi đăng ký thành công, khóa học sẽ được thêm vào danh sách "Khóa học của tôi" (My Courses).

Cập nhật trạng thái nút bấm thành "Tiếp tục học".

2.3. Hủy đăng ký khóa học (Unenroll/Unregister)

Mô tả: Học viên có thể hủy ghi danh khỏi một khóa học miễn phí hoặc yêu cầu hoàn tiền (đối với khóa học trả phí theo chính sách).

Yêu cầu chi tiết:

Tính năng nằm trong khu vực quản lý "Khóa học của tôi" hoặc trang chi tiết của khóa học đang tham gia.

Có popup xác nhận (Confirmation) trước khi hủy để tránh thao tác nhầm: "Bạn có chắc chắn muốn hủy đăng ký khóa học này không? Tiến trình học của bạn sẽ bị xóa."

Sau khi hủy thành công, hệ thống gỡ khóa học khỏi danh sách của học viên và làm mới trạng thái nút CTA.