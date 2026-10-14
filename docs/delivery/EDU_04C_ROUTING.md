# EDU-04c / CASE-04 — IP, port TCP và routing nhập môn

Ngày: 14/10/2026. Phạm vi: một bài `routing` thuộc L0.4, bổ sung nền cho CASE-L0-04; catalog có 13 bài beta. L0/CASE-04 vẫn còn năng lực chưa có bài, chưa đóng gate module/level/pilot.

## Kết quả và ranh giới

Bài giúp phân biệt IP đích, route chọn chặng tiếp theo và port TCP chọn dịch vụ tại máy đích. Engine thuần `routePacket` cùng renderer `RoutingLab` dùng mạng cố định, một router, hai IP đích và ba port. Cấu hình đề: IP 192.0.2.10 có lịch học TCP 8080, thư viện TCP 9090; TCP 8181 không có dịch vụ lắng nghe. IP 198.51.100.20 là máy khác, dịch vụ máy đó không mô phỏng.

Các trace: gửi → router → máy đích → dịch vụ; thiếu route dừng ở router khi không có route mặc định; đổi IP đến máy khác; cùng IP đổi port tới dịch vụ khác hoặc không có listener. Chọn mới hoặc đổi route bắt đầu trace từ bước 0 và giữ lựa chọn khác. Quay lại bài áp dụng vẫn giữ checkpoint theo cơ chế hiện hành.

Engine 1.3.0 chỉ thêm model, không đổi engine cũ; lesson/progress/schema v1 và đáp án 12 bài cũ giữ nguyên. Whitelist `kind` bổ sung routing, navigation đặt sau DNS; registry liên kết năng lực, nguồn, prerequisite request/DNS và case review revision 1. Không thêm dependency hoặc thay runtime.

Mô hình không gửi mạng thật và không mô phỏng subnet/ARP, NAT, firewall, DNS, mất gói, route động, TCP handshake/connection đầy đủ hoặc HTTP. Đổi port không chọn đường IP là quy tắc trong mô hình IP routing này; không khẳng định mọi thiết bị mạng thực tế bỏ qua port. Port chỉ có ý nghĩa cùng giao thức/IP; 8080/9090 là lựa chọn của đề, không phải quy tắc dịch vụ phổ quát.

## Nguồn và review

Codex (agent) đối chiếu ngày 14/10/2026:

- [RFC 1122 §3.3.1](https://www.rfc-editor.org/rfc/rfc1122.html): IP chọn next hop. Nội dung dùng bản diễn giải ngắn và trace tự biên soạn, không coi mô hình là đầy đủ Internet routing.
- [RFC 9293 §3.1](https://www.rfc-editor.org/rfc/rfc9293.html): IP source/destination addresses và TCP source/destination ports ở hai header.
- [RFC 5737](https://www.rfc-editor.org/rfc/rfc5737.html): các dải địa chỉ dùng cho tài liệu; mô hình không truy vấn các địa chỉ đó.

Case “Sửa đường tới máy lưu ảnh” giả định mạng không có route tới đích và không có default route; kiểm tra người học phân biệt sửa port với sửa đường đi. Có label giả định, yêu cầu, gợi ý thử, phản hồi và giới hạn. Đây là review beta nội bộ, chưa qua chuyên gia độc lập hoặc pilot thật.

## Kiểm chứng

- `pnpm content:check`: đạt 36 module/13 bài beta. `pnpm lint`, typecheck (trong build) và production build: đạt.
- `pnpm test:unit`: **29/29** đạt. Ba test routing chứng minh thứ tự host/service, port không bypass missing route, wrong IP và restore checkpoint không hợp lệ.
- Test restore ban đầu kỳ vọng clamp/round; đã đối chiếu `boundedNumber` và sửa kỳ vọng: chỉ nhận số nguyên trong phạm vi, các giá trị ngoài phạm vi hoặc phân số quay về mặc định. Không đổi helper dùng chung để làm test qua.
- `pnpm test:e2e`: **103 đạt, một skip** (mouse hover trên project touch; tap được test riêng), 104 test toàn bộ suite. Bài routing có test đủ trạng thái, lưu/reload lab và completion.
- Responsive suite kiểm 13 bài ở 320/360/390/430/768/1024/1440 px, kiểm kích thước nút, focus và lỗi lưu/reduced motion theo suite hiện hành.
- Sáu screenshot lab/case ở 320, 390 và 1280 px trong `.cache/routing/`; đã review nội dung thật, controls xếp cột trên mobile/hai cột trên desktop, trace có chữ và feedback. Không có overflow hoặc pageerror trong visual script.
- JavaScript gzip 151,27 kB; CSS gzip 7,41 kB. Vite cảnh báo chunk raw lớn hơn 500 kB, vẫn dưới budget JS gzip 250 kB hiện hành; chưa có field Web Vitals. Annotation Zod là cảnh báo baseline, build exit 0.
- Checksum artifact đã test tại `.cache/routing/tested-artifact.json`, đối chiếu trước packaging; không đưa cache/ảnh vào commit.

Chưa có kiểm thiết bị iOS/Android thật, screen reader thật, tester Minh hoặc pilot học sinh trong task này. Kết quả emulation không thay gate đó. Bước tiếp theo: HTTPS/TLS/session theo L0.5, OS/concurrency và cấu trúc dữ liệu theo L0.2–3, sau đó đánh giá coverage trước CAP-L0.

## Phát hành

Nhánh `codex/edu-04c-routing`, nguồn commit được đóng gói cùng build đã test, giữ site owner-private. Thành công phát hành chỉ báo khi có kết quả tool deployment; không suy từ build.
