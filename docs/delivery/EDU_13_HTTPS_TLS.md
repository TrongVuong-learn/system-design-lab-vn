# EDU-13 — HTTPS/TLS

Scope: một bài nhập môn L0.4, ID tls/version1, case tự biên soạn và guidance hai mức. Không đóng module/pilot. Model TLS version1, engine1.4.0 thêm activity, không đổi13 model cũ. Tiến độ v1 giữ nguyên, chỉ thêm khóa lesson mới.

Nguồn sơ cấp: RFC9846 §1/2/5 (thay RFC8446, TLS1.3); RFC9525 §6 (danh tính dịch vụ); RFC9110 §4.2.2 (HTTPS). Truy cập15/10/2026. TLS chỉ bảo vệ kênh, không chứng nhận nội dung. Nguồn không mô tả số phòng/cấu hình giả của đề.

Trace: HTTP/tamper →201 gốc, người trên mạng đọc201, trình duyệt nhận999. HTTPS/valid/tamper →HTTP gửi qua kênh, phát hiện sửa, không trả999. HTTPS/sai tên hoặc hết hạn hoặc không tin →dừng trước HTTP. HTTPS/valid/listen →trình duyệt201, người trên mạng không đọc được nội dung nhưng thấy metadata.

Giới hạn: khái niệm, không thực thi crypto/PKI; nhóm bước không tương đương TLS packet trace. Endpoint/khóa tin cậy, không bỏ kiểm tra, không proxy/0-RTT/resumption/QUIC/revocation. Chỉ AI parent đối chiếu, chưa chuyên gia độc lập hay học sinh thật.

QA15/10: content validation14 bài/36 module/1 bài ôn, typecheck/build/lint đạt,53 unit đạt (ma trận24 cấu hình TLS và regression). Full E2E147 đạt/1 skip hover mobile; sau đó thêm test gợi ý/glossary TLS và chạy riêng8/8 đạt trên mobile Chromium, desktop Chromium/Firefox/WebKit. Responsive matrix có TLS320–1440px; ảnh thật320/390/1280 không overflow/pageerror, parent đã xem ảnh320/1280.

Evidence local ignored `.cache/edu13/`: full-test-results, tls-test-results, screenshots, tested-artifact.json. Source/manifest giữ audience owner-private. Bundle JS569.74KB (169.49 gzip) có warning500KB tồn tại; chưa tối ưu bundle toàn site. Không kiểm thiết bị thật hoặc pilot người thật.
