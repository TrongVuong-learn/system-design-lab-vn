# M4-OFFLINE-01 — Gói học offline của bản beta

## Phạm vi và acceptance

Tải toàn bộ artifact beta (16 bài + bài ôn, engine, font/UI) trong một gói vì hiện nội dung cùng bundle. Không tuyên bố có đủ36 module; chưa tạo package/app native. Owner Codex. Phụ thuộc build Vite đã khóa, lưu tiến độ hiện hữu.

- Opt-in tại Tiến độ; không tự tải khi mở web. Nêu dung lượng, phiên bản và giới hạn nguồn ngoài.
- Build tạo danh sách chính xác tài nguyên và version theo hash; install chỉ thành công khi cache đủ, thất bại không được báo sẵn sàng.
- Kiểm tra gói trước khi hiển thị ready, không chỉ kiểm tra navigator.onLine. Cache bị xóa/thiếu báo tải lại.
- Bản mới tải riêng, chờ đóng các tab cũ; không skipWaiting/reload tự động làm gián đoạn bài.
- Cache static cùng origin theo whitelist, không cache đăng nhập/API/nguồn ngoài. Navigation phục vụ đúng shell cùng version.
- Xóa gói chỉ unregister worker/cache của ứng dụng, không xóa progress IndexedDB. Lỗi/quota có hành động thử lại.
- Kiểm thử reload offline, mở bài chưa từng ghé, lưu/resume, xóa giữ tiến độ, lỗi download và update giữ bản cũ.

## Thiết kế

Giữ palette #f5f7fb/#ffffff/#17233d/#244edb/#fff0a8 và Be Vietnam Pro. Một mục trong trang Tiến độ: giải thích → dung lượng/phiên bản → trạng thái → tải/kiểm tra/xóa. Mobile một cột, điều khiển wrap44px, status chữ; không thêm card quảng cáo hoặc animation. Kiểm ảnh320/390/1280px với nội dung thật.

## Nguồn cơ chế

- https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- https://developer.mozilla.org/en-US/docs/Web/API/Cache/addAll
- https://web.dev/articles/service-worker-lifecycle

Đã đọc15/10/2026. Cache addAll trong install; worker mới chờ client cũ đóng. Lưu browser là best effort, có thể bị hệ điều hành thu hồi; người học vẫn cần export tiến độ. Chưa nghiệm thu thiết bị thật, OS eviction hoặc installed app chỉ từ browser emulation.

## Kết quả

Đã hiện thực adapter/UI/build manifest + worker, không thêm dependency hoặc đổi engine/progress version.

- Content validation36 module/16 bài/1 ôn, TypeScript/build, lint và git diff --check đạt.
-63 unit tests/16files đạt, gồm manifest kiểm byte/hash/ổn định version và quota giả lập chỉ xóa cache mới; repair thất bại không xóa cache cũ.
- Full E2E188 cases:187 đạt,1skip hover mobile; chạy sau bản code cuối (metadata dung lượng và worker version đã có). Bốn context mobile/desktop Chromium, desktop Firefox/WebKit; responsive320–1440.
-12 ca offline nằm trong full suite: chưa opt-in không register; mở bài chưa ghé/new tab/reload offline; ghi/resume; xóa giữ progress; cache thiếu/repair; install lỗi; update lỗi giữ bản cũ; bản mới chờ tab cũ đóng. Fixture HTTP phục vụ artifact thật, chỉ thay version worker và gây503 để kiểm lifecycle; không sửa dist.
- Screenshot320/390/1280px đều không tràn ngang, không pageerror, nút48px hoặc hơn. Parent xem ảnh320 và1280 với nội dung thật.
- Artifact khoảng0,8MB không nén; JS khoảng180KB gzip. Ngưỡng field CWV chưa đo.

Bằng chứng local ignored tại `.cache/m4-offline-01/`: log build/E2E, screenshot/results.json, SHA256 từng file artifact. Bản đầu phát hiện retry cache thiếu không sửa được; sửa thành message repair chủ động rồi kiểm lại trong full suite.

Chưa nghiệm thu Safari iOS/Chrome Android thật, đóng cả tiến trình browser/OS hoặc eviction/quota thiết bị thật; E2E đóng document/new tab trong cùng context. Quota là fault injection, không phải kiểm ổ đĩa đầy thật. Không gọi đây là hoàn tất M4/M5, PWA install hoặc app release.
