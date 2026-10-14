# System Design Lab

Nền tảng học System Design tiếng Việt, trực quan, tương tác, thiết kế từ điện thoại. Có lối bắt đầu cho học sinh cấp 3 chưa biết lập trình và lộ trình tiến tới thiết kế hệ thống chuyên sâu.

**Trạng thái:** bản thử nghiệm web đã được hiện thực với mười ba bài nhập môn, mô phỏng cục bộ và lưu tiến độ. Toàn bộ giáo trình chuyên sâu, PWA/offline, sync và app tiếp tục theo roadmap. Bản thử nghiệm chưa được pilot với học sinh hoặc kiểm tra trên điện thoại thật.

## Chạy dự án

Dùng Node **24.21.0** theo `.node-version` và pnpm **11.25.0**.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Kiểm tra và build:

```sh
pnpm content:check
pnpm lint
pnpm test:unit
pnpm build
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
```

`pnpm dev` sinh catalog từ học liệu và mở server tại URL Vite hiển thị. `pnpm build` tạo bundle ở `dist/` của root. E2E dùng production preview ở cổng 4173. Catalog sinh ra, dependency, browser cache và build output được Git ignore.

## Định hướng đã xác định

- Phạm vi: 6 level, 36 module cốt lõi, 7 nhánh chuyên sâu; học liệu phát hành từng đợt có kiểm duyệt.
- Web mobile trước; PWA/offline sau khi kiểm chứng; iOS/Android là đợt phát triển tiếp theo.
- Stack đã triển khai: TypeScript + React + Vite; engine độc lập giao diện; Capacitor cho app khi đạt điều kiện.
- Nội dung đi từ tình huống dễ hiểu đến thao tác, giải thích và cơ chế kỹ thuật.
- Phi thương mại, chia sẻ quy mô nhỏ: học không cần tài khoản; ưu tiên cách giảng, tiến độ lưu trên thiết bị.
- Cache/queue/network có so sánh bước trước–sau và gợi ý mở dần; xem [EDU-10](docs/delivery/EDU_10_CLEAR_FEEDBACK.md).

## Đọc tài liệu theo thứ tự

| Tài liệu | Nội dung |
| --- | --- |
| [Kế hoạch sản phẩm](SYSTEM_DESIGN_WEB_PLAN.md) | Mục tiêu, tính năng, phương pháp học |
| [Bản đồ giáo trình](CURRICULUM_MAP.md) | Level, module, nhánh chuyên sâu và độ bao phủ |
| [Chuẩn giảng dạy](TEACHING_GUIDE.md) | Cách viết cho người mới và bài mẫu |
| [Kế hoạch ví dụ thực tế](docs/delivery/EDU_09_CASE_STUDY_PLAN.md) | 36 họ case, mini-case từng bài, sáu capstone, bảy nhánh và thứ tự triển khai |
| [Quyết định công nghệ](docs/decisions/0001-web-first-mobile-ready.md) | So sánh stack và hướng web → app |
| [Kiến trúc dự án](docs/engineering/ARCHITECTURE.md) | Cấu trúc mã nguồn, module, dữ liệu và ranh giới phụ thuộc |
| [Thiết lập môi trường](docs/engineering/SETUP.md) | Runtime, workspace, lệnh khởi tạo và CI dự kiến |
| [Thiết kế mobile](docs/design/MOBILE_FIRST.md) | Luồng học dọc, touch, accessibility và offline |
| [Roadmap triển khai](docs/delivery/ROADMAP.md) | Milestone, backlog, người phụ trách và điều kiện nghiệm thu |
| [Workflow dự án](docs/delivery/WORKFLOW.md) | Task, Git/PR, review mã/học liệu, release và quy tắc thư mục |
| [Hướng dẫn đóng góp](CONTRIBUTING.md) | Quy ước khi tham gia hoặc thay đổi dự án |
| [Hướng thiết kế](DESIGN.md) | Typography, bố cục, ngôn ngữ thị giác và review UI |

Các tài liệu sản phẩm ở root được giữ đường dẫn để các liên kết trước đây tiếp tục hoạt động. Thay đổi quyết định kỹ thuật cần cập nhật ADR và các tài liệu liên quan.

Quy tắc cho agent được lưu trong [AGENTS.md](AGENTS.md). Repository có EditorConfig, Git ignore, PR template và cấu hình GitHub Actions Quality. CI chưa được xác nhận chạy trên GitHub vì repository chưa có remote GitHub được cấu hình.

## Mốc bắt đầu triển khai

Đã có workspace, schema, core, renderer, content pipeline và bài cache từ tình huống đến assessment/resume. Mười ba bài có tình huống giả định trong chặng Áp dụng theo [EDU-09](docs/delivery/EDU_09_CASE_STUDY_IMPLEMENTATION.md); vẫn là lớp nhập môn, không thay thế các module hoặc capstone đầy đủ. Báo cáo hiện thực và phần còn lại nằm trong [IMPLEMENTATION_STATUS.md](docs/delivery/IMPLEMENTATION_STATUS.md).
