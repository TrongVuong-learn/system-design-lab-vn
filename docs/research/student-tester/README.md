# Agent student_tester — Minh

Định nghĩa 1.0.0, ngày 2026-10-14. Agent tester dự án được lưu tại [student_tester.toml](../../../.codex/agents/student_tester.toml); không phải skill.

Theo [official OpenAI documentation: Custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents), `.codex/agents/*.toml` khai báo agent dự án bằng `name`, `description`, `developer_instructions`. Agent này giữ model, reasoning và quyền của phiên cha; không thêm API key, MCP hoặc dependency ứng dụng.

## Hồ sơ và việc kiểm tra

Minh là hồ sơ giả định: học sinh lớp 10, 16 tuổi, chưa học code, dùng web bằng điện thoại. Agent kiểm tra bằng browser thật ở context riêng: hiểu hướng dẫn, tìm bài, đọc thuật ngữ/đơn vị, thao tác lab, phản hồi câu hỏi và resume. Nhận xét về khó hiểu là giả thuyết khi chưa có học sinh thật xác nhận. Không tạo lời học sinh, điểm hiểu hoặc pilot giả.

Một file cấu hình giữ vai trò và quy trình; không bảo đảm process đang chạy hay toàn bộ conversation tự sống mãi. Báo cáo mỗi run và [MEMORY.md](MEMORY.md) giữ lịch sử có bằng chứng. Ảnh/checkpoint/report dùng absolute path và lưu vào `.cache/student-tester/<run-id>/`, Git ignore. Phiên đầu chưa có report từ definition 1.0.0; QA-04 trước đó là nguồn kinh nghiệm, không phải chứng nhận cấu hình mới đã được runtime nạp.

## Cách gọi lần sau

> Dùng agent student_tester (Minh) kiểm tra bài metrics trên bản build hiện tại, mode first-use, mobile 390 px. Cho agent thao tác qua browser riêng và trả báo cáo kèm ảnh. Không cung cấp finding cũ hoặc đáp án trước lượt khám phá.

> Dùng student_tester chạy regression SIM-01 và SIM-02 trên commit [SHA], URL [URL]. Đối chiếu báo cáo trước và ghi từng finding: còn / đã sửa / chưa xác minh.

> Dùng student_tester ở mode returning, tiếp tục từ report [đường dẫn] và checkpoint [đường dẫn]. Nêu rõ agent đã được cung cấp lịch sử.

Parent cung cấp checkout/URL đã chuẩn bị, phạm vi 1–2 bài và mode; tránh chuyển cả lịch sử triển khai/đáp án vào context của lượt first-use. Tạo một subagent cho công việc được giao, nhận báo cáo và review minh chứng. Nếu runtime hiện tại không nạp custom role trực tiếp, parent có thể đọc file TOML và dùng nguyên `developer_instructions` trong lời giao việc qua công cụ spawn có sẵn; phải nói rõ đó là cách gọi fallback.

Cấu hình này có thể cần phiên mới để được discovery. Đã kiểm tra cú pháp/schema tối thiểu và checksum; chưa xác nhận custom role được ứng dụng desktop tự nạp trong phiên hiện tại. Cách fallback giữ nguyên persona và quy trình khi chưa có discovery.

## Quy tắc phiên

- **first-use:** trình duyệt mới, đọc UI trước; không xem code/đáp án/report cũ trong vòng khám phá.
- **regression:** dùng finding trước để tái hiện; không gọi đây là quan sát người mới.
- **returning:** dùng report/checkpoint được giao; mọi hiểu biết “đã học” cần xuất phát từ UI đã quan sát, không tự nhận ký ức con người.
- Chỉ lỗi tái hiện được mới gọi defect; giả thuyết giảng dạy và quan sát chưa xác minh ghi riêng. Reload trước khi lưu xong khác reload sau khi báo đã lưu.
- Agent trả report từng phần sớm để hạn chế mất kết quả khi hết usage. Parent cập nhật MEMORY sau review; agent không tự sửa source/commit/deploy.

## Phạm vi hoàn tất

Đã lưu native agent definition và hướng dẫn gọi lại, seed lịch sử từ QA-04, khóa checksum trong [agents-lock.json](../../engineering/agents-lock.json). Đã chạy first-use routing/cache bằng fallback theo definition này; report tại RUN_2026-10-14_ROUTING_CACHE.md. Chưa xác nhận native discovery tự động; không đổi trạng thái pilot thật. Đây là task lưu agent; không sửa ứng dụng hoặc bản web đang phát hành.

## Lượt chạy đã xác minh

Ngày 14/10/2026: [routing/cache](RUN_2026-10-14_ROUTING_CACHE.md) trên 4425af0, first-use/context mới. Browser riêng và artifacts thực; không đọc code/đáp án trước khám phá. Parent spawn fallback đọc native definition. Các câu “chưa có lượt mới” ở trạng thái tạo profile ban đầu là lịch sử; kết quả hiện hành theo MEMORY/report này.
