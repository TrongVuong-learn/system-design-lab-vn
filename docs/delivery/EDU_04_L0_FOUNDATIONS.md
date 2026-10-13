# EDU-04a — Bốn thí nghiệm nền tảng L0

Ngày: 2026-10-13. Nhánh: `codex/edu-04-l0-foundations`.
Owner thực hiện: Codex. Reviewer tự kiểm tra: agent; chưa có chuyên gia độc lập hoặc pilot học sinh.

## Phạm vi và nghiệm thu

Triển khai một phần B0/ENG-03 và B1/EDU-04 đã được giao. Bổ sung bốn bài beta, mỗi bài có tình huống, dự đoán, mô hình tương tác, câu hỏi chuyển giao, glossary và nguồn. Mục tiêu thị giác là nhìn được cơ chế: thanh latency, đường tra DNS, mảnh byte/datagram, bảng phép tính. Mobile xếp dọc, button ít nhất 44 px, không cần hover để thao tác.

| Bài / module | Trace kiểm chứng | Điều cần hiểu |
| --- | --- | --- |
| metrics / L0.6 | 20 lượt cùng đến; 2 worker, hai việc cuối từ 100 lên 1.000 ms: median 550 không đổi, p95 1.000 → 1.900 ms | Latency gồm xếp hàng; throughput theo cửa sổ cả đợt; percentile có cách tính rõ |
| dns / L0.4 | Lấy .10 lúc 0, nguồn đổi .20, cache còn .10 lúc 4; tra đúng giây 5 lấy .20 | TTL hết không tự truy vấn; lần tra dùng nguồn khi cache hết hạn |
| transport / L0.4 | Mất phần 2; TCP giữ 3, giao đủ sau gửi lại; UDP nhận 1 và 3, không tự gửi lại | TCP là luồng byte có thứ tự; UDP không bảo đảm giao đủ; không suy luận tốc độ từ sơ đồ |
| capacity / L0.6 | 2.000 người × 100 kB = 200 MB lưu; 5 lượt/người/ngày → 1.000 MB truyền/ngày | Đơn vị thập phân, tải trung bình khác đỉnh giả định; lưu trữ khác truyền dữ liệu |

Chặn xuất bản dữ liệu lỗi, giữ nguyên ID/schema tiến độ cũ, học tiếp được sau reload, chạy regression sáu bài cũ và responsive 320–1440 px. Nội dung/câu hỏi mới viết cho bối cảnh trường học; Primer dùng như khung kiến thức, RFC/SRE hỗ trợ cơ chế. Không sao chép ảnh/code upstream. Nguồn Primer khóa commit và ghi CC BY 4.0.

## Trạng thái phạm vi

Source đã có: bốn bài, engine thuần, giao diện, metadata cho mười bài, validation build, prerequisite gợi ý và test. Chi tiết contract tại ADR 0003. Không coi B0/B1 hoàn tất: còn HTTP/TLS/port/routing/RTT/bandwidth, concurrency/availability/durability, độ lớn/lũy thừa hai, design process K01, bài phản chứng mở rộng, review chuyên gia và pilot. L1–L5 và bảy track giữ theo backlog.

## Kiểm chứng

- Content pipeline: 36 module, 10 bài beta; build/TypeScript, lint, format và 20 unit tests đạt.
- Chạy toàn bộ 84 E2E: 79 đạt, 1 skip hover trên touch theo thiết kế, 4 ca mới ban đầu lỗi vì test so sánh innerText với textContent. Sửa assertion dùng cùng innerText; 4 ca mới đạt trên Chromium mobile/desktop, Firefox, WebKit. Không phải lỗi mất checkpoint của ứng dụng.
- Sau chỉnh UI từ review ảnh, chạy lại 12 ca (4 foundations + 8 responsive): tất cả đạt. Phạm vi responsive gồm 320/360/390/430/768/1024/1440 px, cả bốn chặng của mười bài, button 44 px và reduced motion.
- Tự review 8 ảnh lab ở 390/1280 px trong `.cache/edu04/` (không commit): số liệu có đơn vị, nút giao thức có trạng thái chọn; cache DNS và nguồn đặt thành hai bản ghi so sánh, không vẽ đường tới nguồn trong lần hit. Không tràn ngang qua matrix.
- Sáu bài cũ, lưu/resume, import/export, lỗi storage, nhiều tab, nâng IndexedDB và thuật ngữ popup được kiểm tra regression. Không đổi storage schema, ID hoặc đáp án cũ.
- Bundle cuối: JS 138,51 kB gzip, CSS 6,91 kB gzip. Vite còn cảnh báo annotation từ Zod có sẵn; build exit 0. Không đổi dependency.

Đây là kiểm thử tự động và review ảnh bởi agent. Chưa kiểm tra điện thoại thật, accessibility audit độc lập, chuyên gia nội dung hay pilot học sinh. Không thay kết quả audit lịch sử ngày 12/10.
