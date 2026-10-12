# Chuẩn giảng dạy System Design dễ hiểu

Phiên bản 1 — 11/10/2026. Áp dụng cho toàn bộ [giáo trình](CURRICULUM_MAP.md) và [kế hoạch website](SYSTEM_DESIGN_WEB_PLAN.md). Đây là đặc tả biên soạn và bài mẫu; chưa có website hoặc kết quả thử nghiệm học sinh.

## 1. Người học và mục tiêu

Lối nhập môn dành cho học sinh cấp 3 chưa học lập trình, biết sử dụng trình duyệt và các phép tính cơ bản. Không yêu cầu cài công cụ, viết code, đọc tiếng Anh chuyên ngành hoặc học hết mạng/OS trước bài tương tác đầu.

Mục tiêu là học sinh có thể tự bắt đầu, hiểu vai trò của các thành phần, dự đoán kết quả một thay đổi, giải thích nguyên nhân và vận dụng sang tình huống khác. Các level sâu vẫn cần tích lũy kiến thức; website cung cấp các bước đệm và bài bổ trợ.

## 2. Cách viết và trình bày

1. Bắt đầu bằng câu hỏi quen thuộc: “Vì sao cả lớp cùng mở trang thì phải chờ?” hoặc “Vì sao phòng học đã đổi nhưng bạn vẫn thấy phòng cũ?”.
2. Cho người học nhìn và thao tác trước khi yêu cầu nhớ tên kỹ thuật. Lần đầu viết “một yêu cầu gửi đến máy xử lý (request)” rồi dùng tên thống nhất.
3. Mỗi chặng tập trung một ý. Một module rộng phải chia thành nhiều bài, tránh đưa toàn bộ danh sách thuật ngữ lên một màn hình.
4. Dùng câu có chủ thể và hành động rõ: ai gửi, gửi gì, đến đâu, điều gì thay đổi. Giải thích cả nguyên nhân và kết quả.
5. Mọi từ mới có giải thích tại chỗ: một câu định nghĩa, ví dụ, tên tiếng Anh, ngộ nhận thường gặp và liên kết đào sâu. Mở từ điển không làm mất vị trí học.
6. Với phép so sánh, chỉ rõ phần tương ứng và phần không tương ứng. Hàng chờ căng tin giúp hiểu việc đến trước/sau nhưng chưa giải thích retry, mất thông báo xác nhận hoặc xử lý trùng.
7. Dùng một họ ví dụ xuyên suốt như website trường, đăng ký câu lạc bộ và thư viện; bổ sung tình huống mới ở bài đánh giá để kiểm tra khả năng áp dụng.
8. Giữ đầy đủ nội dung kỹ thuật trong lớp sâu. Không biến “dễ hiểu” thành khẳng định tuyệt đối như “cache luôn nhanh hơn”, “thêm server luôn tăng tốc” hoặc “timeout nghĩa là thao tác chưa xảy ra”.

Mỗi bài có ba lớp dùng chung nội dung và mô hình:

| Lớp | Cách học | Bằng chứng |
| --- | --- | --- |
| Hiểu bằng hình | Tình huống, sơ đồ nhỏ, ví dụ giải sẵn | Chỉ đúng vai trò và giải thích bằng lời của mình |
| Tự thử và giải thích | Dự đoán, thay một yếu tố, xem từng bước, bài mới | Nêu kết quả, nguyên nhân và điều kiện áp dụng |
| Đào sâu kỹ thuật | Cơ chế, thuật ngữ, toán cần thiết, lỗi; code/SQL khi phù hợp | Phân tích chính xác, kiểm tra invariant, triển khai nếu bài yêu cầu |

Hoàn thành lớp trực giác không tự động đánh dấu đã nắm cơ chế hoặc triển khai được. Bài tập phải nêu đang kiểm tra mức nào.

## 3. Nhịp tương tác và kiến thức bổ trợ

- Ban đầu một yêu cầu, sau đó nhóm nhỏ rồi mới đến nhiều yêu cầu. Mỗi bước đầu chỉ thay một yếu tố; không bắt người học đoán cả bảng cấu hình.
- Dùng nhãn như “Số yêu cầu mới mỗi giây” và giải thích đơn vị. Có thể bắt đầu bằng mức Ít/Vừa/Nhiều rồi mở giá trị cụ thể.
- Sơ đồ nhập môn chỉ hiển thị 2–3 khối; các khối có tên dễ hiểu và tên kỹ thuật phụ. Đây là mặc định thiết kế, không phải giới hạn cho mọi bài.
- Có Chạy/Dừng/Từng bước/Đặt lại, nút thay cho kéo thả và mô tả bằng chữ. Animation không là nguồn thông tin duy nhất; tốc độ phát không đổi kết quả mô phỏng.
- Hiển thị số đang chờ và số hoàn tất trước, rồi thời gian, tốc độ xử lý, phân bố và percentile. Mỗi biểu đồ có lời hướng dẫn đọc một điểm cụ thể.
- Nút “Giải thích đơn giản hơn” mở ví dụ hoặc cách diễn đạt khác được biên soạn sẵn. Gợi ý tăng dần, không chỉ hiện đáp án ngay.
- Phản hồi nêu điều vừa xảy ra: “Nơi lưu dữ liệu vẫn đang có hàng chờ; thêm máy nhận yêu cầu chưa giảm được số lượt đọc ở đây.”
- Lượt học có thể chia thành chặng 3–5 phút, bài đầy đủ khoảng 10–15 phút; đây là mục tiêu ban đầu cần kiểm chứng. Không dùng thời gian đọc nhanh làm điểm năng lực.

| Khi bài cần | Bài bổ trợ ngay tại chỗ |
| --- | --- |
| Đếm yêu cầu và số chỗ | Cộng/trừ bằng thẻ; giữ đơn vị rõ |
| Tốc độ vào/ra | Đếm số đến và số làm xong trong cùng một khoảng |
| Tỷ lệ cache hit | Đếm 8 trên 10 lượt, rồi mới chuyển sang phân số và phần trăm |
| Biểu đồ | Giải thích trục, đơn vị và đọc thử một điểm |
| Percentile | Sắp thời gian từ nhỏ đến lớn rồi chỉ vị trí; nêu quy ước tính |
| Xác suất, lũy thừa, logarithm | Ví dụ số nhỏ và hình minh họa trước công thức |
| Code/SQL | Bài riêng có ví dụ chạy được và giải thích từng bước |

Cho phép dùng máy tính hoặc công cụ trực quan. Mục tiêu chính là hiểu quan hệ, không phải tính nhẩm.

## 4. Bài mẫu: “Vì sao website vẫn hiện phòng học cũ?”

**Tên kỹ thuật cho tác giả:** cache và độ mới dữ liệu. Bài thuộc lối dẫn nhập L0; cơ chế cache ở L2 liên kết về ví dụ này.

**Điều cần biết trước:** biết đọc một bảng lịch. Không cần code hoặc phần trăm.

### Màn hình 1 — Câu chuyện

> Bạn mở website của lớp để xem phòng sinh hoạt câu lạc bộ. Thông tin được lưu ở một nơi chính. Để tra cứu thuận tiện, máy xử lý giữ thêm một bản ghi gần đó.
>
> Trong mô hình này, đọc bản ghi gần mất ít thời gian hơn hỏi lại nơi lưu chính. Bản ghi ấy được gọi là cache.

Sơ đồ chỉ có ba khối: **Bạn xem lịch → Máy xử lý có bản ghi gần → Nơi lưu lịch chính**. Chưa hiển thị RPS, p95 hoặc viết tắt DB.

Người học bấm “Xem phòng học” và nhìn đường đọc từ bản ghi gần. Sau đó chạy ví dụ có lời giải với 10 thẻ lượt xem: 8 thẻ đọc thành công từ bản ghi gần, 2 thẻ cần đọc nơi lưu chính. Hiển thị “Nơi lưu chính trả lời 2 lượt”; mở phần nâng cao mới giới thiệu “8/10 = 80%”.

**Giả định tác giả cần thể hiện:** 10 thẻ là trace ví dụ có dữ liệu/mục tra cứu được xác định trước; mỗi lượt không tìm được bản ghi tạo đúng một lần đọc nguồn chính; không có retry, làm mới nền hoặc lượt đọc khác. Không hứa cứ bật cache là đạt 80%.

### Màn hình 2 — Dự đoán trước khi bấm

> Ban đầu lịch ghi phòng 201. Cô phụ trách đổi lịch chính sang phòng 205, nhưng bản ghi gần vẫn là 201. Nếu trang dùng bản ghi gần ngay lúc này, bạn sẽ thấy phòng nào?

Người học chọn 201 hoặc 205 và nêu lý do bằng một câu hoặc chọn mệnh đề lý do. Sau đó bấm “Xem lịch” để kiểm tra. Phản hồi cho cả đáp án đúng và sai: “Trang đang đọc bản ghi gần, nơi vẫn lưu 201; việc đổi lịch chính chưa làm bản này thay đổi.”

### Màn hình 3 — Tự sửa và giải thích

Ba thao tác có nhãn rõ:

- **Đổi phòng trong lịch chính** — chỉ đổi dữ liệu nguồn.
- **Xem bằng bản ghi gần** — hiển thị giá trị đang có trong bản ghi.
- **Lấy lịch mới từ nguồn chính** — cập nhật bản ghi và hiển thị 205.

Hai giá trị luôn xuất hiện bằng chữ bên cạnh nhau. Người học thử lại với cặp phòng khác rồi trả lời: “Điều gì khiến trang hiển thị phòng mới?”.

### Màn hình 4 — Quy tắc cập nhật

> Chúng ta muốn thay đổi phòng học xuất hiện trên trang trong vòng một phút. Có thể giữ nguyên bản ghi cũ năm phút mà không cập nhật gì không?

Phản hồi: “Không đạt yêu cầu trong trường hợp lịch đổi ngay sau lần lấy dữ liệu. Bản ghi có thể còn cũ quá một phút.” Sau đó cho thử quy tắc hết hạn hoặc nhận thông báo cập nhật; mỗi quy tắc có một ví dụ và giả định riêng.

Đồng hồ mô phỏng, thời điểm thay đổi và thời điểm hết hạn hiển thị rõ. Nêu giả định nguồn chính đang truy cập được và cách xử lý khi bản ghi hết hạn; phần lỗi kết nối nằm trong bài tiếp theo. Không khẳng định chỉ đặt TTL một phút là đủ bảo đảm mọi lần đọc trong mọi tình huống.

### Màn hình 5 — Tình huống mới

> Website đăng ký câu lạc bộ hiển thị còn một chỗ từ bản ghi gần. Trong lúc đó, một bạn khác đã đăng ký chỗ cuối ở nơi lưu chính. Hệ thống có nên xác nhận còn chỗ chỉ dựa vào bản ghi gần không?

Người học cần nhận ra phải kiểm tra và cập nhật tại nơi chịu trách nhiệm giữ đúng số chỗ. Liên kết đến bài “Hai bạn cùng đăng ký chỗ cuối” để học thao tác đồng thời. Không ngụ ý đọc lại một lần là tự giải quyết được mọi race condition.

### Kết bài và giới hạn ví dụ

> Bản ghi gần có thể giảm số lượt phải đọc nơi lưu chính. Khi thông tin thay đổi, cần quy tắc để biết lúc nào bản ghi còn dùng được và lúc nào phải lấy thông tin mới.

Có thể ví cache như ảnh chụp thời khóa biểu; điểm giống là ảnh có thể cũ sau khi lịch gốc đổi. Điểm khác là bản ghi trên máy tính có thể được cập nhật tự động theo nhiều cơ chế. Tốc độ đọc và công sức cập nhật phụ thuộc hệ thống; đây là mô hình có giả định.

## 5. Kiểm tra chất lượng trước khi nhân rộng

Mỗi bài có review kỹ thuật và review khả năng hiểu. Checklist:

1. Tiêu đề nói rõ một vấn đề; không yêu cầu hiểu thuật ngữ mới để đọc tiêu đề.
2. Mọi từ, ký hiệu và đơn vị bắt buộc được giải thích hoặc có bài bổ trợ ngay tại chỗ.
3. Có ví dụ giải sẵn, thao tác tự thử và tình huống mới.
4. Phép so sánh ánh xạ đúng vai trò và nêu giới hạn; không tạo bảo đảm kỹ thuật sai.
5. Kết quả trên hình khớp engine và phần giải thích; bản chữ thể hiện được cùng thông tin.
6. Câu hỏi đánh giá phân biệt hiểu nguyên nhân với đoán đáp án; không chấm khả năng nhớ tiếng Anh thay cho hiểu kiến thức.
7. Phần nâng cao có thể mở từ bài hiện tại, với điều kiện tiên quyết rõ ràng.

Thử bài nhập môn theo vài vòng nhỏ, khoảng 5–8 học sinh cấp 3/vòng, gồm nhóm chưa lập trình và nhóm đã học. Ghi nhận kiến thức ban đầu, gợi ý đã dùng, chỗ cần người hướng dẫn can thiệp và cách giải thích của người học. Với lớp sâu, người tham gia cần học nền tương ứng trước.

Rubric bài cache: người học phân biệt nguồn chính/bản ghi; dự đoán đúng khi bản ghi cũ và giải thích nguyên nhân; đếm đúng lượt đọc theo trace; nhận ra quy tắc cập nhật không đạt yêu cầu; áp dụng sang ví dụ đăng ký chỗ. Dùng chọn đáp án, thao tác và câu ngắn kết hợp, không chỉ trắc nghiệm.

Nếu cùng một ngộ nhận xuất hiện lặp lại hoặc nhiều người cần được giải thích lại mới thao tác được, bài phải sửa và thử lại trước khi dùng làm mẫu. Có thể kiểm tra lại sau vài ngày với tình huống khác để xem khả năng ghi nhớ và áp dụng.

Các vòng nhỏ dùng để tìm vấn đề và cải tiến; không chứng minh mọi học sinh đều hiểu. Trước khi có kết quả, chỉ mô tả bài là được thiết kế cho đối tượng này. Số lượt xem, câu ngắn, điểm dễ đọc và thời gian học là tín hiệu phụ, không thay thế bằng chứng hiểu.

## Tra cứu thuật ngữ khi đang đọc

Dùng term.name/term.english/term.meaning của bài làm nguồn duy nhất cho ghi chú và danh sách từ mới. Định nghĩa phải hiểu được khi mở riêng khỏi đoạn văn. Trong văn xuôi, thuật ngữ mở bằng hover/focus hoặc chạm; không bắt người học xuống cuối bài mới biết nghĩa. Giữ danh sách đầy đủ cuối bài. Không tự thêm tương tác vào đáp án; tránh nút lồng nút. Các bài phát triển sau tuân thủ chuẩn ghi chú tại chỗ của plan và MOBILE_FIRST.md.

Danh sách từ mới chỉ hiển thị tên Việt/Anh khi popup được hỗ trợ; mở nghĩa bằng hover/focus hoặc chạm, không in thêm cùng định nghĩa ngay dưới mục. Browser thiếu Popover API hiển thị định nghĩa dạng chữ như fallback. Cùng một nguồn registry được dùng cho cả hai cách hiển thị.
