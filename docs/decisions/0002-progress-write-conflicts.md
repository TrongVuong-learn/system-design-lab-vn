# ADR 0002 — Bảo vệ checkpoint khỏi ghi đè giữa các tab

Trạng thái: áp dụng trong bản beta, 12/10/2026.

## Bối cảnh

Mỗi tab giữ một snapshot tiến độ. Hai tab cùng đọc trước khi có thay đổi có thể ghi lần lượt toàn bộ snapshot, khiến tab sau xóa tiến độ mà tab trước đã lưu. Hàng đợi trong một provider chỉ bảo vệ thứ tự của một tab. Import là thay snapshot chủ động; tự merge mọi save sẽ làm import và reset không rõ nghĩa.

## Quyết định

Adapter IndexedDB so sánh chuỗi snapshot gốc với bản đang lưu trong cùng một giao dịch readwrite, rồi ghi nếu còn khớp. Xung đột abort giao dịch, trả ProgressConflictError do learning-core định nghĩa. UI giữ phiên đang học trong bộ nhớ, cảnh báo, cho xuất dự phòng rồi reload. Không tự merge hoặc cho retry ghi đè.

Nâng database từ v1 lên v2, giữ nguyên store progress/key current và JSON schema v1. Kiểm tra store tồn tại khi upgrade. Adapter cũ gọi open(v1) sẽ gặp VersionError sau upgrade, tránh client cũ bỏ qua bảo vệ mới. Không tự đóng tab hoặc thay cài đặt trình duyệt của người dùng.

## Hệ quả và kiểm chứng

Bản lưu không đổi thì save và import hoạt động bình thường; thao tác trong cùng một tab tiếp tục được serialized. Tab stale phải xuất phần đang học và reload trước khi chọn cách giữ các tiến độ. Chưa có hợp nhất attempts hay sync. Nếu storage bị chặn/thu hồi thì vẫn cần export dự phòng.

E2E kiểm tra hai tab, bản đã lưu không bị xóa, export phiên xung đột, reload; fixture database v1 nâng lên v2 giữ câu trả lời/chặng, từ chối writer v1 và tiếp tục lưu/reload. Chạy trên Chromium mobile/desktop, Firefox và WebKit. Ranh giới core không phụ thuộc IndexedDB/React; giao dịch nằm ở adapter.
