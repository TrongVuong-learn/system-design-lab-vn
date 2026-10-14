# Kế hoạch triển khai và nghiệm thu

Trạng thái: roadmap và ước lượng; web beta có 13 bài nhập môn, các gate hoàn thiện level còn mở. Trạng thái thực thi theo [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md); các gate chưa đạt vẫn còn mở. Phạm vi kiến thức theo [CURRICULUM_MAP.md](../../CURRICULUM_MAP.md), tiêu chuẩn học theo [TEACHING_GUIDE.md](../../TEACHING_GUIDE.md).

Quy trình thực hiện từng task, Git/review, release và quản lý thư mục áp dụng theo [WORKFLOW.md](WORKFLOW.md) và [CONTRIBUTING.md](../../CONTRIBUTING.md).

## 1. Phân chia công việc

| Luồng | Người chịu trách nhiệm | Đầu ra |
| --- | --- | --- |
| Sản phẩm và kế hoạch | Product/technical lead | Phạm vi, quyết định, backlog, acceptance và rủi ro |
| Giáo trình | Curriculum lead + chuyên gia System Design | 6 level, 36 module, 7 track; competencies, prerequisites, rubric |
| Mobile UX | Designer + frontend engineer | Flow dọc, design system, accessibility, prototype |
| Engine | Kỹ sư mô phỏng | Mô hình, replay, metrics, fixtures và invariant tests |
| Content platform | Frontend/full-stack engineer | Schema, player, preview, search, progress và offline |
| Biên soạn | Technical writer / instructional designer | Storyboard, ví dụ, glossary, bài bổ trợ và bài mới |
| Chất lượng | QA + reviewer kỹ thuật/cách giảng | Test thiết bị, review mô hình, pilot học sinh và sửa lỗi |

Một người có thể giữ nhiều vai trò nhưng thời gian phải được phân bổ rõ. Bài consensus, transaction, security và failover cần reviewer chuyên môn; AI hỗ trợ bản nháp không thay review.

## 2. Milestone chính

| Mốc | Phạm vi và dependencies | Điều kiện hoàn tất |
| --- | --- | --- |
| M0 — Baseline sản phẩm | Rà catalog, phân rã năng lực, chọn stack/thiết bị, mobile storyboard | Có owner, giả định, definition of done, ADR và story mẫu |
| M1 — Nền tảng dự án | Workspace, packages, CI, schema, lesson player đơn giản; sau M0 | Checkout sạch chạy được; một fixture qua pipeline; ranh giới core/UI được kiểm tra |
| M2 — Một bài hoàn chỉnh | Bài cache nhập môn, engine, assessment, resume; sau M1 | Học từ đầu tới bài mới trên mobile; nội dung và mô hình khớp; pilot và sửa |
| M3 — Sáu lab và biên soạn | Engine/models bổ sung, catalog, glossary, coverage, pipeline; sau M2 | Sáu lab có bài áp dụng, review, replay và phương án không kéo |
| M4 — Web beta và PWA | Hiệu năng, offline packs, update/migration, device QA; sau M3 | Gate web bên dưới đạt; công bố đúng phạm vi học liệu đã có |
| M5 — Hoàn thiện chương trình | L0–L2 rồi L3–L5; từng nhánh sâu; bắt đầu song song M3 khi mẫu đã ổn | Từng level đủ mục tiêu, học liệu, hoạt động, assessment và review |
| M6 — Tài khoản/sync (hoãn, tùy nhu cầu) | Phi thương mại, chia sẻ ít: hiện dùng lưu cục bộ và export/import; chỉ thiết kế backend khi có nhu cầu thật | Không là gate web beta/app; mở task riêng nếu được ưu tiên lại |
| M7 — App beta | Capacitor spike rồi lifecycle, storage, deep links; sau gate web | Lab đại diện đạt trên Android/iPhone; dữ liệu và offline ổn |
| M8 — App release | Signing, packaging, listing, release/beta channel, review | Có build đã kiểm thử, phương án hỗ trợ và phát hành theo store |

M5 là luồng nội dung dài hạn. App có thể phát hành với các level đã hoàn chỉnh và trạng thái catalog rõ, không cần chờ mọi chuyên sâu; không mô tả chương trình hoàn chỉnh khi còn năng lực bắt buộc thiếu.

## 3. Backlog cụ thể cho đợt đầu

| ID | Công việc | Phụ thuộc | Tiêu chí nghiệm thu |
| --- | --- | --- | --- |
| ENG-01 | Chốt runtime, workspace, package exports | M0 | Install theo lockfile và build được ở môi trường sạch |
| ENG-02 | Content schema, stable IDs, compatibility | ENG-01 | Nội dung sai bị từ chối; hợp lệ sinh blocks/manifests |
| UX-01 | App shell Học/Khám phá/Tiến độ | M0 | Dùng một tay, chữ lớn, back và focus hợp lý |
| EDU-01 | Storyboard cache + rubric | M0 | Ví dụ trường học, thuật ngữ giải thích, câu hỏi chuyển giao |
| SIM-01 | Engine cache tối thiểu | ENG-02, EDU-01 | Seed/replay/Step nhất quán; số lượt đọc và dữ liệu cũ đúng |
| WEB-01 | Player và activity renderer | ENG-02, UX-01 | Story/prediction/activity/feedback trong flow dọc |
| DATA-01 | Progress, checkpoint, export/import | ENG-02 | Reload/back/đổi ứng dụng không mất bước đã ghi thành công |
| QA-01 | Kiểm tra fixture, mobile và accessibility | SIM-01, WEB-01, DATA-01 | Chạy được bài từ đầu đến cuối; có text alternative |
| EDU-02 | Pilot học sinh và sửa | QA-01 | Có ghi nhận ngộ nhận, sửa và thử lại điểm lặp lại |
| ARCH-01 | Prototype transaction và architecture review | WEB-01 | Khung player hỗ trợ độ sâu khác, không chỉ bài cache |
| REL-01 | Preview/staging và artifact version | QA-01 | Deployment tái lập; direct URL và rollback hoạt động |

Không dùng task kiểu “Làm frontend” hoặc “Viết nội dung” cho cả tháng. Mỗi ticket phải có outcome, dependencies, owner, cách kiểm chứng và phần ngoài phạm vi.

## 4. Ước lượng và cách điều hành

Giả định nguồn lực: hai kỹ sư toàn thời gian, một người phụ trách học liệu toàn thời gian, designer/QA/reviewer bán thời gian. Review chuyên môn được dành lịch riêng.

- M0–M1: khoảng 2–3 tuần.
- M2: khoảng 2–3 tuần, gồm vòng sửa sau pilot.
- M3: khoảng 4–6 tuần sau khi khung đã được kiểm chứng; nội dung và engineering chạy song song.
- M4: khoảng 2–3 tuần tùy tình trạng hiệu năng, thiết bị và offline.
- Tổng mốc web beta có chất lượng: **khoảng 10–15 tuần theo các giả định trên**, cập nhật sau M2. Đây không phải thời gian hoàn thành toàn bộ giáo trình.
- M5: chương trình nhiều tháng; lập lịch theo effort thực của biên soạn, activity và review ở các mức khó. Không gán thời gian của bài cache cho mọi module.
- M7–M8: dự trù ban đầu 4–8 tuần cho beta và chuẩn bị release nếu Capacitor phù hợp; thời gian store review không được coi là cam kết.
- M6 có estimate riêng sau khi chốt auth/sync/chia sẻ; không cộng vào web pilot bắt buộc.

Mốc 6–8 tuần trong bản kế hoạch cũ chỉ ước lượng bộ lab hẹp. Tài liệu này là nguồn kế hoạch cập nhật cho mobile-first, PWA, pipeline học liệu và app readiness.

Demo nội bộ hàng tuần bằng hành trình người học chạy được. Mỗi đợt chọn outcome có thể nghiệm thu; cuối đợt rà kỹ thuật, nội dung, pilot và rủi ro. Giữ quyết định quan trọng bằng ADR. Sau mỗi milestone cập nhật phạm vi còn lại và khoảng ước lượng.

## 5. Gate “web đã ổn” trước app

1. **Đúng chuyên môn:** sáu lab qua fixtures/invariant tests; hình, metrics, đáp án và giải thích khớp; giới hạn mô hình công khai.
2. **Dễ học:** có pilot học sinh cấp 3, gồm người chưa code; lỗi hiểu sai lặp lại đã sửa/thử lại; người học áp dụng được sang tình huống mới.
3. **Mobile:** Safari iOS và Chrome Android trên thiết bị thật trong ma trận đã chọn; 360/390/430 px và fallback 320 px; không cần hover/kéo/zoom bắt buộc.
4. **Trợ năng:** text alternative, focus, screen reader, chữ lớn, reduced motion; công bố kết quả kiểm tra đúng mức đã thực hiện.
5. **Dữ liệu:** reload, back, app background và khởi động lại giữ bản ghi đã lưu; export/import/version migration có kiểm thử; lỗi lưu không bị che.
6. **Offline:** tải đủ mới báo sẵn sàng; mở lại trong airplane mode; cập nhật không làm hỏng attempt; thiếu dung lượng được xử lý. Kiểm tra trên browser support matrix cụ thể.
7. **Chất lượng phát hành:** không còn lỗi nghiêm trọng đã biết làm sai kiến thức, mất dữ liệu hoặc chặn học; có rollback và cách báo lỗi.

Mục tiêu performance: LCP ≤ 2,5 giây, INP ≤ 200 ms, CLS ≤ 0,1 ở p75 người dùng mobile khi đủ dữ liệu thực. Đây là ngưỡng theo [Core Web Vitals](https://web.dev/articles/vitals). Trước khi đủ field data, dùng cấu hình lab cố định và thiết bị thật; không tuyên bố đạt p75 thực chỉ từ một lần chạy Lighthouse.

Ngân sách kỹ thuật nội bộ ban đầu: JavaScript cho shell và lesson player đầu ≤ 250 KB gzip, tải riêng lab engine; phản hồi nút phải xuất hiện ngay cả khi mô phỏng đang tính. Đo và cập nhật budget sau vertical slice; các con số này là mục tiêu dự án, không phải benchmark đã đạt.

## 6. CI, kiểm thử và release

CI bắt buộc cho mã: typecheck, lint/import boundaries, core tests, build, E2E hành trình chính. CI nội dung: schema/IDs/links, prerequisite graph, glossary, version compatibility, assessment fixtures và coverage report. Test chọn theo rủi ro, không viết test chỉ để lặp lại implementation.

E2E chính: bắt đầu từ số 0 → dự đoán → đổi tham số → quan sát → thử thách → lưu → reload → tiếp tục. Bổ sung lỗi network/storage, update version và import không hợp lệ. Playwright chạy Chromium/WebKit/Firefox theo nhu cầu; emulation và WebKit desktop không thay Safari iOS thật.

Môi trường: local → preview theo thay đổi → staging beta → production. Nội dung và engine phát hành version tương thích; giữ artifact cũ và quy trình rollback. Store app có release track riêng. Không đăng công khai hoặc gửi lời mời pilot chỉ vì ticket nghiên cứu đã được tạo; thực hiện khi có phạm vi phát hành/tuyển người cụ thể.

## 7. Rủi ro và quyết định ứng phó

| Rủi ro | Theo dõi / hành động |
| --- | --- |
| Độ rộng nội dung vượt nguồn lực | Coverage registry, owner/reviewer; hoàn thiện từng level; công bố trạng thái thật |
| Bài dễ đọc nhưng hiểu sai | Pilot với bài chuyển giao, review kỹ thuật, ví dụ phản chứng |
| Mô phỏng nặng trên điện thoại | Worker, batching snapshot, giới hạn hoạt động, đo thiết bị yếu |
| Offline/update mất tiến độ | Immutable versions, checkpoint, migration, thử interrupted download |
| Web UI không đạt trên app | Spike Capacitor trước đầu tư lớn; giữ core/content độc lập |
| Tự dựng quá nhiều hạ tầng | API/DB/app shell theo mốc; chỉ thêm abstraction có consumer thật |
| Kế hoạch thời gian thiếu thực tế | Đo effort viết/hiện thực/review/pilot riêng, re-estimate sau M2 |

Definition of done cho một tính năng gồm hành vi đúng, nội dung liên quan đã review, mobile/accessibility, test có ý nghĩa, xử lý lỗi, tài liệu và version. “Đã có màn hình” chưa phải “đã có một bài học hoàn chỉnh”.

## 8. EDU-03 — ưu tiên sau kiểm định học liệu 12/10/2026

[Báo cáo kiểm định](CONTENT_AUDIT_2026-10-12.md) đối chiếu sáu bài beta, mô hình và khung 36 module với System Design Primer cùng tài liệu gốc. Đây là kiểm định có phạm vi, chưa thay review chuyên gia hoặc pilot. Giữ nguyên 6 level/36 module/7 nhánh.

| Thứ tự / ID | Đầu ra | Điều kiện nghiệm thu |
| --- | --- | --- |
| P0 / EDU-03a | Sửa nhãn đếm cache, đơn vị backlog, làm rõ queue/replica | Số liệu có phạm vi đếm; trace cache hit → refresh → expiry → miss khớp UI; giữ dữ liệu học cũ |
| P1 / ENG-03 | Registry năng lực, prerequisite, nguồn và review/version | Kiểm tra level khớp module, graph hợp lệ, source theo claim; chặn phát hành nội dung thiếu review; báo cáo coverage tách từng miền |
| P1 / EDU-04 | Hoàn thiện L0: mạng, giao thức, chỉ số và ước lượng | Có bài dạy, thao tác, phản ví dụ và bài chuyển giao cho từng năng lực; giải thích ms, %, byte, p95 ngay tại chỗ |
| P1 / EDU-05 | L1: API, dữ liệu, index và transaction | Mô hình giữ chỗ có invariant, xen kẽ hai transaction, retry; review chuyên môn trước xuất bản |
| P2 / EDU-06 | L2: policy cache, sharding, queue lỗi và backpressure | Có mất ACK, duplicate, cache stampede, hot shard, tải biến động và giới hạn mô hình |
| P2 / EDU-07 | L3–L4: consistency/consensus và production | Timeline phân vùng mạng; SLO, security, backup/restore; chuyên gia duyệt các bảo đảm |
| P3 / EDU-08 | L5 và từng track, case study hoàn chỉnh | Thiết kế với workload/API/data/failure/security/cost, rubric lập luận; không chấm thành thạo bằng một trắc nghiệm |

EDU-02 pilot chạy cùng từng lô học liệu đã review, không đợi soạn hết chương trình. Nhánh chuyên sâu triển khai theo prerequisite; không coi sáu bài nhập môn là đã hoàn thành các module L2 được gắn nhãn.

## 9. EDU-03b — kế hoạch biên soạn từ Primer

Task EDU-03b chỉ hoàn tất đặc tả tích hợp; các lô dưới đây là backlog biên soạn. Chi tiết PRIMER-K/C và nguồn được quản lý duy nhất trong [CURRICULUM_MAP mục 9](../../CURRICULUM_MAP.md#9-kế-hoạch-tích-hợp-kiến-thức-từ-system-design-primer). Mỗi lô tách thành task bài nhỏ khi chuyển Ready; không tạo nhánh trước cho mọi lô.

| Lô / task cha | Phạm vi | Phụ thuộc | Đầu ra và gate cụ thể |
| --- | --- | --- | --- |
| PRIMER-B0 / ENG-03 | ID, prerequisite, source/attribution, review, coverage | Đặc tả EDU-03b | Registry nhận biết planned/draft/reviewed/published; trace từ bài tới K/C, source revision; chặn thiếu review, không nâng trạng thái chỉ vì có link |
| PRIMER-B1 / EDU-04 | K02–K06; giới thiệu K01 | B0 cho xuất bản; biên soạn có thể bắt đầu trước | Bài L0 có đơn vị, ví dụ nhỏ, trace request, DNS/transport và ước lượng; pilot người chưa biết lập trình |
| PRIMER-B2 / EDU-05 | K01, K07, K10, K12–K14; C01 bản một dịch vụ | B1; phần nền transaction L1.5 | API/data/index và identifier; thêm bài transaction từ nguồn chuyên môn; case có kiểm tra collision, expiry, quyền và retry |
| PRIMER-B3 / EDU-06 | K08–K09, K11 phần discovery, K15–K19; C06; C01 bản mở rộng | B2; các engine mới qua review fixture | Thử workload lệch, cache update, hot shard, mất ACK; so sánh đánh đổi; không chỉ tăng số server để qua bài |
| PRIMER-B4 / EDU-07 | K20–K22; đào sâu K15; nối consensus/SRE/security hiện hữu | B3; transaction, failure model và reviewer chuyên môn | Có lịch sử phân vùng, failover và tính downtime; nguồn gốc hỗ trợ claim; threat/restore review và phản chứng |
| PRIMER-B5 / EDU-08 | K11 kiến trúc, K23; C02–C05, C07–C08 | B3/B4 và prerequisite theo từng case | Bản có hướng dẫn + bản đổi ràng buộc; API/data/trace/lỗi/cost và rubric lập luận; nghiệm thu từng case, không đợi hoàn tất cả lô |
| PRIMER-B6 / EDU-08 + learning-core | Flashcards, hướng ôn, OOD tùy chọn | Có bài nguồn đã review; persistence/version theo ENG-03 | Thẻ tự viết liên kết bài/năng lực; nhớ thẻ không tự hoàn thành module; OOD cần nền lập trình, không bắt buộc với học sinh nhập môn |

Owner theo vai trò ở mục 1: curriculum lead chịu phạm vi, technical writer viết, simulation engineer làm hoạt động, QA kiểm tra, chuyên gia duyệt cơ chế, instructional reviewer kiểm tra cách giảng. Chưa gán tên reviewer hoặc thời gian cam kết khi chưa có người thực nhận việc.

Mỗi bài phải có outcome/prerequisite, storyboard mobile, glossary, nguồn, giả định, trace thường/lỗi, đánh giá chuyển giao và reviewer evidence. Khi review fail, giữ draft. Sau pilot sửa ngộ nhận rồi mới phát hành từng phần. Không gọi một lô hoàn tất chỉ vì có trang hoặc trắc nghiệm. Không nhập upstream code/dependency hay đổi stack trong task kế hoạch này.

### Tiến độ triển khai EDU-04a (13/10/2026)

Đã viết phần đầu B0 (registry/gate cho beta) và bốn bài B1: metrics, DNS, TCP/UDP, ước lượng. Phạm vi, nghiệm thu và kết quả tại [EDU_04_L0_FOUNDATIONS.md](EDU_04_L0_FOUNDATIONS.md). B0/ENG-03 và B1/EDU-04 vẫn đang thực hiện; chưa qua gate review chuyên gia/pilot, chưa đủ toàn bộ năng lực L0. Trạng thái beta hiện thực được phân biệt với reviewed/published dự kiến tại ADR 0003.

### EDU-02 — bộ pilot vòng 1 (13/10/2026)

Đã chuẩn bị [bộ điều phối, phiếu học sinh, rubric và biểu mẫu ghi nhận](../research/student-pilot/README.md) cho cache + các bài L0 mới. Trạng thái EDU-02: **chuẩn bị, chưa có buổi thật hoặc người tham gia được xác nhận**. Chưa đóng gate pilot. Cần chủ dự án xác nhận học sinh/người điều phối và khả năng truy cập trên thiết bị trước khi thực hiện; dữ liệu quan sát thật lưu riêng ngoài Git.

### Tiến độ EDU-04b (14/10/2026)

Bổ sung HTTP request/response và RTT/bandwidth; sửa hướng dẫn metrics từ QA-04. Phạm vi và nghiệm thu tại [EDU_04B_HTTP_NETWORK.md](EDU_04B_HTTP_NETWORK.md). B1/EDU-04 vẫn đang thực hiện: chưa đủ toàn bộ L0, chưa qua pilot thật. Sau đợt này tiếp tục IP/port/routing và HTTPS/TLS, OS/concurrency rồi đánh giá năng lực còn thiếu trước khi đóng L0; chưa chuyển gate web/app sang đạt.

## 10. EDU-09 — ví dụ thực tế trong từng bài và module

[Kế hoạch chi tiết EDU-09](EDU_09_CASE_STUDY_PLAN.md) bổ sung 36 họ case theo đúng module, mini-case cho từng bài, sáu capstone level và hướng phân rã bảy nhánh. Chuẩn viết trong TEACHING_GUIDE; danh mục tình huống và task CASE-00…10/CASE-QA chỉ quản lý trong EDU-09, tránh hai backlog mâu thuẫn.

Thứ tự: CASE-01 schema/version → CASE-02 ba bài đại diện → CASE-03 đủ 12 bài beta → CASE-04 L0 → CASE-05 L1 → CASE-06 L2 → CASE-07/08 L3–L4 theo prerequisite → CASE-09 L5 và CASE-10 từng nhánh. Các task này bổ sung đầu ra áp dụng cho EDU-04…08/PRIMER-B1…B5, không thay hoặc tự đóng các gate đó. CASE-QA và EDU-02 chạy theo batch; kiến thức nền, reviewer và mô hình mới là dependency cần kiểm riêng.

Trạng thái ngày 14/10/2026: CASE-00 đã viết đặc tả; CASE-01 trở đi chưa hiện thực. Site vẫn có 12 bài beta theo baseline EDU-04b. Chưa tăng số module hoàn chỉnh, chưa có pilot thật, chưa thay gate web/app. Ước lượng CASE-01–03 và điều kiện nguồn lực tại EDU-09 mục 9; lịch phần còn lại được cập nhật sau storyboard, không gán thời hạn hoàn thành toàn chương trình từ số lượng case.

### Hiện thực CASE-01–03 (14/10/2026)

Đã nâng chặng Áp dụng cho đủ 12 bài beta: schema/gate review, context/yêu cầu, gợi ý thử và đánh đổi; đáp án và tiến độ v1 được giữ. [Báo cáo nghiệm thu](EDU_09_CASE_STUDY_IMPLEMENTATION.md) ghi 26 unit test, 99 E2E đạt/một skip, responsive và giới hạn review. CASE-04–10 cùng các gate module/level/pilot vẫn mở; tiếp theo bù học liệu L0 theo EDU-04. Đây là cập nhật sau mốc đặc tả CASE-00 ở trên.

### CASE-04 / EDU-04c: nền IP/port/routing (14/10/2026)

Đã thêm bài routing và case chuyển giao tại L0.4, nâng catalog lên 13 bài beta. [Báo cáo EDU-04c](EDU_04C_ROUTING.md) ghi engine 1.3.0, RFC nguồn, trace/giới hạn, 29 unit test và 103 E2E đạt/một skip. CASE-04/EDU-04 vẫn mở: HTTPS/TLS/session, OS/concurrency, cấu trúc dữ liệu và các năng lực L0 còn thiếu cần bài riêng và review trước CAP-L0.

### QA-05 — agent review và sửa đơn vị cache (14/10/2026)

student_tester đã chạy first-use routing/cache; knowledge_reviewer được Astra medium thiết kế, runtime Sol medium. [QA-05](../research/knowledge-reviewer/QA_05_RESOLUTION.md) lưu scope, báo cáo, matrix, lỗi KR-01 đã sửa và kiểm tra. Chưa đóng gate pilot/ chuyên gia độc lập/level. Các timeout Firefox trong lượt full và kết quả serial retest được ghi rõ; không mô tả full suite ban đầu là pass.

## 11. EDU-10 — phản hồi dễ hiểu (14/10/2026)

Quyết định: phi thương mại, chia sẻ nhỏ, ưu tiên học liệu; auth/sync hoãn. Owner root. Đợt này chọn cache, queue, network để hoàn thiện mẫu trước khi mở rộng13 bài.

| Task | Phạm vi | Acceptance |
| --- | --- | --- |
| EDU-10a | Bảng trước–sau và nguyên nhân sau thao tác | Dữ liệu lấy từ bước vừa thực thi, đơn vị rõ; queue đổi tham số chưa chạy phải nói chưa qua thời gian; cache hết hạn chưa tự làm mới; network không hứa tốc độ thật |
| EDU-10b | Gợi ý hai mức + lời giải có yêu cầu cho prediction/challenge ba bài | Trả lời sai chưa hiện ngay lời giải; mở dần nơi quan sát/cách suy luận/lời giải; đúng có giải thích; lưu/reload giữ mức đã mở riêng mỗi câu hỏi |
| EDU-10c | QA và chuẩn biên soạn | Unit trace, schema và tương thích assessment cũ; mobile320/390, desktop, keyboard, saved→reload, reduced motion; review ảnh nội dung thật |

Điều kiện hoàn tất đợt: a/b hiện thực, c có chứng cứ, source/metadata/báo cáo cập nhật và site dùng artifact đã kiểm. Ngoài phạm vi: đăng nhập/backend, đổi mục tiêu/đáp án, thay engine timing, bài ôn tổng hợp, công nhận mastery, triển khai toàn36 module. Giữ6 level/36 module/7 track. EDU-02 vẫn chưa pilot thật.

Backlog sau đợt: mở rộng chuẩn cho các bài khác; bài ôn liên kết3–4 kiến thức; hệ thống website trường phát triển qua các level; nút báo đoạn khó hiểu khi đã chốt cách thu thập phù hợp.

### Kết quả EDU-10a/b/c

Đã hiện thực phản hồi trước–sau và gợi ý mở dần cho cache/queue/network; nghiệm thu và giới hạn tại [EDU-10](EDU_10_CLEAR_FEEDBACK.md). Phi thương mại/lưu cục bộ là ưu tiên hiện tại. Mở rộng10 bài, bài ôn tổng hợp và pilot vẫn là backlog; chưa đóng gate module/level.

## 12. EDU-11 — mở rộng phản hồi cho10 bài beta còn lại

Task Verified qua QA, owner root, baseline cde6c94. Phạm vi: request/balance/replica/design/metrics/dns/transport/capacity/http/routing. Mỗi câu hỏi có hai gợi ý biên soạn; mỗi hoạt động có quan sát trước–sau từ trạng thái thật và nguyên nhân, cùng renderer EDU-10. Dependencies: schema guidance/hints/observation hiện có, engine registry13 kinds.

Acceptance: không đổi mục tiêu, đáp án hoặc cơ chế engine; đơn vị và giới hạn đúng từng bài; DNS hết hạn chưa tự tra; replica cấu hình lag không đổi lịch ghi cũ; HTTP đổi cấu hình bắt đầu request mới, mã lỗi vẫn là phản hồi; TCP/UDP không biến một trace thành bảo đảm giao thành công; metrics và traffic so các lần tính độc lập, không coi đó là thời gian thật tiếp diễn. Reset bỏ quan sát cũ; lưu/reload, hint riêng prediction/challenge, tiến độ v1 và fixture cũ tiếp tục chạy.

QA: unit trace các nhóm, schema có đủ guidance13 bài, full E2E liên quan, mobile320/390 và desktop, keyboard/reduced motion và ảnh thật. Ngoài phạm vi: bài ôn tổng hợp, tài khoản/backend, PWA/app, công nhận mastery hoặc đóng pilot người thật. Sau EDU-11 tiếp tục bài ôn có ràng buộc kết hợp kiến thức, chuẩn hóa hệ thống website trường xuyên bài.

### Kết quả EDU-11

Đã hiện thực gợi ý và quan sát trước–sau cho đủ13 bài beta. [EDU-11](EDU_11_FEEDBACK_ALL_LESSONS.md) ghi phạm vi, trace, test và giới hạn. Bước tiếp theo là bài ôn kết hợp kiến thức và website trường xuyên bài; chưa coi13 bài là đủ năng lực36 module và chưa đóng pilot thật.
