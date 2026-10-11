# System Design Lab

Nền tảng học System Design tiếng Việt, trực quan, tương tác, thiết kế từ điện thoại. Có lối bắt đầu cho học sinh cấp 3 chưa biết lập trình và lộ trình tiến tới thiết kế hệ thống chuyên sâu.

**Trạng thái:** đang hoàn thiện đặc tả. Repository hiện chứa tài liệu; ứng dụng, cấu hình build và các lệnh dự án bên dưới chưa được triển khai hoặc kiểm thử.

## Định hướng đã xác định

- Phạm vi: 6 level, 36 module cốt lõi, 7 nhánh chuyên sâu; học liệu phát hành từng đợt có kiểm duyệt.
- Web mobile trước; PWA/offline sau khi kiểm chứng; iOS/Android là đợt phát triển tiếp theo.
- Stack đề xuất: TypeScript + React + Vite; engine độc lập giao diện; Capacitor cho app khi đạt điều kiện.
- Nội dung đi từ tình huống dễ hiểu đến thao tác, giải thích và cơ chế kỹ thuật.

## Đọc tài liệu theo thứ tự

| Tài liệu | Nội dung |
| --- | --- |
| [Kế hoạch sản phẩm](SYSTEM_DESIGN_WEB_PLAN.md) | Mục tiêu, tính năng, phương pháp học |
| [Bản đồ giáo trình](CURRICULUM_MAP.md) | Level, module, nhánh chuyên sâu và độ bao phủ |
| [Chuẩn giảng dạy](TEACHING_GUIDE.md) | Cách viết cho người mới và bài mẫu |
| [Quyết định công nghệ](docs/decisions/0001-web-first-mobile-ready.md) | So sánh stack và hướng web → app |
| [Kiến trúc dự án](docs/engineering/ARCHITECTURE.md) | Cấu trúc mã nguồn, module, dữ liệu và ranh giới phụ thuộc |
| [Thiết lập môi trường](docs/engineering/SETUP.md) | Runtime, workspace, lệnh khởi tạo và CI dự kiến |
| [Thiết kế mobile](docs/design/MOBILE_FIRST.md) | Luồng học dọc, touch, accessibility và offline |
| [Roadmap triển khai](docs/delivery/ROADMAP.md) | Milestone, backlog, người phụ trách và điều kiện nghiệm thu |
| [Workflow dự án](docs/delivery/WORKFLOW.md) | Task, Git/PR, review mã/học liệu, release và quy tắc thư mục |
| [Hướng dẫn đóng góp](CONTRIBUTING.md) | Quy ước khi tham gia hoặc thay đổi dự án |

Các tài liệu sản phẩm ở root được giữ đường dẫn để các liên kết trước đây tiếp tục hoạt động. Thay đổi quyết định kỹ thuật cần cập nhật ADR và các tài liệu liên quan.

Quy tắc cho agent được lưu trong [AGENTS.md](AGENTS.md). Repository có EditorConfig, Git ignore và PR template; CI/branch protection được cấu hình trong milestone bootstrap khi có remote phù hợp.

## Mốc bắt đầu triển khai

Chốt môi trường có thể tái lập, cấu trúc workspace và các hợp đồng nội dung; sau đó hoàn thiện một bài cache trên điện thoại từ mở bài, thử nghiệm, đánh giá đến lưu và tiếp tục học. Roadmap là nguồn chính cho thứ tự triển khai và phạm vi từng đợt.
