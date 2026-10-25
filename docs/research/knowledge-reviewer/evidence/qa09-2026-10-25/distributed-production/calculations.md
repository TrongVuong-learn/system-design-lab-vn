# Phép tính và trace độc lập — nhóm L3/L4/capstone

Checkout `/Users/vuongn/Documents/ChatGPT/System Design learning`, HEAD `68f7de6cd2d1659c0b9840c067e5e519539c1194`. Tính tay từ giả định trong từng bài, không gọi hàm chấm. `mode=calculated`; không có runtime mô phỏng hoặc browser trong lượt này.

| Bài / tình huống | Input và expected độc lập | Đối chiếu source |
| --- | --- | --- |
| `distributed-order` clocks | B local=2 nhận 4 ⇒ `max(2,4)+1=5`; `[2,0]` và `[0,3]` bất khả so sánh theo từng thành phần. | Ví dụ/chọn đáp án khớp. |
| `consensus-raft` votes/commit | Với N=3, majority=2. Chỉ A có X là 1/3 nên chưa commit; hai nút A/B có X term hiện tại cho phép commit nếu điều kiện Raft còn lại giữ. | Đáp án khớp; quy tắc term hiện tại đã được nêu. |
| `quorum-fencing` intersection | N=5,R=W=3 ⇒ giao tối thiểu R+W−N=1. Giao tập không ép client chọn version mới nhất. | Đáp án khớp; không suy linearizability chỉ từ đại số. |
| `quorum-fencing` lease/token | A kiểm lease, pause; B nhận token 8 và kho chấp nhận; A token 7 đến sau ⇒ kho cần từ chối 7 bằng so và ghi nguyên tử. | Đáp án khớp; chưa chạy kho thật. |
| `conflicts-crdt` counter/set | max([2,0],[0,3])=[2,3], tổng 5; merge lại [2,0] không đổi. Remove tag t1 không loại add tag t2 chưa quan sát. | Đáp án khớp trong mô hình G-counter và observed-remove add-wins của bài. |
| `slo-observability` | 10.000×0,1%=10 lỗi cho phép; 30 lỗi thực tế, vượt 20. | Đáp án khớp khi cùng mẫu số/cửa sổ. |
| `resilience` | 1.000−700=300ms < retry 800ms. Ba tầng tối đa 3 lần/tầng có tối đa 3³=27 lời gọi tới cuối. | Đáp án khớp; 27 là biên trên khi lịch xấu. |
| `capacity-tail` Little/p95/fanout | 20/s×0,5s=10 trong hệ ổn định; 19×10+1000=1190ms, mean=59,5ms, nearest-rank p95 là vị trí ceil(0,95×20)=19 ⇒ 10ms; fanout độc lập 1−0,99^10≈9,5618%. | Đáp án khớp. Nguồn MIT L17.pdf §17.4.1 (PDF p.11) hỗ trợ trực tiếp; correction sau khi đọc đủ PDF. |
| `recovery-cost` | 10+20+40+20+10=100 phút; 100×2+300×1+400+100=1000 đơn vị/tháng; 10% của 200 storage=20. | Đáp án khớp giả định nối tiếp và đơn giá hư cấu. |
| `capstone-foundations` | 2MB/(1MB/s)=2s; 20+80+100=200ms ⇒ 2,20s. Khi 2MB/s ⇒ 1,20s. | Đáp án khớp giả định bước nối tiếp, bỏ overhead/mất gói. |
| `capstone-scaling` | Warm: 200×0,2+20=60 thao tác/s; cold=220; hit 50%=120. Backlog=(20−15)×60=300; drain sau dừng nhận=300/15=20s. Pool=4×25=100, vượt budget80 là20. | Đáp án khớp mô hình cửa sổ đều, không retry. |
| `capstone-production` | Canary=1000×20%=200 lỗi, old=9000×1%=90; tổng290; success=97,1%; budget=1%×10000=100; vượt190. Restore90−RTO60=30 phút. | Đáp án khớp cửa sổ đã nêu. |
| `capstone-architecture` | 20.000×2/600≈66,67 lượt/s trung bình; không suy peak. | Đáp án khớp. |

## Nguồn đọc trực tiếp trong lượt này

Ngày kiểm `2026-10-25`; URL sống không có revision nội dung ghi `unknown`. Các nguồn được mở để đối chiếu cơ chế tương ứng, không gán số fixture cho nguồn: [CAP Gilbert/Lynch](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf), [Lamport 1978](https://lamport.azurewebsites.net/pubs/time-clocks.pdf), [Raft extended paper §§5.2–5.4](https://raft.github.io/raft.pdf), [Dynamo 2007](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf), [PACELC Abadi 2012](https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf), [fencing theo Kleppmann](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html), [PostgreSQL 18 PREPARE TRANSACTION](https://www.postgresql.org/docs/18/sql-prepare-transaction.html), [Azure Saga](https://learn.microsoft.com/en-us/azure/architecture/patterns/saga), [AWS outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html), [CRDT Preguiça/Baquero/Shapiro v1](https://arxiv.org/pdf/1805.06358), [Google SRE Implementing SLOs](https://sre.google/workbook/implementing-slos/), [OpenTelemetry primer](https://opentelemetry.io/docs/concepts/observability-primer/), [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [OIDC Core 1.0 errata set 2](https://openid.net/specs/openid-connect-core-1_0.html), [RFC 9700 BCP 240](https://www.rfc-editor.org/info/rfc9700/), [PostgreSQL 18 standby](https://www.postgresql.org/docs/18/warm-standby.html), [PostgreSQL 18 PITR](https://www.postgresql.org/docs/18/continuous-archiving.html), [AWS DR](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html), [MIT queueing §4.4](https://web.mit.edu/urban_or_book/www/book/chapter4/4.4.html).

Correction: nguồn `https://courses.csail.mit.edu/6.02/s2009/handouts/L17.pdf` là MIT 6.02 Lecture 17, có Little’s Law ở §17.4.1 trên trang PDF 11–12 và ứng dụng ở trang 13. Kết luận cũ dựa vào web snippet là false positive; URL nguồn hợp lệ. MIT queueing §4.4 là nguồn đối chiếu bổ sung. Trang RFC errata cho RFC 9700 trả 429 trong lượt này, nên không ghi là đã rà errata; bản OIDC tự ghi đã tích hợp errata set 2.
