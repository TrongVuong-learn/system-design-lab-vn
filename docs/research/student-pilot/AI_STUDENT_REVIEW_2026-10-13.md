# QA-04 — Góc nhìn học sinh mô phỏng bằng agent

Ngày: 2026-10-13. Một agent `student_simulation` được tạo theo yêu cầu chủ dự án, dùng góc nhìn học sinh lớp 10 chưa học lập trình. Người tổng hợp: Codex/root. Đây là kiểm tra giao diện qua một góc nhìn giả định; **không có học sinh thật, không đo được độ hiểu hoặc tiến bộ của học sinh**. EDU-02 vẫn có 0 buổi thực tế.

Bản ứng dụng thử: `4032361bdcd502b8a18dac3bb924b3f492cc3045`, engine 1.1.0, lesson version 1. HEAD khi thử `7096452e64697adb6ee545b136a316902c01a95f` chỉ thêm bộ tài liệu pilot. Production build phục vụ qua local preview cổng 4174. Chromium, viewport 390 × 844 CSS px, touch/mobile emulation, browser context mới; không dùng tiến độ cá nhân hoặc trình duyệt đăng nhập của chủ dự án.

## Cách thử và giới hạn

Agent đọc nội dung trên giao diện, không đọc engine/học liệu JSON/đáp án rubric trước khi thử. Thao tác qua Playwright và xem ảnh thật. AI vẫn có kiến thức nền của mô hình; việc đóng vai không tạo ra một học sinh chưa biết kiến thức. Nhận xét “có thể khó hiểu” là giả thuyết cần xác minh với người học thật.

Agent đã gửi ghi nhận theo từng bước và tạo 7 ảnh, sau đó chạm giới hạn sử dụng trước khi viết báo cáo cuối. Root tổng hợp từ những ghi nhận đã nhận và review ảnh cache/metrics. Không tạo thêm phản hồi hoặc câu nói học sinh. Không có command log hoàn chỉnh để biến buổi khám phá này thành test suite tái lập.

## Các thao tác đã thực hiện

| Phạm vi | Quan sát được |
| --- | --- |
| Trang chủ | Đổi phòng ở nguồn, xem lịch; quan sát tình huống dữ liệu cũ và tìm bài cache |
| Cache — câu chuyện/dự đoán | Đọc tình huống; chọn phòng 201; mở thí nghiệm |
| Cache — thuật ngữ | Chạm mở định nghĩa cache; có nút Đóng và quay lại bài |
| Cache — dữ liệu cũ | Đổi nguồn sang 205 rồi xem: bản ghi trả 201; lượt thấy dữ liệu cũ tăng lên 1 |
| Cache — TTL/resume | Đổi thời hạn 5 → 4 phút; sau khi UI báo đã lưu, reload giữ TTL 4 và trạng thái nguồn/cache trước đó |
| Metrics — dự đoán | Chọn đáp án A có chủ ý để kiểm tra phản hồi sai; tiếp tục vào lab |
| Metrics — thuật ngữ | Chạm mở/đóng định nghĩa median |
| Metrics — cấu hình | Tăng 1 → 2 thủ thư, bật hai việc cuối chậm: median 550 ms, p95 1.900 ms, throughput 10,53 lượt/giây |
| Metrics — resume | Reload giữ cấu hình, chặng học và số liệu |
| Metrics — áp dụng | Với 40 yêu cầu/2 giây, chọn 20 yêu cầu/giây; xem giải thích và lưu hoàn thành |

Chưa thử DNS/transport/capacity trong lượt agent này; chưa xác nhận hoàn tất chặng áp dụng cache; chưa thử 320 px, desktop, thiết bị thật, screen reader hoặc retention. Không dùng việc agent chọn đúng câu hỏi để chứng minh người học hiểu.

## Phát hiện và đề xuất

### SIM-01 — Nhãn nút chưa mô tả hành động đổi thời gian

Ưu tiên đề xuất: P2, cách hướng dẫn thao tác. Route `/#/learn/metrics`, chặng Tự thử.

Bước tái hiện: mở lab ở cấu hình đầu → xem nút “Hai việc cuối: 100 ms” → bấm nút → nhãn thành “Hai việc cuối: 1.000 ms”, số liệu cập nhật. Hành vi đổi thời gian hoạt động; nhãn hiện tại chủ yếu báo giá trị, không nói rõ tác dụng của lần bấm tiếp theo. Đây là quan sát về câu chữ và giả thuyết trở ngại cho người mới, chưa có học sinh xác nhận.

Đề xuất: nhãn hành động như “Làm hai việc cuối chậm hơn” khi tắt; “Cho hai việc cuối nhanh lại” khi bật. Hiển thị riêng trạng thái “100 ms → 1.000 ms” và giữ `aria-pressed`. Không thay cơ chế/đáp án.

Minh chứng: [lab ban đầu](../../../.cache/student-simulation/04-metrics-lab.png), [sau khi bật chậm](../../../.cache/student-simulation/05-metrics-two-slow.png).

### SIM-02 — Đơn vị ms cần điểm giải thích ngay tại bài metrics

Ưu tiên đề xuất: P2, kiến thức bổ trợ. Route `/#/learn/metrics`, câu chuyện và lab.

Agent gặp “100 ms”, “1.900 ms” trong lab; trong phần câu chuyện/lab/glossary đã mở không tìm thấy lời giải “1 ms = 1/1.000 giây”. Đây là thiếu hướng dẫn được nhận thấy trong phạm vi màn hình đã thử, không khẳng định cả website không có giải thích ms. Bài request có thể đã giới thiệu đơn vị, nhưng người mở thẳng metrics vẫn cần một điểm nhắc lại.

Đề xuất: thêm dòng ngắn cạnh lab “ms là mili giây; 1.000 ms = 1 giây”, hoặc thuật ngữ mở tại chỗ. Sau đó đưa tác vụ đọc một latency vào pilot thật để xác minh có giúp không. Không dùng tốc độ đọc hoặc phép tính của AI để kết luận dễ học.

Minh chứng: [lab metrics](../../../.cache/student-simulation/04-metrics-lab.png).

### SIM-03 — Reload trước khi ghi xong cần được phân biệt với dữ liệu đã lưu

Trạng thái: quan sát cần theo dõi, chưa xác nhận lỗi mất dữ liệu đã lưu. Route `/#/learn/cache`, Tự thử → thời hạn bản ghi.

Ở lần đổi TTL 5 → 4 rồi reload ngay, agent thấy trở lại 5. Chưa ghi lại chính xác trạng thái lưu trước lần reload đó. Kiểm tra lại: đổi 5 → 4, đợi UI báo “Đã lưu trên thiết bị”, reload → TTL vẫn 4 và phản hồi “Bản ghi được dùng tối đa 4 phút…”. Vì vậy lượt này không chứng minh adapter làm mất bản đã lưu.

Đề xuất theo dõi: trong pilot thật, ghi cả trạng thái lưu và thời điểm reload khi người học nói mất thay đổi. Nếu cần đánh giá rủi ro pending writes, dùng test riêng với trì hoãn ghi có kiểm soát; chưa đưa ra bản sửa từ quan sát này.

Minh chứng: [trước reload sau khi lưu](../../../.cache/student-simulation/06-cache-ttl-saved.png), [sau reload](../../../.cache/student-simulation/07-cache-ttl-reloaded.png).

## Điều đang hoạt động trong phạm vi thử

Tình huống nguồn/cache có số phòng và phản hồi bằng chữ để đối chiếu. Tooltip chạm/đóng hoạt động. Metrics làm rõ hai số median/p95 khác nhau bằng một cấu hình cụ thể. Hai bài giữ trạng thái đã lưu sau reload trong các bước đã kiểm tra. Ảnh mobile có nội dung và điều khiển đọc được; đây không thay responsive matrix hoặc accessibility audit.

## Bàn giao

SIM-01 và SIM-02 là backlog cải thiện hướng dẫn, chưa sửa source trong task kiểm tra này. SIM-03 chưa được ghi là defect mất dữ liệu. Các ảnh là artifact local trong `.cache/student-simulation/`, Git ignore; báo cáo giữ tên ảnh và hành trình đã thử. Không thay nhãn beta/human-reviewed, không nhập dữ liệu mô phỏng vào CSV quan sát học sinh và không đóng gate pilot.
