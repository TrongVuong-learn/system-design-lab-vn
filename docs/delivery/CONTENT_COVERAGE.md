# Độ bao phủ học liệu — báo cáo sinh từ source

Chạy lại bằng `pnpm coverage:write`; kiểm tra drift bằng `pnpm coverage:check`.
Bài beta và năng lực đã đăng ký không đại diện cho toàn bộ năng lực cần có.
Số theo độ sâu là metadata biên tập, không phải số người học đã thành thạo hoặc chứng nhận review chuyên gia.
Phạm vi bắt buộc vẫn ở [CURRICULUM_MAP](../../CURRICULUM_MAP.md) và [roadmap](ROADMAP.md).

| Module | Bài beta khả dụng | Năng lực đăng ký: nhập môn / cơ chế / thiết kế | Module |
| --- | --- | --- | --- |
| L0.1 | system-boundaries, request, cache | 2 / 1 / 0 | Chưa hoàn chỉnh |
| L0.2 | concurrency, cpu-io, address-space, file-handles, event-loop, os-practice | 5 / 1 / 0 | Chưa hoàn chỉnh |
| L0.3 | compression, structures-cost, hash-table, library-search, locality, priority-heap, search-tree, serialization | 7 / 1 / 0 | Chưa hoàn chỉnh |
| L0.4 | dns, transport, routing, tls, network | 5 / 0 / 0 | Chưa hoàn chỉnh |
| L0.5 | streaming-lifecycle, http, cookie-session, reverse-proxy, multiplexing | 4 / 1 / 0 | Chưa hoàn chỉnh |
| L0.6 | measurement-reliability, metrics, capacity, capstone-foundations | 2 / 1 / 1 | Chưa hoàn chỉnh |
| L1.1 | requirements-boundaries | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L1.2 | api-contracts | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L1.3 | data-models | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L1.4 | database-indexes | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L1.5 | transactions-isolation | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L1.6 | capstone-service, service-delivery | 0 / 1 / 1 | Chưa hoàn chỉnh |
| L2.1 | balance, scaling-service | 1 / 1 / 0 | Chưa hoàn chỉnh |
| L2.2 | case-short-links, case-query-cache, cache-policies | 0 / 1 / 2 | Chưa hoàn chỉnh |
| L2.3 | replica, replication-failover | 1 / 1 / 0 | Chưa hoàn chỉnh |
| L2.4 | case-social-path, partitioning | 0 / 1 / 1 | Chưa hoàn chỉnh |
| L2.5 | case-school-feed, queue, messaging-delivery | 1 / 1 / 1 | Chưa hoàn chỉnh |
| L2.6 | design, capstone-scaling, admission-backpressure | 1 / 1 / 1 | Chưa hoàn chỉnh |
| L3.1 | distributed-order | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L3.2 | consensus-raft | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L3.3 | quorum-fencing | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L3.4 | distributed-workflows | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L3.5 | conflicts-crdt | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L3.6 | multi-region, capstone-distributed | 0 / 1 / 1 | Chưa hoàn chỉnh |
| L4.1 | slo-observability | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L4.2 | resilience | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L4.3 | capacity-tail | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L4.4 | security-lifecycle | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L4.5 | delivery-platform | 0 / 1 / 0 | Chưa hoàn chỉnh |
| L4.6 | capstone-production, recovery-cost | 0 / 1 / 1 | Chưa hoàn chỉnh |
| L5.1 | end-to-end-design | 0 / 0 / 1 | Chưa hoàn chỉnh |
| L5.2 | architecture-boundaries | 0 / 0 / 1 | Chưa hoàn chỉnh |
| L5.3 | migration-evolution, case-growth-roadmap | 0 / 0 / 2 | Chưa hoàn chỉnh |
| L5.4 | platform-tenants, case-fixture-crawler, case-club-ledger, case-book-ranking, track-ai, track-data, track-search, track-realtime, track-media, track-platform, track-business | 0 / 0 / 11 | Chưa hoàn chỉnh |
| L5.5 | architecture-decisions | 0 / 0 / 1 | Chưa hoàn chỉnh |
| L5.6 | architecture-review, capstone-architecture | 0 / 0 / 2 | Chưa hoàn chỉnh |

Tổng: 85 bài beta; 36/36 module có ít nhất một bài; 0/36 module được công nhận hoàn chỉnh.
Không tính bài ôn liên module thành một module đầy đủ. Số bài phản ánh nội dung khả dụng, không phải chứng nhận mastery hoặc hoàn tất mọi năng lực.

## Nhánh chuyên sâu và bài tổng hợp khả dụng

| Nhánh | Bài beta |
| --- | --- |
| AI / ML Systems | track-ai |
| Data Engineering | track-data, case-fixture-crawler, case-club-ledger, case-book-ranking |
| Search, Recommendation và Geo | track-search, case-school-feed, case-fixture-crawler, case-social-path, case-book-ranking |
| Realtime và Collaboration | track-realtime, case-school-feed |
| Media và Streaming | track-media |
| Cloud, Platform và Edge | track-platform, case-growth-roadmap |
| Hệ thống nghiệp vụ | track-business, case-club-ledger |

Sáu capstone: capstone-foundations, capstone-service, capstone-scaling, capstone-distributed, capstone-production, capstone-architecture.

Tám case tích hợp: case-short-links, case-school-feed, case-fixture-crawler, case-club-ledger, case-social-path, case-query-cache, case-book-ranking, case-growth-roadmap.

27 bài có bản thiết kế tự viết, rubric tự đối chiếu và đề đổi ràng buộc. Chưa chấm thiết kế tự động, chưa review chuyên gia/pilot học sinh.
