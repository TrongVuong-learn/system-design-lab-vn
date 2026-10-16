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

## 2026-10-14 — đối chiếu kỹ thuật các đề xuất trong EDU-04b

Parent/root sửa SIM-01 bằng nhãn hành động và trạng thái100/1.000ms riêng; SIM-02 thêm giải thích1.000ms=1giây ngay lab và glossary. Regression metrics cùng91E2E đạt, reviewảnh390/1280px; chi tiết tại [EDU-04b](../../delivery/EDU_04B_HTTP_NETWORK.md). Đây là xác minh code/UI bởi root, không phải lượt student_tester hoặc học sinh mới. Giả thuyết về hiệu quả giảng dạy vẫn cần pilot thật. SIM-03 giữ trạng thái chưa xác nhận mất dữ liệu đã lưu.

## 2026-10-14 — first-use routing/cache

Definition 1.0.0; application 4425af0; Chromium touch 390×844, xem thêm hai case 320 px. [Report gốc](RUN_2026-10-14_ROUTING_CACHE.md), artifact `/private/tmp/student-tester-2026-10-14-current/`. Parent đã đọc report và xem routing-lab.png. Agent xác nhận saved → reload, case/lab/quay lại, completion của routing/cache. Không thấy defect chặn học/mất dữ liệu trong phạm vi; chưa test toàn bộ site/thiết bị thật.

P3: diễn đạt định nghĩa port có thể trừu tượng cho người mới; chưa có pilot xác nhận, chưa sửa như defect. Skip link xuất hiện trong ảnh cache dài là quan sát chưa xác minh; không kết luận lỗi UI chỉ từ ảnh toàn trang. Ghi đầy đủ phần chưa thử trong report. Đây là AI mô phỏng, không đóng EDU-02.

## 2026-10-14 — QA-06 first-use DNS/network/queue

Definition1.0.0, HEAD f8ae271, bundle baseline24625a3 do parent xác minh. Chạy song song độc lập với knowledge reviewer. [Report gốc](RUN_2026-10-14_DNS_NETWORK_QUEUE.md); artifact `/private/tmp/student-parallel-2026-10-14/`. Ba luồng prediction→lab→case→completion, phản hồi sai/sửa có chủ ý, tap glossary, saved→reload, case/lab giữ câu trả lời; touch390 và case320. Không xác nhận defect. P3 payload/backlog thiếu giải thích inline, parent bổ sung glossary; regression xem [QA-06](../../delivery/QA_06_PARALLEL_REVIEW.md). Chưa pilot thật, desktop, offline hay assistive technology.
