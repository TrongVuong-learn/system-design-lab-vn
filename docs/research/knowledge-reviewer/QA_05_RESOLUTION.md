# QA-05 — Tester học sinh, agent reviewer và sửa KR-01

Ngày: 14/10/2026. Application baseline 4425af0; working delta chỉ sửa cache case limitation/revision/review và test regression, giữ đáp án/progress/engine.

## Kết quả các agent

- [student_tester first-use](../student-tester/RUN_2026-10-14_ROUTING_CACHE.md): routing + cache, touch 390×844 và xem thêm case 320 px. Saved/reload, case/lab/quay lại và completion giữ nguyên; không thấy defect chặn học/mất dữ liệu trong phạm vi. P3 port glossary trừu tượng là giả thuyết cần pilot, chưa gọi defect.
- [Astra medium authoring](AUTHORING_2026-10-14.md): session Astra thiết kế/rà native profile; runtime file là gpt-6-sol medium. Parse TOML, 5 fields, checksum đối chiếu. Audit Astra ban đầu dừng do quota và chuyển scope; không có kết luận toàn bộ 13 bài.
- [Sol medium review](RUN_2026-10-14_SOL.md): đọc 13 bài, nguồn sơ cấp và thực thi trace tiêu biểu; [27 claim rows](claims-2026-10-14-sol.json). Pass-with-scope, không phát hiện thêm lỗi kiến thức P0/P1/P2 trong phạm vi đã kiểm. Đây là AI review, không human-reviewed/pilot.

## KR-01 — resolved trong source và QA

Finding từ Astra: cache.caseStudy.limitations nói lab dùng giây nhưng UI/engine dùng phút. Parent đọc lại time badge, nút Qua 1 phút, TTL control và feedback để xác nhận. Đã sửa thành “Đồng hồ trong lab và câu hỏi đều dùng phút mô phỏng”, case revision 2; editorial revision/review khớp. Câu hỏi, đáp án, lesson ID/version, progress v1 và engine giữ nguyên. Đã sửa cả dòng plan tương ứng để không giữ hai đặc tả mâu thuẫn.

Sol chạy engine: đổi nguồn 205 rồi đọc phút 0 vẫn 201, qua năm phút đọc 205. E2E regression kiểm badge Phút và mở Giới hạn tình huống thấy cùng phút, sau đó hoàn thành/lưu như cũ. Không suy bảo đảm độ mới thật từ mô hình giả định.

## Kiểm tra parent

- content validation trong build: 36 module / 13 bài beta; typecheck, lint, production build đạt. Unit 29/29 đạt; fixture giữ nguyên assessment cũ.
- E2E lượt đầy đủ 4 workers: 101 pass, hai Firefox timeout ở giới hạn tổng test 30 giây, một skip có chủ ý (hover trên touch). Trace cho thấy locator đã tìm đúng nút trong hai hành trình nhiều bài, hết budget toàn test trước action hoàn tất; không có assertion sai mô hình.
- Giữ trace gốc ở `.cache/qa05/initial-failures/`. Chạy riêng đúng hai test Firefox, workers=1, không đổi source/timeout/retries: cả hai pass (21,3/23,4 giây; tổng48,9 giây). Điều này xác nhận luồng chạy được trên cùng artifact; chưa chứng minh suite luôn ổn với mọi mức tải máy. Không gọi lượt full ban đầu là xanh.
- Build/checksum tại `.cache/qa05/tested-artifact.json` phải giữ nguyên qua packaging. Bundle JS gzip151,34kB/CSS7,41kB; các cảnh báo Vite/Zod hiện hành được giữ, không tăng ngưỡng để giấu.
- Student đã dùng browser và xem ảnh trên baseline; Sol kiểm source/engine, không browser. Thay đổi chỉ văn bản giới hạn nên không thay bố cục UI; E2E xác nhận văn bản hiển thị. Chưa có thiết bị thật, screen reader thật hoặc pilot học sinh.

## Backlog có phạm vi

P3 glossary port: cân nhắc bổ sung ví dụ cùng IP/TCP8080 lịch và9090 thư viện, kiểm với người học. Capacity: phân biệt bài toán số tự đặt với nguồn sizing/benchmark, bổ sung provenance khi mở rộng kiến thức. Routing: nêu rõ case máy lưu ảnh chuyển ngữ cảnh từ lab máy trường; hiện chưa xác nhận gây hiểu sai. Giữ các hạng mục này mở, không nâng thành confirmed error.

Native profile + hướng dẫn + lịch sử/checksum được cài vào worktree và project gốc cho lần sau. Custom-role native discovery chưa được xác nhận tự reload; hai lần gọi reviewer dùng fallback đọc profile và explicit model/effort. Phát hành giữ owner-private, chỉ báo thành công theo tool deployment.
