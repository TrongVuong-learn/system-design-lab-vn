# Kế hoạch triển khai và nghiệm thu

Trạng thái: backlog và ước lượng đề xuất. Chưa bắt đầu phát triển ứng dụng. Phạm vi kiến thức theo [CURRICULUM_MAP.md](../../CURRICULUM_MAP.md), tiêu chuẩn học theo [TEACHING_GUIDE.md](../../TEACHING_GUIDE.md).

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
| M6 — Tài khoản và sync nếu cần | API, auth, PostgreSQL, export/import nâng cấp | Không mất/nhân đôi attempt; phân quyền đúng; có migration/backup |
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
