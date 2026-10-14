# Kế hoạch website học System Design tương tác

Ngày lập: 11/10/2026. Phiên bản 5 — 14/10/2026: bổ sung ví dụ thực tế theo từng bài/module; giữ định hướng toàn diện theo level, học sinh cấp 3, mobile-first và web trước app. Trạng thái: web beta có 13 bài nhập môn; phần giáo trình đầy đủ và case theo EDU-09 còn là kế hoạch triển khai, chưa qua pilot học sinh thật.

Tên làm việc: **System Design Lab**.

Bộ tài liệu triển khai chuyên nghiệp: [kiến trúc và cấu trúc project](docs/engineering/ARCHITECTURE.md), [thiết lập môi trường](docs/engineering/SETUP.md), [thiết kế mobile](docs/design/MOBILE_FIRST.md), [roadmap hiện hành](docs/delivery/ROADMAP.md), [quyết định công nghệ](docs/decisions/0001-web-first-mobile-ready.md). Roadmap hiện hành là nguồn chính cho milestone và ước lượng sau khi bổ sung mobile-first/PWA/app.

## 1. Mục tiêu và giả định

Xây dựng website tiếng Việt giúp người học hiểu hệ thống bằng cách thay đổi kiến trúc, chạy mô phỏng, quan sát kết quả và giải thích quyết định của mình.

Yêu cầu đã chốt: website có khu vực riêng cho từng level; ưu tiên bao phủ toàn diện các mảng System Design; cách giảng đủ gần gũi để học sinh cấp 3 có thể bắt đầu. Lối học nhập môn không yêu cầu lập trình, SQL hoặc tiếng Anh chuyên ngành. Level thể hiện kiến thức và khả năng thực hành, không quy đổi cứng sang chức danh hoặc số năm kinh nghiệm.

Mọi chủ đề có lớp giải thích phổ thông và phần kỹ thuật mở dần theo kiến thức tiên quyết. Giữ đầy đủ phạm vi chuyên sâu và xây các bước bổ trợ để người mới tiến tới độ sâu đó. Chuẩn biên soạn và bài mẫu nằm trong [TEACHING_GUIDE.md](TEACHING_GUIDE.md). Độ dễ hiểu là tiêu chí cần thử với người học thật; hiện chưa có kết quả thử nghiệm để xác nhận.

Phạm vi đầy đủ gồm sáu level cốt lõi và các nhánh chuyên sâu, được đặc tả trong [bản đồ giáo trình](CURRICULUM_MAP.md). Bao phủ được kiểm tra theo mục tiêu học và bằng chứng thực hành, không tính bằng số tiêu đề xuất hiện trên website. Các chủ đề chuyên biệt tiếp tục được bổ sung khi lĩnh vực phát triển.

Sau lộ trình đầu tiên, người học cần làm được bốn việc:

1. Chuyển một yêu cầu sản phẩm thành yêu cầu về tải, độ trễ, tính đúng đắn và khả năng phục hồi.
2. Tìm nút thắt từ sơ đồ và số liệu của một hệ thống.
3. Chọn giải pháp, chạy thử và dùng kết quả để kiểm tra dự đoán.
4. Giải thích ít nhất hai đánh đổi của thiết kế và giới hạn còn lại.

Việc chia level, ưu tiên độ bao phủ và có lối học dễ hiểu cho học sinh cấp 3 là yêu cầu sản phẩm. Các ước lượng nhân sự, thời gian và thứ tự phát hành bên dưới vẫn là giả định lập kế hoạch.

## 2. Cách tổ chức trải nghiệm học

Mỗi bài dùng cùng vòng học:

**Tình huống → Dự đoán → Thử nghiệm → Quan sát → Giải thích → Thử thách mới.**

Ví dụ mở đầu: “Giờ ra chơi, nhiều bạn cùng xếp hàng mua nước. Mở thêm quầy nhận đơn có giúp mọi người nhận nước nhanh hơn nếu vẫn chỉ có một người pha?” Sau khi dự đoán và thử, người học mới liên hệ từng phần với các thành phần của ứng dụng. Giải thích cả điểm giống và giới hạn của phép so sánh.

- Một màn hình chỉ đưa ra một câu hỏi chính và 2–3 tham số liên quan.
- Cho xem từng bước một request trước khi hiển thị nhiều request đồng thời.
- Dùng ví dụ đời thường để giới thiệu, sau đó nối rõ từng phần với khái niệm kỹ thuật và giới hạn của ví dụ.
- Cho người học dự đoán trước khi chạy; phản hồi giải thích nguyên nhân của kết quả.
- Có gợi ý ba mức: gợi ý nơi quan sát, gợi ý nguyên lý, lời giải có giải thích.
- Mỗi bài cơ bản nhắm đến 10–15 phút; một lab có thể gồm hai bài ngắn. Bài tổng hợp level chia phiên khoảng 30–45 phút; case sâu có thể cần nhiều phiên. Thời lượng phải được kiểm chứng qua thử nghiệm người học; quy mô mini-case và case module theo EDU-09.
- Mỗi bài có mini-case trong chặng **Áp dụng**: vấn đề, yêu cầu cụ thể, lựa chọn/thử nghiệm, phản hồi và đánh đổi. Mỗi module có họ tình huống cùng bài tổng hợp; mỗi level có capstone. Giữ bốn chặng player hiện hành, không tạo thêm khối lặp lại câu chuyện mở đầu.
- Chuẩn biên soạn quản lý trong [TEACHING_GUIDE](TEACHING_GUIDE.md); danh mục và thứ tự triển khai đủ 36 module, bảy nhánh, tương thích dữ liệu và QA nằm trong [EDU-09](docs/delivery/EDU_09_CASE_STUDY_PLAN.md). Ví dụ giả định được ghi rõ; case doanh nghiệp phải có nguồn trực tiếp và giới hạn chuyển thể. Câu hỏi chuyển giao thay ngữ cảnh hoặc ràng buộc để kiểm tra vận dụng.

### Chuẩn dễ hiểu cho học sinh cấp 3

- Nút **Bắt đầu từ số 0** dẫn đến sáu bài bằng chuyện tin nhắn, lịch học và xếp hàng; không cần cài công cụ hoặc viết code.
- Mỗi bài có ba lớp: **Hiểu bằng hình → Tự thử và giải thích → Đào sâu kỹ thuật**. Code là hoạt động triển khai trong lớp sâu, với bài bổ trợ riêng.
- Dùng tiếng Việt trước, tên kỹ thuật và tiếng Anh sau. Chữ viết tắt được giải nghĩa lần đầu; các bảng thuật ngữ trong tài liệu tác giả không được đưa nguyên xi lên màn hình nhập môn.
- Một ý mới mỗi chặng; ban đầu chỉ 1–2 điều khiển, 2–3 khối và một biến được thay đổi. Đây là giới hạn thiết kế ban đầu, điều chỉnh qua thử nghiệm.
- Giới thiệu đơn vị, cách đọc biểu đồ và phép tính trước khi dùng. Bắt đầu từ số yêu cầu và thời gian chờ; percentile, xác suất và công thức có bài giải thích riêng.
- Có **Giải thích đơn giản hơn**, **Xem lại từng bước** và từ điển tại chỗ. Nội dung bổ trợ được biên soạn sẵn, không phụ thuộc AI tutor.
- Đi từ ví dụ có lời giải sang bài bớt gợi ý rồi tình huống mới. Cho phép trả lời bằng thao tác, sắp bước hoặc lời nói/câu ngắn khi đánh giá có người hướng dẫn.
- Đánh giá khả năng giải thích nguyên nhân, liên hệ ví dụ với hệ thống và áp dụng sang tình huống khác; không chỉ đếm lượt xem hoặc số lần bấm đúng.

### Các màn hình

| Màn hình | Công việc chính của người học |
| --- | --- |
| Tổng quan level | Chọn L0–L5; xem đầu vào, đầu ra, module bắt buộc và bài tổng hợp của từng level |
| Bản đồ kiến thức | Duyệt theo chủ đề hoặc quan hệ tiên quyết; tìm chỗ thiếu kiến thức và xem trạng thái học liệu |
| Lộ trình cá nhân | Chọn mục tiêu, làm bài đánh giá đầu vào tùy chọn, học hoặc ôn đúng phần còn thiếu |
| Bài học + phòng thí nghiệm | Đọc tình huống, dự đoán, chỉnh tham số, chạy và đọc kết quả |
| Thử thách | Giải yêu cầu có ràng buộc, so sánh các lần thử và tự giải thích |
| Chuyên sâu và case study | Chọn AI, Data, Realtime, Search, Media, Platform hoặc bài toán tổng hợp theo kiến thức cần có |
| Từ điển | Tra thuật ngữ kèm ví dụ và liên kết về bài liên quan |

Trang giới thiệu chỉ cần giới thiệu giá trị và dẫn thẳng vào bài đầu. Người học có thể bắt đầu mà không đăng ký.

Người học được mở mọi bài, xem giải thích kiến thức tiên quyết và bỏ qua phần đã biết. Bài đánh giá đầu vào chỉ đề xuất điểm bắt đầu; không khóa cứng theo level. Tiến độ đọc/xem, kết quả thực hành và năng lực đã chứng minh được hiển thị riêng. Nội dung dự kiến có nhãn rõ ràng và không tính vào số bài đã phát hành.

### Bố cục phòng thí nghiệm mobile-first

```text
┌───────────────────────────────────┐
│ Quay lại        Bài / Chặng 2/5   │
│ Câu chuyện và câu hỏi ngắn         │
│ Dự đoán của bạn                   │
│ Sơ đồ nhỏ / bảng trạng thái        │
│ 1–2 thao tác liên quan            │
│ Kết quả và giải thích ngay bên dưới│
│ [Từng bước] [Chạy / Dừng]         │
└───────────────────────────────────┘
```

Thiết kế màn hình dọc một cột trước. Giữ tham số, sơ đồ và kết quả gần nhau; không yêu cầu đổi tab để hiểu tác động của thao tác. Chỉ dùng bộ lớp Hiểu bằng hình / Tự thử / Đào sâu. Desktop mở rộng thành các vùng cạnh nhau khi đủ chỗ. Có nút và ô nhập thay cho kéo, bản chữ tương đương và giảm chuyển động. Xem ma trận màn hình, safe area và tiêu chí nghiệm thu tại [MOBILE_FIRST.md](docs/design/MOBILE_FIRST.md).

## 3. Giáo trình toàn diện theo level

| Level | Phạm vi | Đầu ra chính |
| --- | --- | --- |
| L0 — Nhập môn hệ thống | Máy tính, OS, mạng, giao thức web, cấu trúc dữ liệu liên quan, chỉ số và ước lượng | Giải thích đường đi request và các nguồn độ trễ |
| L1 — Thiết kế ứng dụng và dữ liệu | Yêu cầu, API, data modeling, database internals, transaction, bảo mật cơ bản | Thiết kế một dịch vụ có API, dữ liệu và hành vi đúng |
| L2 — Mở rộng hệ thống | Load balancing, caching/CDN, replication, sharding, messaging, backpressure | Tìm và xử lý nút thắt; dự đoán khi tải tăng hoặc phân bố lệch |
| L3 — Hệ thống phân tán | Consistency, clocks, consensus, quorum, distributed transactions, conflict resolution, multi-region | Phân tích tính đúng đắn và khả năng phục vụ khi xảy ra lỗi cục bộ hoặc partition |
| L4 — Vận hành production | SLO, observability, resilience, security/privacy, deployment, DR, cost | Thiết kế hệ thống có thể vận hành, khôi phục và kiểm soát chi phí |
| L5 — Thiết kế tổng thể và tiến hóa | Domain boundaries, migration, platform, multi-tenancy, quyết định kiến trúc, case study tổng hợp | Bảo vệ và phát triển kiến trúc theo ràng buộc sản phẩm, vận hành và tổ chức |

Security, tính đúng đắn, chi phí và yêu cầu sản phẩm xuất hiện từ level đầu phù hợp và được đào sâu về sau. Các nhánh AI/ML, Data Engineering, Search/Recommendation, Realtime, Media, Cloud/Platform và hệ thống nghiệp vụ có điều kiện tiên quyết riêng; người học không phải hoàn thành mọi nhánh để hoàn thành phần cốt lõi.

Chi tiết module, tương tác, điều kiện tiên quyết và ma trận bao phủ: [CURRICULUM_MAP.md](CURRICULUM_MAP.md).

### Sáu lab thử nghiệm khung tương tác

Sáu lab dưới đây là đợt phát hành thử nghiệm để kiểm chứng engine và phương pháp học. Chúng được gắn vào các level tương ứng; toàn bộ giáo trình là phạm vi sản phẩm bắt buộc được quản lý riêng.

| Lab | Thao tác trực tiếp | Điều người học phải chứng minh |
| --- | --- | --- |
| 1. Một yêu cầu đi đâu? | Theo dõi nơi nhận, nơi xử lý, nơi lưu dữ liệu; làm chậm một chặng; tăng số yêu cầu | Đếm số hoàn tất, đọc thời gian chờ và tìm nơi bị chậm; sau đó học tên latency/throughput; p95 có bài tiếp theo riêng |
| 2. Load balancing và khả năng phục vụ khi lỗi | Thêm API server, đổi cách phân tải, tắt một server, làm chậm database | Giải thích khi nào thêm server có ích; phát hiện nút thắt chung; nhận ra ảnh hưởng của health check và session lưu trong từng server |
| 3. Cache và độ mới dữ liệu | Bật cache-aside; đổi TTL, dung lượng và phân bố truy cập; cập nhật dữ liệu; thử cache lạnh | So sánh tải database, hit/miss và dữ liệu cũ; chọn chính sách phù hợp với yêu cầu độ mới |
| 4. Queue và workers | Tạo burst job, thêm worker, làm mất ACK, bật retry có giới hạn và idempotency | Phân biệt nhận job với hoàn tất job; đọc backlog; xử lý tình huống gửi lại mà không tạo tác dụng phụ trùng |
| 5. Replication và tính nhất quán khi đọc | Ghi primary, đọc replica, tăng độ trễ sao chép, đọc ngay sau ghi | Nhận ra stale read; chọn đường đọc theo yêu cầu; giải thích đánh đổi giữa độ mới và khả năng phục vụ trong mô hình đã định |
| 6. Thiết kế URL shortener | Chọn các thành phần đã học; thử hot link, traffic burst, database chậm và analytics gửi lại | Đạt yêu cầu trong các kịch bản thử, dùng số liệu bảo vệ thiết kế, nêu giới hạn và chi phí tương đối |

Mỗi lab có phần cơ bản được hướng dẫn và phần thử thách. Các tình huống nâng cao như cache stampede, circuit breaker hoặc failover có bầu leader đầy đủ được bổ sung sau khi phiên bản cơ bản ổn định.

Trước lab 6 có bài đọc ngắn về API tạo/đọc link, ánh xạ mã ngắn sang URL, ràng buộc duy nhất và xử lý va chạm mã. Lab tổng hợp tái sử dụng engine và các khối đã có.

### Các nhóm nội dung bắt buộc trong phạm vi toàn nền tảng

| Nhánh | Nội dung tiếp theo |
| --- | --- |
| Dữ liệu | Access pattern, SQL/NoSQL, index, transaction/isolation, sharding, hot key, di chuyển dữ liệu |
| Độ tin cậy | Timeout, retry budget, backoff/jitter, circuit breaker, rate limiting, backpressure, SLO, observability |
| Hệ thống phân tán | Network partition, CAP trong đúng bối cảnh, consistency model, failover, multi-region, outbox/saga |
| Case study | Chat, news feed, đặt vé, notification, upload/video processing |
| AI Systems | Inference serving, batching, streaming, RAG, cập nhật index, quyền truy cập dữ liệu, evaluation, latency–cost–quality |

Các nhóm trên được phân bổ vào bản đồ giáo trình ngay từ đầu. Thứ tự xuất bản được điều chỉnh theo kiến thức tiên quyết và kết quả thử nghiệm; các mảng đã nằm trong phạm vi không bị loại chỉ vì ít người nhấp xem. Từng level chỉ được công bố hoàn chỉnh khi đáp ứng tiêu chí bao phủ ở phần 8.

## 4. Ví dụ đặc tả một bài: “Thêm cache giúp gì?”

**Bối cảnh:** dịch vụ đọc thông tin sản phẩm. API còn dư công suất nhưng database quá tải.

**Giả định minh họa:** 1.000 yêu cầu đọc/giây; mỗi cache miss tạo đúng một lần đọc database; database xử lý tối đa 300 lượt đọc/giây trong mô hình; chưa có retry hoặc truy vấn nền.

1. Chạy baseline không có cache. Người học quan sát hàng đợi database tăng.
2. Yêu cầu dự đoán tác động của việc thêm API server rồi kiểm tra dự đoán.
3. Bật cache và xem luồng hit/miss. Nếu giả sử hit rate đạt 80%, tải đọc database là `1.000 × (1 − 0,8) = 200 lượt/giây` theo các giả định trên. Đây là bài toán dự đoán; hit rate trong lần mô phỏng thực tế được tính từ workload, TTL và dung lượng.
4. So sánh baseline và phương án có cache với cùng workload và seed. Quan sát latency, tỷ lệ thành công và DB load.
5. Thêm thao tác cập nhật sản phẩm. Người học kiểm tra khi nào khách vẫn đọc dữ liệu cũ.
6. Thử thách mới yêu cầu giữ độ trễ và tỷ lệ thành công trong ngưỡng, đồng thời đáp ứng yêu cầu độ mới với ngân sách giả lập.
7. Kết bài bằng giải thích: vì sao TTL dài có thể giảm DB load nhưng không phù hợp với một số loại dữ liệu?

Ngưỡng vượt bài được xác lập sau khi kiểm chứng mô hình và phải có ít nhất hai phương án khả thi với đánh đổi khác nhau. Không gán một kết quả p95 chỉ từ công thức giảm tải database.

## 5. Phạm vi tính năng và cách đánh giá

### Bắt buộc cho nền tảng học theo level

- Khu vực riêng cho L0–L5, mục tiêu đầu vào/đầu ra và bài tổng hợp tương ứng.
- Bản đồ kiến thức, tìm kiếm theo khái niệm, prerequisite và bộ lọc chủ đề/level.
- Phân biệt học liệu dự kiến, học liệu đã duyệt và học liệu đã phát hành.
- Bản theo dõi độ bao phủ liên kết mỗi năng lực với bài học, tương tác, bài đánh giá và reviewer.
- Tiến độ học tách khỏi kết quả đánh giá năng lực; gợi ý ôn lại và học bù.
- Lối Bắt đầu từ số 0, tiêu đề phổ thông, từ điển tại chỗ, bài bổ trợ toán/code và lớp kỹ thuật mở dần.

### Phạm vi đợt thử nghiệm tương tác đầu tiên

- Sáu lab, giải thích tiếng Việt, thuật ngữ và sơ đồ tương tác.
- Kiến trúc mẫu; hành động có giới hạn như thêm server, bật cache, đổi đường đọc. Canvas kéo thả tự do để giai đoạn sau.
- Chạy, dừng, từng bước, reset; so sánh cấu hình A/B; gây lỗi được định nghĩa theo từng bài.
- Bộ chỉ số, timeline và phản hồi gắn với sự kiện thực tế của mô phỏng.
- Lưu tiến độ và phương án trên thiết bị; xuất/nhập bản lưu có kiểm tra định dạng.
- Câu hỏi dự đoán, thử thách và gợi ý theo mức.
- Hỗ trợ bàn phím, điện thoại và giảm chuyển động.

### Tính năng nâng cấp theo đợt

Tài khoản, đồng bộ nhiều thiết bị, chia sẻ bài làm bằng URL, editor tự do, cộng tác nhiều người, CMS, AI tutor và chế độ luyện phỏng vấn. Chọn thứ tự dựa trên phản hồi beta.

### Đánh giá bài làm

Chấm theo yêu cầu được công bố và kết quả chạy, không yêu cầu khớp một sơ đồ duy nhất.

- Tính đúng đắn là điều kiện bắt buộc: ví dụ cùng job gửi lại không được tạo thêm tác dụng phụ trong kịch bản yêu cầu idempotency.
- Kiểm tra mục tiêu latency, throughput, tỷ lệ thành công, độ mới và ngân sách theo từng bài.
- Có kịch bản bình thường, burst và lỗi liên quan đến kiến thức vừa học.
- Hiển thị lý do chưa đạt và bằng chứng: hàng đợi ở đâu, request nào timeout, bản ghi nào cũ.
- Phần giải thích đánh đổi dùng rubric và ví dụ để tự đánh giá trong MVP; không tuyên bố máy đã chấm chính xác câu trả lời mở.

AI tutor về sau có thể đọc nội dung đã duyệt và snapshot bài làm để đặt câu hỏi, gợi ý và phản biện. Kết quả kiểm tra kỹ thuật vẫn do engine và quy tắc xác định. Cần bộ câu hỏi đánh giá tutor trước khi đưa vào dùng; API key được giữ phía server nếu tích hợp dịch vụ AI.

## 6. Kiến trúc kỹ thuật đề xuất

```text
Nội dung Markdown + cấu hình lesson có phiên bản
                         ↓
             Giao diện học: React + TypeScript
                ↙                  ↘
       Bộ điều khiển lab         Tiến độ / bản lưu
                ↓                 Trình duyệt
       Simulation engine TypeScript
       thời gian logic + event queue + seed
                ↓
        Sự kiện + chỉ số + kết quả kiểm tra
                ↓
        Sơ đồ / timeline / biểu đồ / phản hồi
```

**Triển khai bản đầu:** website tĩnh phục vụ qua CDN. Simulation chạy ở trình duyệt; học liệu được quản lý cùng mã nguồn. Bản beta có thể được triển khai trên Sites khi bước xây dựng được yêu cầu. Nhu cầu mô phỏng hàng nghìn request không đồng nghĩa phải gửi hàng nghìn request thật tới backend.

**Sơ đồ:** bắt đầu bằng SVG với vị trí node cố định và thành phần tái sử dụng. Khi cần chọn, di chuyển và nối node, cân nhắc React Flow; thư viện có hỗ trợ bàn phím và screen reader nhưng trải nghiệm hoàn chỉnh vẫn cần kiểm tra riêng. [Tài liệu React Flow](https://reactflow.dev/learn/advanced-use/accessibility)

**Engine:** TypeScript thuần, tách khỏi React. Dùng thời gian logic và seed để replay được kết quả. Bản nhỏ có thể chạy trực tiếp; tách sang Web Worker khi đo thấy xử lý ảnh hưởng giao diện. Web Worker cho phép chạy tác vụ trên luồng riêng. [MDN Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

**Lưu dữ liệu:** tiến độ nhỏ dùng storage trình duyệt; bản chạy và dữ liệu có cấu trúc lớn hơn dùng IndexedDB. Có export/import vì dữ liệu trên một thiết bị không phải đồng bộ hoặc bản sao lưu lâu dài. [MDN IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

**Backend về sau:** bổ sung khi cần đồng bộ người học, chia sẻ có quyền truy cập hoặc AI tutor. Tách các dữ liệu learner, progress, attempt và scenario snapshot; không lưu mọi event mô phỏng lên server nếu chưa có nhu cầu.

**Stack và app:** chọn baseline TypeScript + React + Vite trong pnpm workspace; schema, learning core và engine độc lập UI. Học liệu biên dịch thành blocks từ Markdown/JSON. Web/PWA được kiểm chứng trước, sau đó thử Capacitor với bundle cục bộ; app có gate riêng về storage, lifecycle, offline, deep link và store release. API Node/Fastify + PostgreSQL chỉ thêm khi cần. Chi tiết và phương án thay thế được lưu trong [ADR](docs/decisions/0001-web-first-mobile-ready.md).

### Hợp đồng nội dung

Mỗi lesson gồm: `id`, `version`, `prerequisites`, `objectives`, `story`, `explanation`, `scenario`, `controls`, `initialState`, `metricDefinitions`, `predictionQuestion`, `challenge`, `successRules`, `feedback`, `sources`, `modelAssumptions`.

Bổ sung cấu trúc giáo trình: `levelId`, `moduleId`, `topicIds`, `competencyIds`, `trackIds`, `depth`, `requiredIn`, `publicationStatus`, `reviewedAt`, `sourceVersion`. Lưu graph tiên quyết theo năng lực để một bài có thể phục vụ nhiều lộ trình mà không sao chép nội dung.

Bổ sung hợp đồng dễ hiểu: `learnerTitle`, `plainSummary`, `explanationLayers`, `termsIntroduced`, `analogyMapping`, `analogyLimits`, `mathPrimerIds`, `codePrimerIds`, `commonMisconceptions`, `depthObjectives`, `comprehensionReview`. Lưu kết quả đánh giá theo độ sâu: hiểu trực giác, hiểu cơ chế, áp dụng và triển khai.

Tách bốn thực thể: cấu trúc giáo trình, nội dung bài học, hoạt động thực hành và bằng chứng đánh giá. Tiến độ không chỉ là cờ `completed`; cần phân biệt đã xem, đã thử, đạt trong bài mới và cần ôn lại. CI kiểm tra ID, liên kết, prerequisite có chu trình và mục tiêu chưa có bài/đánh giá. Tìm kiếm được tạo từ catalog nội dung; không đòi hỏi backend tìm kiếm riêng từ đầu.

Mỗi attempt lưu: phiên bản lesson/engine, cấu hình, seed, câu trả lời dự đoán, kết quả kiểm tra, số liệu tóm tắt và phần tự giải thích. Nhờ đó có thể chạy lại và biết kết quả thuộc mô hình nào.

Mỗi bài mới cần có mục tiêu học, diễn biến mẫu, giới hạn mô hình, câu hỏi dễ hiểu, kịch bản kiểm thử và một người review kỹ thuật trước khi phát hành.

## 7. Độ đúng của mô phỏng và kiểm chứng

Mô phỏng dùng để học quan hệ nguyên nhân–kết quả trong các giả định được công khai. Các con số không được giới thiệu như benchmark của Redis, PostgreSQL hoặc một nhà cung cấp cloud.

- Tách lượng yêu cầu người dùng gửi vào, các lần retry và số yêu cầu thành công. Không tăng điểm bằng cách tạo nhiều retry hoặc bỏ qua request thất bại.
- Latency được tính từ timestamp trong engine. p95 phải ghi rõ tập mẫu, số mẫu, khoảng đo, số timeout và request chưa kết thúc; luôn xem cùng tỷ lệ thành công.
- Các kịch bản vượt bài có thời gian khởi động, cửa sổ đo và quy tắc kết thúc rõ ràng. Dùng cùng workload để so sánh A/B và thêm workload mới để kiểm tra khả năng áp dụng.
- Chi phí hiển thị bằng điểm tài nguyên giả lập với bảng quy đổi trong bài. Chỉ thêm tiền cloud khi có dữ liệu giá, ngày cập nhật và giả định sử dụng cụ thể.
- Animation chỉ thể hiện một phần request đại diện. Tăng tốc hoặc giảm chuyển động không làm thay đổi kết quả engine.
- Giới hạn kích thước kịch bản và số sự kiện; báo rõ khi vượt giới hạn thay vì âm thầm bỏ bớt xử lý.

Các kiểm thử quan trọng gồm replay xác định; kết quả Play/Step giống nhau; request không tự biến mất hoặc nhân đôi; TTL và replication lag đúng; queue còn tăng khi tốc độ vào vượt công suất xử lý lâu dài; mất ACK không gây tác dụng phụ trùng khi cơ chế idempotency đang được mô hình hóa bật đúng.

Nội dung phải thể hiện retry có thể làm trầm trọng tình trạng quá tải; có tình huống giới hạn retry và backoff để quan sát. Đây cũng là một bài học vận hành được trình bày trong [Google SRE: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/).

Không dạy replication như backup; không dạy CAP là lựa chọn hai thuộc tính tùy ý ở mọi thời điểm. Các bảo đảm như read-after-write hoặc idempotency phải nêu rõ phạm vi và giả định.

## 8. Lộ trình triển khai và tiêu chí hoàn thành

Kế hoạch hiện hành nằm trong [ROADMAP.md](docs/delivery/ROADMAP.md): M0 đặc tả → M1 bootstrap → M2 một bài mobile hoàn chỉnh → M3 sáu lab và nền tảng biên soạn → M4 web beta/PWA. M5 là luồng hoàn thiện các level và chuyên sâu; M6 thêm sync khi cần; M7–M8 là app beta và phát hành.

Ước lượng web beta mobile-first/PWA: **10–15 tuần**, giả định hai kỹ sư và một người phụ trách học liệu toàn thời gian, cùng designer/QA/reviewer bán thời gian. Cập nhật sau M2. Đây không phải lịch hoàn thành toàn bộ 36 module và 7 nhánh. Mốc 6–8 tuần cũ chỉ dành cho bộ lab hẹp hơn.

Các level L0–L2, rồi L3–L5 và từng chuyên sâu được hoàn thiện theo coverage registry. Chương trình kéo dài nhiều tháng; dùng effort thực tế của biên soạn, activity, review và pilot để lập lịch tiếp theo. Từng level chỉ công bố hoàn chỉnh khi đạt tiêu chí dưới đây.

Beta nhập môn có khoảng 5–8 học sinh cấp 3 mỗi vòng nhỏ, gồm người chưa biết code. Thử riêng lớp sâu với người có nền tương ứng. Kết quả giúp tìm vấn đề và cải tiến; chưa đủ chứng minh hiệu quả học trên diện rộng.

### Tiêu chí nghiệm thu đợt thử nghiệm sáu lab

1. Tất cả sáu lab có vòng học hoàn chỉnh và ít nhất một thử thách chuyển giao.
2. Mỗi lab có phương án đạt và phương án sai đã kiểm chứng; lỗi không bị che bởi điểm hiệu năng.
3. Cùng cấu hình, phiên bản và seed cho cùng kết quả; thay tốc độ phát không đổi đáp án.
4. Có thể hoàn thành các hành động chính bằng bàn phím và trên màn hình điện thoại; trạng thái không phụ thuộc riêng vào màu hoặc animation.
5. Tải lại trang khôi phục tiến độ; export/import khôi phục được bản lưu hợp lệ; có xử lý dữ liệu cũ hoặc sai định dạng.
6. Tất cả chỉ số có định nghĩa và giới hạn mô hình; không có con số “hiệu năng thực tế” không được đo.
7. Bài mẫu được điều chỉnh từ ít nhất một vòng quan sát người học thật.
8. Bài nhập môn không cần code hoặc công cụ cài thêm; mọi từ và ký hiệu bắt buộc đã được giải thích. Có bản chữ tương đương và thao tác từng bước.

### Tiêu chí nghiệm thu một level và toàn bộ phần cốt lõi

1. Mọi năng lực bắt buộc của level có bài giải thích đã review, hoạt động áp dụng thích hợp và đánh giá đúng độ sâu; không tính mục lục hoặc liên kết đọc thêm là đã dạy xong.
2. Mỗi module có ít nhất một hoạt động tương tác có ý nghĩa. Bài thiên về quyết định kiến trúc dùng bài tập chọn phương án, incident replay hoặc design review thay cho ép mọi nội dung vào mô phỏng traffic.
3. Prerequisite truy cập được, không có phụ thuộc vòng hoặc bài bắt buộc bị thiếu.
4. Có capstone kiểm tra kiến thức tích hợp; phần trả lời mở có rubric rõ ràng và nêu cách đánh giá.
5. Cả nội dung, mô phỏng và đáp án đã qua review; nguồn, ngày review và phiên bản được lưu.
6. Người học đúng level có thể sử dụng bài qua ít nhất một vòng thử nghiệm; lớp phổ thông có học sinh cấp 3 đã học phần nền tương ứng tham gia. Các level cao kiểm tra lập luận về giới hạn và tình huống lỗi. Bài gây hiểu sai lặp lại phải được sửa và thử lại.
7. Chỉ gọi phần cốt lõi hoàn chỉnh khi toàn bộ L0–L5 đạt các điều kiện trên. Theo dõi các chuyên sâu độc lập và tiếp tục cập nhật giáo trình theo phiên bản.

Chỉ số theo dõi sau beta: tỷ lệ bắt đầu/hoàn thành lab, bước thường bỏ dở, số lần cần gợi ý, khả năng giải câu hỏi mới và mức giữ kiến thức sau một tuần nếu có thể theo dõi. Tỷ lệ hoàn thành không thay thế đo khả năng hiểu và áp dụng.

## 9. Ưu tiên triển khai đầu tiên

Bắt đầu bằng bản đồ L0–L5 và registry năng lực, bootstrap workspace theo [SETUP.md](docs/engineering/SETUP.md), rồi hoàn thiện bài cache nhập môn từ mở bài đến đánh giá và resume trên điện thoại. Tiếp theo phát triển bài **“Vì sao thêm server mà hệ thống vẫn chậm?”**. Song song prototype transaction và design review để kiểm tra khung phục vụ nhiều độ sâu. Mọi đợt đối chiếu độ bao phủ, ưu tiên lấp khoảng trống cốt lõi.

Bài **“Vì sao website vẫn hiện phòng học cũ?”** trong [TEACHING_GUIDE.md](TEACHING_GUIDE.md) là mẫu giọng văn cần thử với học sinh trước khi nhân rộng. Tính công sức viết bổ trợ và thử nghiệm vào ước lượng nội dung sau bài mẫu.

Rủi ro lớn nhất là mô phỏng dạy sai trực giác hoặc người học chỉ thử tham số ngẫu nhiên để vượt bài. Giảm rủi ro bằng giả định rõ ràng, review chuyên môn, bước dự đoán trước khi chạy và bài áp dụng sang tình huống mới. Chi phí và công sức lớn nhất ở MVP dự kiến nằm ở thiết kế học liệu, engine và kiểm chứng; hosting là một hạng mục riêng, chỉ ước tính khi biết lưu lượng và cách triển khai.

## Chuẩn giải thích thuật ngữ tại chỗ

Thuật ngữ trong phần văn xuôi của bài có gạch chân chấm và nút mang tên rõ. Desktop dùng hover hoặc focus để mở ghi chú; click có thể ghim và click lại để đóng. Mobile dùng chạm để mở/đóng popup tại chỗ. Không đổi trang hoặc ghi lại tiến độ chỉ vì tra nghĩa.

Popup có tên tiếng Việt, tên tiếng Anh và định nghĩa từ cùng registry của bài; không sao chép định nghĩa riêng trong UI. Đóng bằng nút có tên, Escape, chạm ngoài hoặc khi từ ra khỏi vùng nhìn/đổi chặng. Có thể di chuyển chuột từ từ sang popup để đọc; không đóng ngay khi rời chữ. Đóng bằng nút trả focus về thuật ngữ và không tự mở lại.

Vị trí popup nằm trong viewport, không làm cả trang cuộn ngang ở 320 px; dùng top layer và không che vĩnh viễn thao tác học. Không dùng thuộc tính title làm cách giải thích duy nhất. Mục “Giải thích từ mới” cuối bài giữ toàn bộ định nghĩa và làm phương án tra cứu bổ sung.

Renderer chỉ annotate văn xuôi bằng các term.name/term.english có trong schema, khớp nguyên thuật ngữ không phân biệt hoa/thường; giữ từ dài hơn ưu tiên và không khớp bên trong từ khác. Không nhúng HTML/script vào JSON và không đặt nút thuật ngữ bên trong nút đáp án. Các bài sau phải dùng cùng component và chuẩn tương tác. Annotation tường minh theo content blocks/ID sẽ thuộc contract học liệu nâng cấp sau này.

Acceptance: hover/focus desktop, tap mobile, Escape/đóng ngoài/đóng nút, popup không tràn ở 320 px, định nghĩa từ registry, focus được giữ và luồng học/lưu tiến độ không đổi. Kiểm chứng đa browser và thiết bị thật theo ma trận hiện hành; không suy ra đã hỗ trợ mọi browser cũ từ một lần chạy emulation.

Danh sách từ mới chỉ hiển thị tên Việt/Anh khi popup được hỗ trợ; mở nghĩa bằng hover/focus hoặc chạm, không in thêm cùng định nghĩa ngay dưới mục. Browser thiếu Popover API hiển thị định nghĩa dạng chữ như fallback. Cùng một nguồn registry được dùng cho cả hai cách hiển thị.

## Kiểm định học liệu — EDU-03

Kết quả [kiểm định ngày 12/10/2026](docs/delivery/CONTENT_AUDIT_2026-10-12.md): sáu bài beta mới giới thiệu một phần kiến thức; chưa có module nào đủ bằng chứng nghiệm thu toàn bộ. Giữ 6 level/36 module/7 nhánh và không tính phần trăm hoàn thành bằng số tiêu đề. Dùng System Design Primer để đối chiếu nhóm chủ đề, nguồn chính thức/paper để kiểm tra bảo đảm kỹ thuật. Phân bổ chi tiết ở CURRICULUM_MAP §9, ưu tiên thực hiện và acceptance ở ROADMAP §8, quy tắc kiểm định ở TEACHING_GUIDE.

## Tích hợp System Design Primer vào kế hoạch học liệu

Phạm vi biên soạn chi tiết nằm tại [CURRICULUM_MAP mục 9](CURRICULUM_MAP.md#9-kế-hoạch-tích-hợp-kiến-thức-từ-system-design-primer): 23 nhóm kiến thức PRIMER-K01–K23, tám bài thiết kế PRIMER-C01–C08, flashcards, lộ trình ôn và bài OOD bổ trợ. Nguồn được khóa revision và ghi attribution tại đó. Đây là mở rộng đặc tả bên trong 6 level/36 module/7 nhánh, chưa phải nội dung đã học được trên web.

Đưa quy trình thiết kế của Primer thành một luồng học bốn bước, diễn giải cho học sinh:

1. **Cần giúp ai, làm việc gì?** Chọn phạm vi và điều kiện, viết yêu cầu đo được, ước lượng bằng số nhỏ trước.
2. **Thông tin đi qua đâu?** Vẽ các thành phần và đường đọc/ghi; giải thích trách nhiệm từng phần.
3. **Một việc được làm đúng thế nào?** Làm rõ API, dữ liệu, invariant, thứ tự thao tác và kết quả khi gửi lại hoặc lỗi.
4. **Khi đông hơn hoặc có sự cố thì sao?** Đổi workload, đo nút thắt, so sánh phương án với yêu cầu độ mới, bảo mật, chi phí và vận hành.

Mỗi bước có ví dụ giải sẵn → lựa chọn có phản hồi → bài đổi ràng buộc. Mobile hiển thị một quyết định hoặc một bước trace tại một thời điểm, có bản chữ và nút tiến/lùi; không dồn toàn bộ sơ đồ vào một canvas phải zoom. Tiếp tục dùng chuẩn giải thích thuật ngữ tại chỗ. Các mô hình bổ sung chỉ được xây khi batch nội dung tương ứng sẵn sàng; engine độc lập UI và vẫn ưu tiên web trước app.

Các case được chuyển thể thành chia sẻ ghi chú, bảng tin câu lạc bộ, crawler thư viện, quỹ câu lạc bộ, mạng quen biết, cache tra cứu, xếp hạng sách và cổng trường tăng tải. Các chủ đề ngoài độ sâu của Primer (consensus/transaction/SRE/security/AI...) vẫn theo chương trình hiện hữu và tài liệu chuyên môn riêng. Backlog và thứ tự phụ thuộc nằm tại ROADMAP mục 9.
