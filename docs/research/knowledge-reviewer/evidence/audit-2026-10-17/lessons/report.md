# Review kiến thức phần được giao — worktree 18 bài

**Kết luận: pass-with-scope cho nội dung và phép tính đã kiểm; chưa có finding P0/P1/P2 xác nhận trong phần được giao ở HEAD này.** AI review không là human review hoặc pilot. Claim matrix có 82 dòng field/scenario kèm điều kiện và evidence mode; `verified-with-conditions` chỉ áp dụng cho mô hình nhập môn cùng giả định nêu trong từng bài, không là lời bảo đảm hệ thống thật.

## Baseline và phạm vi

- Worktree tuyệt đối `/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning`, HEAD thực tế `8f2afa8bb6a6dc832ca246e1f41f01de9fcdd197`, `git status --short` rỗng. Khác checkout cũ 6 bài ở `/Users/vuongn/Documents/ChatGPT/System Design learning` HEAD `6a9f9177c5aad2d1c2eb0bf21e9afd49d25daae6`. Report checkout cũ lưu ở thư mục cha, không được dùng làm kết luận cho bản hiện hành.
- Model/effort được parent giao: `gpt-6-sol` / `low`; profile knowledge_reviewer 1.1.0. Đã đọc README/CONTRIBUTING/WORKFLOW/profile/REFERENCE_GUIDE ở checkout cũ trước khi chuyển; bản mới được đối chiếu HEAD sạch.
- Đã đọc đủ 6 bài `intro.json`, 4 bài `foundations.json` gồm story, explanation, limit, terms, prediction, challenge, caseStudy, guidance; `content/reviews/vi/school-day.json` gồm hai scenario, requirements/hints/reflection/limits/sources; engine `index.ts`, `foundations.ts`, `school-review.ts`, và đoạn UI metric/lag liên quan. Parent review observations và UI riêng. Không kết luận về 8 bài còn lại, browser/mobile, hoặc toàn 36 module.
- Nguồn gốc mở trong run ngày 2026-10-17: [MDN Client-server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview), [Google SRE Monitoring](https://sre.google/sre-book/monitoring-distributed-systems/), [Google SRE Overload](https://sre.google/sre-book/handling-overload/), [Microsoft Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside), [Microsoft Queue Load Leveling](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling), [PostgreSQL 18 Hot Standby](https://www.postgresql.org/docs/18/hot-standby.html), [RFC 1034 status/text](https://www.rfc-editor.org/info/rfc1034/), [RFC 9293 status/text](https://www.rfc-editor.org/info/rfc9293/), [RFC 768 status/text](https://www.rfc-editor.org/info/rfc768/), [NIST binary prefixes](https://physics.nist.gov/cuu/Units/binary.html). RFC status page đã xem; errata chưa audit toàn bộ, không có finding phụ thuộc errata.

## Trace và phép tính độc lập

- `request`: chặng nối tiếp 20+80+20=120 ms; độ trễ tổng khác throughput.
- `balance/design`: DB tối đa 4 lần đọc/giây là bottleneck khi không cache. Với 12 lượt/giây, cache hit giả định 75% thì 3 đọc nguồn/giây; 2 server ×6=12. `design` thêm 3 workers ×2=6, chi phí 2+3+1=6.
- `cache`: nguồn 201→205 khi cache còn hạn trả 201; đúng ranh giới TTL5 phút thì miss đọc 205. Lấy mới chủ động là đường riêng. Bản mới đã đổi metric thành “Xem qua nguồn” chỉ đếm thao tác Xem lịch, có note tương ứng; finding nhãn sai của checkout cũ không áp dụng.
- `queue`: 6 vào/giây, 1 worker xử lý 2 làm backlog tăng 4/giây; 4 workers ×2=8 giữ backlog không tăng ở tải 8. Muốn xóa backlog cũ cần công suất dư.
- `replica`: một write lag3 tới replica ở t3; đọc ngay có thể thấy cũ. Khi đổi lag 5→1 với pending, engine chặn write mới đến t5 để giữ thứ tự. Bản mới có note rõ về quy tắc này và lag0; finding thiếu điều kiện của checkout cũ không áp dụng. Chữ “lag cố định” trong `limit` mô tả lượt đơn mặc định; UI cho đổi giữa lượt nhưng giải thích hiện hành đủ để không suy ra SLA 1 giây.
- `metrics`: 20 request t0/4 workers FIFO; bình thường 5 lớp ×100 ms, window500ms, median300ms, p95 nearest-rank500ms, throughput40/s. Hai request cuối 1000ms làm window1400ms, median vẫn300ms, p95 1400ms, throughput≈14.286/s. Expected lập bằng timeline độc lập trước khi chạy engine. 40 request/2s=20 request/s ở assessment, không là cấu hình lab.
- `dns`: fill .10 tại t0 TTL5, đổi nguồn .20; tra trước t5 dùng .10, tra đúng t5 lấy .20. `RFC 1034` giải thích cache/TTL; lab tự định nghĩa boundary và bỏ serve-stale.
- `transport`: mảnh TCP 2 mất thì contiguous prefix giao cho app là [1], mảnh3 ở buffer; UDP datagram giao [1,3] trong trace giả định. TCP không giữ ranh giới message; bài đã nêu giới hạn này.
- `capacity`: 2.000 ảnh ×100 kB=200 MB lưu thập phân; 5 lượt xem/ảnh/ngày=1.000 MB/ngày truyền. Trung bình 10.000/86.400≈0.1157 lượt/giây, nhân peak factor4≈0.463 chỉ là giả định, không dự báo burst.
- `school-day`: opening config server2/cache/TTL1/workers3 cho 12 reads, 6 jobs/s, cost6≤7. Rush config server1/cache/TTL1/workers5 xử lý 8 backlog +4×8 việc=40 việc trong 4s; 5×2×4=40, cost7≤8; read 6/s được cache giả định hỗ trợ. TTL≤1 chỉ là kiểm policy dưới các giả định riêng, không chứng minh độ mới thực tế. Reflection tự đánh giá, engine chỉ kiểm số.

Trace đã chạy bằng `node --import tsx /private/tmp/sdl-audit-2026-10-17-lessons/current/trace.mts`, actual lưu `trace.json`. `node --import tsx scripts/content.ts --check` pass: 36 module registry, 18 bài, 1 review. Unit tests tại worktree mới không chạy được do sandbox không cho Vitest viết file tạm `node_modules/.vite-temp`; không báo pass. Không sửa source, metadata hay dependency.

## Phần chưa xác minh

- Chưa browser-observed, chưa kiểm đầy đủ restore/checkpoint của `school-day`, `metrics`, DNS hoặc mọi input corrupt. Đọc source UI chỉ đủ xác nhận nhãn/note hiện tại; parent có nhánh review UI riêng. Chưa mở nguồn chuẩn để rà mọi nuance về DNS modern/transport beyond claims ở bài nhập môn; RFC 1034 có nhiều cập nhật và không được dùng như mô tả DNS hiện đại toàn diện. Nguồn sống có checkedAt 2026-10-17, revision unknown nếu trang không công bố.
- Test nội bộ pass ở checkout cũ không áp dụng cho HEAD mới. Thay đáp án/cơ chế sau review cần parent xem version/migration bằng chứng học cũ.

## Thẩm định bổ sung theo parent: đường tra DNS

`apps/web/src/features/lab/FoundationLabs.tsx:130-131` hiển thị “Đường tra rút gọn: resolver → root → máy chủ tên miền cấp cao → nơi quản lý tên → resolver.” [RFC 1034 §5.3.3](https://www.rfc-editor.org/info/rfc1034/) mô tả resolver tự chọn máy chủ, gửi truy vấn, đọc referral rồi chính resolver hỏi máy chủ tiếp theo. Nếu xem mũi tên là đường chuyển tiếp gói tin giữa root, TLD và authoritative thì sai. Tuy nhiên nhãn “rút gọn” và story trong bài nói “Bộ tra cứu DNS hỏi các nơi chỉ dẫn”, nên ở phạm vi bài nhập môn tôi xếp **nguy cơ diễn đạt/biên tập**, chưa đủ để ghi P2 lỗi kiến thức xác nhận. Nên thay bằng “Resolver lần lượt hỏi root (được chỉ tới TLD), hỏi TLD (được chỉ tới nơi quản lý tên), rồi hỏi nơi quản lý tên để lấy địa chỉ”; thêm câu các máy chủ chỉ dẫn resolver, không tự chuyền câu hỏi. Đây là đối chiếu source, chưa quan sát browser bởi reviewer này.

Parent đã chạy unit suite riêng: 68/68 pass trên 19 files với Node 26.11.1 sau khi được cấp quyền. Runtime này khác Node 24.21.0 được khóa trong repository; tôi không gộp kết quả của parent thành kiểm chứng đã chạy ở reviewer này.
