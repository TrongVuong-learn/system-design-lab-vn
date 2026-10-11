# Bản đồ giáo trình System Design Lab

Phiên bản đề xuất: 3 — 11/10/2026. Tài liệu đặc tả phạm vi; các module dưới đây chưa phải học liệu đã xây dựng. Kế hoạch sản phẩm: [SYSTEM_DESIGN_WEB_PLAN.md](SYSTEM_DESIGN_WEB_PLAN.md). Chuẩn giảng dạy: [TEACHING_GUIDE.md](TEACHING_GUIDE.md).

## 1. Nguyên tắc bao phủ và phân level

Yêu cầu sản phẩm: từng level có khu vực riêng, kiến thức được tổ chức toàn diện và tăng chiều sâu theo năng lực. Phần cốt lõi bao phủ vòng đời từ hiểu nền tảng, xác định yêu cầu, thiết kế, mở rộng, bảo đảm tính đúng đắn đến vận hành và tiến hóa hệ thống. Các lĩnh vực ứng dụng chuyên biệt có nhánh riêng và được theo dõi độ hoàn thiện độc lập.

Level không gắn cứng với số năm kinh nghiệm. Người học có thể mạnh ở database nhưng thiếu networking; website cần thể hiện hồ sơ năng lực theo chủ đề và gợi ý phần cần bổ sung.

Học sinh cấp 3 chưa từng lập trình có lối bắt đầu riêng trong L0. Các thuật ngữ dưới đây phục vụ tác giả kiểm tra độ bao phủ; giao diện người học dùng tên dễ hiểu và giới thiệu thuật ngữ sau ví dụ. Ở mọi level, các lớp trực giác, cơ chế, áp dụng và triển khai có bằng chứng đánh giá riêng. Giữ toàn bộ chiều sâu kỹ thuật, bổ sung bước đệm để tiếp cận.

- **L0:** hiểu hệ thống hoạt động thế nào.
- **L1:** thiết kế một dịch vụ và dữ liệu đúng yêu cầu.
- **L2:** mở rộng và kiểm soát tải.
- **L3:** phân tích tính đúng đắn trong hệ thống phân tán.
- **L4:** vận hành, bảo vệ và khôi phục hệ thống.
- **L5:** thiết kế tổng thể và quản lý quá trình tiến hóa kiến trúc.

Mỗi module được chia thành các bài nhỏ sau khi chốt mục tiêu học. Danh sách module là phạm vi cần phát triển; số lượng tiêu đề không đại diện cho độ sâu hay mức hoàn thiện. Một module chỉ hoàn chỉnh khi năng lực bắt buộc có bài dạy, hoạt động áp dụng, đánh giá và review.

## 2. Sáu level cốt lõi

### L0 — Nhập môn máy tính, mạng và hệ thống

Đầu vào: biết dùng trình duyệt và các phép tính cơ bản; không yêu cầu lập trình, SQL hoặc tiếng Anh chuyên ngành. Giải thích phần trăm, đơn vị và cách đọc biểu đồ đúng lúc cần dùng. Code xuất hiện ở lớp kỹ thuật với bài bổ trợ.

**Lối Bắt đầu từ số 0** gồm sáu bài dẫn nhập nằm trong các module L0:

| Bài | Tình huống | Điều hiểu được |
| --- | --- | --- |
| Một tin nhắn đi đến bạn mình thế nào? | Gửi tin qua các điểm trung gian | Một thao tác có nhiều chặng và có thể phải chờ |
| Vì sao cả lớp cùng vào thì trang chậm? | Nhiều người cùng hỏi một bàn trực | Giới hạn xử lý và hàng đợi |
| Nhanh nghĩa là gì? | Đo thời gian một bạn chờ và số bạn được phục vụ | Thời gian chờ khác với số việc làm xong |
| Vì sao website vẫn hiện phòng học cũ? | Xem lịch bằng bản sao chưa được cập nhật | Bản sao giúp tra cứu nhưng có thể cũ |
| Nếu người đang trực nghỉ thì sao? | Chuyển việc và kiểm tra thông tin bàn giao | Cần chuẩn bị cho một thành phần ngừng hoạt động |
| Chọn cách nào cho ngày hội của trường? | Giới hạn người hỗ trợ và thời gian chờ | Mỗi lựa chọn có lợi ích và chi phí |

Các mục như event loop, heap, QUIC và percentile được giữ trong chương trình nhưng chia thành bài riêng sau phần nền, không dồn vào màn hình đầu.

| ID | Module và kiến thức | Hoạt động trực quan |
| --- | --- | --- |
| L0.1 | Hệ thống là gì; client/server; trạng thái; dữ liệu; ranh giới và phụ thuộc; yêu cầu chức năng/phi chức năng | Ghép luồng từ thao tác người dùng đến nơi lưu dữ liệu |
| L0.2 | CPU, RAM, disk/filesystem; process/thread; concurrency/parallelism; blocking/non-blocking I/O; event loop; tài nguyên hữu hạn | Timeline CPU/I/O, thay số worker và quan sát thời gian chờ |
| L0.3 | Array/list, hash table, tree, heap/queue; độ phức tạp; locality; serialization và compression ở mức trực giác | So sánh thao tác tìm kiếm/lưu trữ và chi phí khi dữ liệu tăng |
| L0.4 | IP, port, DNS, routing, TCP/UDP, connection; packet loss, RTT và bandwidth | Theo dấu kết nối, tạo packet loss/delay trong mô hình được giới hạn |
| L0.5 | HTTP, HTTPS/TLS, cookies/session; proxy; HTTP/2 và HTTP/3/QUIC ở mức tổng quan; request/response và streaming | Mở từng chặng DNS → kết nối → TLS → API; xem dữ liệu được gửi ở đâu |
| L0.6 | Latency, throughput, concurrency, percentiles; availability/durability; đơn vị byte/time; ước lượng traffic/storage; phân bố và workload | Tạo tập request, xem median/p95 và thử thay các giả định ước lượng |

Đầu ra: giải thích một request đi qua đâu, phân biệt các chỉ số và đưa ra ước lượng có đơn vị cùng giả định. Capstone: tìm nguyên nhân chậm trong một ứng dụng đơn giản.

### L1 — Thiết kế dịch vụ và dữ liệu

Đầu vào của lớp giải thích và mô phỏng: năng lực L0 liên quan; chưa cần code/SQL. Dùng thẻ yêu cầu và bảng dữ liệu có thể thao tác trước. Các bài triển khai code/SQL có điều kiện riêng và bài bổ trợ về biến, hàm, điều kiện, request/response và truy vấn cơ bản.

| ID | Module và kiến thức | Hoạt động trực quan |
| --- | --- | --- |
| L1.1 | Thu thập yêu cầu; access pattern; giới hạn phạm vi; invariants; thiết kế thành phần/interface; separation of concerns; sơ đồ context/container | Chuyển yêu cầu thành API, dữ liệu, ràng buộc và sơ đồ có trách nhiệm rõ |
| L1.2 | REST/RPC/gRPC/GraphQL; pagination và tính nhất quán giữa các trang; API versioning; validation; error contract; idempotency; timeout với kết quả chưa rõ; giới hạn của cancellation; authentication/authorization và session | Thiết kế hợp đồng API, thử phân quyền, gửi lại request và tra cứu kết quả chưa xác định |
| L1.3 | Relational/document/key-value/graph/wide-column; schema; normalization/denormalization; constraints; SQL và access pattern; nguồn dữ liệu gốc và dữ liệu suy ra | Chọn mô hình dữ liệu cho truy vấn cụ thể, so sánh chi phí và tính đúng đắn |
| L1.4 | Index, B+ tree, hash index, LSM ở mức nguyên lý; buffer/cache; query plan; joins; read/write amplification | Duyệt index, xem query plan mô phỏng, thay đổi index và workload |
| L1.5 | ACID; concurrency anomalies; isolation; locking; MVCC; optimistic/pessimistic concurrency; deadlock; WAL và recovery | Xen kẽ hai transaction, xem anomaly và kiểm tra invariant |
| L1.6 | File/block/object storage; upload; identifier generation và uniqueness; background job cơ bản; config/secrets; logging/metrics cơ bản; test, deploy và rollback một dịch vụ | Thiết kế URL shortener/file upload với sơ đồ dữ liệu, tín hiệu quan sát và tình huống lỗi |

Đầu ra: xây dựng bản thiết kế dịch vụ có API, mô hình dữ liệu, phân quyền và hành vi khi retry/lỗi rõ ràng. Capstone: URL shortener hoặc ứng dụng đặt chỗ ở phạm vi một database.

### L2 — Mở rộng hệ thống và xử lý tải

Đầu vào: năng lực về API, data modeling, index và transaction trong L1.

| ID | Module và kiến thức | Hoạt động trực quan |
| --- | --- | --- |
| L2.1 | Vertical/horizontal scaling; stateless/stateful; L4/L7 load balancing; health check; service discovery; connection pooling | Thêm/tắt server; thay chính sách phân tải; giữ nút thắt downstream |
| L2.2 | Cache-aside/read-through/write-through/write-back; TTL, eviction, invalidation; hot key; stampede; negative caching; CDN/edge caching | Đổi workload, cập nhật dữ liệu, thử cold start, stampede và độ mới |
| L2.3 | Primary/replica; sync/async replication; replication lag; read routing; failover cơ bản | Đọc ngay sau ghi và chọn nguồn đọc theo yêu cầu |
| L2.4 | Partitioning/sharding; hash/range; consistent hashing; shard key; hot partition; resharding; secondary index và truy vấn xuyên shard | Phân phối dữ liệu và traffic, thêm shard, tạo hot tenant và di chuyển dữ liệu |
| L2.5 | Queue/pub-sub/log; partition và ordering; ACK; delivery semantics; retry, deduplication, idempotency; dead-letter queue | Làm mất ACK, chạy lại sự kiện, thay số consumer và đọc backlog |
| L2.6 | Rate limiting, admission control, backpressure; batching; load shedding; autoscaling delay; burst và tải kéo dài | Thử traffic spike, quota theo tenant, tốc độ vào/ra và quy tắc giới hạn |

Đầu ra: chọn giải pháp theo workload, phát hiện bottleneck mới và hiểu chi phí/độ phức tạp tăng thêm. Capstone: dịch vụ đọc nhiều kết hợp notification/analytics bất đồng bộ.

### L3 — Hệ thống phân tán và tính đúng đắn

Đầu vào: replication, partitioning, messaging và transaction ở độ sâu bài yêu cầu. Bổ trợ xác suất, state machine và invariant đúng lúc bằng sự kiện, trạng thái và “điều luôn phải đúng”. Việc hiểu phép so sánh chưa đủ để đánh dấu đã hiểu thuật toán hoặc bảo đảm phân tán.

| ID | Module và kiến thức | Hoạt động trực quan |
| --- | --- | --- |
| L3.1 | Partial failure; network partition; clocks và ordering; happens-before; Lamport/vector clocks; consistency models; CAP/PACELC với giả định | Thay lịch gửi/nhận, gây partition và kiểm tra các lịch sử đọc/ghi |
| L3.2 | Consensus, replicated state machine; safety/liveness; leader election; Raft; tổng quan Paxos và điều kiện mô hình | Mất leader, chia mạng, quan sát term/log/commit; thử lịch lỗi xác định |
| L3.3 | Quorum và điều kiện bảo đảm; membership; failure detector; lease; distributed locks; fencing tokens; split brain | Làm trễ client giữ lock, thay leader và kiểm tra ghi từ chủ cũ |
| L3.4 | Distributed transaction; 2PC; saga; outbox/inbox; CDC; event sourcing và CQRS; ranh giới của exactly-once | Dừng giữa các bước, replay, bù trừ và kiểm tra invariant end-to-end |
| L3.5 | Concurrent updates; conflict resolution; versioning; CRDT ở mức nguyên lý; anti-entropy/read repair | Hai phía cập nhật khi offline rồi kết nối lại; so sánh chính sách hợp nhất |
| L3.6 | Multi-region; active/passive và active/active; routing; locality; cross-region latency; data placement; failover/failback | Mất region, thay đường đọc/ghi, xem độ mới và điều kiện phục hồi |

Đầu ra: nêu rõ failure model, bảo đảm và giới hạn của thiết kế; phân biệt invariant đúng với hệ thống chỉ có số liệu đẹp. Capstone: kho key-value hoặc workflow đặt hàng có lỗi giữa chừng. Mô hình các thuật toán phải được chuyên gia review trước khi xuất bản.

### L4 — Production, bảo mật, độ tin cậy và chi phí

Đầu vào: L2 và phần L3 liên quan. Security cơ bản ở L1 được bổ sung chiều sâu tại đây.

| ID | Module và kiến thức | Hoạt động trực quan |
| --- | --- | --- |
| L4.1 | SLI/SLO/SLA; error budget; logs/metrics/traces; correlation; sampling; cardinality; alerting; incident response và postmortem | Điều tra sự cố qua dashboard/timeline và chọn cảnh báo có hành động |
| L4.2 | Timeout/deadline; retry budget, exponential backoff/jitter; circuit breaker; bulkhead; graceful degradation; overload/cascading failure | Tạo retry storm, giới hạn tài nguyên và so sánh các cơ chế phục hồi |
| L4.3 | Capacity planning; headroom; queueing; Little’s Law trong điều kiện áp dụng; tail latency; fan-out; load/soak testing; profiling | Dự đoán rồi đo trong mô hình; đổi phân bố service time và tải |
| L4.4 | Threat modeling; IAM/RBAC/ABAC; OAuth/OIDC; session/token lifecycle; tenant isolation; encryption và key management; secrets; audit; abuse prevention; privacy/retention/deletion | Vẽ trust boundary, thử quyền truy cập chéo tenant và kiểm tra vòng đời dữ liệu |
| L4.5 | VM/container/serverless; orchestration; network boundary; IaC; CI/CD; feature flag; canary/blue-green/rolling; rollback; config/schema compatibility; chaos testing | Triển khai phiên bản mới, gây lỗi, rollback và kiểm tra client cũ |
| L4.6 | Backup/restore; RPO/RTO; disaster recovery drill; retention; cost model; storage/compute/network egress; chi phí observability và công vận hành; resource efficiency; build/buy | Khôi phục từ backup, đối chiếu mục tiêu và phân tích chi phí theo workload |

Đầu ra: thiết kế được cách đo, phát hiện, xử lý và khôi phục sự cố, đồng thời giải thích giới hạn quyền truy cập và ngân sách. Capstone: kế hoạch production readiness và diễn tập sự cố của một hệ thống có sẵn.

### L5 — Thiết kế tổng thể và tiến hóa kiến trúc

Đầu vào: các năng lực cốt lõi L1–L4. Không yêu cầu người học nắm mọi sản phẩm/vendor cụ thể.

| ID | Module và kiến thức | Hoạt động trực quan |
| --- | --- | --- |
| L5.1 | Quy trình thiết kế end-to-end; clarification; workload và ước lượng; APIs/data; thành phần; failure/security/cost review; chiến lược kiểm chứng | Nhận một đề chưa đủ thông tin và xây bản thiết kế với giả định rõ |
| L5.2 | Modular monolith, microservices, SOA, event-driven; DDD/bounded context; coupling/cohesion; sync/async; ownership và team boundaries | So sánh các cách chia hệ thống dưới cùng yêu cầu và năng lực vận hành |
| L5.3 | Evolutionary architecture; strangler; database/schema migration; expand-contract; backfill; dual write và reconciliation; API/event compatibility; rollback | Chuyển dữ liệu và traffic qua nhiều phiên bản mà vẫn kiểm tra invariant |
| L5.4 | Platform/control plane/data plane; multi-tenancy; noisy neighbor; quotas; isolation; cells và blast radius; governance | Chọn mô hình tenant, cô lập sự cố và phân phối tài nguyên |
| L5.5 | ADR/RFC; trade-off matrix; risk/uncertainty; buy/build; total cost; vendor dependence; operational burden; roadmap và technical debt | Bảo vệ phương án trước các ràng buộc mới về người, tiền và thời gian |
| L5.6 | Architecture review; đọc paper/postmortem; benchmark và phản biện giả định; strategy validation; capstone nhiều giai đoạn | Review thiết kế, đổi yêu cầu, xử lý incident và lập kế hoạch nâng cấp |

Đầu ra: đề xuất, bảo vệ và điều chỉnh kiến trúc theo bằng chứng; lập kế hoạch migration và vận hành. Capstone gồm bản thiết kế, ADR, threat/failure review, ước lượng, kế hoạch triển khai/rollback và diễn tập. Phần lập luận có rubric tự đánh giá hoặc reviewer; không gắn nhãn tự động “đã thành thạo” khi chỉ hoàn thành trắc nghiệm.

## 3. Các nhánh chuyên sâu

| Nhánh | Điều kiện tiên quyết chính | Phạm vi và bài tổng hợp |
| --- | --- | --- |
| AI/ML Systems | API, cache, queue, dữ liệu, security; bổ trợ ML căn bản | Training/inference; feature/data pipeline; model/version registry; GPU memory và scheduling; batching/streaming; model routing/fallback; RAG ingestion/chunking/embedding/hybrid retrieval/reranking; index freshness/ACL; eval/observability; prompt/tool security; agent workflow và quyền hành động. Capstone: hệ thống hỏi đáp tài liệu có phân quyền, đánh giá chất lượng, latency và chi phí |
| Data Engineering | Storage, messaging, replication, transaction | ETL/ELT, CDC; batch/stream; event time, watermark, windowing, late events; replay/checkpoint; schema evolution; data quality/lineage; OLTP/OLAP; warehouse/lake/lakehouse; orchestration. Capstone: analytics pipeline có dữ liệu đến trễ và backfill |
| Search, Recommendation và Geo | Index, partitioning, pipeline; bổ trợ scoring/vector | Inverted index; query pipeline/ranking; autocomplete; vector/ANN và hybrid search; candidate generation/ranking; feedback loop; spatial index/geohash; freshness và evaluation. Capstone: search hoặc khám phá địa điểm với dữ liệu cập nhật |
| Realtime và Collaboration | Networking, messaging, ordering, consistency | WebSocket/SSE/polling; connection lifecycle; fan-out; presence; offline sync; event order; conflict resolution; OT/CRDT và phạm vi áp dụng. Capstone: chat hoặc collaborative editor |
| Media và Streaming nội dung | Object storage, queue, CDN, networking | Upload lớn/resumable; transcoding pipeline; adaptive bitrate; VOD/live; manifest/segment; origin/CDN; quyền phát nội dung; latency và buffering. Capstone: hệ thống xử lý và phát video có job lỗi, spike lượt xem và ngân sách băng thông |
| Cloud, Platform và Edge | L2, security, SRE | Kubernetes/orchestration sâu; autoscaling; service mesh khi phù hợp; serverless; multi-region; CDN/edge; scheduling/resource isolation; platform APIs; control plane; IaC và delivery. Capstone: nền tảng nhiều tenant có quota và vùng ảnh hưởng lỗi |
| Hệ thống nghiệp vụ có invariant chặt | Transaction, idempotency, workflow và failure handling | Inventory/reservation; payment workflow và reconciliation; ledger; audit; scheduling; policy changes và compensation. Capstone: đặt vé/đặt hàng với retry, timeout và trạng thái không rõ kết quả |

Các nhánh này là một phần của bản đồ sản phẩm. Năng lực chuyên sâu được đánh giá theo từng nhánh; AI không phải một level mặc định cao hơn mọi lĩnh vực khác. Các công nghệ cụ thể là ví dụ triển khai và có ngày review riêng.

## 4. Ma trận kiểm tra độ bao phủ

Ma trận dưới đây xác định nơi chịu trách nhiệm chính cho từng miền. Khi một chủ đề xuất hiện ở nhiều level, dùng cùng topic ID và tăng depth thay vì sao chép bài. Đây là bản phân bổ phạm vi, không phải báo cáo học liệu đã hoàn thành.

| Miền kiến thức | Giới thiệu | Đào sâu | Bằng chứng học tập cần có |
| --- | --- | --- | --- |
| Requirements và trade-offs | L0.1, L1.1 | L5.1, L5.5 | Yêu cầu đo được, giả định và so sánh phương án |
| Compute/OS/network/protocols | L0.2–L0.5 | L2.1, L4.3, Platform | Trace một request và giải thích bottleneck |
| API/contracts/identity | L1.2 | L4.4, L5.3 | API có quyền truy cập, retry semantics và tương thích phiên bản |
| Data modeling/storage/index/query | L1.3–L1.4, L1.6 | L2.4, Data/Search | Access pattern gắn với schema và đường truy vấn |
| Transactions/concurrency/recovery | L1.5 | L3.4, L4.6 | Bài xen kẽ thao tác và invariant vẫn đúng |
| Capacity/performance/cache/CDN | L0.6, L2.1–L2.2 | L4.3, L4.6 | Ước lượng có giả định và số liệu thử nghiệm |
| Replication/partitioning | L2.3–L2.4 | L3.3, L3.6 | Stale read, hot partition và failover |
| Messaging/event processing | L2.5–L2.6 | L3.4, Data/Realtime | Duplicate/out-of-order/replay có kết quả được giải thích |
| Distributed correctness | L2.3, L2.5 | L3.1–L3.5 | Lịch sử sự kiện, safety/liveness và giới hạn bảo đảm |
| Reliability/observability/DR | L2.1, L2.6 | L4.1–L4.3, L4.6 | SLO, incident, phương án khôi phục và đo kết quả |
| Security/privacy/abuse | L0.5, L1.2, L1.6 | L4.4, mọi capstone liên quan | Trust boundary, phân quyền và vòng đời dữ liệu |
| Delivery/infrastructure/evolution | L1.6 | L4.5, L5.2–L5.4 | Rollout, schema migration và rollback |
| Cost/resource efficiency/organization | L0.6, L2 | L4.6, L5.4–L5.5 | Cost model, ownership và operational burden |
| Domain/AI/Data/Realtime specialties | Bài bổ trợ theo nhánh | Các track chuyên sâu | Capstone và rubric riêng từng nhánh |

Mọi capstone đều xem xét sáu trục phù hợp mức độ: tính đúng đắn, hiệu năng, độ tin cậy, bảo mật, chi phí và khả năng vận hành/tiến hóa. Yêu cầu vi phạm tính đúng đắn hoặc quyền truy cập không được bù bằng điểm hiệu năng.

## 5. Website và lộ trình cá nhân

Điều hướng chính: **Level → Chủ đề → Lab → Case study → Chuyên sâu → Tiến độ**. Trên mobile dùng điều hướng thu gọn và tìm kiếm; tránh hiển thị toàn bộ graph phức tạp cùng lúc.

Trang mỗi level gồm: dành cho ai, kiến thức đầu vào, đầu ra, module bắt buộc, module bổ trợ, số nội dung thực sự đã xuất bản, bài tổng hợp và đường sang level/nhánh tiếp theo.

Thẻ bài có tiêu đề phổ thông, một câu cho biết sẽ hiểu điều gì và tên kỹ thuật phụ. Người mới nhìn các khối chính rồi mở chi tiết theo từng bước. Các tab trong bài là **Hiểu bằng hình / Tự thử / Đào sâu**; phần sâu có thực hành code khi phù hợp. Đề bài nêu rõ năng lực tiên quyết và độ sâu đang được đánh giá.

Ba cách bắt đầu:

1. Chọn **Bắt đầu từ số 0**, học tuần tự từ L0 hoặc level tự chọn.
2. Làm đánh giá đầu vào tùy chọn để nhận gợi ý học bù theo từng miền.
3. Chọn một bài toán hoặc nhánh chuyên sâu rồi xem lộ trình tiên quyết tương ứng.

Mỗi chủ đề có thể hiển thị theo lớp: giải thích trực giác → cơ chế → thí nghiệm → failure mode → quyết định thiết kế. Người học mở rộng độ sâu theo nhu cầu. Ví dụ cache ở L1 được giới thiệu qua đọc dữ liệu; ở L2 có policy/invalidation; ở L4 có sự cố stampede và quan sát; ở AI có phạm vi an toàn của cache kết quả.

Không khóa nội dung vì người học chưa hoàn thành bài trước. Hiển thị điều cần biết và liên kết học bù. Những bài chưa có nội dung chỉ xuất hiện trong roadmap với trạng thái dự kiến, không có nút “Bắt đầu học” giả.

## 6. Hoạt động học phù hợp từng loại kiến thức

| Loại kiến thức | Tương tác phù hợp |
| --- | --- |
| Traffic, cache, queue, scheduling | Mô phỏng thời gian logic và biểu đồ |
| Index, transaction, consistency, consensus | Thao tác từng bước, timeline, lịch sử đọc/ghi và kiểm tra invariant |
| Security, API, data model | Bài tập hợp đồng, truy cập theo vai trò và quyết định thiết kế |
| SRE, deployment, recovery | Incident replay, dashboard và diễn tập rollout/restore |
| Kiến trúc tổng thể, migration, trade-offs | Design challenge, so sánh phương án, ADR và review theo rubric |

Mỗi module có ít nhất một hoạt động có ý nghĩa. Không cần mỗi bài lý thuyết một engine riêng; một engine có thể phục vụ nhiều bài với cấu hình khác nhau. Bài mẫu mới phải được kiểm tra với người học ở đúng level trước khi nhân rộng.

Lớp phổ thông đi qua ví dụ có lời giải → ví dụ bớt gợi ý → tình huống mới. Người học được thử sai và xem nguyên nhân. Bài tính toán có đơn vị, phép tính từng bước và bảng trực quan. Xem checklist, bài mẫu và cách thử với học sinh tại [TEACHING_GUIDE.md](TEACHING_GUIDE.md).

## 7. Registry nội dung và tiêu chuẩn hoàn chỉnh

Mỗi năng lực bắt buộc có một bản ghi:

`competencyId, topicId, levelId, moduleId, requiredIn, prerequisiteIds, depth, learningOutcome, lessonIds, activityIds, assessmentIds, sourceRefs, owner, reviewer, reviewedAt, publicationStatus`.

Trạng thái nội dung: **đã đặc tả → đang soạn → đang review → đã duyệt → đã phát hành → cần cập nhật**. Trạng thái người học là dữ liệu riêng: **chưa học → đã xem → đã thực hành → đã chứng minh trong bài mới → cần ôn**.

Đo độ bao phủ theo từng level và miền:

- Số năng lực bắt buộc có giải thích đã duyệt / tổng số năng lực bắt buộc của phiên bản chương trình.
- Số năng lực có hoạt động thực hành phù hợp / tổng số năng lực cần hoạt động đó.
- Số năng lực có đánh giá đúng độ sâu / tổng số năng lực bắt buộc.
- Báo cáo riêng prerequisite bị thiếu, nội dung chờ review và nội dung cần cập nhật.

Không gộp các chỉ số thành một phần trăm chung có thể che khuất cả một miền bị thiếu. Chỉ công bố level hoàn chỉnh khi mọi năng lực bắt buộc đủ các bằng chứng phù hợp; hoàn thành catalog chưa đồng nghĩa hoàn thành học liệu.

Kiểm tra tự động cho cấu trúc: ID duy nhất, liên kết hợp lệ, graph không có phụ thuộc vòng, bài bắt buộc có nguồn và đánh giá, nội dung chưa xuất bản không xuất hiện như bài học sẵn có. Reviewer con người kiểm tra độ chính xác, chiều sâu, ngộ nhận dễ gặp và chất lượng giải thích.

Mỗi module ghi ngày review và phiên bản nguồn. Nguyên lý ổn định được review khi có thay đổi nội dung hoặc lỗi; bài phụ thuộc vendor/model/API được review khi tài liệu chính thức thay đổi. Khi đổi đầu ra bắt buộc, tăng phiên bản curriculum và giữ bằng chứng học cũ kèm gợi ý học phần mới.

## 8. Tài liệu nền để rà soát phạm vi

Đây là các nguồn tham khảo chính thức để phát triển và kiểm tra học liệu, không phải bằng chứng rằng chương trình đề xuất tương đương một khóa học hoặc chứng nhận của các đơn vị này.

- **Hệ phân tán:** fault tolerance, replication, consistency và các case study được đối chiếu với [MIT 6.5840](https://pdos.csail.mit.edu/6.5840/) và [lịch học 2026](https://pdos.csail.mit.edu/6.824/schedule.html).
- **Database internals:** storage, indexing, query execution, concurrency control và recovery đối chiếu với [CMU 15-445/645 Spring 2026](https://15445.courses.cs.cmu.edu/spring2026/schedule.html).
- **Vận hành:** SLO, monitoring, incident response, overload và release engineering đối chiếu với [Google SRE](https://sre.google/sre-book/table-of-contents/) và [SRE Workbook](https://sre.google/workbook/table-of-contents/).
- **Đánh giá kiến trúc:** các chiều vận hành, bảo mật, độ tin cậy, hiệu năng, chi phí và hiệu quả tài nguyên được rà soát thêm bằng [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html).
- **Bảo mật ứng dụng:** dùng [OWASP ASVS](https://owasp.org/projects/asvs) làm nguồn kiểm tra yêu cầu kỹ thuật liên quan; mỗi yêu cầu tham chiếu trong bài cần giữ phiên bản.

Mỗi bài cụ thể vẫn cần nguồn trực tiếp cho cơ chế được giảng, giả định mô phỏng và ví dụ implementation. Case study tổng hợp được ghi rõ là bài thiết kế giáo dục; chỉ mô tả kiến trúc thực tế của một công ty khi có nguồn công khai hỗ trợ.
