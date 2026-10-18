# Bản đồ giáo trình System Design Lab

Phiên bản đề xuất: 6 — 17/10/2026; bổ sung kế hoạch case theo module, giữ nguyên phạm vi 6 level/36 module/7 nhánh. Tài liệu đặc tả phạm vi; các module dưới đây chưa phải học liệu đã xây dựng. Kế hoạch sản phẩm: [SYSTEM_DESIGN_WEB_PLAN.md](SYSTEM_DESIGN_WEB_PLAN.md). Chuẩn giảng dạy: [TEACHING_GUIDE.md](TEACHING_GUIDE.md).

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

Mỗi bài có mini-case trong chặng Áp dụng; mỗi module có một họ tình huống và bài tổng hợp; mỗi level có capstone. [EDU-09](docs/delivery/EDU_09_CASE_STUDY_PLAN.md) quản lý danh mục đủ 36 module, phân rã tình huống, bảy nhánh, kế hoạch ánh xạ bài beta và thứ tự triển khai. Hiện có mini-case cho 29 bài beta và một bài ôn tổng hợp; họ case module và capstone vẫn đang đặc tả; không tính một case tổng hợp thay mọi năng lực trong module. Chuẩn biên soạn nằm trong TEACHING_GUIDE.

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

## 9. Kế hoạch tích hợp kiến thức từ System Design Primer

### 9.1. Nguồn và phạm vi

Nguồn: **The System Design Primer — Donne Martin và contributors**, commit `ae9bbd7b02d90b9866215de185217d33f39ab733`, ngày commit 20/03/2026; truy xuất 12/10/2026. [README cố định][primer], [license CC BY 4.0][primer-license]. Đây là bản chuyển thành kế hoạch giảng dạy tiếng Việt: phân lại level, thêm ví dụ trường học, hoạt động mobile, bài phản chứng và tiêu chí đánh giá. Không nhập nguyên code, hình hoặc bộ Anki; không đại diện cho sự chứng thực của tác giả.

Giữ 6 level/36 module/7 nhánh. **23 nhóm PRIMER-K bên dưới là nhóm công việc biên soạn trong module hiện hữu**, không phải 23 module mới hoặc 29 bài đã phát hành. Một nhóm có thể cần nhiều bài nhỏ. Các ID này truy vết kế hoạch; chưa phải competency registry chạy trong ứng dụng. Trạng thái toàn bộ bổ sung: **đã đặc tả, chưa biên soạn/duyệt/phát hành**. Phần sáu bài beta hiện có chỉ được tái sử dụng khi đáp ứng mục tiêu tương ứng.

### 9.2. Kiến thức, hoạt động và đầu ra bắt buộc

Các liên kết ở cột kiến thức trỏ tới mục trong revision nguồn đã khóa. Cột hoạt động và nghiệm thu là thiết kế giáo dục của dự án. Các chi tiết mở rộng theo giáo trình cũ vẫn giữ nguyên; Primer không thay chương trình database, consensus, security hoặc SRE chuyên sâu.

| ID / module | Kiến thức phải chuyển thành bài | Tình huống và tương tác mobile | Bằng chứng người học cần tạo |
| --- | --- | --- | --- |
| PRIMER-K01 · L1.1, L5.1 | [Quy trình thiết kế][p-design]: xác định người dùng/use case, phạm vi, yêu cầu, giả định; sơ đồ tổng thể; thành phần lõi; tìm nút thắt và đánh đổi | Thiết kế cổng đăng ký câu lạc bộ; chọn thẻ yêu cầu trước khi thêm thành phần | Một yêu cầu đo được, một giả định chưa biết, API/data flow và lý do chọn phương án |
| PRIMER-K02 · L0.6, L2.1 | [Performance/scalability][p-performance]; tăng tài nguyên dọc/ngang; giới hạn và chi phí mở rộng | Đổi số bàn trực và tốc độ mỗi bàn; dùng cùng workload để so sánh | Phân biệt mục tiêu nhanh hơn một việc với phục vụ nhiều việc; chỉ ra nút thắt sau khi mở rộng |
| PRIMER-K03 · L0.6 | [Latency/throughput][p-latency]; đơn vị và cửa sổ đo; nối tiếp phần percentile đã có trong chương trình | Timeline chờ nhận sách và bộ đếm sách trả mỗi giây | Tính hai chỉ số từ trace; giải thích vì sao nhiều việc hoàn tất hơn chưa chắc từng bạn chờ ít hơn |
| PRIMER-K04 · L0.6, L4.3 | [Ước lượng][p-estimation], lũy thừa hai, kích thước dữ liệu, tải đọc/ghi và độ lớn latency | Bộ tính số học sinh × lượt/ngày × byte; đổi giờ cao điểm và retention | Bảng phép tính có đơn vị, giả định, khoảng biến động; không dùng số latency lịch sử như benchmark hiện tại |
| PRIMER-K05 · L0.4 | [DNS][p-dns]: tên miền, resolver, bản ghi, cache và TTL; độ trễ cập nhật và giới hạn định tuyến | Tìm địa chỉ thư viện qua các bàn tra cứu; đổi địa chỉ khi cache còn hạn | Theo dấu truy vấn và giải thích vì sao người dùng khác nhau có thể tới địa chỉ khác nhau |
| PRIMER-K06 · L0.4–L0.5 | [TCP/UDP/HTTP][p-communication]: kết nối, thứ tự, retransmission, request/response; tách giao thức khỏi nhu cầu ứng dụng | Gửi bài tập hoặc âm thanh lớp học; làm rơi/trễ gói trong trace | Chọn giao thức theo yêu cầu; không kết luận TCP bảo đảm xử lý nghiệp vụ đúng một lần hoặc UDP luôn nhanh hơn |
| PRIMER-K07 · L1.2 | [REST/RPC][p-rpc]: resource/action, hợp đồng, lỗi và coupling; liên kết bài idempotency/versioning đã quy hoạch | So sánh xem lịch và đăng ký chỗ; gửi lại sau timeout | API contract và cách biết kết quả chưa rõ; phân biệt phương thức HTTP với bảo đảm của nghiệp vụ |
| PRIMER-K08 · L2.2; Media, Platform | [CDN][p-cdn]: edge/origin; push/pull; cache hit/miss, invalidation, chi phí lưu và truyền | Phát ảnh hội trường cho người xem ở nhiều vùng; thử nội dung ít dùng và ảnh vừa cập nhật | Chọn cơ chế phân phối, giải thích cold miss và yêu cầu độ mới; không coi CDN chỉ dùng cho ảnh |
| PRIMER-K09 · L2.1 | [Load balancing][p-lb]: L4/L7, health check, phân tải, session state; cụm cân bằng tải cũng có thể lỗi | Phân học sinh vào quầy; cho một quầy chậm hoặc ngừng nhận | Trace phân tải; phân biệt health check thành công với còn công suất; phát hiện bottleneck downstream |
| PRIMER-K10 · L0.5, L2.1 | [Reverse proxy][p-proxy]: chuyển tiếp, TLS termination, caching/compression; quan hệ với load balancer | Mở từng lớp cổng trường → bàn điều phối → lớp học | Gán đúng trách nhiệm; chỉ ra khi một thành phần đóng cả hai vai trò |
| PRIMER-K11 · L2.1, L5.2 | [Application layer][p-app]: tách trách nhiệm, service discovery, microservices và chi phí lời gọi qua mạng | So sánh một hệ thống quản lý trường với các dịch vụ lịch/đăng ký/thông báo | Sơ đồ ownership/phụ thuộc, một lỗi liên dịch vụ và lý do giữ monolith hoặc tách dịch vụ |
| PRIMER-K12 · L1.3 | [Dữ liệu quan hệ][p-db]: schema, khóa, chuẩn hóa/phi chuẩn hóa; access pattern và chi phí cập nhật dữ liệu lặp | Bảng học sinh, lớp và lượt đăng ký; ghép bảng hoặc giữ bản tổng hợp | Truy vấn cần hỗ trợ, constraint và tình huống các bản dữ liệu lặp không khớp |
| PRIMER-K13 · L1.4 | [SQL tuning][p-sql]: schema/index, query plan, joins, partitioning và cache trong DB | Tra danh sách theo mã học sinh; thêm index và đổi tỷ lệ đọc/ghi | So sánh số mục phải xét và chi phí ghi/lưu; không mặc định thêm mọi index hoặc loại bỏ mọi join |
| PRIMER-K14 · L1.3 | [NoSQL][p-nosql]: key-value, document, wide-column, graph; so sánh với relational theo truy vấn và bảo đảm | Chọn cấu trúc cho hồ sơ, lịch sử sự kiện, quan hệ bạn bè | Hai phương án cùng yêu cầu và đánh đổi; không gán mọi NoSQL là eventual consistency hoặc không có transaction |
| PRIMER-K15 · L2.3, L3.5 | [Replication][p-replication]: primary/replica, multi-leader, sync/async, lag, conflict, read routing | Đổi lịch ở hai địa điểm; chậm truyền và mất một nút | Lịch sử ghi/đọc, điều kiện xác nhận ghi, rủi ro mất dữ liệu; không coi replica là backup |
| PRIMER-K16 · L2.4 | [Federation/sharding][p-sharding]: chia theo chức năng so với chia dữ liệu cùng miền; key, skew, join xuyên shard và di chuyển | Chia hồ sơ theo lớp hoặc mã học sinh; thêm lớp đông đột biến | Chọn shard key, chỉ ra hot partition và kế hoạch chuyển dữ liệu không mất/nhân đôi |
| PRIMER-K17 · L2.2 | [Vị trí và đối tượng cache][p-cache]: client/CDN/proxy/application/database; query result so với object; dung lượng, eviction và invalidation | Đặt bản sao lịch ở các chặng, đổi một ô dữ liệu gốc | Liệt kê bản cache bị ảnh hưởng, chi phí cập nhật và cache key có phạm vi quyền truy cập |
| PRIMER-K18 · L2.2 | [Cache policies][p-cache-policies]: cache-aside, write-through, write-back, refresh-ahead; TTL, cold start, LRU và dữ liệu cũ | Xem/đổi lịch; dừng hệ thống sau ghi cache nhưng trước ghi nguồn; dự đoán mục cần làm mới | Trace đọc/ghi/ACK, độ mới và durability; phân biệt TTL, eviction, invalidation; nêu điều kiện của từng bảo đảm |
| PRIMER-K19 · L2.5–L2.6 | [Asynchronism][p-async]: message/task queues, xử lý nền, backpressure; nối tới ACK/retry/dedup/DLQ đã quy hoạch | Gửi giấy mời khi việc đến dồn dập; worker lỗi giữa nhận và xác nhận | Phân biệt nhận việc/làm xong, tính backlog, chọn giới hạn nhận; chỉ ra duplicate và tác dụng phụ |
| PRIMER-K20 · L3.1 | [CAP và consistency][p-cap]: weak/eventual/strong theo định nghĩa cụ thể; đọc sau ghi và lịch sử thao tác; partition | Hai bàn giữ số chỗ còn lại, ngắt liên lạc rồi đọc/ghi | Chỉ ra thao tác phải chờ/từ chối hoặc có thể thấy cũ trong mô hình; phân biệt linearizability với ACID consistency |
| PRIMER-K21 · L3.6, L4.1, L4.6 | [Availability][p-availability]: active-passive/active-active, failover, downtime budget, phụ thuộc nối tiếp/song song | Cho một khu nhà mất điện; chuyển xử lý và phục hồi | Tính budget theo kỳ đo; nêu giả định độc lập trước khi nhân xác suất; chỉ ra lỗi chung và điều kiện failback |
| PRIMER-K22 · L1.2, L4.4 | [Security cơ bản][p-security]: quyền tối thiểu, dữ liệu truyền/lưu, input, truy vấn tham số; mở rộng theo ASVS đã quy hoạch | Đọc bảng điểm bằng các vai trò và sửa tham số yêu cầu | Xác định trust boundary, kiểm tra quyền phía server và dữ liệu nhạy cảm; mã hóa không thay phân quyền |
| PRIMER-K23 · L5.6 | [Kiến trúc thực tế][p-real]: đọc nguồn, workload, bối cảnh, bottleneck, thời điểm và giới hạn | Đọc một bài engineering công khai, điền phiếu phản biện trên mobile | Phân biệt dữ kiện/giả định; giải thích vì sao kiến trúc đó không tự phù hợp cho trường học; giữ URL/ngày của bài gốc |

### 9.3. Tám bài thiết kế tích hợp

Đây là bài tập giáo dục lấy đề bài làm điểm xuất phát, không mô tả kiến trúc hiện hành của các công ty. Workload và số liệu sẽ được tính lại với đơn vị/giả định công khai. Các nguồn dưới đây là solution mẫu, không phải đáp án duy nhất. Chưa mở bài nâng cao như bài hoàn chỉnh khi thiếu prerequisite.

| ID / nguồn | Nơi học và prerequisite | Bản chuyển thể, tương tác và tiêu chí hoàn tất |
| --- | --- | --- |
| PRIMER-C01 · [Pastebin/Bit.ly][c-pastebin] | L1.6 → L2 capstone; API, schema, identifier | Chia sẻ ghi chú lớp bằng mã ngắn; chọn expiry, xử lý trùng mã, đọc/ghi và analytics. Nộp API/schema, trace collision/expiry và thiết kế mở rộng; phân biệt encoding với hashing |
| PRIMER-C02 · [Timeline/search][c-twitter] | L2 capstone → Search, Realtime; queue, cache, index | Bảng tin câu lạc bộ: fan-out khi ghi/đọc, người có nhiều người theo dõi, chỉ mục tìm kiếm. Thay phân bố follower và đo lượng công việc; giải thích độ mới của feed/index |
| PRIMER-C03 · [Crawler][c-web_crawler] | Search, Data; networking, queue, dedup | Kho trang giả lập của thư viện: frontier, chu kỳ link, lịch thu thập lại, lập chỉ mục. Chạy trên dữ liệu fixture, không crawl Internet thật trong bài; tránh lặp vô hạn và đặt giới hạn theo host |
| PRIMER-C04 · [Mint][c-mint] | Nhánh nghiệp vụ/Data; API, background job, quyền, idempotency | Theo dõi quỹ câu lạc bộ bằng giao dịch giả lập: nhập định kỳ, phân loại, ghi đè thủ công, tổng hợp/cảnh báo. Replay không đếm đôi; cập nhật nguồn không ghi đè lựa chọn người dùng. Không kết nối tài khoản ngân hàng thật |
| PRIMER-C05 · [Social graph][c-social_graph] | Search, L2.4; graph/BFS, partitioning | Tìm đường quen biết ngắn nhất giữa học sinh trên graph vô hướng không trọng số. So sánh số nút/lượt đọc xuyên shard và đường tìm được; phân biệt GraphQL API với graph database |
| PRIMER-C06 · [Query cache][c-query_cache] | L2.2–L2.4; hash table, eviction, cache policies | Cache kết quả tra thư viện với bộ nhớ hữu hạn: hit/miss, TTL, LRU, thêm node, hot key. Chứng minh eviction đúng trace và giải thích remapping/cold cache |
| PRIMER-C07 · [Sales rank][c-sales_rank] | Data Engineering; queue/log, aggregation | Xếp hạng sách theo lượt mượn trong cửa sổ thời gian: cập nhật định kỳ, nhiều danh mục, late/duplicate event. Tính lại một bộ dữ liệu bằng tay và replay; tách độ mới khỏi tốc độ truy vấn |
| PRIMER-C08 · [Scaling on AWS][c-scaling_aws] | L5.1–L5.3, Platform; L1–L4 liên quan | Cổng trường tăng dần tải: một máy → tách dữ liệu → cân bằng tải/cache/replica → điều chỉnh kiến trúc. Mỗi bước phải đo bottleneck, chọn phương án, nêu chi phí/lỗi; AWS là lớp triển khai tùy chọn, không đổi stack của sản phẩm học |

Mỗi case có bản có hướng dẫn và bản đổi ràng buộc để chuyển giao. Rubric chung chấm riêng: yêu cầu/ước lượng; API/data; trace bình thường; lỗi/tính đúng đắn; security/cost; lập luận trade-off. Không gom thành nhãn “thành thạo” nếu phần đúng đắn chưa đạt.

### 9.4. Ôn tập và phần bổ trợ từ repo

- **Flashcards:** học ý tưởng ôn cách quãng từ mục Anki của Primer; tự viết thẻ tiếng Việt liên kết PRIMER-K/C, gồm một tình huống, câu hỏi “vì sao”, phản ví dụ và link quay về bài. Chạm để mở giải thích; hỗ trợ bàn phím. Chưa nhập deck hoặc chạy thuật toán ôn tập. Thành tích nhớ thẻ tách khỏi bằng chứng thiết kế.
- **Study guide:** cung cấp ba cách học: nền tảng tuần tự; ôn theo lỗ hổng năng lực; luyện case/phỏng vấn sau nền tảng. Người mới không bị ép theo lịch ôn phỏng vấn ngắn của người đã có kinh nghiệm.
- **Object-oriented design:** hash map/LRU là bổ trợ L0.3/L2.2; call center, deck of cards, parking lot, chat server là bài implementation tùy chọn sau kiến thức lập trình. Circular array trong repo là đề chờ đóng góp, không ghi là có solution. Không dùng notebook Python upstream để quyết định ngôn ngữ sản phẩm TypeScript.
- **Additional questions:** làm ngân hàng bài đổi ràng buộc sau các case đã review; tác giả phải viết rubric trước khi phát hành. Liên kết đến câu hỏi chưa có học liệu chỉ là đọc thêm.
- **Video, blog và kiến trúc công ty:** dùng như nguồn đọc có hướng dẫn; không yêu cầu tài khoản/dịch vụ ngoài để hoàn thành bài lõi. Ghi nguồn gốc, ngày xuất bản và phạm vi áp dụng; chưa kiểm chứng mọi link trong repo.

### 9.5. Các điểm phải hiệu chỉnh khi chuyển thể

Giữ tên thuật ngữ hiện đại primary/replica và multi-leader; giữ thuật ngữ cũ chỉ trong chú thích tra cứu nguồn. Những phần dưới đây cần nguồn trực tiếp và review trước phát hành, không dịch nguyên câu khái quát của Primer:

1. CAP phải có failure model và định nghĩa; strong consistency không tự suy từ “dùng SQL” hoặc “sao chép đồng bộ”; eventual consistency không cam kết hội tụ trong vài mili giây.
2. TTL hết hạn không đồng nghĩa tự tải mới; write-through chỉ cho bảo đảm độ mới trong phạm vi đường ghi, cơ chế phối hợp và failure handling đã định nghĩa; cache không mặc định luôn nhanh hơn mọi lần đọc database.
3. Công thức availability nối tiếp/song song chỉ áp dụng theo cấu trúc và giả định xác suất đã nêu; phải xét lỗi chung, failover và kỳ đo. Ví dụ downtime tính lại theo số ngày đã chọn, không sao chép bảng làm hằng số.
4. GraphQL là ngôn ngữ truy vấn và runtime cho API, không phải graph database; sửa cách nhóm trong case social graph theo [tài liệu GraphQL][graphql].
5. Ví dụ query cache/SQL tuning, sản phẩm cloud, thông số phần cứng và latency phải ghi phiên bản; không đem cấu hình cũ thành hướng dẫn triển khai mới. Base62 là cách biểu diễn, không phải cơ chế bảo mật cho mã truy cập.
6. Security trong Primer chỉ là phần giới thiệu; tiếp tục giữ threat modeling, tenant isolation, auth, privacy và lifecycle dữ liệu trong L4.4. Không xem sanitization chung là thay thế kiểm soát theo ngữ cảnh.

Nguồn trực tiếp cho CAP, replication, isolation, queue được ghi trong [báo cáo EDU-03](docs/delivery/CONTENT_AUDIT_2026-10-12.md). Khi soạn từng bài, bổ sung sourceRef ở cấp claim và phiên bản; chưa gọi kế hoạch này là toàn bộ nội dung đã được xác minh.

### 9.6. Hồ sơ bàn giao mỗi bài

Mỗi bài tách từ PRIMER-K/C có: ID riêng, module/competency/depth, prerequisite, outcome, lời giải tiếng Việt, terms, tình huống có lời giải, bài tự thử, trace lỗi/phản ví dụ, assessment/rubric, sourceRef và adaptation note. Reviewer kiểm tra riêng cơ chế kỹ thuật và khả năng hiểu. Thao tác mobile theo từng bước, không bắt kéo; bảng/timeline có bản chữ và thuật ngữ dùng popover đã chuẩn hóa. Kết quả mô phỏng phụ thuộc engine registry, không nhúng code tùy ý vào học liệu.

Acceptance của việc **thêm vào plan**: mọi nhóm đề mục chính, tám solution mẫu và tài nguyên bổ trợ có nơi xử lý hoặc lý do chỉ đọc thêm; ID không thay 36 module; có nguồn revision/attribution, thứ tự triển khai và gate review. Acceptance của **bài đã phát hành** vẫn là mục 7 cùng TEACHING_GUIDE và WORKFLOW; hai trạng thái không được đánh đồng.

[primer]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md
[primer-license]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/LICENSE.txt
[p-design]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#how-to-approach-a-system-design-interview-question
[p-performance]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#performance-vs-scalability
[p-latency]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#latency-vs-throughput
[p-estimation]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#back-of-the-envelope-calculations
[p-dns]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#domain-name-system
[p-communication]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#communication
[p-rpc]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#remote-procedure-call-rpc
[p-cdn]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#content-delivery-network
[p-lb]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#load-balancer
[p-proxy]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#reverse-proxy-web-server
[p-app]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#application-layer
[p-db]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#relational-database-management-system-rdbms
[p-sql]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#sql-tuning
[p-nosql]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#nosql
[p-replication]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#master-slave-replication
[p-sharding]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#federation
[p-cache]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#cache
[p-cache-policies]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#when-to-update-the-cache
[p-async]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#asynchronism
[p-cap]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#availability-vs-consistency
[p-availability]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#availability-patterns
[p-security]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#security
[p-real]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/README.md#real-world-architectures
[c-pastebin]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/solutions/system_design/pastebin/README.md
[c-twitter]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/solutions/system_design/twitter/README.md
[c-web_crawler]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/solutions/system_design/web_crawler/README.md
[c-mint]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/solutions/system_design/mint/README.md
[c-social_graph]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/solutions/system_design/social_graph/README.md
[c-query_cache]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/solutions/system_design/query_cache/README.md
[c-sales_rank]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/solutions/system_design/sales_rank/README.md
[c-scaling_aws]: https://github.com/donnemartin/system-design-primer/blob/ae9bbd7b02d90b9866215de185217d33f39ab733/solutions/system_design/scaling_aws/README.md
[graphql]: https://graphql.org/learn/
