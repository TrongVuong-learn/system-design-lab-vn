# Quy tắc làm việc trong repository

## Nguồn hướng dẫn

- Đọc README.md và CONTRIBUTING.md; áp dụng docs/delivery/WORKFLOW.md.
- Giữ các yêu cầu đã chốt: mobile-first, dễ tiếp cận với học sinh cấp 3, 6 level/36 module/7 nhánh chuyên sâu, web trước app sau.
- Kiến trúc, setup và roadmap nằm trong docs/; cập nhật nguồn chính khi thay quyết định, tránh tạo tài liệu mâu thuẫn.
- Khi thiết kế hoặc đổi UI, đọc `.agents/skills/frontend-design/SKILL.md` và `DESIGN.md`. Review screenshots với nội dung thật trên mobile/desktop; minh họa phải phục vụ cơ chế bài học. Nguồn skill được khóa trong docs/design/tooling-lock.json.

## Mã nguồn và học liệu

- Tổ chức theo cấu trúc trong docs/engineering/ARCHITECTURE.md. Chỉ tạo app/package khi milestone hoặc task cần.
- Core mô phỏng và học tập không phụ thuộc React, DOM, storage hoặc native SDK; tích hợp qua adapter.
- Nội dung có schema/ID/version và hoạt động tham chiếu registry; không nhúng mã thực thi tùy ý vào học liệu.
- Đặt kiểm thử theo rủi ro và hành vi cần chứng minh. Kiểm tra mobile, dữ liệu lưu và trợ năng khi thay luồng học.
- Bảo toàn thay đổi của người dùng. Không thực hiện git reset/clean hoặc xóa dữ liệu ngoài phạm vi task.

## Kiểm chứng và báo cáo

- Làm việc theo task cụ thể, ghi phạm vi và điều kiện hoàn tất; tiếp tục trong phạm vi người dùng đã cho phép.
- Chỉ tạo nhánh khi bắt đầu một phần việc cụ thể cần tách và repository đã có baseline commit. Giai đoạn đặc tả ban đầu chưa cần nhánh riêng; giữ nhánh chính hiện có, không tự đổi tên.
- Chỉ báo build/test/deploy thành công khi có bằng chứng. Phân biệt đặc tả, source đã viết và tính năng đã chạy.
- Runtime/dependency được khóa theo setup đã kiểm tra; không tự nâng framework để xử lý task không liên quan.
- Phát hành áp dụng workflow và quyền đã được người dùng giao; không coi file template là workflow đang chạy.

## Agent kiểm thử theo góc nhìn học sinh

- Khi người dùng gọi tester học sinh/Minh, dùng role `student_tester` tại `.codex/agents/student_tester.toml`; cách gọi và lịch sử tại `docs/research/student-tester/`.
- Lượt first-use không giao finding/đáp án cũ trước khi agent khám phá UI. Chỉ gọi khi có task kiểm tra; không tự chạy cho mọi thay đổi.
- Agent tạo báo cáo/ảnh trong phiên browser riêng; parent review bằng chứng và cập nhật lịch sử. Kết quả AI mô phỏng không thay pilot học sinh thật.
