# Hướng dẫn đóng góp

Đọc [README](README.md), [kiến trúc](docs/engineering/ARCHITECTURE.md) và [workflow](docs/delivery/WORKFLOW.md) trước khi thay đổi dự án. Repository hiện ở giai đoạn đặc tả; hướng dẫn chạy ứng dụng sẽ được xác nhận trong milestone bootstrap.

## Quy trình làm việc

1. Chọn task có mục tiêu, phạm vi, điều kiện nghiệm thu và phụ thuộc rõ.
2. Khi bắt đầu một phần việc cần nhánh riêng và repository đã có baseline commit, tạo nhánh ngắn từ nhánh chính đã đồng bộ; dùng `codex/<task-id>-<topic>` cho công việc của Codex. Giai đoạn lập kế hoạch ban đầu chưa cần nhánh riêng.
3. Thực hiện một thay đổi có thể review, cập nhật tài liệu và kiểm tra liên quan.
4. Mở PR khi repository có remote và workflow review; mô tả kết quả và bằng chứng kiểm chứng theo template.
5. Hoàn tất review, kiểm tra bắt buộc và milestone gate trước khi tích hợp/phát hành.

Các lệnh dự kiến và điều kiện môi trường nằm trong [SETUP.md](docs/engineering/SETUP.md). Chỉ ghi một kiểm tra là đã chạy khi có kết quả thực tế; ghi rõ giới hạn kiểm chứng.

## Quy ước đóng góp

- Đặt mã theo feature và ranh giới package; public API nhỏ, tránh import xuyên nội bộ.
- Unit test đặt cạnh module; E2E và fixtures tích hợp ở root `tests/`.
- Học liệu ở `content/`; mỗi thay đổi có ID, version, mục tiêu và reviewer phù hợp.
- Mobile-first và giọng văn phù hợp học sinh cấp 3 là tiêu chí nghiệm thu của tính năng học.
- Commit có một mục đích rõ; dùng các tiền tố `feat`, `fix`, `docs`, `test`, `refactor`, `chore` nhất quán.
- Dependency mới phải có nhu cầu cụ thể; cập nhật manifest và lockfile cùng thay đổi.
- Quyết định thay stack, ranh giới package hoặc hợp đồng dữ liệu được ghi vào `docs/decisions/`.

Owner/reviewer và merge policy thực tế sẽ được cấu hình khi nhóm và remote được xác định; tài liệu không đại diện cho branch protection hoặc CI đã bật.
