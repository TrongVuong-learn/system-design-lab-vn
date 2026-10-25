# EDU-26 — học liệu còn lại của chương trình

Ngày 24/10/2026. Yêu cầu: hoàn thành các bài còn lại, tự quyết triển khai và kiểm chứng, không hỏi lại. Owner: Codex. Phụ thuộc: phần EDU-25 đang có trong workspace được giữ và hoàn thiện cùng đợt.

Phạm vi: các bài cơ chế còn thiếu L0/L2–L5, sáu bài tổng hợp level, bảy nhánh chuyên sâu và tám case tích hợp đã chốt trong CURRICULUM_MAP. Mỗi bài có tình huống, chương giải thích với ví dụ/lịch thao tác, ngộ nhận, thực hành có phản hồi, tình huống chuyển giao, nguồn và prerequisite. Bài thiết kế có đề tự viết và rubric; đáp án lựa chọn không được coi là chấm thiết kế. Không đổi 36 hợp đồng tiến độ đang có, runtime, storage hoặc stack. Không giả lập việc chạy hệ thống production thật bằng trắc nghiệm.

Điều kiện hoàn tất: học liệu được nạp và tìm thấy trong web/offline; schema/nguồn/prerequisite/compatibility hợp lệ; coverage có bài cho 36 module, nhánh/capstone có liên kết; kiểm thử đầy đủ và kiểm mobile/desktop/resume/xuất-nhập. Ghi bằng chứng kiểm tra và release riêng; không tự công nhận module đủ mọi năng lực hoặc pilot thiết bị thật. Các đầu ra vượt học liệu như sync/native và nghiên cứu học sinh vẫn thuộc roadmap riêng.

Thiết kế: giữ palette và Be Vietnam Pro của DESIGN.md; danh mục level/module dẫn thẳng tới bài, nhánh dẫn tới nhóm bài; không bày mọi bài dài trên trang đầu. Bài thiết kế có vùng viết và tiêu chí đối chiếu ở chặng áp dụng, lưu cùng checkpoint. Thông tin học trước có link rõ. Mọi điều khiển dùng bàn phím/chạm, một cột ở 320px và vùng đọc giới hạn ở desktop.

Trạng thái: Verified local ngày25/10/2026; phát hành qua PR/CI/master và đối chiếu production. Nguồn được mở lại khi đối chiếu; link không truy cập được không ghi là đã đọc. Nội dung/ví dụ tự biên soạn, review bởi agent, không gắn human-reviewed.

## Học liệu đã biên soạn

Tổng 85 bài beta + 1 bài ôn. Đợt này tích hợp sáu bài EDU-25 đang có và thêm 49 bài, 178 chương có ví dụ/lịch suy luận, 178 câu áp dụng, 98 câu dự đoán/chuyển giao. Cả 36 module có bài; 27 bài có đầu ra tự viết, rubric và thay đổi ràng buộc. Cộng EDU-25: 55 bài mới so với production 30 bài, 205 chương và 218 câu áp dụng.

| Nhóm EDU-26 | Số bài |
| --- | ---: |
| Bổ trợ L0 | 4 |
| Cơ chế L2, L3, L4 | 18 |
| Thiết kế L5 | 6 |
| Nhánh chuyên sâu | 7 |
| Capstone sáu level | 6 |
| Case tích hợp PRIMER-C01–08 | 8 |

Không thêm engine database/cloud/Raft chạy thật: các bài mới dùng ví dụ và lịch thao tác tự biên soạn, lựa chọn có phản hồi và thiết kế tự viết. Kiểm các điều kiện chính: commit Raft theo term; quorum giao chưa tự linearizable; lease cần tài nguyên kiểm fencing; CRDT hội tụ không giữ mọi invariant; 2PC/saga/ACK không tự exactly-once; p95/mean/fan-out và Little cần đúng ranh giới; RPO/RTO cần diễn tập; quyền dữ liệu RAG phải được thực thi ngoài model.

## Đối chiếu nguồn

Nguồn sơ cấp được đối chiếu 24–25/10/2026 và ghi URL/sourceId trong editorial/chương: RFC9110/9111/6455/8216/9700/9309; PostgreSQL18 replication/isolation/backup/constraints; Lamport clocks, Raft, Dynamo, CAP/PACELC; Kleppmann fencing; CRDT Preguiça/Baquero/Shapiro2018; Google SRE; AWS Builders Library/outbox/DR/S3; C4, ADR Nygard, Fowler; Kubernetes, OpenTelemetry, OIDC/OWASP; Dataflow, Flink, Lucene/HNSW/PostGIS; RAG/PagedAttention và OWASP LLM. Ví dụ/số liệu đều do tác giả dựng, không nhận là sự kiện production hay benchmark vendor.

Hai nguồn truy cập không được đã thay: mirror CRDT bằng https://arxiv.org/abs/1805.06358 (đọc cả bản HTML); link bài queue cũ bằng MIT6.02 Lecture17 https://courses.csail.mit.edu/6.02/s2009/handouts/L17.pdf, mục Little's law nêu hệ ổn định và cùng ranh giới. Tài liệu Stripe được đọc ở trang idempotent_requests?lang=curl; không áp đặt cùng semantics cho mọi phiên bản API. Các nguồn phụ gắn ở bài không thay review từng claim độc lập.

## Dữ liệu và kiểm tra

Giữ nguyên 36 contract ở workspace đầu đợt, trong đó 30 đã phát hành và 6 EDU-25. Chỉ thêm ID/contract mới; không đổi version progress1/IndexedDB2, dependency hoặc runtime khóa. Bản nháp design-* là văn bản tối đa2000 ký tự/mục trong lab, không lưu điểm tự chấm. Chỉnh câu trả lời/bản nháp bỏ completed; làm lại practice giữ bản thiết kế. Mỗi thiết kế đòi có nội dung mọi mục và đổi ràng buộc để lưu hoàn thành, với nhãn chưa được chấm.

Lượt đầu: unit phát hiện assertion số bài cũ36, sửa thành85; 105/105 unit đạt. E2E bài mới trên Chromium mobile:50 đạt, một lỗi thật do chuỗi dài trong nhãn thiết kế làm tràn layout và sai hit target nút quay lại sau reload. Sửa wrap/min-width và viết nhãn AI bằng tiếng Việt; thêm assertion không tràn sau hiện form. Hai cấu hình chưa chạy vì thiếu browser được cài đúng phiên bản Playwright khóa, không nâng dependency. Kiểm chứng đầy đủ/phát hành được ghi khi có kết quả.

Bổ sung kiểm chứng 25/10: 106 unit/29 files, content/coverage, TypeScript, lint, format và build đạt. Kiểm tra core thêm trường hợp completed nhập không đủ bằng chứng; UI danh mục/tiến độ/bài học chỉ hiển thị hoàn thành thiết kế khi đủ practice, challenge và bản nháp, giữ semantics bài cũ. 27/27 bài thiết kế hoàn thành bằng thao tác chạm, lưu/reload và không tràn tại320px. Đã xem ảnh chương thật, danh mục và form tại320/390/1280px; 9 tổ hợp bài/viewport không pageerror hoặc overflow. Evidence ignored ở .cache/edu26/.

Một lượt regression trung gian bị dừng khi chốt thêm kiểm tra bản lưu thiết kế; trace runner gặp lỗi đọc source đang đổi. Lượt đó không dùng làm bằng chứng đạt toàn bộ. Bản cuối được build lại và chạy đầy đủ trên source cố định. Bundle có cảnh báo kích thước Vite (khoảng388KB gzip JavaScript); không che cảnh báo hoặc nhận là đã đo hiệu năng thiết bị thật.

## Kết quả bản cuối

- Node24.21.0/pnpm11.25.0; content/coverage/typecheck/lint/format/build và git diff --check đạt; 106 unit/29files đạt.
- Toàn bộ544E2E được chạy:538đạt,1skip có sẵn,5timeout trong đoạn phiên host gián đoạn. Trace ghi một tap kéo dài1.036.812ms sau sáu bài chạy bình thường; không đổi timeout/assertion để bỏ qua. Chạy lại đúng5test trên cùng artifact đạt5/5 trong32,8s. Tổng kết543đạt/1skip. Chromium mobile/desktop, Firefox, WebKit; ma trận85bài ×7bề rộng320–1440px.
- Ngoài regression:27bài thiết kế ×320px thao tác chạm/hoàn thành/resume đạt; screenshot chương/danh mục/form ở320/390/1280 đã review, không overflow/pageerror.
- Artifact offline fingerprint ed306c62a5a6fe9b,16tài nguyên trong manifest, tổng1.777.355byte; sw.js/offline.json kiểm riêng khi phát hành.
- Publication record: PR tích hợp tại [GitHub](https://github.com/TrongVuong-learn/system-design-lab-vn/pulls) ghi CI, merge SHA, deployment và HTTP/browser smoke. Chỉ production từ remote master; không deploy nhánh tính năng.

Giới hạn còn giữ: beta do AI biên soạn/đối chiếu, không reviewer độc lập hoặc pilot học sinh; browser emulation không thiết bị thật/screen reader; bản tự viết không được chấm nội dung; module chưa được công nhận đầy đủ chỉ vì có bài. Cảnh báo bundle lớn vẫn được ghi nhận. Không đóng các mốc sync/native/PWA cài đặt/nghiên cứu từ đợt học liệu này.
