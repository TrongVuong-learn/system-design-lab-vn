# QA13 — Minh thử hoạt ảnh game trên mobile

## Phạm vi và điều kiện hoàn tất

User giao Minh thử cả ba game mới, kiểm tra thao tác/kết quả có dễ theo dõi, sửa lỗi đã xác minh và phát hành Vercel. Owner root; reviewer góc nhìn học sinh student_tester definition1.0.0. Giữ nguyên luật, phiên lưu và nội dung bài. Hoàn tất khi report/evidence được rà, lỗi tái hiện có regression, CI và production được xác minh. Đây là AI mô phỏng, không thay pilot hoặc điện thoại thật.

## Bằng chứng

First-use trên master4e624da, fingerprint465a632d01c85089; context riêng390×844 touch, bổ sung320/reduced-motion. [Report Minh](../research/student-tester/qa13-2026-10-27/report.md). Cả3game: dự đoán từ UI, thử nhánh sai có chủ ý, chơi lại đạt mục tiêu, replay và reload giữ kết quả/nhật ký.

QA13-F1/P2 được parent tái hiện độc lập: sau tap đầu tại390px, hình cache bắt đầu y823, queue y845, trong khi nav cố định bắt đầu y779. Nút thao tác còn thấy nhưng toàn bộ hình bị ngoài vùng nhìn, hoạt ảnh ngắn có thể kết thúc trước khi người học cuộn tới.

## Sửa

Khi người dùng chọn hành động hoặc xem lại, kiểm tra vùng hình với viewport/nav. Chỉ khi hình bị ngoài vùng nhìn, đưa hình vào giữa viewport ngay trước timeline. Cuộn tức thì để không chạy đồng thời hai chuyển động; giữ focus ở nút. Không cuộn khi mới mở trang/resume; không đổi trạng thái game, tính điểm hay storage.

Sau sửa tại390: hình cache y318–526, queue y319–526; nút thao tác và replay đều nhìn thấy trên nav. [Cache sau sửa](../research/student-tester/qa13-2026-10-27/after-cache-390.png), [Queue sau sửa](../research/student-tester/qa13-2026-10-27/after-queue-390.png).

QA13-H1/H2 (thuật ngữ, sự chú ý giữa lượt tiếp theo và diễn biến lượt vừa xong) vẫn là giả thuyết về người mới. Không gọi là sai kiến thức hoặc kết luận hiểu sai; không đổi học liệu dựa vào giả thuyết chưa xác minh.

## Kiểm tra

110 unit;32 game/motion E2E qua mobile/desktop Chromium, Firefox, WebKit; lint, formatting, build đạt. Test mới chứng minh nút+hình nằm trên nav ở320/390, normal/reduced motion và keyboard focus giữ nguyên. Các test replay, rapid input/reset, persistence, offline tiếp tục đạt. Local fingerprint05d66a798997c44b. Regression Minh và kết quả phát hành ghi bổ sung dưới đây/PR.

## Regression Minh

Agent đã lưu [report regression](../research/student-tester/qa13-2026-10-27/regression.md) và số đo/ảnh trước khi chạm usage limit ở cuối lượt. Report ghi12 tổ hợp3game×320/390×normal/reduced-motion: F1 không còn tái hiện, replay không tăng lượt, không tự cuộn khi mở/resume, focus giữ ở nút. Parent đọc báo cáo và rà ảnh/số đo; không tuyên bố agent đã làm ngoài phạm vi tài liệu. App fingerprint05d66a798997c44b.

User chuyển tiếp yêu cầu kế hoạch pixel rework; kế hoạch ở docs/design/PIXEL_CITY_REWORK_PLAN.md, chưa áp dụng lên UI trong QA13.
