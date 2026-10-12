# Thiết kế học tập mobile-first

Ngày cập nhật: 11/10/2026. Phiên bản đề xuất: 1.

**Trạng thái:** tài liệu thiết kế và kế hoạch nghiệm thu; chưa phải giao diện, tính năng offline hoặc kết quả thử nghiệm đã được triển khai.

Tài liệu liên quan: [kế hoạch sản phẩm](../../SYSTEM_DESIGN_WEB_PLAN.md), [bản đồ giáo trình](../../CURRICULUM_MAP.md), [chuẩn giảng dạy](../../TEACHING_GUIDE.md).

## 1. Quyết định sản phẩm

Website phải hỗ trợ hoàn thành hành trình học chính trên điện thoại ở tư thế dọc. Thiết kế màn hình nhỏ trước, sau đó mở rộng bố cục cho tablet và desktop. Người học không cần xoay ngang hoặc chuyển sang máy tính để hoàn thành lớp giải thích, mô phỏng và đánh giá khái niệm.

Phạm vi giáo trình giữ nguyên **6 level L0–L5, 36 module cốt lõi và 7 nhánh chuyên sâu**. Đây là phạm vi cần phát triển, không phải số học liệu đã xuất bản. Các module được chia thành bài sau khi xác định năng lực và cách đánh giá; không quy đổi 36 module thành 36 bài.

Lối **Bắt đầu từ số 0** nằm trong L0, dành cho học sinh cấp 3 chưa từng lập trình. Không yêu cầu code, SQL, tiếng Anh chuyên ngành, đăng nhập hoặc cài ứng dụng. Các bài triển khai code chuyên biệt phải ghi rõ công cụ và điều kiện sử dụng; không lấy việc viết code làm điều kiện để tiếp cận lớp giải thích của cùng chủ đề.

Web mobile là sản phẩm đầu tiên. Native app là giai đoạn sau, dùng lại nội dung có cấu trúc, định danh năng lực, mô hình và quy tắc đánh giá khi phù hợp; không cam kết dùng nguyên giao diện web cho native.

## 2. Cấu trúc điều hướng

Ba điểm đến chính trên điện thoại:

- **Học:** tiếp tục chặng đang học, bắt đầu từ số 0 hoặc theo lộ trình đã chọn.
- **Khám phá:** duyệt level, chủ đề, lab, case study và các nhánh chuyên sâu; có tìm kiếm.
- **Tiến độ:** xem bài đã xem, hoạt động đã thử và năng lực đã chứng minh, được tách riêng.

Trang level hiển thị mục tiêu, điều cần biết trước, học liệu đã có và bài tổng hợp. Không đưa toàn bộ graph 36 module và các nhánh lên màn hình đầu tiên. Người học có thể mở bản đồ theo nhóm hoặc dùng danh sách tương đương.

Trong bài học, **Hiểu bằng hình / Tự thử / Đào sâu** là ba lớp nội dung. Dùng một bộ chọn lớp khi cần; không đặt thêm bộ tab Bài học / Thí nghiệm / Kết quả bên trong. Kết quả của một thao tác thuộc ngay hoạt động đó.

Mỗi lớp gồm các chặng có tên và tiến độ như “Dự đoán · Chặng 2/5”. Chuyển lớp giữ vị trí và trạng thái riêng. Nút quay lại hoạt động theo lịch sử có nghĩa, không tự đặt lại bài. Mở từ điển hoặc phần bổ trợ rồi đóng phải đưa người học về đúng chỗ.

## 3. Màn hình học dọc theo từng chặng

Luồng chung: **Tình huống → Dự đoán → Thử nghiệm → Quan sát và giải thích → Tình huống mới**.

```text
┌──────────────────────────────────┐
│ Quay lại        Bài / Chặng 2/5  │
│ Vì sao vẫn hiện phòng học cũ?    │
├──────────────────────────────────┤
│ Một câu hỏi và bối cảnh ngắn     │
│ Dự đoán: [Phòng 201] [Phòng 205] │
├──────────────────────────────────┤
│ Sơ đồ nhỏ / bảng trạng thái      │
│ Nguồn chính: 205                │
│ Bản ghi gần: 201                │
├──────────────────────────────────┤
│ [Xem lịch] [Lấy lịch mới]       │
│ Kết quả: Bạn nhìn thấy 201      │
│ Vì trang vừa đọc bản ghi gần.   │
│ Mở chi tiết lần chạy            │
├──────────────────────────────────┤
│ [Từng bước] [Chạy / Dừng]       │
└──────────────────────────────────┘
```

Đây là cấu trúc tham khảo, không phải yêu cầu ép cả bài vào đúng một chiều cao màn hình. Trang cuộn dọc tự nhiên; tránh nhiều vùng cuộn lồng nhau.

### 3.1. Giữ quan hệ giữa điều khiển và kết quả

- Sơ đồ, điều khiển đang dùng và kết quả chính nằm trong cùng một khối hoạt động. Không bắt người học đổi tab chỉ để xem tác động của nút vừa bấm.
- Mỗi chặng nhập môn mặc định chỉ mở 1–2 điều khiển liên quan đến câu hỏi. Điều khiển nâng cao mở có chủ đích.
- Khi thay giá trị, hiển thị “Bạn vừa đổi…” và trạng thái mới. Không tự cuộn xa khỏi thao tác hoặc chuyển chặng khi chưa được yêu cầu.
- Phản hồi dùng tên cụ thể: “Bản ghi gần vẫn là 201” hoặc “Hàng chờ đang tăng”, thay cho “Tối ưu chưa đạt”.
- Phần số liệu đầy đủ, biểu đồ và timeline có thể mở rộng ngay bên dưới; kết quả tối thiểu cần để trả lời câu hỏi luôn hiển thị.
- So sánh A/B trên màn hình nhỏ dùng các thẻ cùng thứ tự chỉ số, kèm cấu hình và workload. Không dùng hai dashboard thu nhỏ cạnh nhau.

### 3.2. Thanh thao tác và cách cầm máy

Thanh Chạy / Dừng / Từng bước có thể cố định gần đáy trong lab. Khi xuất hiện thanh này, không chồng thêm thanh điều hướng tổng ở cùng vị trí. Nội dung cuối trang phải có khoảng trống tương ứng để không bị che.

Vị trí nút chính, khoảng cách và số nút là giả thuyết thiết kế cần thử với người cầm máy bằng tay trái hoặc tay phải. Không coi một vùng màn hình là dễ chạm cho tất cả thiết bị và người dùng.

Reset phải ghi rõ đối tượng: “Đặt lại thí nghiệm” khác “Xóa tiến độ trên thiết bị”. Đặt lại thí nghiệm không được xóa kết quả các bài khác. Những thay đổi cấu hình thường xuyên nên có cách hoàn tác hoặc quay về checkpoint mà không tạo chuỗi hộp thoại xác nhận.

## 4. Sơ đồ, SVG và phương án thao tác tương đương

### 4.1. Sơ đồ nhỏ trước, chi tiết mở dần

Lớp nhập môn bắt đầu bằng 2–3 khối có tên phổ thông và tên kỹ thuật phụ. Ưu tiên hướng dọc hoặc bố cục vừa bề rộng. Chỉ mở thêm thành phần khi câu hỏi cần đến chúng.

SVG phù hợp cho sơ đồ nhỏ có nhãn rõ, nhưng việc dùng SVG tự nó không bảo đảm accessibility. Tên, vai trò và trạng thái phải có biểu diễn văn bản tương đương. Tương tác ưu tiên điều khiển HTML có ngữ nghĩa, được liên kết với phần tử tương ứng trên sơ đồ.

Đối với sơ đồ lớn:

- Gom nhóm và mở chi tiết theo thành phần; luôn có đường về tổng quan.
- Có chế độ danh sách “Ai gửi gì cho ai” và timeline sự kiện.
- Pan/zoom là công cụ khám phá bổ sung. Thao tác bắt buộc trong lớp phổ thông không phụ thuộc pinch, nhãn quá nhỏ hoặc đường nối khó chọn.
- Nếu một sơ đồ chuyên sâu cần vùng xem hai chiều, mô tả rõ cách sử dụng và cung cấp cách đọc/chọn thành phần ngoài canvas.

Animation chỉ là biểu diễn. Bảng trạng thái và kết quả chữ phải thể hiện cùng diễn biến; tắt animation không được làm mất thông tin cần để giải bài.

### 4.2. Không phụ thuộc kéo, hover hoặc cử chỉ khó phát hiện

| Hành động | Cách thao tác chính trên mobile | Cách bổ sung nếu có |
| --- | --- | --- |
| Thêm thành phần | Bấm “Thêm máy xử lý”, chọn từ danh sách | Kéo thả trên màn hình đủ rộng |
| Kết nối hai thành phần | Chọn điểm đầu, chọn điểm cuối, xem xác nhận trực quan | Kéo đường nối |
| Chỉnh số lượng | Nút tăng/giảm và ô số có nhãn | Slider với bước rõ ràng |
| Sắp thứ tự sự kiện | Chọn sự kiện rồi bấm lên/xuống | Kéo thẻ |
| Xem định nghĩa | Bấm thuật ngữ hoặc nút thông tin có tên | Tooltip khi dùng chuột |
| Xem dữ liệu của node | Chọn node hoặc chọn hàng trong danh sách | Hover chỉ để xem nhanh |

Không có chức năng chỉ xuất hiện khi hover. Không yêu cầu long-press, double-tap hoặc swipe ẩn để hoàn thành bài. Các tương tác kéo không thiết yếu phải có cách thực hiện bằng một con trỏ mà không kéo. [W3C: Dragging Movements trong WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

## 5. Viewport, chạm, chữ và accessibility

### 5.1. Ma trận màn hình

| Bề rộng CSS | Mức ưu tiên | Yêu cầu |
| --- | --- | --- |
| 360 px | Chính | Hoàn thành luồng học dọc, kiểm tra nội dung dài và chữ lớn |
| 390 px | Chính | Kiểm tra toàn bộ hành trình, safe area và bàn phím ảo |
| 430 px | Chính | Dùng thêm không gian hợp lý, không kéo giãn nội dung khó đọc |
| 320 px | Fallback bắt buộc | Giữ nội dung, hành động và cách đọc thay thế; không giảm cỡ chữ để ép vừa |
| Tablet/desktop | Mở rộng | Có thể đặt nội dung cạnh hoạt động nếu vẫn giữ thứ tự đọc và trạng thái |

Các kích thước trên là viewport CSS, không phải độ phân giải phần cứng hay danh sách thiết bị được bảo đảm. Kiểm thử trình duyệt phải bao gồm thiết bị thật; giả lập viewport không kiểm tra được toàn bộ bàn phím, safe area, hiệu năng và hành vi khi đổi ứng dụng.

Nội dung chữ và điều khiển phải reflow ở 320 CSS px. Trường hợp biểu đồ hoặc nội dung thực sự cần hai chiều phải được xem xét riêng, kèm phương án đọc phù hợp; không dùng ngoại lệ này để biện minh cho cả trang cuộn ngang. [W3C: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)

### 5.2. Touch target và chữ

- **44–48 CSS px là lựa chọn thiết kế của dự án** cho vùng chạm của điều khiển chính; chọn kích thước nhất quán trong design system và thử trên thiết bị.
- Không gọi 44–48 px là ngưỡng WCAG AA. WCAG 2.2 AA SC 2.5.8 dùng mức 24 × 24 CSS px và có các ngoại lệ về khoảng cách, điều khiển tương đương, nội tuyến và trường hợp khác. [W3C: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- Vùng chạm thực phải tương ứng với thiết kế, không chỉ có icon nhỏ nằm trong khoảng trống trang trí.
- Giữ nhãn chữ cho hành động quan trọng. Không dùng icon không có tên cho Chạy, Dừng, Đặt lại hoặc Gửi câu trả lời.
- Cho phép phóng to; không khóa zoom của trình duyệt. Chữ tăng đến 200% vẫn giữ nội dung và chức năng, gồm nhãn trên nút và ô nhập. [W3C: Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text)

### 5.3. Safe area, bàn phím và focus

- Thanh cố định phải tính vùng an toàn của thiết bị và sự thay đổi chiều cao vùng nhìn khi thanh trình duyệt hoặc bàn phím xuất hiện.
- Khi nhập số hoặc trả lời, ô đang focus, nhãn, thông báo lỗi và hành động hoàn tất phải nhìn thấy được. Không để thanh lab che chúng.
- Dùng loại bàn phím phù hợp với dữ liệu, nhưng không loại bỏ cách nhập bằng bàn phím vật lý hoặc công cụ hỗ trợ.
- Dialog hoặc bảng chỉnh thông số phải có tên, nút đóng rõ, thứ tự focus hợp lý và trả focus về nơi mở.
- Không tạo bẫy focus trong canvas. Người dùng bàn phím có thể vào, thao tác và rời hoạt động.

### 5.4. Màu, chuyển động và trình đọc màn hình

- Trạng thái có chữ hoặc biểu tượng cùng màu: “đang chờ”, “hoàn tất”, “lỗi”, “dữ liệu cũ”.
- Tôn trọng lựa chọn giảm chuyển động; cung cấp Dừng và Từng bước. Giảm chuyển động không thay đổi kết quả engine.
- Trình đọc màn hình nhận kết quả sau hành động hoặc theo bước. Không thông báo từng request của một luồng tải lớn.
- Biểu đồ có tiêu đề, đơn vị và bản tóm tắt/dữ liệu chữ đủ để thực hiện nhiệm vụ học.
- Không yêu cầu người học nhìn animation đúng một khoảnh khắc; có thể dừng, đọc lại và xem lịch sử.
- Mục tiêu là thiết kế và kiểm thử theo WCAG 2.2 AA. Chỉ tuyên bố mức đáp ứng sau khi có kiểm tra phù hợp; tài liệu này chưa xác nhận tuân thủ.

## 6. Mạng yếu, tiếp tục học và offline

Ba khái niệm phải được ghi riêng trong backlog và giao diện: **tiếp tục học trên thiết bị**, **tiếp tục một bài đã tải khi mất mạng**, **mở lại bài hoàn toàn offline**.

### 6.1. Bản web đầu tiên

- Lưu vị trí bài/chặng, dự đoán, cấu hình, kết quả đã hoàn tất và checkpoint mô phỏng cần thiết trên thiết bị.
- Mỗi bản lưu gắn phiên bản nội dung, schema và engine. Không âm thầm áp kết quả của phiên bản cũ cho một quy tắc chấm mới.
- Sau khi dữ liệu cần cho một hoạt động đã tải đủ, hoạt động cục bộ nên tiếp tục khi mất mạng nếu không phụ thuộc tài nguyên từ xa. Giao diện phải phản ánh chính xác điều này.
- Chia tải nội dung theo bài hoặc hoạt động; không yêu cầu tải mọi lab của cả giáo trình trước khi bắt đầu.
- Khi tải lỗi, giữ câu trả lời và vị trí đã có, cho thử lại phần lỗi. Không hiển thị bài chưa tải như đã sẵn sàng offline.
- Chuyển ứng dụng hoặc ẩn tab phải lưu checkpoint và xử lý trạng thái chạy theo quy tắc rõ ràng. Mặc định đề xuất: dừng phát khi trở lại, báo “Đã tạm dừng”, cho tiếp tục từ checkpoint. Thời gian mô phỏng không được trôi theo thời gian người học rời ứng dụng nếu bài không định nghĩa hành vi đó.
- Chỉ hiển thị “Đã lưu” sau khi ghi thành công; nếu lưu thất bại, báo trạng thái và cho xuất bản lưu khi khả thi.

Lưu cục bộ không có nghĩa dữ liệu tồn tại vĩnh viễn hoặc được đồng bộ. Người dùng có thể xóa dữ liệu trình duyệt; website phải có mô tả rõ và đường xuất/nhập phù hợp. Không hứa giữ lại mọi event nếu chỉ lưu checkpoint.

### 6.2. Offline đầy đủ là một milestone riêng

Khả năng tải trước và mở lại bài khi không có mạng chỉ được công bố sau khi triển khai và kiểm tra gói nội dung/version, cache của ứng dụng và tài nguyên phụ thuộc.

Một bài chỉ được gắn **Đã tải để học offline** khi mọi thành phần cần cho phạm vi đó đã có: lời giải thích, hình, activity/engine, scenario và đánh giá cục bộ. Nguồn đọc thêm từ website khác có thể vẫn cần mạng và phải được ghi rõ.

Acceptance riêng gồm: tải bị ngắt có thể thử lại; không đánh dấu gói chưa hoàn chỉnh là sẵn sàng; mở bài sau khi đóng/mở trình duyệt trong điều kiện đã cam kết; hiển thị phiên bản; cập nhật không phá lượt học đang chạy; xóa gói tải không âm thầm xóa kết quả học.

Khi chưa thực hiện milestone này, không dùng nhãn “học offline toàn bộ”, và không suy ra khả năng offline chỉ từ việc website có thể được cài lên màn hình chính.

## 7. Nội dung dễ hiểu và có thể tái sử dụng

### 7.1. Hợp đồng nội dung

Nội dung gốc dùng block có schema và không phụ thuộc renderer web: tình huống, giải thích, thuật ngữ, dự đoán, sơ đồ, bảng, hoạt động, phản hồi, đánh giá và nguồn. Markdown có thể dùng cho phần prose rồi chuyển thành block khi build. Không nhúng JSX, DOM hoặc JavaScript tùy ý trong học liệu gốc.

Mỗi bài tham chiếu `levelId`, `moduleId`, `competencyIds`, prerequisite và độ sâu. Activity tham chiếu một loại tương tác đã được duyệt và cấu hình mô hình. Nguồn, giả định, giới hạn phép so sánh và phiên bản đánh giá được lưu cùng nội dung.

Web và native có thể dùng renderer khác nhau nhưng phải giữ cùng ý nghĩa, hành vi mô hình và tiêu chí đánh giá. Thay đổi giao diện không được đổi đáp án hoặc bảo đảm kỹ thuật.

### 7.2. Quy tắc cho học sinh mới bắt đầu

- Dùng chuyện lịch học, đăng ký câu lạc bộ, nhắn tin và thư viện trước thuật ngữ.
- Toán xuất hiện khi cần: đếm trước phần trăm, thời gian một lượt trước percentile, bảng và hình trước công thức.
- Một thuật ngữ có định nghĩa ngắn, ví dụ, tên tiếng Anh và ngộ nhận cần tránh; tra cứu không làm mất bài đang học.
- Phép so sánh luôn có phần giống và phần không giống hệ thống thật.
- Đánh giá bằng kết hợp thao tác, chọn lý do và câu ngắn. Không chấm khả năng tính nhẩm, đọc nhanh hoặc nhớ tiếng Anh thay cho hiểu nguyên nhân.
- Lớp sâu giữ thuật ngữ, giả định và giới hạn chính xác. Người học hoàn thành lớp trực giác chưa tự động được ghi nhận thành thạo lớp sâu.

## 8. Pipeline biên soạn và trạng thái xuất bản

```text
Đặc tả năng lực
    → Storyboard mobile
    → Nội dung + cấu hình hoạt động
    → Review kỹ thuật và review cách giảng
    → Thử với người học, sửa và thử lại
    → Duyệt phiên bản
    → Phát hành
    → Theo dõi lỗi và cập nhật
```

| Công việc | Chủ trách nhiệm | Điều kiện chuyển bước |
| --- | --- | --- |
| Phân rã module | Curriculum lead | Có mục tiêu đo được, prerequisite và mức độ cần đánh giá |
| Storyboard | Tác giả học liệu + designer | Mỗi chặng rõ câu hỏi, hành động, phản hồi và cách đọc trên mobile |
| Đặc tả activity | Chuyên gia nội dung + kỹ sư engine | Có trace mẫu, giả định, failure scenario và quy tắc đạt |
| Biên soạn/hiện thực | Tác giả + kỹ sư nền tảng | Qua schema, liên kết, nguồn và kiểm tra hành vi |
| Review | Reviewer kỹ thuật + reviewer cách giảng | Không sai cơ chế; cách diễn đạt và phương án tiếp cận phù hợp |
| Pilot | Người phụ trách nghiên cứu học tập | Ghi nhận thao tác và khả năng áp dụng; sửa lỗi lặp lại |
| Phát hành | Owner nội dung | Đủ review, phiên bản, accessibility và trạng thái catalog |

Một người có thể đảm nhiệm nhiều vai trò, nhưng các bài kỹ thuật quan trọng cần người review độc lập với tác giả. AI hỗ trợ bản nháp không thay cổng review.

Trạng thái học liệu giữ thống nhất với registry: **đã đặc tả → đang soạn → đang review → đã duyệt → đã phát hành → cần cập nhật**. Phân biệt trạng thái này với tiến độ người học. Bài dự kiến không có nút “Bắt đầu học” như một bài đã sẵn sàng; công bố số nội dung đã phát hành theo level/nhánh.

Một module hoàn chỉnh cần năng lực bắt buộc có giải thích, hoạt động phù hợp, đánh giá đúng độ sâu và review. Mục lục, nguồn đọc thêm hoặc một sơ đồ chưa đủ để tính đã dạy xong module.

## 9. Pilot với học sinh cấp 3

Pilot đầu tập trung lối không cần code; chọn khoảng **5–8 người mỗi vòng nhỏ** như giả định lập kế hoạch, gồm người chưa lập trình và người đã biết một ít. Sau đó thử lớp sâu với người đã có kiến thức tiên quyết. Mẫu nhỏ giúp tìm vấn đề để sửa, không chứng minh mọi học sinh đều hiểu.

### Kịch bản quan sát

1. Mở website bằng điện thoại của người học hoặc thiết bị mục tiêu, vào Bắt đầu từ số 0 mà không được chỉ từng nút.
2. Hoàn thành bài cache hoặc hàng đợi từ tình huống đến tự thử.
3. Tra một từ chưa biết rồi trở lại hoạt động.
4. Đưa ứng dụng ra nền hoặc rời bài, sau đó tiếp tục học.
5. Giải tình huống mới, khác các giá trị và bối cảnh vừa xem.
6. Giải thích điều gì đã đổi, vì sao kết quả xuất hiện và khi nào kết luận không còn đúng.

Ghi lại kiến thức đầu vào, thiết bị/trình duyệt, chỗ thao tác sai, trợ giúp đã dùng và ngộ nhận. Không dùng tên trường, danh tính thật hoặc câu trả lời cá nhân không cần thiết làm dữ liệu sản phẩm mặc định.

### Bằng chứng cần quan sát

| Khía cạnh | Bằng chứng |
| --- | --- |
| Tự bắt đầu | Tìm được bài và hành động đầu mà không được người hướng dẫn thao tác hộ |
| Hiểu cơ chế | Phân biệt nguồn chính/bản ghi; chỉ ra dữ liệu nào được đọc |
| Dự đoán | Nêu kết quả trước khi chạy và giải thích theo trạng thái hiện có |
| Áp dụng | Nhận ra vấn đề tương tự trong bài đăng ký chỗ hoặc tình huống mới |
| Dùng mobile | Thay tham số, xem kết quả, tra từ và tiếp tục học không bị mất ngữ cảnh |
| Tiếp cận | Có thể hoàn thành nhiệm vụ bằng phương án văn bản và không kéo khi cần |

Nếu một ngộ nhận hoặc lỗi giao diện lặp lại, sửa bài/luồng trước khi dùng làm mẫu cho hàng loạt nội dung. Lưu rõ vấn đề đã sửa, điểm chưa giải quyết và kết quả thử lại. Các bài nâng cao không được kết luận đạt chỉ vì người mới hoàn thành phần hình minh họa.

## 10. Milestone và tiêu chí nghiệm thu

Dùng chung mã milestone trong [ROADMAP.md](../delivery/ROADMAP.md): M0 đặc tả, M1 bootstrap, M2 một bài mobile hoàn chỉnh, M3 sáu lab và pipeline biên soạn, M4 web beta/PWA, M5 hoàn thiện level/chuyên sâu, M6 sync khi cần, M7–M8 app beta/release.

M2 phải kiểm chứng nguyên nhân và kết quả nằm gần nhau, bài cache có thể tự học, lưu và tiếp tục. M3 mở rộng các dạng hoạt động và review. M4 kiểm tra offline đầy đủ theo mục 6; M5 chỉ công bố level hoàn chỉnh khi coverage và assessment đủ. Sau bài mẫu, đo riêng effort viết, activity, review và pilot để ước lượng phần còn lại.

### Checklist nghiệm thu mỗi luồng mobile

- Hoàn thành ở 360/390/430 px dọc; 320 px có cách dùng tương đương, không mất nội dung bắt buộc.
- Đọc được nhãn, thay điều khiển và thấy kết quả mà không cần hover, kéo bắt buộc hoặc pinch bắt buộc.
- Chữ lớn, safe area và bàn phím ảo không che nội dung/hành động cần thiết.
- Có thứ tự đọc, tên điều khiển và focus phù hợp; bàn phím có thể rời canvas.
- Chế độ giảm chuyển động và Từng bước giữ đủ thông tin, cùng kết quả kỹ thuật.
- Điều hướng, từ điển và quay lại giữ đúng vị trí; đặt lại thí nghiệm không xóa tiến độ ngoài phạm vi.
- Resume, mất mạng và lỗi lưu hiển thị đúng khả năng thực tế; không báo “đã lưu” hoặc “offline sẵn sàng” khi chưa xác nhận.
- Nguồn, giả định mô hình, thuật ngữ và đánh giá đã review; lớp sâu không bị giản lược thành bảo đảm sai.
- Thử trên Safari iOS và Chrome Android thuộc ma trận hỗ trợ được dự án chốt; ghi phiên bản và thiết bị khi nghiệm thu, không chỉ dựa trên desktop giả lập.

## 11. Rủi ro cần theo dõi

| Rủi ro | Cách kiểm soát |
| --- | --- |
| Bố cục mobile đẹp nhưng học không hiểu | Đánh giá qua dự đoán, giải thích và bài chuyển giao; quan sát trực tiếp trước khi nhân rộng |
| Canvas lớn chiếm toàn bộ trải nghiệm | Sơ đồ theo nhóm, hoạt động có cấu trúc và phương án danh sách/timeline |
| Content phát triển nhanh hơn khả năng review | Owner/reviewer từng module, backlog chưa duyệt và cổng xuất bản rõ |
| Mất bài khi người học bị gián đoạn | Checkpoint có phiên bản, kiểm tra back/reload/đổi ứng dụng và báo lỗi lưu |
| Thiết bị yếu chạy quá tải | Giới hạn event/animation, hiển thị request đại diện, kiểm tra thiết bị mục tiêu; giảm hiển thị không làm sai engine |
| Dễ hiểu nhưng sai chuyên môn | Phân lớp giải thích, nêu giới hạn phép so sánh, review cơ chế và trace |
| Có catalog nhưng bị hiểu là đã hoàn chỉnh | Trạng thái học liệu và độ bao phủ công bố riêng theo level/nhánh |
| Học liệu gắn chặt vào web | Block/schema và logic độc lập renderer; kiểm chứng nhu cầu native trước khi xây thêm lớp trừu tượng |


## Kiểm chứng responsive trong bản beta

Ma trận tự động hiện có ở `tests/e2e/responsive-matrix.spec.ts`: 320, 360, 390, 430, 768, 1024 và 1440 CSS px; catalog, bốn chặng của sáu bài, điều khiển tap và trạng thái lỗi ghi. Project `responsive-chromium` chạy riêng ma trận; các project mobile/desktop giữ hành trình tiến độ. Đây là viewport/touch emulation, chưa thay thế ma trận trình duyệt và thiết bị thật trong tiêu chí nghiệm thu phía trên. Kết quả từng đợt ở docs/delivery/IMPLEMENTATION_STATUS.md.

### Chuẩn ghi chú thuật ngữ

Từ có gạch chân chấm mở ghi chú tại chỗ: hover/focus trên desktop, chạm toggle trên mobile. Popup không modal, không điều hướng trang hoặc bắt buộc hover; có nút Đóng ít nhất 44 px, Escape và light-dismiss. Khi popup đóng bằng nút, trả focus về từ mà không mở lại. Giới hạn popup trong viewport 320 px và bám vị trí từ khi cuộn, đóng nếu từ ra khỏi vùng nhìn. Danh sách “Giải thích từ mới” vẫn giữ đầy đủ định nghĩa. Chuẩn nguồn/renderer và acceptance chi tiết nằm ở SYSTEM_DESIGN_WEB_PLAN.md, mục Chuẩn giải thích thuật ngữ tại chỗ.
