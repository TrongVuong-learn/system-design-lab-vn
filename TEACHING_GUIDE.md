# Chuẩn giảng dạy System Design dễ hiểu

Phiên bản 3 — 17/10/2026; chuẩn hóa mini-case từng bài và case tổng hợp. Áp dụng cho toàn bộ [giáo trình](CURRICULUM_MAP.md) và [kế hoạch website](SYSTEM_DESIGN_WEB_PLAN.md). Đây là chuẩn biên soạn và bài mẫu. Web hiện có 21 bài beta, mỗi bài có mini-case, cùng một bài ôn tổng hợp; chưa có kết quả thử nghiệm học sinh.

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

Các màn hình dưới đây là nhịp storyboard sư phạm, không quy định số chặng UI. Khi hiện thực, ghép vào bốn chặng player hiện hành; tình huống chuyển giao nằm ở Áp dụng theo chuẩn cuối tài liệu.

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

## Kiểm định kiến thức và nguồn trước phát hành

Dùng quy trình tại WORKFLOW.md và registry trong CURRICULUM_MAP.md. Mỗi khẳng định kỹ thuật cần nguồn trực tiếp tới mục hỗ trợ nó; ghi phiên bản sản phẩm/tài liệu, ngày kiểm tra và giả định. Repo tổng hợp như System Design Primer dùng để phát hiện chủ đề thiếu; kiểm tra lại bảo đảm bằng paper, tiêu chuẩn hoặc tài liệu chính thức. Không suy từ SQL/NoSQL sang một consistency model cố định.

Bài có mô phỏng phải công bố ý nghĩa từng metric, đơn vị, cửa sổ đo và thao tác nào được tính. Tách số việc còn chờ khỏi tốc độ việc đến; tách cache miss trong lượt xem khỏi mọi lần đọc nguồn. Có ít nhất một trace bình thường và một trace bác bỏ ngộ nhận, với kết quả tính tay đối chiếu engine. Ví dụ đời thường luôn đi kèm chỗ phép so sánh không còn đúng.

Trước khi gọi một năng lực là hoàn chỉnh, cần đủ giải thích, hoạt động, đánh giá chuyển giao và review có người/ngày/bằng chứng. Build/schema/E2E chỉ kiểm chứng cấu trúc và hành vi đã định nghĩa, không tự chứng minh toàn bộ kiến thức đúng hoặc học sinh hiểu. Pipeline beta đã kiểm tra quan hệ review/claim-level source theo ADR 0003; review bởi agent không thay review chuyên gia hoặc pilot. ENG-03 đầy đủ vẫn còn mở.

## Bộ pilot vận hành

Dùng [bộ EDU-02](docs/research/student-pilot/README.md) để điều phối vòng đầu: tách phiếu học sinh khỏi đáp án, ghi mức trợ giúp và câu giải thích trong tình huống mới, sửa rồi thử lại lỗi lặp. Chưa có buổi thực tế; không ghi kết quả giả lập hoặc kiểm thử tự động thành pilot học sinh.

## Chuẩn tình huống áp dụng — EDU-09

Áp dụng cho 21 bài beta hiện có và mọi bài mới. Mỗi bài có một mini-case trong chặng Áp dụng, mỗi module có họ tình huống và bài tổng hợp, mỗi level có capstone. Danh mục, độ khó, hoạt động và kế hoạch triển khai được quản lý duy nhất tại [EDU-09](docs/delivery/EDU_09_CASE_STUDY_PLAN.md).

1. **Vấn đề có người dùng cụ thể:** ai đang làm gì, gặp khó khăn nào; mở bằng lời phổ thông. Tình huống áp dụng thay ít nhất một ràng buộc hoặc ngữ cảnh so với ví dụ có hướng dẫn, không kể lại y nguyên đoạn mở bài.
2. **Yêu cầu kiểm tra được:** điều cần đạt, số liệu có đơn vị, phạm vi thời gian, invariant nếu có; nhập môn chỉ vài ràng buộc chính. Giải thích ký hiệu và đơn vị trước khi dùng.
3. **Quyết định và thử nghiệm:** dự đoán/chọn phương án, thao tác theo bước, quan sát kết quả. Hoạt động phải đúng khả năng engine; phép suy luận chỉ trên giấy ghi rõ là suy luận, không giả vờ có mô phỏng. Bài thiết kế có thể dùng bảng quyết định hoặc trace thay animation.
4. **Phản hồi có nguyên nhân:** gắn kết quả với cơ chế, có gợi ý tăng dần và một phản ví dụ. Không lộ lời giải trong context/yêu cầu trước khi người học thử. Đánh giá theo độ sâu, không chỉ đếm click hoặc nhớ từ tiếng Anh.
5. **Lợi ích, đánh đổi và giới hạn:** nói rõ cải thiện gì, mất gì, khi nào phương án không còn phù hợp; với bài mở cho phép nhiều phương án có lý do và rubric.
6. **Nguồn trung thực:** trường học/doanh nghiệp giả định phải có nhãn “Tình huống giả định”; số người, tải, thời gian hoặc đơn giá tự đặt không được mô tả là benchmark thật. Case doanh nghiệp có tài liệu gốc, thời điểm/phiên bản, phần trích/chuyển thể và phạm vi giản lược. Nguồn của cơ chế kỹ thuật vẫn bắt buộc với tình huống tự viết; lưu trong editorial registry.
7. **Dễ học trên mobile:** từng quyết định một, sơ đồ có bản chữ, chạm/bàn phím dùng được, từ mới giải thích tại chỗ theo chuẩn hiện hành. Có thể rời bài rồi tiếp tục từ dữ liệu đã lưu; bài tổng hợp dài chia chặng. Không nhồi mọi chủ đề của một module vào một mini-case.
8. **Nghiệm thu đúng mức:** đủ case không có nghĩa đủ mọi năng lực. Mỗi bài liên kết năng lực, hoạt động/trace, đánh giá, review và version; module cần coverage cùng bài tổng hợp. AI mô phỏng học sinh hỗ trợ QA, không thay review kỹ thuật hoặc pilot thật.

Đợt EDU-09 ban đầu giữ ID/đáp án/ý nghĩa challenge và progress của 12 bài tại thời điểm triển khai; nếu đổi mục tiêu hoặc đáp án cần thiết kế version/migration trước khi phát hành. Rubric sâu và evidence mới không tự diễn giải lại trạng thái hoàn thành cũ. Renderer, case schema và mini-case của 21 bài đã hiện thực; họ case module và capstone còn theo EDU-09. Xem trạng thái hiện hành tại README và IMPLEMENTATION_STATUS.

## Chuẩn phản hồi thao tác và gợi ý — EDU-10

Sau thao tác, ghi hành động → trước/sau có đơn vị → nguyên nhân. Chỉ so sánh bước liền trước với bước vừa làm, không gọi đó là benchmark A/B; giữ nhãn giả định và giới hạn. Thay cấu hình queue chưa thực thi phải phân biệt công suất dự kiến với việc đã hoàn thành. Cache đến hạn chỉ được làm mới khi đọc/lấy mới theo mô hình. Tổng network tách RTT, xử lý và truyền. Reset xóa quan sát cũ; reload có thể xem lại bước cuối đã lưu.

Gợi ý dùng dữ liệu tĩnh có schema: hai mức cho mỗi prediction/challenge (nơi quan sát, cách suy luận). Sai: phản hồi khuyến khích, mở từng mức rồi có nút xem lời giải; đúng: hiện lời giải có nguyên nhân. Gợi ý không chứa code; glossary áp dụng trong văn xuôi. Mức đã mở lưu riêng theo bài và câu hỏi; dữ liệu cũ mặc định chưa mở. Không thay answer/options/explanation để thêm gợi ý, không coi dùng gợi ý hoặc chọn đúng sau lời giải là bằng chứng thành thạo.
