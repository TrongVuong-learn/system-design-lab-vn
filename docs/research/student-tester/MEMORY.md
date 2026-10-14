# Lịch sử có bằng chứng của Minh / student_tester

Hồ sơ hiện hành: definition 1.0.0. File này do parent duy trì sau review report. Không phải trí nhớ của một học sinh thật. First-use không đọc finding cũ trước vòng khám phá.

## 2026-10-13 — nguồn kinh nghiệm QA-04

Lượt trước dùng agent `student_simulation`, chưa dùng native definition student_tester 1.0.0. Bản ứng dụng 4032361, Chromium touch 390×844, trang chủ/cache/metrics. Nguồn: [báo cáo QA-04](../student-pilot/AI_STUDENT_REVIEW_2026-10-13.md).

- Thao tác đã ghi nhận: tooltip tap/đóng, cache nguồn205/bản ghi201, TTL4 sau lưu/reload; metrics 2 worker + hai việc chậm có median550ms/p951900ms, resume và lưu chặng áp dụng.
- SIM-01 — **đề xuất còn mở trong báo cáo**, nhãn “Hai việc cuối: 100 ms” chưa mô tả tác dụng lần bấm. Chưa có học sinh xác nhận, chưa xác minh trạng thái trên bản mới hơn.
- SIM-02 — **đề xuất còn mở trong báo cáo**, cần điểm giải thích ms ngay tại metrics. Chưa có học sinh xác nhận, chưa xác minh trên bản mới hơn.
- SIM-03 — **chưa xác nhận defect**, reload ngay có lần trởTTL5; sau khi báo đã lưu, reload giữTTL4. Không gọi đây là mất dữ liệu đã lưu.
- Chưa thử DNS/transport/capacity, màn320px, desktop, screen reader hoặc điện thoại thật ở lượt đó. Agent hết usage trước báo cáo cuối; parent tổng hợp từ ghi nhận và7ảnh.

## Các lần sau

Mỗi entry ghi run ID, date, definition version, application commit, mode, report/artifact absolute paths, scope thực sự chạy, finding status và giới hạn. Giữ entry lịch sử; khi fix hoặc tái hiện có kết quả mới, thêm entry theo commit mới. Không biến “đã học trong vai Minh” thành số liệu learning gain hoặc chứng nhận bài dễ hiểu cho mọi học sinh.
