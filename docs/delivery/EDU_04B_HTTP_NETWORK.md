# EDU-04b — HTTP và thời gian tải

Ngày: 2026-10-14. Nhánh `codex/edu-04b-http-network`. Owner thực hiện và tự review: Codex/agent. Phạm vi: tiếp tục PRIMER-B1, không đóng toàn bộ EDU-04 hoặc pilot.

## Vấn đề và đầu ra

Bản L0 có DNS/TCP/UDP nhưng chưa có bài HTTP hoặc hoạt động tách RTT với tốc độ truyền. QA-04 cũng ghi nhãn nút metrics thiếu mô tả hành động và cần nhắc đơn vị ms. Đợt này thêm hai bài beta và sửa hai điểm hướng dẫn đó.

- `http`, L0.5: yêu cầu GET/đường dẫn, phản hồi 200/404/503, header/body; thử đường dẫn thiếu và bảo trì. Máy chủ vẫn truy cập được khi bảo trì. Không dạy rằng HTTP error tương đương mất kết nối hoặc 200 luôn bảo đảm dữ liệu mới.
- `network`, L0.4: ba phần chờ RTT/xử lý/truyền ảnh; đổi tốc độ và kích thước, có phép đổi kB/byte/bit/Mbps/ms. Mô hình lý tưởng trên kết nối đã có, không giả làm stack TCP hoặc benchmark thực.
- Metrics: nút thể hiện tác dụng “Làm hai việc cuối chậm hơn”/“Cho hai việc cuối nhanh lại”; trạng thái thời gian nằm riêng. Giải thích `1.000 ms = 1 giây` ngay lab và glossary.

Engine 1.2.0, schema whitelist thêm hai kind. Lesson/progress JSON version 1, IndexedDB v2 giữ nguyên. Metrics editorial revision 2 là sửa hướng dẫn; không đổi đáp án, mục tiêu hoặc cách tính, không regrade tiến độ cũ. Giữ ranh giới engine thuần → UI → adapter.

## Điều kiện nghiệm thu và trace

| Phạm vi | Trace / outcome cần kiểm chứng |
| --- | --- |
| HTTP | Trước bước phản hồi chưa có status; GET lịch có thật → 200 + body phòng201; đường dẫn thiếu → 404; bảo trì → 503; hết bảo trì với đường dẫn thiếu vẫn 404 |
| Mạng | 1.000kB, 8Mbps, RTT100ms, xử lý50ms → 1.150ms; 16Mbps → 650ms. 100kB/8Mbps → 250ms, RTT200ms → 350ms |
| Dữ liệu | Chọn cấu hình, đợi đã lưu, reload giữ chặng/cấu hình/số liệu; hai câu áp dụng sai→sửa→hoàn thành; progress cũ dùng schema hiện có |
| Mobile | 320–1440px không tràn, button lab ít nhất44px; focus/chặng/reduced motion theo bộ hiện có; review hình 390/1280px với nội dung thật |
| Học liệu | Schema/registry/sources/prerequisites hợp lệ; không biến bài beta thành module đã hoàn tất |

## Nguồn và giới hạn

HTTP đối chiếu [RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html) và [MDN status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status). RTT/throughput tham khảo [RFC6349](https://www.rfc-editor.org/rfc/rfc6349), đơn vị băng thông đối chiếu [MDN Bandwidth](https://developer.mozilla.org/en-US/docs/Glossary/Bandwidth). Ví dụ và phép tính tự biên soạn, có giả định công khai; không nhập code/ảnh/dependency upstream.

L0 vẫn còn IP/port/routing, HTTPS/TLS, OS/process/concurrency, availability/durability và nhiều năng lực khác. Các bài HTTP/2/3, POST/session/authorization/retry và mạng có queue/loss thuộc đợt tiếp theo. Chưa có reviewer chuyên gia độc lập, học sinh thật hoặc thiết bị thật.

## Kiểm chứng

- Pipeline/build/TypeScript/lint/format đạt; catalog 36 module/12 bài beta. 23 unit tests đạt.
- Toàn bộ E2E: **91 đạt, 1 skip hover trên touch theo thiết kế**, có test tap riêng. Chromium mobile/desktop, Firefox, WebKit; responsive 320/360/390/430/768/1024/1440px và reduced motion.
- Luồng mới kiểm tra HTTP200→404→503→hết bảo trì, nội dung/header, cấu hình mạng và reload sau khi lưu, câu áp dụng sai→sửa→hoàn thành. Regression mười bài trước, progress/export/import/multi-tab/IndexedDB upgrade đạt.
- Review 6 ảnh lab HTTP/network/metrics ở390/1280px trong `.cache/edu04b/` (không commit). HTTP đọc lần lượt trên mobile, hai thông điệp đặt cạnh nhau desktop; JSON wrap trong vùng đọc. Thời gian có số/đơn vị và thanh phân biệt bằng nhãn, không chỉ màu. Nhãn metrics mô tả tác dụng lần bấm và có lời giải ms ngay trên chart.
- Bundle trước đóng gói: JS143,11kB gzip, CSS7,11kB gzip; không đổi dependency. Vite vẫn có warning annotation từ Zod có sẵn, build exit0.

Kiểm tra trên browser emulation và ảnh bởi agent/root; chưa có học sinh thật, reviewer độc lập, screen reader hoặc thiết bị thật. Không dùng các kết quả này để đóng gate pilot hoặc toàn bộ L0.
