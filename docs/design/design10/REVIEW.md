# DESIGN-10 review

Phạm vi: parent visual/functional review, không phải user study hay review chuyên gia độc lập.

Taste editorial-greeting seed 1026, không redraw. Brief tự soạn trong quyền sáng tạo user đã giao. Scope adapts to learning app: typography/font tiếng Việt và controls tối thiểu 44px ưu tiên; home có tiêu đề mời học lớn, không phải admin dashboard. Không tạo ảnh stock để đạt quota. Scroll Craft working surface: không pin/scroll hijack; một đỉnh tương tác request, ba khu vực còn lại phục vụ vào học/chơi.

Vòng 1: hero có thứ bậc rõ, CTA đầu trang và hệ thống tương tác; Game có lối riêng trên mobile/desktop. Ba vấn đề: hình 3D nhỏ, bài ở home chia ba cột quá hẹp, chú thích cũ 9–10px. Đã kéo camera gần, chuyển home sang hai cột, tăng chú thích lên tối thiểu 12px và bỏ bóng chồng của demo cache.

Vòng 2: kiểm tra 320/390/1280, game chơi và lesson cache. Nội dung/controls không bị tràn; mobile game dùng tranh hẹp bên trái, desktop ba bìa lớn. Cơ chế bằng HTML còn sử dụng được khi WebGL không có. Reduced motion bỏ dịch chuyển GSAP, dừng Lottie, 3D nhảy ngay đến trạng thái cuối.

Đánh giá nội bộ: design 7/10, usability 8/10, creativity 7/10, content 8/10 (weighted 7.4). Điểm mạnh: thao tác request sống, kết quả game có trace, chữ Việt và trạng thái lưu. Giới hạn: mô hình 3D đơn giản; nhiều thành phần lesson cũ giữ hình học cũ để tránh ảnh hưởng 85 hoạt động; chưa đo trên điện thoại vật lý. Không tuyên bố giải thưởng hoặc FPS thực tế.

Taste warnings có chủ đích: tiêu đề home lớn cho lời mời học; lộ trình nằm dưới fold vì home có các phần tự luyện, không phải dashboard mọi block cùng màn hình; radius khác giữa panels/trường form/diagram để giữ tính tương thích các lab. Không bỏ qua lỗi tràn/contrast/tiny text.

Artwork: Three.js geometry và Lottie JSON nguyên gốc trong source; không asset bên thứ ba. LottieFiles dotlottie-web 0.81.0 tự host WASM và nằm trong offline pack. GSAP/Three.js lazy import, cleanup khi route đổi; Three chỉ render resize/thao tác, không có animation loop nền. Game save phiên bản 1 riêng localStorage, không sửa IndexedDB tiến độ học và không nằm trong export học tập.

Bằng chứng máy và ảnh ở docs/design/design10/evidence; kết quả CI và production được cập nhật trong PR phát hành.

Gate cuối: Taste source lint 0 FAIL/0 WARN; browser inspector 0 FAIL/4 WARN. Đã đọc đủ fold và contact sheet desktop/tablet/mobile. Warning tỷ lệ nhãn 12px được giữ vì đây là metadata/nhãn số liệu bên cạnh tên bài và nội dung 14–18px; không còn chữ dưới 11px. Các warning còn lại có lý do ở trên.
