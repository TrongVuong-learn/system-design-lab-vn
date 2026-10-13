# Kịch bản người điều phối — không đưa phần đáp án cho học sinh

Đọc [phạm vi và điều kiện](README.md) trước. Các tác vụ thực hiện trên bản đã ghi commit/version. Vai trò điều phối chưa được gán cho một người thật; cần chủ dự án xác nhận trước buổi.

## Buổi 40–45 phút

| Phút dự kiến | Việc thực hiện |
| --- | --- |
| 0–4 | Giới thiệu từ phiếu học sinh; xác nhận muốn tham gia; ghi mã, lớp 10/11/12, đã học code/chưa, thiết bị/trình duyệt và đã xem bài chưa |
| 4–8 | Câu trước học: cache + một chủ đề được giao; ghi nguyên lời, không chữa đáp án |
| 8–20 | Học cache từ trang chủ; tác vụ tìm bài, giải nghĩa, tạo dữ liệu cũ/lấy mới, tải lại |
| 20–33 | Bài mới; để học sinh tìm, dự đoán, thao tác và giải thích; không chọn đáp án hộ |
| 33–40 | Đóng bài, câu sau học và giải thích bằng lời; ghi trước khi phản hồi |
| 40–45 | Cảm nhận cuối buổi; giải thích lại ngộ nhận còn tồn tại sau khi kết thúc phần đo; cảm ơn |

Đây là khung thời gian, không ép học sinh bấm nhanh. Nếu thiếu giờ hoặc mệt, dừng và ghi phần chưa thử là NA; không biến buổi chưa đủ thành một quan sát hoàn tất. Không công bố trước đáp án của quiz trên web. Nếu chưa hiểu “yêu cầu”, cho phép dùng chính glossary trong bài; mọi giải thích thêm của điều phối phải được ghi.

## Mức hỗ trợ và ghi nhận

- H0: không trợ giúp. Lời mời nói suy nghĩ trung lập (“Bạn đang nghĩ gì?”) không tính là chỉ dẫn.
- H1: nhắc mục tiêu tác vụ, không nêu nút/vị trí/đáp án.
- H2: chỉ vị trí/nút hoặc giải nghĩa cơ chế để tiếp tục. Từ đây không tính hoàn tất độc lập.
- H3: làm mẫu/đưa đáp án; chỉ ghi hoàn tất có hỗ trợ.

Nếu im lặng hoặc đứng yên khoảng 60 giây, hỏi “Bạn đang mong điều gì xảy ra?”; nếu vẫn không tiếp tục hoặc muốn giúp, dùng mức hỗ trợ nhỏ nhất và ghi thời điểm. Không hỏi dẫn dắt “Em hiểu TTL rồi đúng không?”; hỏi “Theo em điều gì sẽ xảy ra tiếp theo? Vì sao?”. Người điều phối không sửa lỗi hiểu trong lúc chấm câu sau học; ghi xong mới giải thích.

Tách ba thứ: hành vi quan sát, lời nói nguyên văn, diễn giải của người quan sát. Thời gian chỉ là tín hiệu phụ. Quiz đúng sau vài lần bấm không phải bằng chứng tự giải thích được.

## Rubric trước/sau — mỗi tiêu chí 0/1

Cho 1 khi người học tự trả lời đúng cả kết quả và lý do cần thiết; 0 khi sai/chưa biết; NA nếu chưa hỏi. Ghi H0–H3 ở từng câu. Không cộng NA thành 0. Giữ riêng điểm đầu tiên trước hỗ trợ và điểm sau hỗ trợ nếu có; chỉ dùng điểm đầu tiên cho so sánh trước/sau. Câu trước và sau không phải hai đề chuẩn hóa có độ khó bằng nhau; chỉ xem như tín hiệu.

| Chủ đề | Tiêu chí / đáp án trước | Tiêu chí / đáp án sau |
| --- | --- | --- |
| Cache C1 | 301 vì đang đọc bảng phụ chưa cập nhật | 17 giờ vì bản ghi phụ còn cũ |
| Cache C2 | Không bảo đảm giới hạn 1 phút nếu cập nhật mỗi 5 phút | Không đạt giới hạn 2 phút nếu giữ cũ 10 phút |
| Metrics M1 | 30/3 = 10 lượt/giây, đúng đơn vị | 24/2 = 12 lượt/giây, đúng đơn vị |
| Metrics M2 | Không suy ra thời gian chờ từng lượt từ throughput | Không suy ra thời gian chờ từng lượt từ throughput |
| Metrics M3 | NA: chưa hỏi percentile trước học | Hai vị trí giữa có thể giữ nguyên; vị trí ở đuôi tăng nên p95 tăng; không cần thuộc tên tiếng Anh |
| DNS D1 | Giây 3 dùng cũ vì còn hạn | Giây 5 dùng .10 vì còn hạn |
| DNS D2 | Lần tra giây 8 lấy lại nguồn vì hết hạn | Lần tra đúng giây 6 lấy .20 theo mô hình |
| DNS D3 | Chờ không tự gửi truy vấn | Chờ không tự nhận câu trả lời mới |
| Transport T1 | TCP chưa giao C, còn thiếu B ở giữa luồng | Giao 1, giữ 3 chờ 2 |
| Transport T2 | UDP không tự gửi lại B | Cần cơ chế ở lớp khác hoặc giao thức thích hợp để có giao đủ |
| Transport T3 | Không hứa khôi phục nếu kết nối hỏng mãi | Không hứa giao đủ khi mạng không phục hồi |
| Capacity E1 | 500 × 200 / 1.000 = 100 MB lưu | 800 × 50 / 1.000 = 40 MB lưu |
| Capacity E2 | 100 × 4 = 400 MB truyền/ngày | 40 × 3 = 120 MB truyền/ngày |
| Capacity E3 | Lưu 100 MB không đổi, truyền 800 MB/ngày | Lưu 40 MB không đổi, truyền 240 MB/ngày khi 6 lượt |

M3 chỉ báo cáo điểm sau, không dùng NA trước học để tính “mức tăng”. Các tiêu chí còn lại tính theo từng cặp có dữ liệu, không gộp khác chủ đề thành một tổng điểm so sánh học sinh. Bài cache có 2 tiêu chí; bài mới có 3, riêng metrics chỉ có 2 cặp trước/sau.

## Sau mỗi buổi và sau vòng

Điền phiếu, đánh dấu câu nói có cần ẩn danh thêm không, rồi lập issue với bằng chứng và bước tái hiện. Ưu tiên: chặn học/mất dữ liệu → ngộ nhận cơ chế → cần chỉ dẫn → trình bày. Mỗi lỗi có owner, thay đổi đề xuất và kế hoạch thử lại. Không sửa ngay giữa hai người rồi tổng hợp như cùng phiên bản.

Sau vòng, báo cáo số n/N độc lập và có hỗ trợ theo từng tác vụ/tiêu chí; không chỉ phần trăm. Với bài chỉ một người, nói rõ bằng chứng hẹp. Thử lại lỗi bằng người mới để kiểm tra first-use; nếu mời lại người cũ, báo cáo riêng vì đã quen bài. Muốn đo ghi nhớ, tổ chức lần sau với đề khác và ghi khoảng thời gian; bộ này chưa đo retention.
