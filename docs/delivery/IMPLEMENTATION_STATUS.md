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
