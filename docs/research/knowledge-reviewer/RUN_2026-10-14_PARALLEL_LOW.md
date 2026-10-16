# Independent AI knowledge review — 2026-10-14

**Kết luận: pass-with-scope.** Trong 13 bài beta đã đọc, các claim chính, đáp án challenge và trace rủi ro được kiểm dưới giả định công bố chưa cho thấy lỗi P0/P1/P2 xác nhận. Đây là review AI, không phải human expert review hay pilot học sinh; kết luận chỉ áp dụng cho phạm vi chứng cứ dưới đây.

- Checkout: `/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning`; HEAD `f8ae271c2c1e9c3618f1742f2efcee84f4e0dffa`, `git status --short` rỗng khi bắt đầu. Theo thông tin parent, bundle preview là source commit `fix24625a3`; commit HEAD tiếp theo chỉ đổi config agent. Không xác minh hash bundle độc lập.
- Profile: `.codex/agents/knowledge_reviewer.toml` bản 1.0.1, model yêu cầu `gpt-6-sol`, reasoning `low`. Review độc lập, không đọc finding/report cũ hoặc trao đổi với student tester trước kết luận.
- Phạm vi: đọc `story`, `explanation`, `limit`, `terms`, `prediction`, `challenge`, `sources`, `caseStudy` của cả 13 bài/version 1; đối chiếu engine và renderer liên quan. Thực thi trace DNS, cache, queue, network, routing, metrics bằng `trace.mjs`. Trình duyệt Chromium ở viewport 390×844 đã mở preview `http://127.0.0.1:4173/#/learn/dns`, đi qua prediction đến lab và chạy TTL boundary; có `browser-dns-lab.txt`, screenshot. Chưa kiểm từng chặng UI của 12 bài khác, chưa kiểm lưu tiến độ/reload hoặc mạng thật.

## Finding xác nhận

Không có P0/P1/P2 được xác nhận trong phạm vi trên. Test pass không chứng minh tất cả claim ngoài các giả định của bài; những khoảng trống chứng cứ bên dưới vẫn cần xử lý trước khi gọi toàn bộ giáo trình là đã được chuyên gia thẩm định.

## Provenance gap và giới hạn cần theo dõi

**PG-01 — capacity/source, chưa xác minh bằng nguồn sơ cấp.** `content/lessons/vi/foundations.json`, bài `capacity`, `sources` chỉ dẫn System Design Primer (nguồn tổng hợp cộng đồng). Đáp án `challenge` tự nó đúng với đơn vị thập phân công bố: `2.000 × 100 kB = 200.000 kB = 200 MB` lưu, năm lượt ảnh tạo `1.000 MB/ngày` truyền. Đây là phép tính từ giả định, không phải benchmark hay claim từ Primer. Nếu quy trình học liệu yêu cầu primary source cho quy ước đơn vị, bổ sung nguồn chuẩn đo lường trực tiếp; không sửa đáp án chỉ vì gap này. Kiểm lại source link và assessment sau khi bổ sung. Mức: provenance gap, không P2 vì cơ chế và đáp án không sai.

**PG-02 — request/source, độ sâu nguồn.** Bài `request` dùng MDN overview chính thức để dẫn câu chuyện client–server; con số 20+80+20 ms là giả định của bài. Nguồn này không chứng minh thời gian thực của một request. `limit` đã nói rõ không phải đo website thật, nên chưa thành finding; giữ nhãn giả định khi biên tập về sau.

**Chưa thực thi đủ:** replica change-lag/checkpoint; traffic/balance và bài design phối hợp; TCP/UDP phase; HTTP status; capacity controls. Với những bài này ma trận ghi riêng bằng chứng đọc code và tính độc lập, không đánh dấu là trace thực thi. Chưa đánh giá claim thuộc 36 module/7 track chưa có nội dung, failover, offline, hệ thống thật, bản dịch thuật ngữ qua thử nghiệm người học.

## Trace rủi ro và expected tính độc lập

| Bài | Input và expected độc lập | Actual đã quan sát |
| --- | --- | --- |
| DNS | TTL=5 s, lấy .10 tại t=0, nguồn đổi .20; tra t=0 vẫn .10, đúng t=5 lấy .20. Theo [RFC 1035 §4.1.3, §7.4](https://www.rfc-editor.org/rfc/rfc1035). | Engine và preview mobile đều khớp; preview ghi cache `.10` trước hạn và `.20` sau lookup ở giây 5. |
| Cache | Bản 201, nguồn→205 tại t=0, TTL=5 phút; đọc t=0 còn 201, tại t=5 miss→205. [Azure Cache-Aside, Problems](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) hỗ trợ nguy cơ stale, số phút là giả định bài. | Engine khớp. |
| Queue | 8 đến/s, ba worker ×2/s → backlog tăng 2/s, sau 3 s là 6. Đổi bốn worker → backlog vẫn 6; năm worker → 4. [Azure Queue-Based Load Leveling, considerations](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling) hỗ trợ producer>consumer làm queue tăng. | Engine khớp; challenge nêu rõ bằng tốc độ đến chỉ ngăn tăng backlog. |
| Network | 1.000 kB=8.000.000 bit. 8 Mbps→1.000 ms truyền, 16 Mbps→500 ms; cộng RTT 100 và xử lý 50 →1.150/650 ms. [RFC 6349 §1.2](https://www.rfc-editor.org/rfc/rfc6349) xác nhận RTT và bandwidth là đại lượng riêng; công thức lý tưởng là phép tính dưới giả định bài. | Engine khớp; renderer dùng kB, Mbps, ms rõ. |
| Routing | Không route/default route, dù port 8080 hay 9090 đều dừng ở router. [RFC 1122 §3.3.1](https://www.rfc-editor.org/rfc/rfc1122), [RFC 9293 §3.1](https://www.rfc-editor.org/rfc/rfc9293) hỗ trợ tách định tuyến IP và port TCP. | Engine khớp; renderer nêu mô hình bỏ firewall/NAT/handshake. |
| Metrics | Hai worker, 20 arrival t=0, 100 ms mỗi việc: hoàn tất cặp ở 100…1000 ms; median 550, nearest-rank p95=1000, 20/s theo cửa sổ 1 s. Hai việc cuối 1000 ms: hoàn tất t=1900, median 550, p95=1900, throughput=20/1.9≈10.53/s. [Google SRE, Worrying About Your Tail](https://sre.google/sre-book/monitoring-distributed-systems/) hỗ trợ nhìn tail; nearest-rank được bài định nghĩa. | Engine khớp. |

Nguồn bổ sung đã mở theo mục: [RFC 768, introduction](https://www.rfc-editor.org/rfc/rfc768) cho UDP không bảo đảm giao và chống trùng; [RFC 9110 §§15.3, 15.5, 15.6](https://www.rfc-editor.org/rfc/rfc9110.html) cho HTTP 200/404/503; [PostgreSQL 18 Hot Standby §26.4](https://www.postgresql.org/docs/current/hot-standby.html) cho standby có thể chưa thấy thay đổi mới; [Google SRE Handling Overload, Pitfalls of QPS](https://sre.google/sre-book/handling-overload/) cho ranh giới mô hình công suất cố định. Các nguồn không xác nhận số cụ thể trong tình huống giả định.

Chi tiết từng bài/claim/assessment và loại bằng chứng ở `claim-matrix.json`. Các script, output, screenshot đều trong thư mục artifact này. Không sửa source, profile, docs, lock, commit hay preview server.
