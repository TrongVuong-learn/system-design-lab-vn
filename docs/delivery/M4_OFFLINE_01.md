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

Chưa kiểm chứng; cập nhật sau hiện thực.
