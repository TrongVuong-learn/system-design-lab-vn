# Phiếu dành cho học sinh

Chúng mình đang thử xem website có dễ học không. Bạn không bị chấm điểm ở trường. Có thể nói “mình chưa biết”, nghỉ hoặc dừng bất cứ lúc nào. Khi dùng web, hãy nói điều bạn đang nghĩ: chỗ nào khó hiểu, bạn nghĩ nút sẽ làm gì, điều gì khác dự đoán. Bạn được dùng máy tính để tính số.

Người hướng dẫn chỉ đưa từng phần đúng lúc; không cần đọc trước toàn bộ phiếu.

## Trước khi học — không mở bài để tìm đáp án

**Câu chung:** Một bảng phụ chép phòng học là 301. Bảng chính vừa đổi sang 302, bảng phụ chưa được cập nhật. Một bạn chỉ nhìn bảng phụ sẽ thấy phòng nào? Vì sao? Nếu phòng mới phải hiện trong một phút, cập nhật bảng phụ mỗi năm phút có luôn đáp ứng không?

Chỉ làm câu thuộc bài được phân công:

- **Chỉ số:** 30 lượt tra sách hoàn tất trong 3 giây. Trung bình mỗi giây xong bao nhiêu lượt? Từ đó có biết từng bạn chờ bao lâu không? Vì sao?
- **DNS:** Bộ tra cứu giữ địa chỉ cũ trong 8 giây từ lần lấy lúc giây 0. Nguồn đổi ở giây 2. Trong mô hình chỉ hỏi nguồn khi cache hết hạn, tra ở giây 3 và giây 8 khác nhau thế nào? Chỉ chờ đến giây 8 có tự gửi một truy vấn mới không?
- **TCP/UDP:** Dữ liệu có ba phần theo thứ tự A, B, C; B mất, A và C đã đến đích. TCP cho ứng dụng đọc C ngay không? UDP có tự gửi lại B không? Có thể nói TCP luôn khôi phục thành công dù kết nối hỏng mãi không?
- **Ước lượng:** 500 bạn, mỗi bạn một ảnh riêng 200 kB và xem 4 lượt/ngày, mỗi lượt tải trọn một ảnh. Với 1 MB = 1.000 kB, cần lưu bao nhiêu MB ảnh và truyền bao nhiêu MB/ngày? Xem gấp đôi có làm ảnh lưu gấp đôi không?

## Thử website

1. Từ trang chủ, tìm bài giải thích vì sao phòng học vẫn hiện thông tin cũ và học theo cách bạn thấy hợp lý. Nói chỗ nào bạn chưa biết làm gì tiếp.
2. Khi có một từ chưa rõ, thử tìm nghĩa của nó và quay lại đọc tiếp.
3. Trong thí nghiệm, làm cho lịch chính và thông tin bạn vừa xem khác nhau, rồi tìm cách nhận thông tin mới. Giải thích bằng lời của bạn.
4. Khi người hướng dẫn yêu cầu, tải lại trang; kiểm tra có tiếp tục ở đúng chỗ không.
5. Tìm và học bài thứ hai được giao. Thực hiện một việc sau, tùy bài:
   - Chỉ số: tìm một cấu hình mà hai việc chậm làm nhóm chờ lâu thay đổi, còn số ở giữa nhóm không đổi; giải thích hai con số khác nhau.
   - DNS: tạo một lần tra ra địa chỉ khác nguồn hiện tại, rồi tìm điều kiện để lần tra lấy địa chỉ mới.
   - TCP/UDP: làm mất một phần, so sánh phần ứng dụng nhận ở hai giao thức; nói điều gì còn phải chờ.
   - Ước lượng: giữ số học sinh và kích thước ảnh, tăng lượt xem; nói đại lượng nào thay đổi và vì sao.

## Sau khi học — đóng bài, giải thích bằng lời của bạn

**Câu chung:** Bảng phụ thư viện còn ghi “đóng cửa lúc 17 giờ”. Bảng chính đổi thành 16 giờ, bảng phụ chưa cập nhật. Người chỉ xem bảng phụ nhận thông tin nào, vì sao? Nếu yêu cầu thông tin cũ không quá hai phút, giữ bản ghi mười phút mà không cập nhật có đáp ứng không?

Chỉ làm câu thuộc bài đã học:

- **Chỉ số:** 24 lượt hoàn tất trong 2 giây. Tính số lượt/giây. Con số đó có cho biết mỗi lượt mất bao lâu không? Vì sao hai lượt cuối chậm hơn có thể làm p95 tăng nhưng median không đổi?
- **DNS:** Lấy địa chỉ .10 ở giây 0, TTL 6 giây; nguồn đổi sang .20 ở giây 2. Tra ở giây 5 và đúng giây 6 thấy gì trong mô hình? Nếu chỉ chờ mà không tra, có tự nhận câu trả lời mới không?
- **TCP/UDP:** Phần 1 và 3 đến, phần 2 bị mất. TCP giao phần nào cho ứng dụng trước khi nhận lại 2? Với UDP, muốn nhận đủ thì có thể chỉ dựa vào UDP không? Nếu mạng không phục hồi, có được hứa TCP sẽ giao đủ không?
- **Ước lượng:** 800 bạn, mỗi bạn một ảnh riêng 50 kB, xem 3 lượt/ngày. Tính MB ảnh duy nhất và MB truyền mỗi ngày (1 MB = 1.000 kB). Nếu xem 6 lượt/ngày, hai số thay đổi thế nào?

## Nhận xét cuối buổi

- Từ hoặc đoạn nào bạn phải đọc lại? Chỉ đúng chỗ nếu nhớ.
- Bạn thấy điều gì trên hình khó hiểu hoặc khác dự đoán?
- Nếu giải thích bài cho một người bạn, bạn sẽ nói thế nào?
- Điều gì cần đổi để lần sau bạn tự học dễ hơn?
