# EDU-09 — Kế hoạch ví dụ thực tế cho toàn bộ giáo trình

Ngày: 14/10/2026. Trạng thái: **đặc tả triển khai**, chưa bổ sung case vào ứng dụng. Phạm vi: 36/36 module cốt lõi, sáu bài tổng hợp level và định hướng cho bảy nhánh chuyên sâu. Baseline: 12 bài beta tại commit `b082d69`; chưa có pilot học sinh thật.

Nguồn chính: [phạm vi giáo trình](../../CURRICULUM_MAP.md), [chuẩn giảng dạy](../../TEACHING_GUIDE.md), [kiến trúc](../engineering/ARCHITECTURE.md), [workflow](WORKFLOW.md). Tài liệu này sở hữu danh mục case, phân rã công việc và nghiệm thu; không thay danh sách module, không nhân đôi registry học liệu. Đợt CASE-00 chỉ lập kế hoạch. Tiến độ hiện thực sau đó được quản lý tại [báo cáo CASE-01–03](EDU_09_CASE_STUDY_IMPLEMENTATION.md); danh mục dưới đây tiếp tục là đặc tả cho phần chưa xây.

## 1. Kết quả cần đạt và cách chia phạm vi

Mỗi bài có **một tình huống áp dụng ngắn** ngay trong chặng “Áp dụng”. Mỗi module có **một họ tình huống xuyên suốt**, chia thành nhiều bài theo năng lực, rồi một bài tổng hợp module. Mỗi level có **một capstone** liên kết các module. Một ví dụ duy nhất không đủ thay toàn bộ module.

| Đơn vị | Vai trò | Quy mô đề xuất để pilot | Bằng chứng |
| --- | --- | --- | --- |
| Mini-case trong bài | Đổi ít nhất một ràng buộc hoặc ngữ cảnh để kiểm tra vận dụng | 3–5 phút trong nhịp bài; một quyết định chính | Lựa chọn, quan sát và lý do |
| Case cuối module | Kết hợp các năng lực đã học trong module | 15–25 phút, chia chặng và tiếp tục được | Trace/kết quả, phương án, giới hạn |
| Capstone cuối level | Kết hợp nhiều module, tăng tính độc lập | Mỗi phiên 30–45 phút; case sâu cần nhiều phiên | Hồ sơ thiết kế và rubric theo level |

Thời lượng là giả định để kiểm chứng, không cộng thêm mặc định vào mọi bài đang có. Giữ bốn chặng của player; mở rộng “Áp dụng”, không thêm một chặng bắt buộc thứ năm. Các bài L3–L5 vẫn cần prerequisite; “dễ hiểu” là có bước đệm, không bỏ cơ chế hoặc bảo đảm.

Toàn bộ tình huống và số liệu bên dưới là **do tác giả giả định cho việc học**, chưa phải số đo hay kiến trúc thực tế của một trường/doanh nghiệp. Không dùng logo/tên hãng để tạo cảm giác đã được xác nhận. Nếu sau này thêm case doanh nghiệp, cần tài liệu gốc, thời điểm, phạm vi và ghi rõ phần giản lược. Quy tắc nguồn và trình bày nằm trong TEACHING_GUIDE, mục “Chuẩn tình huống áp dụng”.

**Điều kiện hoàn tất kế hoạch:** đủ đúng 36 ID module; mỗi mục có bài nhỏ, yêu cầu, thao tác, lỗi/biến thể và bằng chứng; có ánh xạ 12 bài hiện hữu, bảy nhánh, contract dự kiến, phụ thuộc, QA và gate phát hành. Điều kiện hoàn tất sản phẩm được quản lý riêng ở mục 10.

## 2. Cách đọc danh mục

`CASE-Lx-0y` là ID kế hoạch của họ case thuộc module `Lx.y`; chưa phải ID bài trong catalog. Khi biên soạn, lập bảng năng lực → lesson ID → mini-case ID → activity/fixture → assessment → review. Bài nhỏ dưới đây là các lát nội dung dự kiến, không ấn định số bài cuối cùng; module rộng được tách thêm để mỗi bài chỉ có một quyết định chính.

Mỗi case dùng: ví dụ có hướng dẫn → người học đổi một yếu tố → biến thể mới ít gợi ý hơn. Baseline và biến thể phải có cùng cách đo khi so sánh. Có trace thường và trace lỗi/phản chứng; không lấy số click làm bằng chứng hiểu. “Thử” là hoạt động dự kiến, chỉ ghi đã có engine khi đối chiếu mục 6.

## 3. Danh mục 36 module

### L0 — Nhìn được một hệ thống hoạt động ra sao

Prerequisite: dùng trình duyệt, cộng/trừ; bổ trợ đơn vị và biểu đồ ngay tại chỗ. Chưa yêu cầu code.

#### CASE-L0-01 · L0.1 — Mở lịch học của lớp

- **Bài nhỏ:** client/server và luồng yêu cầu; trạng thái/nguồn chính/bản sao; ranh giới/phụ thuộc; chức năng và yêu cầu chất lượng.
- **Đề:** học sinh cần xem phòng hiện tại; mô hình ba chặng tuần tự mất 20 + 80 + 20 ms. Chỉ rõ máy nào lưu lịch, máy nào hiển thị.
- **Thử:** bấm gửi, theo dấu từng chặng; đổi phòng tại nguồn; ngắt một phụ thuộc. Gắn mỗi hành động với một trạng thái trước/sau.
- **Biến thể:** thư viện trả kết quả cũ dù máy chủ vẫn trả lời; yêu cầu chuyển từ “xem được” sang “xem đúng phiên bản”. Không đồng nhất bản sao với nguồn chính.
- **Bằng chứng:** ghép đúng đường đi, tính 120 ms trong mô hình tuần tự và chỉ ra nơi cần kiểm tra độ mới. Nối bài `request`, `cache`; cache chuyên sâu ở L2.2.

#### CASE-L0-02 · L0.2 — Máy tạo thẻ tham dự ngày hội

- **Bài nhỏ:** CPU/RAM/disk; process/thread và giới hạn bộ nhớ; concurrency/parallelism; I/O blocking/non-blocking và event loop.
- **Đề:** tám công việc, mỗi việc 100 ms tính + 400 ms chờ đọc, một CPU; mọi con số là mô hình. Hai việc có thể chồng thời gian chờ nhưng không tự nhân đôi năng lực CPU.
- **Thử:** timeline từng bước; thay số worker và cách chờ I/O; sau đó đặt giới hạn RAM, xem điều gì không thể tiếp tục.
- **Biến thể:** đổi sang việc chủ yếu dùng CPU; đặt một việc tính dài lên event loop. Không dạy “async luôn nhanh” hoặc “nhiều thread là nhiều CPU”.
- **Bằng chứng:** phân biệt đang chạy/đang chờ, tìm tài nguyên nghẽn và giải thích vì sao cùng số worker cho kết quả khác. Cần engine timeline mới.

#### CASE-L0-03 · L0.3 — Tìm và xếp hàng sách trong thư viện

- **Bài nhỏ:** list/array và tra cứu; hash table/collision; cây cho phạm vi; queue/heap; tăng trưởng chi phí và locality; serialization/compression.
- **Đề:** tra mã trong 16 rồi 128 sách, tìm khoảng mã và chọn lượt mượn ưu tiên. Đếm phép so sánh/thao tác; không gán số ms thực cho cấu trúc dữ liệu.
- **Thử:** đổi cách tổ chức cùng bộ dữ liệu; thêm/xóa mục; so sánh kích thước bản tin trước/sau mã hóa và nén với chi phí xử lý giả định.
- **Biến thể:** nhiều mã va chạm, nhiều lượt ghi, hoặc dữ liệu ít nén được. Hash không phải lúc nào cũng một bước; heap không phải toàn bộ danh sách đã sắp thứ tự.
- **Bằng chứng:** chọn cấu trúc theo truy vấn, nêu chi phí đọc/ghi và kiểm tra dữ liệu giải mã giữ nguyên ý nghĩa. Các mô hình được tách theo bài, không dựng một lab chứa mọi cấu trúc.

#### CASE-L0-04 · L0.4 — Gửi ảnh câu lạc bộ qua mạng

- **Bài nhỏ:** IP/port/routing; DNS/TTL; connection và TCP/UDP; mất gói; RTT/bandwidth.
- **Đề:** tên miền đổi địa chỉ khi bản DNS còn hạn; một mảnh dữ liệu bị mất; ảnh 1.000 kB đi qua đường 8 Mbps, RTT 100 ms và xử lý 50 ms theo mô hình giản lược.
- **Thử:** tra tên trước/sau hết hạn, theo gói qua tuyến, chọn cách xử lý mất mảnh; tăng riêng tốc độ đường truyền hoặc giảm riêng RTT.
- **Biến thể:** chuyển từ ảnh cần đủ dữ liệu sang vị trí con trỏ cập nhật liên tục. Không hứa UDP nhanh hơn trong mọi trường hợp hoặc TCP bảo đảm hạn chót.
- **Bằng chứng:** tách tìm địa chỉ, tìm dịch vụ và chuyển dữ liệu; giải thích vì sao nhân đôi Mbps không chia đôi mọi thành phần chờ. Tái dùng `dns`, `transport`, `network`, bổ sung IP/port/routing.

#### CASE-L0-05 · L0.5 — Đăng nhập rồi xem lịch riêng

- **Bài nhỏ:** HTTP request/response; HTTPS/TLS và trust; cookie/session; proxy; tổng quan HTTP/2, HTTP/3/QUIC; streaming.
- **Đề:** lịch tồn tại hoặc không tồn tại, máy chủ bảo trì; chỉ tài khoản có quyền xem lịch riêng. Mô hình luồng từng chặng, không gửi thông tin đăng nhập thật.
- **Thử:** xem method/path/status/body; đọc trace TLS; hết hạn phiên, đổi quyền; so sánh nhận toàn bộ nội dung với từng phần trong trace đã định nghĩa.
- **Biến thể:** phản hồi 200 nhưng dữ liệu cũ; đăng nhập thành công nhưng không có quyền xem lớp khác. HTTPS không tự cấp quyền và status không chứng minh nội dung mới.
- **Bằng chứng:** phân biệt giao vận, phản hồi HTTP và kết quả nghiệp vụ; chỉ điểm kiểm tra session/quyền. Tái dùng `http`; TLS/session/protocol trace là việc mới.

#### CASE-L0-06 · L0.6 — Ước lượng trang ảnh ngày hội

- **Bài nhỏ:** latency/throughput/concurrency; median/p95 và cửa sổ đo; byte/thời gian; availability/durability; storage/traffic và workload.
- **Đề:** 2.000 học sinh, mỗi người một ảnh 100 kB, mỗi ảnh được xem năm lượt/ngày; dùng đơn vị thập phân, bỏ metadata/replica trong phép tính cơ sở.
- **Thử:** tách 200 MB dữ liệu gốc và 1.000 MB payload tải/ngày; cho hai yêu cầu cuối chậm để đối chiếu median/p95. Đổi lượt xem mà giữ số ảnh.
- **Biến thể:** xóa nhầm ảnh trong lúc dịch vụ vẫn trả lời; tăng tải giờ cao điểm nhưng giữ tổng ngày. Không đồng nhất khả dụng, bền dữ liệu và tốc độ.
- **Bằng chứng:** ghi đơn vị/giả định, giải thích storage khác traffic và đọc được đuôi phân bố. Tái dùng `metrics`, `capacity`; chưa coi hai bài là đủ module.

### L1 — Thiết kế một dịch vụ đúng yêu cầu

Prerequisite: các phần liên quan của L0; dùng bảng/thẻ trước SQL và code.

#### CASE-L1-01 · L1.1 — Đăng ký câu lạc bộ có 30 chỗ

- **Bài nhỏ:** hỏi rõ yêu cầu/access pattern; scope; invariant; thành phần/interface và trách nhiệm; context/container.
- **Đề:** tối đa 30 đăng ký đã xác nhận, mỗi học sinh một đăng ký; danh sách chờ là yêu cầu tùy chọn cần làm rõ.
- **Thử:** chuyển lời kể thành tiêu chí kiểm tra; phân vai trình duyệt/API/nơi lưu; lập sơ đồ tối thiểu và xác định ai bảo vệ số chỗ.
- **Biến thể:** thêm hủy đăng ký và vai trò quản lý; bỏ tính năng chưa cần để giữ phạm vi. Không coi sơ đồ nhiều khối là thiết kế tốt hơn.
- **Bằng chứng:** bảng yêu cầu → API/dữ liệu → phép kiểm tra; phân biệt quy tắc luôn đúng với mục tiêu tốc độ. Nối L1.2 và L1.5, chưa giải concurrency ở đây.

#### CASE-L1-02 · L1.2 — Bấm đăng ký hai lần khi mạng chậm

- **Bài nhỏ:** REST/RPC/gRPC/GraphQL theo nhu cầu; validation/error contract; pagination/versioning; session/quyền; idempotency và timeout/cancellation.
- **Đề:** một yêu cầu đã ghi thành công nhưng phản hồi bị mất. Gửi lại cùng ý định không tạo hai đăng ký; người khác không được hủy hộ.
- **Thử:** gửi lại bằng cùng khóa, đổi payload của khóa cũ, tra cứu trạng thái; thêm bản ghi giữa hai trang; thử người dùng khác và client phiên bản cũ.
- **Biến thể:** người dùng hủy thao tác tại trình duyệt sau khi máy chủ đã commit. Không suy timeout/cancel là chưa làm gì.
- **Bằng chứng:** hợp đồng request/response, phạm vi/lifetime khóa và hành vi lỗi; lý do chọn API phù hợp. Không chấm theo “giao thức tốt nhất” chung chung.

#### CASE-L1-03 · L1.3 — Quản lý mượn sách và lịch sử

- **Bài nhỏ:** quan hệ/document/key-value/graph/wide-column; schema/constraint; chuẩn hóa/phi chuẩn hóa; nguồn gốc và dữ liệu suy ra; SQL nền.
- **Đề:** truy vấn sách đang mượn của học sinh, tồn kho theo đầu sách và quan hệ gợi ý; quy định nguồn nào quyết định trạng thái mượn.
- **Thử:** thao tác bảng nhỏ, đổi mô hình theo access pattern; cập nhật tên sách khi nó xuất hiện ở nhiều bản sao; tính số mục cần sửa.
- **Biến thể:** truy vấn mới cần đi nhiều quan hệ; dữ liệu suy ra chưa đồng bộ. Không gán một bảo đảm consistency cố định cho nhãn SQL/NoSQL.
- **Bằng chứng:** mô hình dữ liệu, constraint và đường truy vấn; nêu một truy vấn đắt và cách đối soát bản sao. Cần fixture dữ liệu chung để so sánh công bằng.

#### CASE-L1-04 · L1.4 — Tìm sách còn có thể mượn

- **Bài nhỏ:** B+ tree/hash index; LSM nguyên lý; buffer/cache; query plan/join; read/write amplification.
- **Đề:** danh mục 10.000 sách, truy vấn tác giả + còn sách và sắp theo ngày; sau đó tăng tỷ lệ cập nhật. Dùng số mục/page đọc thay benchmark giả.
- **Thử:** bật/tắt index, đổi thứ tự trường, xem các bước lọc/join; đếm thêm chi phí cập nhật và dung lượng index.
- **Biến thể:** điều kiện trả gần hết dữ liệu hoặc cache lạnh; engine storage khác có đường ghi khác. Không dạy thêm index luôn cải thiện toàn hệ thống.
- **Bằng chứng:** giải thích plan và cân đối đọc/ghi; phân biệt minh họa nguyên lý với query plan đo từ một DB/version cụ thể.

#### CASE-L1-05 · L1.5 — Hai bạn tranh chỗ cuối cùng

- **Bài nhỏ:** ACID; anomalies/isolation; lock/MVCC; optimistic/pessimistic; deadlock; WAL/recovery.
- **Đề:** còn một chỗ, hai transaction cùng muốn đăng ký; invariant tối đa một xác nhận mới. Chọn rõ engine/isolation cho mỗi trace.
- **Thử:** bấm xen kẽ đọc/ghi/commit; dùng cập nhật có điều kiện, constraint, lock hoặc retry phù hợp; gây deadlock rồi dừng/khôi phục sau ghi log.
- **Biến thể:** transaction thất bại cần chạy lại toàn bộ phần liên quan. Không coi MVCC tự loại mọi anomaly hoặc mọi DB có cùng semantics.
- **Bằng chứng:** trace trước/sau, invariant được giữ và cách retry; source theo phiên bản DB, review chuyên gia bắt buộc trước phát hành cơ chế.

#### CASE-L1-06 · L1.6 — Chia sẻ tài liệu bằng đường dẫn ngắn

- **Bài nhỏ:** file/block/object; upload/background job; identifier/uniqueness; config/secrets; logs/metrics; test/deploy/rollback một dịch vụ.
- **Đề:** tải tài liệu, tạo mã chia sẻ duy nhất, kiểm quyền và hạn dùng. Metadata chưa được báo hoàn tất khi file chưa sẵn sàng.
- **Thử:** upload lỗi, trùng mã, retry job; theo trạng thái và log có correlation; triển khai bản sửa rồi rollback tương thích.
- **Biến thể:** mã bị đoán hoặc file upload dở không được dọn. Mã khó đoán không thay kiểm quyền; object storage không tự xử lý giao dịch metadata.
- **Bằng chứng:** sơ đồ file/metadata, API và trace lỗi/cleanup; xác định secret không đi vào client/log. Case liên kết PRIMER-C01 theo bản đồ hiện hữu.

### L2 — Khi nhiều người cùng dùng

Prerequisite: API/data/index/transaction của L1; bài beta dẫn nhập hiện có chưa đủ đóng các module này.

#### CASE-L2-01 · L2.1 — Mở cổng đăng ký giờ ra chơi

- **Bài nhỏ:** scale dọc/ngang; stateless/stateful; L4/L7 balancing; health check/discovery; connection pool.
- **Đề:** ba máy API nhưng nơi lưu chỉ xử lý 60 thao tác/s theo workload định trước; cần giữ phiên và kiểm tra máy sẵn sàng.
- **Thử:** thêm/tắt API, đổi phân tải; tăng pool và quan sát hàng chờ downstream; tách chi phí đọc/ghi.
- **Biến thể:** một máy còn trả health check nhưng phụ thuộc chậm; phiên nằm cục bộ. Không suy tăng API hoặc connection sẽ tăng throughput vô hạn.
- **Bằng chứng:** chỉ được nút thắt chuyển chỗ, lựa chọn cách lưu trạng thái và giới hạn pool. Nối `balance`, cần thêm state/discovery/health trace.

#### CASE-L2-02 · L2.2 — Cả trường cùng xem lịch vừa đổi

- **Bài nhỏ:** các cache policy; TTL/eviction/invalidation; negative cache; hot key/stampede; CDN/edge và khóa cache theo quyền.
- **Đề:** lịch cần cập nhật trong một phút; 100 lượt đồng thời khi một bản ghi hết hạn. Nêu nguồn có truy cập được và quy tắc refresh.
- **Thử:** so cache-aside/write-through/write-back theo từng trace; TTL, làm mới và gom các lần tải cùng dữ liệu; xem tải nguồn và số đọc cũ.
- **Biến thể:** sự kiện invalidation mất, nguồn lỗi, thông tin riêng bị cache chung. TTL không phải bảo đảm tuyệt đối về độ mới trong mọi failure model.
- **Bằng chứng:** timeline độ mới/tải nguồn và chi phí; phân biệt policy ghi bền với cache. `cache` là bài nền ở L0.1, không đổi ID/module để giả hoàn thiện L2.2.

#### CASE-L2-03 · L2.3 — Vừa đổi hồ sơ nhưng vẫn thấy tên cũ

- **Bài nhỏ:** primary/replica; sync/async; lag; read routing; failover nền.
- **Đề:** chủ hồ sơ cần thấy lần sửa đã xác nhận; người xem bảng tin có thể chấp nhận trễ hai giây theo yêu cầu giả định.
- **Thử:** ghi rồi đọc từ từng nơi; tăng lag, chọn đường đọc; dừng primary và xem mốc dữ liệu thực có trên ứng viên thay thế.
- **Biến thể:** replica có thể thiếu ghi đã ACK trong cấu hình async. Không hứa mọi failover không mất dữ liệu hoặc đọc primary luôn thành công.
- **Bằng chứng:** lịch sử đọc/ghi, điểm xác nhận và trade-off latency/availability/freshness. Tái dùng `replica`; failover cần mô hình và review bổ sung.

#### CASE-L2-04 · L2.4 — Chia dữ liệu của nhiều trường

- **Bài nhỏ:** hash/range/consistent hashing; shard key; hot partition; reshard; index và query xuyên shard.
- **Đề:** mười trường, một trường tạo 60% lượt truy cập; so chia theo trường và theo người dùng dưới cùng trace.
- **Thử:** phân dữ liệu/tải, thêm shard, chuyển một phần dữ liệu và theo đường đọc khi di chuyển; chạy truy vấn toàn trường.
- **Biến thể:** số bản ghi cân bằng nhưng tải lệch; hotspot trên một key vẫn còn. Không coi consistent hashing tự khắc phục mọi hot key.
- **Bằng chứng:** phân bố dữ liệu và traffic riêng, số shard chạm mỗi query và quy trình kiểm tra di chuyển không thiếu/trùng kết quả.

#### CASE-L2-05 · L2.5 — Gửi giấy xác nhận tham dự

- **Bài nhỏ:** queue/pub-sub/log; partition/order; ACK/delivery; retry/dedup/idempotency; DLQ.
- **Đề:** tám job/s, mỗi worker xử lý hai job/s trong mô hình đều. Bốn worker cân tốc độ đến; chưa đủ rút backlog cũ khi tải giữ nguyên.
- **Thử:** mất ACK sau khi hiệu ứng đã ghi, giao lại job, thay consumer; một job độc hại đi DLQ; replay log có checkpoint.
- **Biến thể:** một học sinh nhận yêu cầu cấp giấy hai lần; thứ tự chỉ trong phạm vi partition đã định. Không đồng nhất nhận việc với xong việc hoặc dedup với exactly-once toàn hệ thống.
- **Bằng chứng:** số job chờ/hoàn tất và số hiệu ứng nghiệp vụ, trace retry/idempotency. Tái dùng `queue` cho tốc độ; ACK và hiệu ứng trùng là engine mới.

#### CASE-L2-06 · L2.6 — Giữ cổng ngày hội hoạt động lúc cao điểm

- **Bài nhỏ:** rate limit/admission/backpressure; batching; shedding; autoscaling delay; burst/tải dài và quota tenant.
- **Đề:** năng lực 100 yêu cầu/s, burst 200 yêu cầu/s trong 30 giây, máy bổ sung cần 20 giây khởi động; ưu tiên đăng ký hơn thống kê.
- **Thử:** chặn bớt, hoãn hoặc bỏ chức năng phụ; xem accepted/rejected/completed và hàng chờ; thử quota theo trường.
- **Biến thể:** tải cao kéo dài và client retry đồng loạt. Không đánh giá tốt chỉ vì không từ chối request nhưng mọi người phải chờ vô hạn.
- **Bằng chứng:** quyết định ưu tiên, đường tải vào/ra và phản hồi cho client; chứng minh freshness lẫn tải khi dùng cache. Nối `design`; cơ chế admission/backpressure đầy đủ còn mới.

### L3 — Hệ thống có lỗi giữa chừng vẫn phải giữ đúng điều gì?

Prerequisite: transaction, replication, messaging và nền mạng; bổ trợ state machine, thứ tự sự kiện và xác suất theo bài. Mọi trace phải nêu failure model. Các bảo đảm phân tán cần chuyên gia review.

#### CASE-L3-01 · L3.1 — Hai điểm trực nhìn thấy hai lịch khác nhau

- **Bài nhỏ:** partial failure/partition; clock/ordering; happens-before và Lamport/vector clocks; consistency; CAP/PACELC theo giả định.
- **Đề:** hai điểm nhận cập nhật khi đường truyền giữa chúng bị cắt; một màn hình yêu cầu đọc bản ghi mới nhất theo semantics đã chọn.
- **Thử:** sắp lịch gửi/nhận, lệch đồng hồ; đặt read giữa các write; đối chiếu lịch sử với từng tiêu chí consistency.
- **Biến thể:** phản hồi chậm không phân biệt chắc chắn với máy hỏng; timestamp lớn hơn không chứng minh quan hệ nhân quả.
- **Bằng chứng:** lịch sử thao tác kèm kết quả, điều kiện chấp nhận/từ chối yêu cầu khi partition; giải thích đánh đổi theo định nghĩa, không học khẩu hiệu “chọn hai trong ba”.

#### CASE-L3-02 · L3.2 — Ai giữ sổ đăng ký khi máy trưởng ngừng chạy?

- **Bài nhỏ:** replicated state machine; safety/liveness; election; Raft term/log/commit; tổng quan Paxos bằng bài riêng.
- **Đề:** cụm Raft năm node cố định; xét partition 3–2, crash/recovery và bản ghi chưa commit, không xét Byzantine trong mô hình này.
- **Thử:** từng bước bầu leader, append/ACK/commit/apply; chặn mạng, tắt leader rồi nối lại. Dùng trace đã kiểm theo thuật toán, không tự giản lược quy tắc commit thành đếm ACK.
- **Biến thể:** leader cũ còn chạy ở phía thiểu số. Quan sát có thể ngừng tiến triển trong khi vẫn giữ an toàn.
- **Bằng chứng:** log và commit index không tạo quyết định xung đột; nêu điều kiện để tiến triển trở lại. Mô hình mới, không tái gắn nhãn lab replica là consensus.

#### CASE-L3-03 · L3.3 — Máy giữ khóa cũ quay lại quá muộn

- **Bài nhỏ:** quorum/điều kiện bảo đảm; membership/failure detector; lease; lock/fencing; split brain.
- **Đề:** A nhận quyền ghi token 7 rồi bị treo; B nhận token 8; nơi lưu phải xử lý lần ghi muộn từ A theo hợp đồng token.
- **Thử:** timeline lease và pause, gửi ghi cũ sau ghi mới; bật kiểm tra fencing tại tài nguyên được bảo vệ. Bài khác thay membership/quorum với mô hình rõ.
- **Biến thể:** chỉ nơi cấp lock biết token nhưng nơi lưu bỏ qua. Quorum giao nhau không tự chứng minh linearizability của mọi protocol.
- **Bằng chứng:** trace chấp nhận/từ chối ghi cùng invariant; điều kiện clock/lease/membership và giới hạn failure detector.

#### CASE-L3-04 · L3.4 — Đặt chỗ rồi trừ điểm câu lạc bộ

- **Bài nhỏ:** transaction nhiều dịch vụ/2PC; saga/bù trừ; outbox/inbox/CDC; event sourcing/CQRS; giới hạn exactly-once.
- **Đề:** hai dịch vụ giữ chỗ và điểm nội bộ giả định, không giao dịch tiền thật. Nêu trạng thái hợp lệ khi đang xử lý và kết quả cuối cần đạt.
- **Thử:** dừng sau commit nhưng trước phát sự kiện, giao trùng, lỗi khi bù trừ; so state machine saga với trace 2PC ở bài riêng.
- **Biến thể:** tác dụng phụ đã xảy ra không thể “quay ngược thời gian”; bù trừ là hành động mới có thể lỗi. Replay không được lặp hiệu ứng ngoài ý muốn.
- **Bằng chứng:** bảng trạng thái, event IDs, invariant, retry/đối soát và đường thoát khi không rõ kết quả; không suy exactly-once end-to-end chỉ từ broker.

#### CASE-L3-05 · L3.5 — Cùng sửa danh sách đồ dùng khi offline

- **Bài nhỏ:** cập nhật đồng thời/version; conflict resolution; CRDT nguyên lý; anti-entropy/read repair.
- **Đề:** hai bạn thêm/xóa cùng món khi không kết nối. Sản phẩm phải chọn semantics cho thao tác thêm đồng thời với xóa.
- **Thử:** nối lại theo các thứ tự giao nhận và có bản tin lặp; đối chiếu LWW, giải xung đột thủ công và một CRDT xác định.
- **Biến thể:** đồng hồ lệch hoặc tombstone bị dọn không đúng điều kiện. Hội tụ không tự nghĩa là giữ đúng ý định người dùng.
- **Bằng chứng:** các bản sao hội tụ trong điều kiện mô hình; chỉ thao tác nào được giữ/mất và lý do nghiệp vụ chấp nhận semantics đó.

#### CASE-L3-06 · L3.6 — Một vùng phục vụ mất kết nối

- **Bài nhỏ:** active/passive và active/active; locality/routing/data placement; latency liên vùng; failover/failback.
- **Đề:** dịch vụ hai vùng, RTT liên vùng 120 ms giả định; đăng ký chỗ không được xác nhận trùng, bảng tin có yêu cầu nhẹ hơn.
- **Thử:** mất một vùng, chuyển đường đọc/ghi, kiểm vị trí dữ liệu; nối lại và thử failback khi còn chênh lệch dữ liệu.
- **Biến thể:** vùng cũ thực ra còn ghi được, hoặc điểm phục hồi thiếu ghi đã xác nhận. Nêu ai có quyền ghi trong mỗi giai đoạn.
- **Bằng chứng:** ma trận thao tác theo sự cố, nguy cơ mất dữ liệu/độ trễ và kế hoạch khôi phục; không hứa “hai vùng = luôn sẵn sàng, không mất gì”.

### L4 — Đưa hệ thống vào vận hành

Prerequisite: L2 và các năng lực L3 tương ứng. Không dùng thông tin học sinh thật, credential thật hoặc hệ thống production để diễn tập.

#### CASE-L4-01 · L4.1 — Trang vẫn mở nhưng đăng ký liên tục lỗi

- **Bài nhỏ:** SLI/SLO/SLA và error budget; logs/metrics/traces; sampling/cardinality/correlation; alert/incident/postmortem.
- **Đề:** cửa sổ 10.000 lần đăng ký hợp lệ, mục tiêu thành công 99%; chốt mẫu số, lỗi nào tính và cửa sổ trước khi đo.
- **Thử:** đọc dashboard và trace của một lỗi; tiêu thụ budget theo sự kiện; chọn alert có người nhận/hành động, cân chi phí telemetry.
- **Biến thể:** HTTP 200 nhưng đăng ký thất bại ở nghiệp vụ; sampling bỏ sót một nhóm nhỏ. Không lấy uptime trang chủ thay SLI người học quan tâm.
- **Bằng chứng:** định nghĩa SLI, tính budget, giả thuyết có chứng cứ và postmortem tập trung nguyên nhân/hành động. Không gọi mục tiêu nội bộ là SLA đã cam kết.

#### CASE-L4-02 · L4.2 — Dịch vụ chậm, mọi máy đều gửi lại

- **Bài nhỏ:** timeout/deadline; retry budget/backoff/jitter; breaker/bulkhead; degradation; cascade/overload.
- **Đề:** API gọi ba phụ thuộc; một phụ thuộc chậm, các tầng cùng retry. Đếm tổng lần gọi và tách latency với kết quả nghiệp vụ.
- **Thử:** phát cùng workload/seed, thay retry ở một tầng, truyền deadline; cô lập pool, tạm ngắt và thử lại có kiểm soát.
- **Biến thể:** thao tác không idempotent hoặc retry không còn trong deadline; chức năng cốt lõi cần từ chối thay vì trả kết quả gây hiểu sai.
- **Bằng chứng:** đường khuếch đại tải, số thao tác cuối cùng và giới hạn retry; chọn degradation an toàn. Nêu jitter/timeout không bảo đảm mọi lỗi được khắc phục.

#### CASE-L4-03 · L4.3 — Hệ thống ổn lúc thử nhưng chậm lúc khai mạc

- **Bài nhỏ:** capacity/headroom; queueing/Little’s Law; tail/fan-out; load/soak/profiling.
- **Đề:** cùng số request trung bình nhưng một trace đều và một trace burst; thêm tác vụ fan-out có một nhánh chậm.
- **Thử:** đổi phân bố thời gian xử lý, số nhánh và tải; xem p95/p99/hàng chờ; dùng L = λW chỉ trong cửa sổ ổn định, đơn vị và biên hệ thống thống nhất.
- **Biến thể:** hàng chờ tăng liên tục hoặc mẫu quá nhỏ; latency kết thúc chưa bao gồm request còn treo. Không áp dụng công thức để che giả định sai.
- **Bằng chứng:** dự đoán có giả định, phép đo cùng workload, điểm bão hòa và headroom có lý do; kết quả mô hình không là benchmark production.

#### CASE-L4-04 · L4.4 — Một tài khoản xem nhầm dữ liệu trường khác

- **Bài nhỏ:** threat/trust boundary; IAM/RBAC/ABAC; OAuth/OIDC; session/token; tenant isolation; encryption/key/secrets; audit/abuse; retention/deletion.
- **Đề:** dữ liệu giả lập của hai trường; học sinh xem hồ sơ mình, người quản lý chỉ xem trường mình; xác định dữ liệu nào cần lưu và đến bao giờ.
- **Thử:** bảng vai trò × tài nguyên × hành động; đổi tenant ID, hết hạn/thu hồi token, luân phiên khóa và yêu cầu xóa qua các bản dữ liệu liên quan.
- **Biến thể:** chỉ ẩn nút UI, cache thiếu tenant key hoặc log lưu secret. Mã hóa không thay kiểm quyền và OAuth không tự đồng nghĩa đăng nhập.
- **Bằng chứng:** threat model, test từ chối truy cập, vòng đời token/dữ liệu và audit phù hợp; nguồn chuẩn theo version, review security riêng.

#### CASE-L4-05 · L4.5 — Cập nhật hệ thống ngay trước ngày hội

- **Bài nhỏ:** VM/container/serverless và orchestration; network boundary/IaC; CI/CD; flags; rollout; config/schema compatibility; chaos có giới hạn.
- **Đề:** client v1 và v2 cùng tồn tại; bản mới đổi trường dữ liệu và có lỗi ở 5% traffic giả định.
- **Thử:** canary theo tín hiệu đã chọn, tắt flag hoặc rollback; kiểm old/new reader/writer; giới hạn phạm vi diễn tập và điểm dừng.
- **Biến thể:** code rollback nhưng schema đã đổi theo cách không tương thích; serverless cold start ở burst. Không coi rollback bundle là khôi phục database.
- **Bằng chứng:** ma trận tương thích, rollout plan/stop condition, phép kiểm sau rollback; chọn nền tảng theo nhu cầu vận hành, không mặc định Kubernetes.

#### CASE-L4-06 · L4.6 — Khôi phục sau khi xóa nhầm dữ liệu

- **Bài nhỏ:** backup/restore/retention; RPO/RTO/DR drill; cost compute/storage/egress/observability/công vận hành; resource efficiency/build-buy.
- **Đề:** mục tiêu RPO 15 phút và RTO 60 phút giả định; có mốc backup/log, dữ liệu kiểm tra và bảng đơn giá giả định có đơn vị.
- **Thử:** chọn điểm phục hồi, đo khoảng dữ liệu mất/thời gian phục hồi, xác minh dữ liệu; đổi retention/replication và workload để tính chi phí.
- **Biến thể:** backup tồn tại nhưng lỗi đọc hoặc thiếu khóa giải mã; lỗi người dùng đã lan sang replica. Replica không thay backup và tạo backup không chứng minh restore được.
- **Bằng chứng:** biên bản diễn tập, đối chiếu RPO/RTO và cost breakdown; đánh giá build/buy bằng cả công vận hành, không dùng giá cloud giả làm báo giá hiện hành.

### L5 — Bảo vệ và thay đổi một thiết kế tổng thể

Prerequisite: các năng lực L1–L4 liên quan. Bài có nhiều phương án hợp lệ; reviewer đánh giá giả định và bằng chứng, không chấm theo sơ đồ chuẩn duy nhất.

#### CASE-L5-01 · L5.1 — Thiết kế cổng sinh hoạt cho nhiều trường

- **Bài nhỏ:** clarification/scope; workload/ước lượng; API/data/components; failure/security/cost; chiến lược kiểm chứng.
- **Đề:** khách hàng chỉ nói “nhanh, không mất đăng ký”; người học phải hỏi để có tiêu chí và tự ghi giả định còn thiếu.
- **Thử:** xây bản nhỏ trước; thêm yêu cầu tải gấp mười, lỗi một vùng và quyền theo trường ở các vòng sau; cập nhật quyết định theo bằng chứng.
- **Biến thể:** ngân sách giảm nhưng tính đúng đắn không được giảm. Không mua thêm thành phần mà chưa chỉ ra vấn đề cần giải.
- **Bằng chứng:** hồ sơ yêu cầu, ước lượng có đơn vị, sơ đồ/traces và phương án kiểm chứng từng rủi ro; assessment lập luận có review.

#### CASE-L5-02 · L5.2 — Chia dịch vụ khi đội phát triển lớn lên

- **Bài nhỏ:** modular monolith/microservices/SOA/event-driven; DDD/context; coupling/cohesion; sync/async; ownership/team boundary.
- **Đề:** đội ba người vận hành đăng ký và thông báo, sau đó thành ba nhóm; thay đổi một chức năng đang buộc cả hệ thống phát hành lại.
- **Thử:** chia trách nhiệm bằng thẻ context; vẽ đường gọi/dữ liệu/ownership; mô phỏng một phụ thuộc ngừng hoạt động ở từng phương án.
- **Biến thể:** nhóm vận hành thiếu người hoặc dữ liệu giao dịch bị chia quá sớm. Không mặc định microservices là level cao hơn monolith.
- **Bằng chứng:** phương án ranh giới, chi phí phối hợp/consistency/triển khai và dấu hiệu thực tế khiến cần tách hoặc gộp.

#### CASE-L5-03 · L5.3 — Đổi cấu trúc hồ sơ mà không ngừng phục vụ

- **Bài nhỏ:** strangler/evolution; expand-contract; schema/API/event compatibility; backfill; dual write/reconciliation; rollback.
- **Đề:** tách một trường địa chỉ thành nhiều trường; client cũ vẫn gửi dạng cũ, trong lúc 100.000 bản ghi giả định đang backfill.
- **Thử:** đi từng giai đoạn thêm trường → tương thích hai dạng → backfill/đối soát → chuyển đọc → thu hẹp; lỗi ghi một phía và retry.
- **Biến thể:** người dùng sửa bản ghi đúng lúc backfill; rollback sau khi đã bỏ cột cũ. Dual write không tự atomic.
- **Bằng chứng:** ma trận phiên bản, invariant dữ liệu, checkpoint/cutover/rollback và điều kiện cho phép xóa phần cũ; không lấy tỷ lệ backfill 100% thay kiểm đối soát.

#### CASE-L5-04 · L5.4 — Một trường đông người làm các trường khác chậm

- **Bài nhỏ:** control/data plane; multi-tenancy; noisy neighbor/quota; isolation/cells/blast radius; governance.
- **Đề:** 20 trường, một trường tạo 60% tải; mục tiêu cô lập trải nghiệm trường khác, nêu giả định tài nguyên chia sẻ.
- **Thử:** quota, pool hoặc cell riêng; dừng một cell/control plane; theo những tenant/chức năng còn hoạt động và chi phí dự phòng.
- **Biến thể:** control plane hỏng nhưng data plane có cấu hình còn dùng được; cấu hình rollout sai tới nhiều cell. Không coi tách database là tự cô lập mọi phụ thuộc.
- **Bằng chứng:** sơ đồ quyền điều khiển/phục vụ, blast-radius table, quy trình cấp tenant và trade-off cô lập/chi phí/vận hành.

#### CASE-L5-05 · L5.5 — Tự xây hay thuê dịch vụ thông báo?

- **Bài nhỏ:** ADR/RFC; trade-off matrix; uncertainty/risk; build/buy/TCO; vendor dependence; operational burden; roadmap/debt.
- **Đề:** sáu tuần tới ngày hội, đội hai người, bảng chi phí giả định gồm triển khai, vận hành, chuyển đổi và ngừng dịch vụ.
- **Thử:** so hai phương án theo tiêu chí có trọng số được giải thích; thay tải, nhân lực hoặc ràng buộc dữ liệu; ghi mức bất định.
- **Biến thể:** phí sử dụng thấp nhưng công trực vận hành cao; nhà cung cấp đổi điều kiện. Không trình bày con số giả định như báo giá hãng.
- **Bằng chứng:** ADR có lựa chọn, phương án bỏ, rủi ro, kế hoạch thoát và điều kiện xem xét lại; chấp nhận nhiều đáp án có luận cứ.

#### CASE-L5-06 · L5.6 — Hội đồng review trước ngày khai mạc

- **Bài nhỏ:** architecture review; đọc paper/postmortem; benchmark/giả định; strategy validation; capstone nhiều vòng.
- **Đề:** nhận một thiết kế có giả định thiếu; có benchmark và timeline sự cố được biên soạn riêng, ghi rõ nguồn hoặc giả định của từng phần.
- **Thử:** tìm claim chưa có chứng cứ, thiết kế phép thử có thể bác bỏ; xử lý sự cố, thêm yêu cầu rồi sửa ADR/roadmap.
- **Biến thể:** benchmark đẹp nhưng workload khác; đã sửa lỗi nhanh nhưng migration làm sai dữ liệu. Không xem một paper là đáp án áp dụng cho mọi hệ thống.
- **Bằng chứng:** review có mức nghiêm trọng, chứng cứ/giới hạn, thiết kế sửa và kiểm tra lại; tách tự đánh giá khỏi reviewer xác nhận năng lực.

## 4. Sáu capstone cuối level

Capstone nối các case module, không sao chép nguyên đáp án. Cùng họ sản phẩm nhưng thay workload/ràng buộc và bớt gợi ý. Chưa xuất bản khi prerequisite cần thiết chưa có bài học đủ sâu.

| ID | Đề tổng hợp | Đầu ra tối thiểu | Biến thể để kiểm tra chuyển giao |
| --- | --- | --- | --- |
| CAP-L0 | Vì sao trang lịch học chậm hoặc hiện sai? | Trace request, nơi lưu trạng thái, tách mạng/xử lý, đọc metric và ước lượng | Mạng nhanh hơn nhưng nguồn vẫn chậm; thông tin cũ vẫn nhận HTTP 200 |
| CAP-L1 | Dịch vụ đặt chỗ trong một database | API/quyền, dữ liệu/index, invariant, concurrent trace, retry, deploy/rollback | Hai người tranh chỗ cuối, phản hồi mất sau commit |
| CAP-L2 | Cổng đọc nhiều kèm thông báo bất đồng bộ | Phân tải/cache/replica/shard/queue, workload và bottleneck, cách giới hạn tải | Một hot key và mất ACK; yêu cầu độ mới chặt hơn |
| CAP-L3 | Workflow đặt chỗ nhiều dịch vụ hoặc kho key-value | Failure model, semantics đọc/ghi, log/traces, invariant và phục hồi | Partition, leader cũ trở lại, hiệu ứng được giao lại |
| CAP-L4 | Diễn tập production readiness | SLO/alert, threat model, capacity, rollout, restore và cost | Retry storm + khôi phục; thay một điều kiện giữa bài |
| CAP-L5 | Tiến hóa cổng nhiều trường qua ba vòng review | Thiết kế, ADR, migration/cost/ownership, diễn tập và roadmap | Tải/nhân lực đổi, tenant bị ảnh hưởng chéo, cutover thất bại |

## 5. Bảy nhánh chuyên sâu

Chưa có module ID chính thức cho các nhánh; không tự thêm vào 36 module. Mỗi nhánh sau khi phân rã vẫn áp dụng mini-case mỗi bài và case tổng hợp. Các ID `TRACK-CASE-*` chỉ phục vụ kế hoạch này.

| ID / nhánh | Case thực hành và các lát bài | Thử lỗi / bằng chứng chính | Nền cần có |
| --- | --- | --- | --- |
| TRACK-CASE-AI · AI/ML Systems | Trợ lý tài liệu trường: ingestion/chunking/retrieval/ACL, eval, model/version, inference/GPU/batching, streaming/fallback, quyền tool; thêm bài pipeline training riêng | Tài liệu cũ, người hỏi sai quyền, retrieval không có câu trả lời, tool vượt quyền; đo chất lượng/latency/cost với bộ đánh giá có nguồn, không chỉ một chat demo | L1 API/data, L2 cache/queue, L4 security/observability; bổ trợ ML |
| TRACK-CASE-DATA · Data Engineering | Bảng thống kê mượn sách: CDC/ETL, event time/window/watermark, checkpoint/replay, backfill/schema, quality/lineage, OLTP/OLAP | Sự kiện trễ/lặp và sửa dữ liệu nguồn; kết quả đối soát được, nêu semantics cửa sổ và chi phí | Storage, transaction, messaging và replication |
| TRACK-CASE-SEARCH · Search/Recommendation/Geo | Tìm sách và địa điểm học: inverted index/autocomplete, ranking, vector/hybrid, candidate/rerank, feedback, spatial index/freshness | Kết quả cũ, phân quyền sau index, truy vấn geo sát biên; relevance/coverage/latency theo bộ đánh giá, không gộp search/recommendation/geo thành một thuật toán | Index, partition, pipeline; bổ trợ scoring/vector |
| TRACK-CASE-REALTIME · Realtime/Collaboration | Bảng kế hoạch nhóm: WebSocket/SSE/polling, presence/reconnect, fan-out/order, offline, OT/CRDT | Mất kết nối, sự kiện lặp/đảo thứ tự và sửa đồng thời; trace hội tụ, semantics thao tác và ngân sách kết nối | Networking, messaging, consistency, ordering |
| TRACK-CASE-MEDIA · Media/Streaming | Video bài giảng: resumable upload, transcode/jobs, manifest/segment/ABR, VOD/live, CDN và quyền phát | Job lỗi giữa chừng, segment thiếu, mạng giảm tốc, spike xem; đo buffering/latency và cost theo giả định | Object storage, queue, networking, CDN |
| TRACK-CASE-PLATFORM · Cloud/Platform/Edge | Nền tảng lab cho nhiều trường: scheduling/orchestration, autoscaling, mesh khi cần, serverless/edge, control plane, IaC và quota | Noisy neighbor, cấu hình sai, mất cell/region; phạm vi lỗi, rollout/rollback và giới hạn tài nguyên | L2, L4 security/SRE, multi-region liên quan |
| TRACK-CASE-BUSINESS · Nghiệp vụ invariant chặt | Đặt vé hoạt động và sổ điểm nội bộ: inventory/reservation, timeout/idempotency, ledger/reconciliation, audit, lịch và thay policy, compensation | Xác nhận mất, yêu cầu lặp, bù trừ lỗi; invariant và trạng thái không rõ được xử lý; ví dụ tài chính là mô hình học, không hướng dẫn production chưa review | Transaction, idempotency, workflow/failure |

Các case nhánh là khung phủ phạm vi, chưa phải storyboard/fixture đủ để xuất bản. Mỗi nhánh có ticket biên soạn và reviewer riêng ở CASE-10; không báo hoàn tất cả nhánh khi mới có một case.

## 6. Đợt đầu: áp dụng cho đủ 12 bài beta

Giữ lesson ID, module, bốn chặng và semantics đáp án hiện hành. Đợt đầu làm rõ tình huống bao quanh câu hỏi `challenge`, thêm yêu cầu, hướng thử và đánh đổi; không tự đổi assessment để làm câu chuyện hấp dẫn hơn. Nếu nội dung không thể khớp đáp án cũ, tách task version/migration trước khi phát hành.

| Lesson ID | Module hiện tại | Mini-case và yêu cầu | Tái sử dụng / giới hạn đợt đầu |
| --- | --- | --- | --- |
| `request` | L0.1 | Tra sách: ba chặng tuần tự 20/80/20 ms; xác định tổng thời gian | Trace request hiện hữu; lời giải 120 ms không đổi |
| `cache` | L0.1 | Phòng sinh hoạt vừa đổi; cần mới trong một phút nhưng bản ghi giữ năm phút không kiểm tra | Dùng mô hình bản sao/refresh; lab và đề dùng phút mô phỏng, không coi lab đã chứng minh SLA |
| `metrics` | L0.6 | Quầy xử lý 40 yêu cầu trong hai giây; phân biệt tốc độ và thời gian chờ | Lab batch/slow jobs hiện hữu; 20 yêu cầu/s thuộc phép tính đề, không đổi cấu hình lab ngầm |
| `dns` | L0.4 | Đổi địa chỉ website; cache lấy tại t=0, TTL 5 giây, tra lại t=5 | Engine thời gian logic/expiry hiện hữu, công bố nguồn đang truy cập được |
| `transport` | L0.4 | Gửi nội dung cần đủ mảnh khi dùng UDP | Lab mất mảnh/byte range; giải thích ứng dụng cần cơ chế bổ sung, không mô phỏng một protocol đáng tin cậy hoàn chỉnh |
| `capacity` | L0.6 | 2.000 ảnh 100 kB, mỗi ảnh được xem năm lượt | Đáp án dữ liệu gốc 200 MB; tách lượt xem khỏi số file, công bố phần overhead bỏ qua |
| `http` | L0.5 | Máy trả 200 nhưng lịch trong body vẫn cũ | Tái dùng request/response/status; phần độ mới là câu hỏi suy luận, không bịa tính năng cache trong HTTP lab |
| `network` | L0.4 | Tải 1.000 kB, tăng gấp đôi payload rate, RTT/xử lý giữ nguyên | Lab tính thành phần: 500 + 100 + 50 = 650 ms; nêu không có DNS/handshake/loss trong mô hình |
| `balance` | L2.1 | Thêm quầy nhận đơn trong khi chỗ pha vẫn nghẽn | Lab downstream bottleneck; lựa chọn giải thích giới hạn, chưa có discovery/session |
| `queue` | L2.5 | Tám job/s, mỗi worker hai job/s; giữ hàng chờ không tiếp tục tăng | Bốn worker trong điều kiện đều; không hứa rút backlog hay chống xử lý trùng |
| `replica` | L2.3 | Vừa đổi thông tin cần đọc ngay phiên bản mới | Lab lag/read routing; giới hạn lúc primary truy cập được, chưa có failover an toàn |
| `design` | L2.6 | Cổng ngày hội đáp ứng tải nhưng cache cũ quá yêu cầu | Lab thiết kế hiện hữu; kiểm đồng thời yêu cầu tải và độ mới, không chỉ tối ưu số request |

Pilot UI bằng `cache`, `network`, `queue` để đại diện độ mới, tính toán và hàng chờ; sau khi sửa các điểm lặp mới nhân sang chín bài còn lại. Đây là thứ tự hiện thực/kiểm tra, không gọi là pilot học sinh thật. Kết thúc batch phải đủ 12 case hợp lệ, kiểm regression mọi bài và báo rõ module vẫn chưa hoàn chỉnh.

## 7. Trải nghiệm mobile và thiết kế trình bày

Áp dụng [DESIGN.md](../../DESIGN.md) và skill frontend-design đã khóa trong repository. Giữ nền `#f5f7fb`, vùng đọc `#ffffff`, chữ `#17233d`, hành động `#244edb`, nhấn thay đổi `#fff0a8`, Be Vietnam Pro. Chỉ đổi bố cục chặng áp dụng, không đổi nhận diện hoặc thêm trang trí không có chức năng.

Luồng hiển thị đề xuất, tên chính vẫn là **Áp dụng**:

```text
Áp dụng
Tên tình huống + “Tình huống giả định”
Ai đang gặp vấn đề gì? (đoạn ngắn)
Cần đạt gì? (1–3 ràng buộc, đơn vị rõ)
Câu hỏi / lựa chọn chính
Phản hồi gắn ngay với lựa chọn
Thử lại trong thí nghiệm (khi có lab phù hợp)
Lợi ích, đánh đổi và điều kiện áp dụng
Lưu kết quả / đi tiếp + trạng thái lưu
```

- Mobile một cột, phần thiết yếu không bị giấu trong accordion. Mở riêng phần cơ chế sâu, nguồn và lời giải sau khi đã thử hoặc chủ động xin gợi ý; không đặt đáp án ngay trong câu giới thiệu.
- Mỗi bước một quyết định và tối đa vài điều khiển. Dùng trace/timeline hoặc bảng phù hợp cơ chế; sơ đồ có bản chữ cùng dữ liệu. Desktop có thể đặt đề cạnh kết quả nếu đọc được, thứ tự DOM vẫn hợp lý.
- Nút chạm ít nhất 44 × 44 px theo chuẩn dự án; không phụ thuộc hover, kéo hoặc pinch-zoom. Bàn phím dùng được; focus tới tiêu đề khi đổi chặng, trở lại đúng nút khi đóng popup; trạng thái không chỉ có màu.
- Dùng term registry hiện hành: desktop hover/focus, mobile chạm; không lặp định nghĩa dưới mọi từ hoặc lồng nút glossary trong nút đáp án.
- “Thử lại trong thí nghiệm” về chặng Tự thử và giữ lab/đáp án hiện có. Nếu áp preset sau này, nút ghi rõ “Bắt đầu lượt thử với dữ liệu ví dụ”, giữ lượt cũ và có đường quay lại; không ghi đè ngầm checkpoint.
- Reload chỉ cam kết khôi phục dữ liệu đã lưu thành công; lỗi lưu có retry/export như hiện hành. Chuyển tab, back, đổi ứng dụng và reduced motion không được làm mất câu trả lời hoặc thay kết quả mô hình.
- Bài tổng hợp dài chia checkpoint theo quyết định; không ép đọc một bức tường chữ. Dữ liệu mẫu nhỏ, hiển thị theo bước; engine lớn chỉ tải khi mở, có hạn mức event/node và thông báo khi vượt.

Review trước khi nhân rộng: screenshot nội dung thật ở 390 px và desktop; kiểm 320/360/430/768/1024/1440 px, text zoom, bàn phím, trình đọc màn hình và lỗi lưu. Emulation không thay kiểm trên Safari iOS/Chrome Android thật. Đợt kế hoạch này chưa tạo UI hoặc screenshot mới.

## 8. Nội dung, schema, thư mục và tương thích

Đây là contract đề xuất cho CASE-01, chưa là schema đang chạy. Giữ TypeScript/React/Vite/Zod và ranh giới package, không thêm framework hoặc package mới để chứa case.

### 8.1 Dữ liệu và nguồn duy nhất

Giai đoạn đầu đặt `caseStudy` cùng bài trong `content/lessons/vi/*.json`; không tạo thư mục riêng cho mỗi case nhỏ. Dùng editorial registry hiện có để quản lý nguồn, claims và review; không sao chép nguồn/reviewer vào hai hệ thống.

| Nhóm dữ liệu dự kiến | Trường / ý nghĩa | Kiểm tra trước khi vào beta |
| --- | --- | --- |
| Định danh | `id`, `schemaVersion`, `revision`, `familyId` | ID ổn định/không trùng; family khớp module kế hoạch, riêng bài dẫn nhập liên kết rõ |
| Mục tiêu | `competencyIds`, `depth`, `prerequisiteIds` | Năng lực thuộc module hoặc reference giới thiệu đã khai báo; graph không chu trình |
| Nguồn tình huống | `provenance.kind`: `authored-scenario` hoặc `documented-case`; `sourceIds`, `adaptationNote` khi chuyển thể | Case doanh nghiệp có source trực tiếp, ngày/phiên bản và phần giản lược; case tự viết có nhãn giả định |
| Nội dung | `title`, `context`, `requirements`, `assumptions`, `limitations` | Yêu cầu có tiêu chí quan sát; số có đơn vị, phân biệt giả định và đo được |
| Liên kết tương tác | `activityRef`, `scenarioRef` khi có, `experimentSteps` | Reference thuộc whitelist; cấu hình parse theo đúng activity schema; không JS/HTML thực thi hoặc URL tải mã tùy ý |
| Đánh giá | `assessmentRef`, `tradeoffs`, `transferPrompt` | Đợt đầu reference `challenge` cũ; không tạo bộ đáp án thứ hai; phần mở có rubric và người đánh giá |
| Biên tập/kiểm chứng | Case ID được liên kết với claim/source/trace/review evidence trong `content/editorial.json` | Review đúng revision; bằng chứng fixture/nguồn truy cập được; phân biệt agent/human |

`authored-scenario` không được miễn nguồn cho cơ chế kỹ thuật: số người/số request có thể giả định nhưng bảo đảm về TTL, transaction, retry… vẫn có nguồn. Trường `revision` của case và editorial cần ràng buộc để việc sửa nội dung làm review cũ hết hiệu lực theo phạm vi; chi tiết migration được ghi ADR trước code.

### 8.2 Tiến độ hiện hữu và hai giai đoạn contract

- **Giai đoạn A:** thêm văn cảnh cho challenge hiện hành, không đổi đáp án/ý nghĩa, giữ progress JSON v1, stage 0–3, lesson ID và dữ liệu lab. Parser/validator bổ sung case theo ADR; bump editorial revision. Case-only revision không tự xóa hoàn thành cũ hoặc tự chứng nhận năng lực mới.
- CASE-01 kiểm từng bài xem việc thêm context có thật sự giữ semantics. Nếu câu hỏi/đáp án/độ sâu đổi, không phát hành bằng cách chỉ tăng editorial revision; chuyển sang giai đoạn B.
- **Giai đoạn B:** assessment mới, rubric, attempt và preset/replay riêng cần version của nội dung/assessment/engine/schema. Hoàn thành cũ được giữ như bằng chứng phiên bản cũ; lần đánh giá mới hiển thị riêng. Có migration/import/export/backward-read tests trước rollout; không tự diễn giải đáp án index cũ theo options mới.
- Không ép tự do nhập lý do vào lab record hiện tại. Lý do mở và evidence nhiều chiều thuộc thiết kế attempt của ENG-03; khi chưa có thì cung cấp rubric tự đánh giá hoặc phiếu reviewer, ghi rõ chưa lưu/chấm tự động.
- Registry activity đầy đủ là công việc tiếp theo; hiện app dispatch theo `kind`. CASE-02 có thể dùng whitelist sẵn có cho giai đoạn A. Mô hình mới phải bổ sung hợp đồng typed và consumer thật, không sinh toàn bộ abstraction trước nhu cầu.

### 8.3 Nơi đặt công việc

| Đường dẫn | Thay đổi khi hiện thực |
| --- | --- |
| `content/lessons/vi/` | Mini-case cùng bài, ID/version; tách file theo nhóm học liệu khi đủ nội dung |
| `content/editorial.json` | Quan hệ năng lực/nguồn/review/planRefs theo case revision |
| `packages/content-schema/src/` | Parse case, reference và validation; test bên cạnh module |
| `packages/simulation-engine/src/` | Engine thuần và scenario fixture; không phụ thuộc React/DOM/storage |
| `packages/learning-core/src/` | Rubric/evidence/version của attempt khi giai đoạn B cần |
| `apps/web/src/features/lesson-player/` | Renderer Áp dụng; tách `CaseStudyPanel.tsx` khi cần, tận dụng TermNote/SaveStatus |
| `apps/web/src/features/lab/` | Adapter activity và trình bày; không chứa luật chấm điểm hoặc cơ chế engine |
| `apps/web/src/adapters/` | Persistence/migration khi contract thay; không đặt trong content |
| `scripts/content.ts` | Validation/build/report coverage, không chỉnh generated catalog tay |
| `tests/e2e/` | Luồng case, resume, dữ liệu cũ, trợ năng/responsive theo cấu trúc test hiện hành |
| `docs/decisions/` | ADR contract/version trước khi thay dữ liệu; chưa cần ADR thay stack |

Chỉ tạo file/thư mục khi task tương ứng thực hiện. Capstone dài sẽ được tách sang cấu trúc content riêng sau khi schema/renderer có consumer; không tạo 36 cây thư mục rỗng hoặc một package “case-study” chưa có nhu cầu.

## 9. Workflow, task và thứ tự triển khai

Vai trò: curriculum lead giữ coverage; tác giả viết storyboard; engineer làm schema/player/model; QA kiểm hành vi; reviewer chuyên môn kiểm claims; instructional reviewer kiểm cách hiểu. Một người có thể làm nhiều vai trò nhưng không tự ghi đã có review độc lập. Reviewer chuyên môn chưa được phân công tên là phụ thuộc còn mở, nhất là L1.5, L3 và security.

Workflow từng bài: năng lực/prerequisite → brief case → storyboard mobile → nguồn/trace/rubric → mô hình và nội dung → kiểm tự động → review kỹ thuật/cách giảng → thử với người học/sửa → beta hoặc phát hành theo gate. Evidence thất bại quay lại đúng task; không để review revision cũ thông qua bản mới.

| Task | Phạm vi / đầu ra | Phụ thuộc | Owner chính | Nghiệm thu |
| --- | --- | --- | --- | --- |
| CASE-00 | Kế hoạch này, danh mục 36 module/7 track và cập nhật tài liệu nguồn | Baseline 12 beta | Lead | Đủ ID, mapping, QA, dependencies; ghi rõ chưa hiện thực |
| CASE-01 | ADR + schema/validation + quyết định revision/migration | CASE-00 | Engineer + curriculum | Fixture case hợp lệ/sai bị xử lý đúng; 12 challenge có compatibility audit |
| CASE-02 | Player Áp dụng trên ba bài cache/network/queue | CASE-01 | Frontend + QA | Tap/focus/feedback/lab-return/save/resume đúng, screenshot mobile/desktop được review |
| CASE-03 | Biên soạn/nâng đủ 12 bài beta | CASE-02 | Writer + QA/reviewer | Đủ 12 case giai đoạn A; mọi đáp án cũ giữ nghĩa; review nguồn, regression toàn bộ, ghi giới hạn beta |
| CASE-04 | L0: sáu họ case và CAP-L0 | CASE-03; EDU-04/B1 theo năng lực | Curriculum + simulation | Bù OS/DS/IP/TLS và năng lực còn thiếu; bài nhỏ không dồn thuật ngữ; pilot người mới |
| CASE-05 | L1: sáu họ case và CAP-L1 | CASE-04 phần nền; EDU-05/B2 | Curriculum + data reviewer | API/data/index/transaction có trace thường/lỗi, invariant và review chuyên môn |
| CASE-06 | L2: sáu họ case và CAP-L2 | CASE-05 phần API/data/transaction; EDU-06/B3 | Curriculum + simulation | Tải lệch, dữ liệu cũ, ACK trùng, backpressure; không chỉ thêm văn cảnh cho lab đơn giản |
| CASE-07 | L3: sáu họ case và CAP-L3 | CASE-05/06 theo prerequisite; EDU-07/B4 | Distributed-systems reviewer + engineer | Failure model, safety/liveness, trace phản chứng; từng thuật toán được review trước beta |
| CASE-08 | L4: sáu họ case và CAP-L4 | CASE-06, phần CASE-07 liên quan; EDU-07 | SRE/security reviewer + QA | Incident, quyền, rollout/restore/cost có bằng chứng; reviewer đúng chuyên môn |
| CASE-09 | L5: sáu họ case và CAP-L5 | CASE-05–08; EDU-08/B5 | Architecture reviewer + curriculum | Hồ sơ nhiều phương án, migration và rubric lập luận; hoàn thành quiz không tự chứng nhận thành thạo |
| CASE-10 | Bảy nhánh, tách thành bảy ticket khi Ready | Prerequisite từng nhánh ở mục 5; EDU-08 | Reviewer theo nhánh | Phân rã năng lực/bài/case riêng, không đổi tổng 36 module hoặc gọi khung là chương trình hoàn chỉnh |
| CASE-QA | Checklist, test evidence, review dễ hiểu và EDU-02 theo từng batch | Chạy cùng CASE-02 trở đi | QA + người điều phối | Phân biệt automated/AI/human; findings có retest, gate chưa đạt vẫn mở |

CASE-04–10 là task cha, không là một PR khổng lồ. Mỗi module tách thành: storyboard/claim audit, activity/fixture, nội dung/assessment, QA/review; chỉ đưa Ready khi các dependency đúng bài và reviewer phù hợp đã xác định. Có thể soạn nháp L1–L5 sớm, nhưng không phát hành bài đòi nền tảng chưa được dạy. B0/ENG-03 tiếp tục quản lý nền content/version; không xây registry cạnh tranh riêng trong EDU-09.

**Nhánh:** đợt kế hoạch dùng `codex/edu-09-case-study-plan`. Khi bắt đầu code tạo nhánh task cụ thể từ baseline phù hợp; không tạo trước 36 nhánh. Commit chỉ phạm vi task; bảo toàn thay đổi khác ở checkout của người dùng. Release dùng artifact đã kiểm tra và audience hiện hữu; kế hoạch này không phát hành bản site mới.

**Ước lượng có điều kiện:** với một engineer + một writer làm song song và reviewer/QA có lịch, CASE-01–03 dự trù 10–17 ngày làm việc trên lịch nhóm: contract 2–3, vertical slice 3–5, chín bài còn lại 3–5, regression/sửa 2–4. Đây là khoảng sơ bộ, không phải cam kết hoặc tổng person-days; chưa bao gồm chờ người tham gia pilot. Đo effort từ ba bài đầu rồi cập nhật. Các module cần engine/reviewer mới ước lượng sau storyboard; không nhân 36 với thời gian viết mini-case và không đặt ngày hoàn thành toàn chương trình khi chưa phân rã đủ.

## 10. Kiểm chứng và definition of done

### 10.1 Rubric học tập dự kiến

Bốn tiêu chí, mỗi tiêu chí 0/1/2: (1) hiểu vấn đề/yêu cầu; (2) giải thích cơ chế bằng trace hoặc kết quả; (3) chọn và bảo vệ phương án; (4) nhận ra giới hạn/đánh đổi và áp dụng sang biến thể. Mốc 0: chưa có hoặc sai; 1: đúng một phần/cần gợi ý; 2: đúng và nêu lý do phù hợp độ sâu. Dự kiến đạt case khi ít nhất 6/8, không tiêu chí nào 0 và không vi phạm invariant/quyền bắt buộc; hiệu chỉnh sau pilot.

L0 cho chọn câu lý do hoặc kể theo sơ đồ; L1–L2 cần trace/metric và lựa chọn; L3–L5 cần failure model, chứng cứ và điều kiện giới hạn. Lời giải được xem qua gợi ý phải được ghi nhận, không đồng nhất với tự làm. Đây là rubric tác giả/reviewer, chưa có trong máy chấm hiện tại. Tự đánh giá và AI phản hồi không tự cấp chứng nhận thành thạo.

### 10.2 Kiểm thử theo rủi ro

| Miền | Trường hợp bắt buộc |
| --- | --- |
| Nội dung/schema | Case ID trùng, module/năng lực/reference sai, thiếu đơn vị/nhãn nguồn, source/review không khớp revision; documented-case thiếu nguồn; draft không lọt vào bài phát hành |
| Kiến thức/engine | Trace thường và lỗi tính độc lập; invariant, đơn vị/cửa sổ đo; cùng seed/input cho cùng kết quả; UI/text khớp engine; sai số/giới hạn được nêu |
| Player | Trả lời sai/đúng, đọc gợi ý, quay lại lab rồi về case; feedback không lộ trước khi chọn; không nhân đôi glossary; focus hợp lý |
| Persistence | Reload sau lưu thành công, back/đa tab/xung đột, lỗi quota/storage, import/export; record cũ không đổi nghĩa hoặc mất completed/lab |
| Responsive/accessibility | Các viewport mục 7, text zoom, bàn phím/screen reader, popover chạm/hover, reduced motion, không overflow hoặc sticky che đáp án |
| Hiệu năng | Bundle shell/player trong budget hiện hành, activity tải theo nhu cầu, giới hạn event; phân biệt lab measurement với p75 thực tế |
| Chất lượng học | Người học nói được vì sao, tìm được thông tin cần thiết, giải biến thể; ghi kiến thức đầu vào/gợi ý và sửa ngộ nhận lặp |

Chỉ thêm test chứng minh rủi ro/hành vi; không snapshot hàng trăm đoạn văn thay review kiến thức. Khi đổi player/schema, chạy content check, typecheck/lint, unit liên quan, production build rồi E2E/responsive cần thiết trên artifact cuối. Kiểm fixture độc lập, không tính expected bằng chính hàm đang test.

### 10.3 Gate theo đơn vị

- **Mini-case beta:** đủ context/yêu cầu/giới hạn, hoạt động trung thực với engine, challenge hợp lệ, nguồn/review nội bộ có evidence, mobile/resume qua kiểm; hiển thị beta nếu chưa có chuyên gia/pilot.
- **Module hoàn chỉnh:** mọi năng lực bắt buộc từ CURRICULUM_MAP đã map tới bài và bằng chứng, mini-case từng bài + bài tổng hợp đã review; assessment đúng độ sâu, prerequisites và phiên bản tương thích; thử với người học phù hợp, sửa/retest các lỗi hiểu sai.
- **Level hoàn chỉnh:** sáu module đạt gate, capstone và năng lực liên module có evidence; không dùng số case hoặc số bài beta thay coverage năng lực.
- **Nhánh hoàn chỉnh:** registry năng lực và capstone nhánh đã review theo lĩnh vực; không tự đạt từ hoàn thành phần cốt lõi.
- **Web/app:** giữ nguyên gate web trước app trong ROADMAP; thêm case không tự hoàn tất offline, sync, kiểm thiết bị thật hoặc pilot.

Agent `student_tester` có thể được dùng khi có task gọi tester, với vai trò Minh, dữ liệu đầu vào/prerequisite đúng level và báo cáo quan sát riêng. Không giả định persona lớp 10 chưa học nền có thể đánh giá chuyên môn L3–L5. QA bằng agent giúp phát hiện chỗ khó dùng/khó hiểu; EDU-02 vẫn cần học sinh thật. Không biến báo cáo AI thành buổi học thật hoặc tự liên hệ người tham gia.

## 11. Nguồn nghiên cứu và phạm vi kiểm chứng của kế hoạch

Case trong danh mục là thiết kế bài tập do tác giả đề xuất; số liệu giả định và các trace chi tiết còn phải được biên soạn/kiểm chứng trước khi xuất bản. Danh mục này chưa phải chứng nhận đúng toàn bộ học liệu. Nguồn bổ trợ được chọn theo từng claim, không dùng một link ở cuối bài để chứng minh mọi nội dung.

| Nguồn | Dùng cho kế hoạch / kiểm tiếp khi biên soạn |
| --- | --- |
| [System Design Primer tại commit đã khóa](https://github.com/donnemartin/system-design-primer/tree/ae9bbd7b02d90b9866215de185217d33f39ab733) | Giữ mapping PRIMER-K/C trong CURRICULUM_MAP; tham khảo cấu trúc yêu cầu → ước lượng → thiết kế → đánh đổi. Không dùng thay tài liệu chuyên môn cho mọi bảo đảm; nội dung chuyển thể giữ ghi công Donne Martin/contributors và CC BY 4.0 theo registry hiện hành |
| [PostgreSQL 18 — Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html) | L1.5: phân biệt isolation/anomaly và hành vi theo DB; khi viết fixture phải chốt cấu hình và trace cụ thể |
| [Raft — trang tác giả, paper và tài nguyên](https://raft.github.io/) | L3.2: chọn paper/phiên bản thuật toán cho log/election/commit, ghi giả định; không suy consensus từ mô hình replica hiện có |
| [Google SRE — Handling Overload](https://sre.google/sre-book/handling-overload/) | L2.6/L4.2: thiết kế bài kiểm soát tải và từ chối có chủ đích, chọn tín hiệu theo yêu cầu |
| [OWASP — Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | L1.2/L4.4: phân biệt xác thực và quyền, kiểm quyền tại thao tác/tài nguyên, testcase từ chối |
| `content/editorial.json`, source-1…source-14 | Tái sử dụng nguồn của 12 bài beta: MDN, RFC DNS/TCP/UDP/HTTP, tài liệu cache/queue, hot standby, SRE và ước lượng. CASE-01 kiểm lại claim khi đổi ngữ cảnh, không mặc định review cũ đủ |

Năm nguồn web nêu tên ở trên được mở đối chiếu ngày 14/10/2026; các nguồn registry được kiểm inventory ở đợt kế hoạch này, không tuyên bố đã đọc lại toàn bộ. Fetch riêng RFC 9110 và RFC 8446 trong phiên này không trả nội dung sử dụng được; phần HTTPS/TLS cần kiểm tài liệu chuẩn đầy đủ trong CASE-04 trước review. Những chủ đề khác như CRDT, fencing, 2PC, OIDC, storage engine và các track cần source/paper chính xác bổ sung ở ticket tương ứng; không ghi trạng thái reviewed chỉ từ mô tả trong kế hoạch.

## 12. Kiểm tra đặc tả ngày 14/10/2026

- Đối chiếu tự động: đủ 36 case ID duy nhất, khớp chính xác 36 module trong CURRICULUM_MAP; mỗi mục có phân rã bài, đề, thao tác, biến thể và bằng chứng.
- Đối chiếu tự động: sáu capstone, bảy nhánh và đủ 12 lesson ID/module khớp JSON nguồn; liên kết file nội bộ trong bảy tài liệu thay đổi tồn tại.
- `pnpm content:check` đạt: 36 module, 12 bài nhập môn khả dụng. Thay đổi CURRICULUM_MAP không làm sai catalog nguồn.
- Rà diff/whitespace và giới hạn task: chỉ tài liệu. Không chạy lại build/E2E, không đổi code hoặc deploy; chưa có review chuyên gia độc lập hay pilot cho các case dự kiến.
