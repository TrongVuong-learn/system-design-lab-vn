# EDU-12 — bài ôn website trường

Plan commit74a5d2f trước code, baseline bcbf137; nhánh codex/edu-12-school-review. Scope một hoạt động ôn riêng với hai tình huống;13 bài beta/36 module/7 track giữ nguyên. Không thêm tài khoản/backend hoặc đánh dấu module mastery.

## Cơ chế và nguồn

Core school-review tái dùng trafficStep/queueStep. Opening:12 đọc/s,6 việc/s,0 tồn,4 giây,7 điểm. Rush:6 đọc/s,8 việc/s,8 tồn,4 giây,8 điểm. Server6 đọc/s, nguồn4 đọc/s, worker2 việc/s, cache giả định75% hit cho mọiTTL. TTL chỉ kiểm policy≤1phút theo mô hình lý tưởng. Nhiều cấu hình đạt; không yêu cầu một sơ đồ duy nhất.

Nguồn sơ cấp đã mở15/10/2026: [Azure Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) về đọc cache/nguồn và cân nhắc expiration/staleness; [Azure Queue-Based Load Leveling](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling) về tách nhận/xử lý, công suất và hàng chờ. Không dùng nguồn để chứng minh số tải/chi phí/hit giả định; không gọi TTL là bảo đảm consistency thực tế.

## Nội dung/dữ liệu

Review ID school-day/version1, activityRef school-review registry; scenario opening/rush có schema và review gate riêng, prerequisite refs kiểm với catalog. Không thêm mini-case hoặc lesson để thổi số module. Generated catalog chứa reviews; renderer đọc dữ liệu biên soạn.

Progress v1 thêm reviews optional; checkpoint tách lessons, hai config/run/previous-run/reflection/hint/saved riêng. Kết quả được tính lại từ config đã chạy, không tin số result nhập từ ngoài. Đổi config giữ run cũ có nhãn cần chạy lại và hủy cờ lưu; viết nhận định không tự chấm đúng. Lưu lượt ôn chỉ khi phương án hiện tại đạt và có nhận định, không dùng độ dài để kết luận kiến thức. Export/import/save error/multi-tab dùng adapter hiện có.

## Kiểm chứng

-51 unit test đạt (Vitest thêm inventory cho model thuần ở app), build/content validation/typecheck/lint đạt. Content pipeline nhận36 module/13 lesson/1 review, không nâng dependency. Kiểm toàn bộ960 config cho hai tình huống: bảo toàn received=processed+queued, không xử lý quá việc có/công suất và có nhiều phương án đạt. Rush: worker4 giữ tồn8; worker5 giảm6→4→2→0, làm40 việc; worker6 làm12/12/8/8 theo việc có.
-12 E2E bài ôn ban đầu đạt trên touch Chromium và desktop Chromium/Firefox/WebKit. Full regression144 đạt143 pass/1 skip hover mobile: legacy lessons, progress/import/export/error/retry/multi-tab và responsive cũ tiếp tục chạy.

- Sau bổ sung glossary tại chỗ từ prerequisite registry và thay “Policy” thành “Quy tắc”, build riêng và targeted review/term-notes đạt27 pass/1 skip; không gọi full-run trước là test cùng artifact sau thay đổi này. Cuối cùng bỏ từ “hit/queue” ở hai câu UI, build cuối và12 test ôn đạt; hash/checks ở `.cache/edu12/tested-artifact.json`. Không sửa engine hoặc schema sau full run.
  -15 ảnh ở `/private/tmp/edu12-visual/`: brief/controls/pass/backlog/trace ×320/390/1280, không tràn ngang hoặc pageerror, reduced motion. Parent xem bài/controls320, kết quả desktop, backlog390 và trace320; chữ, trạng thái và số đọc được. Bản ảnh cuối được chụp sau câu chữ cuối.
- Test xác nhận kết quả cũ không dùng để lưu khi config đổi, nhận định/hints/scenario độc lập saved→reload, source v1 cũ giữ lessons, reviews đi cùng export/import, lỗi ghi giữ state rồi retry và reset bỏ run/previous run. Flags nhập không tự thành evidence nếu run/config/reflection không hợp lệ. Ghi chú từ mới có tap/đóng và tra cứu fallback.

Giới hạn: emulation chưa thay điện thoại thật hoặc screen reader; không thử hệ thống gửi/nhận mạng thật. Nhận định không được chấm tự động, không gọi human-reviewed hoặc đóng pilot. Hai agent review không được gọi trong task hiện thực này; evidence là nguồn/trace/tests và review ảnh của parent. Không thay capstone đầy đủ hoặc chứng nhận đủ36 module.
