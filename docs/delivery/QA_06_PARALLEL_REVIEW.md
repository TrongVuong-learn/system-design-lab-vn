# QA-06 — student và knowledge review song song

Ngày14/10/2026, phạm vi: kiểm bản beta13 bài qua hai agent độc lập; xử lý finding có bằng chứng, bảo toàn assessment/progress. Baseline HEAD f8ae271c2c1e9c3618f1742f2efcee84f4e0dffa; dist là24625a3, parent đối chiếu hash trước khi chạy. Agent chưa tự xác minh hash bundle.

## Kết quả baseline

- Minh, AI mô phỏng học sinh lớp10: [report](../research/student-tester/RUN_2026-10-14_DNS_NETWORK_QUEUE.md). DNS/network/queue đủ prediction, lab, case, completion; saved→reload và case↔lab giữ trạng thái. Chromium touch390×844; case320. Không xác nhận lỗi chức năng; P3 payload/backlog thiếu giải thích tại câu đọc.
- Knowledge reviewer definition1.0.1, gpt-6-sol / low: [report](../research/knowledge-reviewer/RUN_2026-10-14_PARALLEL_LOW.md), [matrix](../research/knowledge-reviewer/claims-2026-10-14-parallel-low.json). Đọc13 bài, trace DNS/cache/queue/network/routing/metrics và browser DNS. Không có P0/P1/P2 xác nhận;12 entry verified-with-conditions, capacity insufficient-evidence vì nguồn đơn vị chỉ có Primer.

## Thay đổi xử lý

Thêm Backlog (việc chưa hoàn thành tích lại, trong bài là hàng chờ) và Payload (dữ liệu ảnh cần truyền, bỏ phần điều khiển). Dùng renderer glossary hiện có để hover/focus trên desktop và tap/đóng trên mobile. Không đổi câu hỏi, đáp án, cơ chế hay lưu tiến độ. Thêm nguồn sơ cấp [NIST](https://physics.nist.gov/cuu/Units/binary.html) cho byte/bit và tiền tố thập phân capacity; con số tải vẫn là giả định của bài, không phải benchmark. Editorial revision tăng cho ba bài; lesson/progress version giữ nguyên.

## Kiểm chứng candidate

Content validation36 module/13 bài beta, typecheck và build đạt;29 unit test đạt; lint đạt. E2E targeted thuật ngữ trên mobile Chromium và desktop Chromium/Firefox/WebKit:19 pass,1 skip hover ở touch. Không chạy lại toàn suite104 test vì không đổi renderer/engine/storage. Bounded agent retest ghi riêng khi hoàn tất.

## Giới hạn

AI review không phải pilot học sinh thật hoặc thẩm định chuyên gia người thật. Không suy rộng kết quả13 bài sang36 module/7 nhánh chưa hoàn thiện. Student chưa thử điện thoại thật/assistive technology/offline; reviewer chưa thực thi từng UI của13 bài. Không nâng trạng thái human-reviewed hoặc curriculum complete.

Reviewer recheck: [report riêng](../research/knowledge-reviewer/RETEST_2026-10-14_PARALLEL_LOW.md) xác nhận hai định nghĩa và nguồn NIST; PG-01 đơn vị resolved, không có P0–P2 mới.

Student bounded retest: [report riêng](../research/student-tester/RETEST_2026-10-14_TERMS.md) xác nhận Payload/Backlog tap/đóng ở390 và320, đã lưu→reload giữ đáp án; không có lỗi mới. Parent xem hai ảnh popup320. Sau cập nhật ngày editorial, build lại và bốn test thuật ngữ trên artifact cuối đều đạt; chỉ metadata thay đổi.
