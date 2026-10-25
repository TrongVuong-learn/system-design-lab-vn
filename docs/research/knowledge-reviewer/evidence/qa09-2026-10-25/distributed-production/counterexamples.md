# Phản ví dụ định tính theo từng bài (source-read/inferred)

Đây là lịch thao tác suy luận độc lập để kiểm giới hạn claim và lựa chọn, không phải trace engine đã chạy. Baseline HEAD `68f7de6cd2d1659c0b9840c067e5e519539c1194`. Bài `module-practice` chỉ chấm lựa chọn; sáu bản thiết kế tự viết chỉ kiểm có nội dung, nên các lịch này không đo năng lực học sinh.

| Bài | Lịch thường và phản ví dụ/failure đã xét | Kết quả đối chiếu |
| --- | --- | --- |
| `distributed-order` | W(x=1) trả rồi R mới bắt đầu thấy 0, không W khác; client timeout sau commit vì response rơi. | R=0 trái linearizability; timeout không chứng minh rollback. Đáp án giữ hai nghĩa. |
| `consensus-raft` | N=3, A có X term hiện tại; so một mình với A/B cùng lưu; chia 2+1. | 1/3 chưa commit, 2/3 có thể commit theo điều kiện protocol; thiểu số không tạo quyết định mới. |
| `quorum-fencing` | R=W=3,N=5 giao một nút nhưng reader lấy giá trị tùy ý; A kiểm lease rồi pause, B token8 ghi, A token7 tới. | Giao tập chưa đủ linearizability; kho cần từ chối 7 nguyên tử. |
| `distributed-workflows` | Coordinator chết khi B prepared; relay gửi E9 rồi chết trước đánh dấu; email đã đọc, compensation được gọi. | B không tự abort tùy tiện; E9 có thể lặp; compensation không xóa lịch sử email. |
| `conflicts-crdt` | Hai writer tăng `[2,0]`, `[0,3]`, merge lại bản cũ; hai khu cùng bán chỗ cuối. | G-counter hội tụ 5, không thành 7; hội tụ không tự giữ sức chứa. |
| `multi-region` | A ACK S10, B bền S8; promote B, sau đó A cũ trở lại. | RTO có thể nhỏ nhưng RPO=0 không được chứng minh; A phải bắt kịp/đối soát trước ghi. |
| `slo-observability` | Trang chủ 200 còn endpoint nộp lỗi; requestId thành nhãn metric; sample 10 trace không thấy lỗi. | SLI cần đúng luồng và mẫu số; nhãn tạo chuỗi lớn; sample không chứng minh không lỗi. |
| `resilience` | Ba tầng mỗi tầng 3 lần; client timeout sau write; retry ID mới. | 27 lượt cuối có thể xảy ra; ID mới có thể tạo trùng, cần tra/idempotency. |
| `capacity-tail` | 19 lượt 10ms, một lượt 1000ms; 10 call độc lập hoặc cùng DB lỗi. | Mean 59,5ms, nearest-rank p95 10ms; công thức độc lập không dùng khi tương quan. |
| `security-lifecycle` | An gửi tenantId lớp B; token chữ ký hợp lệ sai audience; DB mã hóa nhưng API trả file B. | Phải kiểm quyền theo nguồn tin cậy/audience; mã hóa disk không khắc phục cấp quyền sai. |
| `delivery-platform` | Canary lỗi20% trong 5% traffic, cũ1%; V2 ghi `archived`, V1 không đọc. | Trung bình có thể che nhóm mới; rollback code không undo dữ liệu. |
| `recovery-cost` | Backup00:00, sự cố18:00 không WAL; phát hiện10+chuẩn bị20+restore40+kiểm20+route10. | Không chứng minh RPO5 phút; toàn RTO100 phút, không phải riêng restore40. |
| `capstone-foundations` | Gửi2MB ở1MB/s; server commit P9 rồi response mất; client biết mã phiếu người khác. | 2,20s theo nối tiếp; timeout không phủ định P9; ID không trao quyền xem. |
| `capstone-service` | Hai người đọc còn1 rồi insert; client retry sau commit timeout; thumbnail lỗi. | Đọc đơn lẻ không giữ invariant; cùng intent phải tra/trả phiếu cũ; job phụ không xóa phiếu. |
| `capstone-scaling` | Warm hit80%, cold hit0%; queue đến20/s làm15/s; pool4×25 với budget80. | DB60/220 thao tác/s; backlog300 sau60s; pool vượt20. |
| `capstone-distributed` | A/B cùng xác nhận một chỗ khi partition; kho thấy token8 trước token7; outbox relay crash. | Vượt sức chứa nếu không quyền bán; kho từ chối7; event có thể lặp. |
| `capstone-production` | 1000 canary lỗi20%, 9000 old lỗi1%; restore90/RTO60; V1 không đọc state V2. | 290 lỗi, budget100, vượt190; restore chậm30; rollback chưa chắc an toàn. |
| `capstone-architecture` | 20.000 người×2 lượt/600s; offline muốn bán một chỗ chung; A log cũ trở lại. | Trung bình66,67/s không là peak; cần quyền bán hoặc đổi hợp đồng; không promote bản cũ tùy tiện. |

Nguồn cụ thể và section cho mỗi cụm claim nằm trong `claim-matrix.json`; phép tính số đầy đủ ở `calculations.md`. Các giả định fixture là của bài, không phải benchmark hay bảo đảm sản phẩm nguồn.
