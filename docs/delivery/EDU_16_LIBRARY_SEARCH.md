# EDU-16 — Tìm sách mà không xem mọi mục

Phạm vi: L0.3 nhập môn mảng, duyệt tuần tự và tìm nhị phân. Owner Codex; không claim module đầy đủ. Nguồn CMU15-122 Spring2026 Lecture4 §1–3 và Lecture6 §1, đọc15/10/2026. Princeton overview/source bị403, không dùng như evidence đã mở. Bài dùng biến thể khoảng inclusive với midpoint floor; CMU code mẫu dùng half-open, nên số bước theo fixture riêng của bài, không gán trace inclusive cho code CMU.

Mảng mã chẵn2…2N, N8/32/128, sorted và truy cập vị trí trực tiếp. Mục tiêu2/2N/2N+1. Linear không early-stop theo thứ tự; binary inclusive lo/hi, floor midpoint. Đơn vị số mục được xem, một phép so quan hệ trừu tượng mỗi bước; không CPU instruction/ms. Không chi phí sort/update/memory/network. UI bảng từng bước, giới hạn phạm vi còn lại, không vẽ128ô nhỏ; cùng palette/design bàn thí nghiệm. Đổi config/reset xóa trace, giữ kết quả học; restore chỉ config/step bounded/model1.

Acceptance: tính tay8/cuối linear8 vs binary4;32/cuối32vs6;128/cuối128vs8; đầu linear1; missing binary kết thúc đúng. Unit đối chiếu oracle mọi preset/prefix và forged checkpoint. E2E bốn browser + responsive, hints/terms/reload/import/export/offline; review screenshot320/390/1280. Không human/pilot.

## Kết quả

Đã hiện thực bài thứ17 + case thư viện, engine1.7.0/model1, schema whitelist/editorial/prerequisite và renderer. Không đổi đáp án/version16 bài cũ hoặc progress1/IndexedDB2. Chỉ checkpoint cấu hình/step, không persist128 dòng trace.

- Content/build/typecheck/lint/diff check đạt;65 unit tests/17files đạt. Hai unit mới đối chiếu18preset, mọi prefix, bounds, uniqueness, invalid/foreign checkpoint và input không mutate.
- Bài mới E2E4/4 context đạt; test320px thao tác keyboard, hints, step/reload, cả hai cách tìm, tìm thấy/không có, case và hoàn thành. Cả hai full run đều qua bài mới.
- Full192 lần đầu:182 đạt/9 lỗi/1skip. Tám lỗi vì2 test cũ ghi16bài; một lỗi keyboard trước React dựng link. Cập nhật count theo catalog và chờ link attached, giữ yêu cầu focus bằng phím.
- Retest ban đầu11/12, một timeout Firefox ở lưu nhận định. Full lần cuối trước sửa readiness:189 đạt/2 lỗi/1skip; lỗi là2 test WebKit set file khi provider chưa ready, dù nút nhập UI còn disabled. Không gọi các full run này là xanh.
- Sửa test chờ nút Nhập bản lưu enabled, và chờ focus kết quả trước điền nhận định. Retest cuối24/24 ca liên quan trên mobile/desktop Chromium, Firefox/WebKit đạt; không thay timeout, không skip lỗi. Typecheck/lint sau sửa đạt. Không chạy full192 thêm sau thay test-only này; artifact ứng dụng giữ nguyên.
- Manual Chromium320/390/1280: export/import, tải gói rồi offline/reload bài mới, tiếp tục step và kết quả đều đạt; không tràn ngang/pageerror. Parent xem ảnh320/1280. Responsive matrix320–1440 trong full run đạt.
- Artifact JS182,77KB gzip; còn cảnh báo chunk500KB như trước, chưa có field CWV.

Evidence local ignored `.cache/edu16/`: logs,18preset traces, ảnh/results và SHA256 từngfile dist. Nguồn/trace được parent đối chiếu, không gán QA-07 hoặc human review cho bài này. Chưa pilot thật/thiết bị thật; chưa hoàn tất L0.3/36module. Hash/tree/heap/locality/serialization/compression tiếp tục roadmap.
