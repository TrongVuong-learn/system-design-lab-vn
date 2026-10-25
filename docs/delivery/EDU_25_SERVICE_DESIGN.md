# EDU-25 — thiết kế một dịch vụ từ yêu cầu đến vận hành

Task biên soạn 18/10/2026, tích hợp và kiểm chứng cùng EDU-26 ngày25/10/2026. Owner Codex; dependency EDU-24. Phạm vi: sáu bài L1.1–L1.6 có các chương cơ chế, ví dụ từng bước và bài quyết định; dùng khung module-practice đã kiểm thay vì thêm mô phỏng SQL/network giả. Giữ bản học thử và các gate đầy đủ còn mở; không gọi trắc nghiệm là proof hệ thống thật hoặc đóng toàn bộ giáo trình. Ngoài phạm vi: backend/auth thật, dịch vụ cloud mới, dependency/runtime upgrade.

UI giữ palette/font/design bàn thí nghiệm. Story → chương có thể mở bằng bàn phím/chạm → dự đoán → lựa chọn/giải thích → case chuyển giao. Chương gồm cơ chế, ví dụ, các bước có thứ tự thật và điều dễ nhầm; không thêm card trang trí. Mobile một cột, summary ≥44px, không cuộn ngang; desktop giữ vùng đọc có giới hạn. Có thể đọc lại chương khi luyện tập. Không lưu cờ đọc thành mastery.

Acceptance: schema chapter strict/version/unique/source, compatibility 30 bài giữ nguyên, question/answer/binding hợp lệ; review claim theo nguồn sơ cấp đã mở. Kiểm unit/schema và pipeline, E2E từng bài + keyboard/resume/import/offline/reflow, review ảnh mobile/desktop. Sau CI merge master, Vercel READY đúng SHA và smoke. Không human-review/pilot/device thật từ kiểm tra AI/browser.

## Review nội dung trước phát hành

Sáu bài mới: requirements-boundaries, api-contracts, data-models, database-indexes, transactions-isolation, service-delivery. Có 27 chương và 40 câu áp dụng, thêm prediction/transfer case từng bài. Các case đều do tác giả dựng, không gán như case production của trường hoặc công ty. Parent đối chiếu các quyết định: scope/context/container C4; timeout không xác nhận rollback; idempotency cần caller/key/payload và xử lý nguyên tử; cursor không tự tạo snapshot; identity khác quyền; UNIQUE/NULL và CHECK khác invariant tổng; B-tree khác hash; cost không phải ms; LSM/compaction có đánh đổi; Read Committed theo statement của PostgreSQL 18; conditional update cần kiểm số dòng; Serializable cần retry; khóa và optimistic version có xung đột; WAL khác backup; object/database khác ranh giới; UUID không là capability; rollback code khác dữ liệu.

Nguồn mở/đọc ngày 18/10: tài liệu tác giả C4; RFC9110/9562; AWS Builders Library idempotency, S3/EBS/EFS; PostgreSQL18 constraints/isolation/index/types/multicolumn/EXPLAIN/transaction/join/locking/MVCC/WAL/B-tree; RocksDB overview/Bloom; gRPC core/GraphQL queries; MongoDB/DynamoDB/Neo4j/Cassandra data model; OWASP secrets/authorization; Kubernetes Deployment và Google SRE monitoring. URL/claim/sourceId trong registry; nguồn PostgreSQL khóa /18/ thay vì phụ thuộc /current/. AWS Well-Architected URL thử mở bị lỗi, không dùng làm nguồn đã đọc.

Không chạy SQL/database/network/cloud thật; các lịch/ví dụ được suy luận theo giả định đã ghi. Không human review hoặc pilot mới. Bài mới không thay thế engine/câu hỏi/tiến độ 30 ID đã phát hành; compatibility giữ nguyên 30 record cũ và khóa toàn chapter/practice mới. Không đổi progressJSON1/IndexedDB2 hoặc dependency.

## Kiểm chứng local ban đầu

Schema/content/coverage đạt. Unit lượt đầu 100 đạt/1 timeout ở fixture library-search cũ khi full parallel; không đổi assertion/timeout, chạy lại maxWorkers2 đạt 101/101. Lượt E2E đầu dừng ở tải module do import JSON mới thiếu attribute trên Node24; thêm `with {type:'json'}` vào test/ma trận, không sửa hành vi app hoặc nới kiểm tra.

Standalone sáu bài × 320/390/1280: ảnh chương và đáp án, xuất/nhập sáu bài đang dở, mở lại offline và chấm đủ đáp án đạt, không overflow/pageerror. Parent đã xem ảnh cơ chế/đáp án mobile/desktop và bổ sung định nghĩa bốn thuật ngữ index; bản build cuối và retest ghi bên dưới. Evidence local ignored `.cache/edu25/`. Bundle vẫn có cảnh báo kích thước; không chứng nhận performance field data, thiết bị thật hoặc hoàn tất 36 module.

## Tích hợp toàn lộ trình

Sáu bài và 36 contract local được giữ trong EDU-26; các chương/practice, điều hướng và lưu tiến độ được kiểm cùng catalog85 bài. Kết quả QA cuối, CI và phát hành dùng [báo cáo EDU-26](EDU_26_REMAINING_CURRICULUM.md). Không coi kết quả local ban đầu là một lần production release riêng.
