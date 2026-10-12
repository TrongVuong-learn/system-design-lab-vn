# Trạng thái hiện thực — bản thử nghiệm đầu tiên

## Phạm vi đã có

- Commit tài liệu nền tảng trên `master`; triển khai trong `codex/eng-01-web-foundation`.
- pnpm workspace với web và ba package content-schema, learning-core, simulation-engine.
- Runtime Node 24.21.0 dùng cho build/test; package manager được khóa và có lockfile.
- Giao diện mobile-first: Học, Khám phá, Tiến độ, trang level và player bốn chặng.
- Catalog 6 level, 36 module và 7 nhánh. Module đầy đủ đang soạn, không có nút học giả.
- Sáu bài beta: hành trình request, nút thắt/chia tải, cache, queue, replication lag và lựa chọn thiết kế nhập môn.
- Mô phỏng deterministic theo command/thời gian logic; metrics có giả định và đơn vị. Chưa cần worker cho workload nhỏ của bản này.
- IndexedDB, checkpoint, export/import có schema và giới hạn kích thước; xử lý lỗi lưu.
- Validation nội dung, TypeScript, lint, unit tests, E2E và cấu hình CI nguồn.

## Kiểm chứng

Báo cáo kiểm chứng cập nhật theo kết quả chạy ở cuối đợt, không suy ra từ cấu hình CI. Luồng E2E kiểm tra cache stale/refresh, lưu rồi reload, hoàn thành bài, catalog L3 và reflow 320 px trên Chromium mobile/desktop. Screenshots được xem để kiểm tra bố cục trang chủ và thí nghiệm 390 px.

Kết quả đợt đầu: content validation 36 module/6 bài đạt; lint và TypeScript/build đạt; **9 unit tests** và **6 E2E tests** đạt dưới Node 24.21.0. Build JavaScript khoảng **128 KB gzip**. Chromium đầy đủ được dùng cho E2E vì headless shell trong môi trường này gặp lỗi ICU/GPU; chưa kiểm chứng WebKit hoặc thiết bị thật.

## Phần chưa hoàn tất của roadmap

- Pilot học sinh và reviewer con người; chưa tuyên bố hiệu quả học tập đã được chứng minh.
- Kiểm thử Safari iOS/Chrome Android trên thiết bị thật và đánh giá accessibility đầy đủ.
- Học liệu chuyên sâu của 36 module; các bài transaction, consensus, failure handling và capstone URL shortener đầy đủ.
- PWA/downloaded modules/offline mở lại; bản hiện tại chỉ lưu tiến độ cục bộ, không cam kết mở trang khi mất mạng.
- Tài khoản, API, sync, native adapter và app. Web storage không tự chuyển sang app.
- CI được cấu hình trong source; cần repository GitHub để xác nhận thực thi trên dịch vụ đó.

Đợt tiếp theo ưu tiên pilot/sửa bài mẫu, kiểm tra thêm nền tảng mobile và mở rộng hoạt động transaction/design review, rồi PWA theo milestone. Sáu bài beta không được đánh dấu là hoàn thành toàn bộ M3/M5.

## UI-02 — hướng thiết kế và tooling

Nhánh `codex/ui-02-design-direction` thay trang đầu bằng bàn học có thí nghiệm cache thật, sơ đồ khác nhau theo từng bài, font Be Vietnam Pro tự host và hệ màu mới. Skill Anthropic frontend-design được cài ở phạm vi project, giữ license và khóa commit nguồn; Impeccable và UI/UX Pro Max chỉ được nghiên cứu. `DESIGN.md` và tooling lock ghi hướng thiết kế cùng nguồn tham khảo.

Đã xem screenshot mobile 390 px và desktop 1280 px. Kiểm tra đạt: format, lint, build, 9 unit tests và 8 E2E trên Chromium mobile/desktop; thí nghiệm trang đầu không đánh dấu hoàn thành bài và các màn chính không tràn ở 320 px. Chưa kiểm thử trên thiết bị thật hoặc WebKit.

## UI-03 — màn học và điều hướng chặng

Task: giúp người mới biết phải làm gì ở mỗi chặng và dùng player trên mobile/bàn phím. Nhánh `codex/ui-03-lesson-desk` được tạo trong worktree riêng từ commit UI-02 đã phát hành để bảo toàn thay đổi tài liệu/skill đang có ở checkout chính.

Đã thực hiện: hướng dẫn thay đổi theo chặng/đáp án/số thao tác còn thiếu; `aria-current="step"`; focus đến tiêu đề chặng sau khi dữ liệu lưu đã tải xong và khi chuyển chặng; cỡ chữ chặng, nhãn mô phỏng, số liệu và lời giải lớn hơn trên mobile. Engine, schema và đáp án không đổi.

Acceptance đã kiểm chứng: production build/typecheck và lint đạt; 10 E2E tests đạt trên Chromium mobile/desktop, gồm keyboard chọn đáp án, nút tiếp tục bị khóa/mở đúng, focus lúc mở/reload/quay lại và reflow 320 px. Screenshot thí nghiệm cache được review ở 390 px/1280 px. Đây là kiểm tra hành vi trợ năng có phạm vi; chưa chứng nhận WCAG đầy đủ, screen reader hoặc thiết bị thật.

## QA-02a — lỗi lưu và nhập/xuất tiến độ

Phần thực thi đầu của QA-02 trên nhánh `codex/qa-02-progress-recovery`: thông báo lỗi đọc/ghi riêng, nút thử ghi lại checkpoint mới nhất, đường tới xuất bản dự phòng và bảo toàn bản lưu không đọc được. Thông báo lỗi nằm trước nội dung chặng trên màn học; dữ liệu của phiên vẫn dùng được khi ghi thất bại. Lỗi đọc không tự ghi đè bản cũ; nhập file hợp lệ là thao tác chủ động thay tiến độ. Các thao tác nhập/xuất chờ tải tiến độ xong. Import thông báo phân biệt đã nhập vào phiên với đã ghi bền vững. Giới hạn 2 MB dùng UTF-8 byte ở core và File.size ở UI.

Acceptance kiểm chứng: format, lint, typecheck/build, **10 unit tests / 16 E2E tests** đạt. E2E giả lập lỗi quota khi put, thử lưu checkpoint mới nhất rồi reload, giữ nguyên bản lưu không đọc được và xuất phiên học, từ chối file sai version/quá lớn mà giữ tiến độ, download/import roundtrip và reload. Unit kiểm tra byte tiếng Việt và ranh giới 2.000.000 byte. Đã review screenshots lỗi ghi 390/1280 px và kiểm tra không tràn 320 px. Node 24.21.0 và lockfile không đổi.

Không đóng toàn bộ QA-02: còn kiểm tra reduced motion chuyên biệt, screen reader, Safari iOS/Chrome Android trên thiết bị thật và lifecycle/app background. Lỗi quota là fault injection, chưa là bằng chứng tái hiện hết loại lỗi storage trên thiết bị. EDU-02 pilot, ENG-03 version/coverage và ARCH-01 tiếp tục theo roadmap; không tuyên bố hoàn thiện toàn bộ giáo trình hoặc PWA.

## QA-03 — ma trận responsive

Nhánh `codex/qa-03-responsive-matrix` bổ sung project Playwright responsive riêng. Kiểm tra 320/360/390/430/768/1024/1440 CSS px: trang chủ, khám phá, L3, tiến độ và bốn chặng của sáu lab; điều khiển tap, kích thước button trong lab ít nhất 44 × 44 px, không cuộn ngang, và lỗi ghi tiến độ giả lập ở từng bề rộng. Có thêm kiểm tra reduced motion + thao tác cache ở tablet landscape 1024 × 768.

Test tìm ra nút stepper bị thu nhỏ còn 42 px ở breakpoint hẹp; đã sửa thành 44 px theo lựa chọn thiết kế của project. Không gọi 44 px là ngưỡng WCAG AA. Screenshot trang chủ/lab thiết kế được review ở 390/768/1440 px.

Build/typecheck, lint và format đạt. 16 E2E hiện có đạt; 8 test responsive cuối đạt trong lượt chạy riêng sau sửa lifecycle của fault injection. Test ban đầu dùng init script khi chỉ đổi hash, đã sửa để reload document rồi mới tiêm lỗi và kiểm tra. Một lần xét duyệt chạy tool gặp 429, retry sau đó được chấp thuận; không bỏ qua bước xét duyệt.

Giới hạn: Chromium viewport/touch emulation; chưa kiểm tra Firefox/WebKit, điện thoại/tablet thật, safe area/bàn phím ảo thực hoặc tăng chữ 200%. Reduced motion test kiểm tra transition nút và một thao tác, không chứng nhận toàn bộ trợ năng. Các gate thiết bị thật vẫn còn mở.

## QA-04 — audit hành vi và đa trình duyệt

Báo cáo đầy đủ tại [SITE_QA_2026-10-12.md](SITE_QA_2026-10-12.md). Kết quả cuối: 12 unit / 64 E2E đạt, build/typecheck/lint/format đạt; Chromium mobile/desktop, Firefox và WebKit. Bổ sung hoàn thành cả sáu bài với metric, sai→sửa đáp án, console/resource errors, tìm kiếm, min/max, multi-tab và migration v1→v2.

Đã sửa ghi đè snapshot giữa tab, checkpoint queue/replica không hợp lệ, query có khoảng trắng và browser channel runner. IndexedDB nâng v2 bảo toàn store/key/JSON v1 và chặn writer cũ; engine patch 1.0.1. ADR 0002 ghi chính sách xung đột không tự merge. Chưa đóng gate thiết bị thật/pilot/WCAG/offline/ENG-03.
