# Hướng thiết kế System Design Lab

## Bối cảnh

Người học cần mở một bài, dự đoán, thao tác và hiểu kết quả trên điện thoại. Giữ lối nhập môn phù hợp học sinh cấp 3. Đây là sản phẩm học tập; mỗi chi tiết thị giác cần hỗ trợ đọc, nhận biết trạng thái hoặc hành động.

## PIXEL-CITY — Hệ UI hiện hành trong source (27/10/2026)

Theo [plan rework](docs/design/PIXEL_CITY_REWORK_PLAN.md), giao diện chuyển sang thành phố dữ liệu pixel trên toàn site. Source đang ở nhánh `codex/pixel-city-ui`; tình trạng kiểm chứng/phát hành nằm trong [báo cáo triển khai](docs/delivery/PIXEL_CITY_UI.md). Các hướng bên dưới là lịch sử và quy tắc cho cơ chế bài học, không phải palette hiện hành.

- Mực `#14203b`, giấy đọc `#f4f7ff`, trời `#b9e6ff`, hành động cobalt `#2447d8`, tín hiệu `#ffcf56`. Be Vietnam Pro tự host, đủ dấu Việt; không dùng font pixel cho phần đọc.
- Trang đầu: bưu kiện đi qua bốn trạm SVG theo thao tác. Cảnh dựa lưới 4 đơn vị, không cần WebGL và không tự chạy khi cuộn. Số liệu của thí nghiệm cache bên dưới vẫn từ engine.
- Khám phá: sáu khu có accordion HTML, mobile mở một khu; tìm kiếm/lọc và danh sách bài giữ lối vào trực tiếp. Trang level và nhánh dùng cùng tokens/controls.
- Game: hai trạm nhận tải, quầy bản tin có mái, băng chuyền sáu chỗ/worker/khay tràn. Xem trước chạy engine một lượt trong bộ nhớ, không ghi phiên game hoặc tiến độ học. Kết quả bàn chơi và replay tiếp tục từ engine thật.
- Màn học và bài ôn: vùng đọc trắng, khung gọn, bảng chặng dùng viền vuông và tín hiệu vàng cho chặng hiện tại; giữ focus, glossary, lỗi lưu, form và điều kiện mở chặng. Không phủ sprite/texture sau văn bản.
- Tiến độ: sáu khu hiển thị số bài tự luyện từ dữ liệu thật, liên kết về level. Import/export và offline giữ vị trí/nhãn rõ; hoàn thành tự luyện không đồng nghĩa thành thạo.
- Nét vuông và bóng khối 3px chỉ dành cho nút hành động, không outline dày mọi đoạn văn. SVG là artwork gốc trong source, nhãn/phiên bản là text thật. Chuyển động theo hành động, có reduced-motion và trạng thái chữ.

## Lịch sử: bàn thí nghiệm


Trang đầu đặt một thí nghiệm thật lên trước: đổi phòng học ở nguồn, đọc bản ghi cũ rồi làm mới. Nội dung có câu hỏi cụ thể và nút mô tả việc sẽ xảy ra. Các bài khác được trình bày như những mục trong sổ học, mỗi bài có sơ đồ riêng đúng chủ đề.

- Nền `#f5f7fb`, vùng đọc `#ffffff`, chữ `#17233d`, hành động `#244edb`, vùng nhấn thay đổi `#fff0a8`, đường cấu trúc `#d8dfeb`.
- Be Vietnam Pro tự host: regular cho văn bản, semibold cho điều khiển và bold cho tiêu đề. Một family chính để dấu tiếng Việt, số và nhãn thống nhất.
- Tiêu đề câu hỏi dùng sentence case, không tô màu một phần headline hoặc dùng một chuỗi khẩu hiệu ngắn thay câu hỏi cụ thể.
- Bố cục mobile một cột; thí nghiệm và phản hồi cùng khối. Desktop dùng vùng demo cạnh ngữ cảnh, phần bài học và lộ trình có nhịp khác nhau.
- Card chỉ dùng khi nội dung là một đơn vị độc lập có hành động. Danh mục level và module ưu tiên danh sách. Không thêm số trang trí, eyebrow chữ hoa hoặc icon tile theo công thức.
- Số thứ tự chỉ dùng cho chặng thực sự có trình tự; dữ liệu có đơn vị. Minh họa cache, queue và replication phải khác nhau vì cơ chế khác nhau.
- Chuyển động gắn với hành động người học; không chạy request trang trí liên tục ở hero.

## Quy trình review UI

Đọc skill frontend-design và file này trước khi đổi giao diện. Viết ngắn mục tiêu, hierarchy và lý do thay đổi; hiện thực; chụp viewport 390 px và desktop; review với nội dung thật; kiểm tra 320 px, focus, reduced motion, lỗi và dữ liệu lưu. Giữ ảnh ở cache, không đưa ảnh kiểm thử vào bundle.

Review bằng câu hỏi cụ thể: người học biết phải làm gì đầu tiên không; có thấy tác động của thao tác không; nhãn và sơ đồ có giải thích điều cần học không; typography tiếng Việt có đọc thoải mái không; chi tiết nào đang chỉ trang trí? Skill hướng dẫn quyết định và review, không bảo đảm tự động rằng giao diện có chất lượng.

## Nguồn và phạm vi áp dụng

- `frontend-design` từ [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) đã cài ở `.agents/skills/frontend-design`, giữ Apache-2.0 license và commit nguồn trong tooling lock.
- [Impeccable](https://github.com/pbakaus/impeccable) được tham khảo cho chu trình critique/audit và bối cảnh sản phẩm. Đợt này không cài CLI binary, hook hoặc detector của Impeccable.
- [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) đã được rà như bộ tra cứu mở rộng; chưa cài vì đợt này cần một hướng thị giác tập trung cho sản phẩm hiện tại.

Thay hướng thiết kế phải cập nhật file này cùng token/component; không chồng lớp CSS phủ lên một hướng cũ đã bị thay thế.

## Màn học

Mỗi chặng có tiêu đề và một hướng dẫn ngắn trước nội dung. Chặng hiện tại dùng chữ, đường cấu trúc và `aria-current`; trên mobile bốn chặng xếp 2 × 2 để giữ nhãn dễ đọc. Focus đến tiêu đề chặng sau khi tải tiến độ hoặc chuyển chặng. Nút chưa mở phải có hướng dẫn nêu việc còn cần làm; số thao tác được suy ra từ tiến độ hiện tại.

Lỗi ghi tiến độ dùng khối nền vàng nhạt trước nội dung chặng, thông báo điều chưa lưu và hành động thử lại/xuất dự phòng. Lỗi đọc có lời giải thích giữ nguyên bản cũ; UI không coi tiến độ trong tab là đã lưu trên thiết bị. Trạng thái lưu bình thường ở cuối chặng để không chiếm vùng đọc.

Thuật ngữ trong văn xuôi dùng gạch chân chấm, giữ font/màu ngữ cảnh khi đóng; trạng thái mở dùng màu hành động. Ghi chú là popover không modal trong top layer, tối đa 320 px, có định nghĩa và nút Đóng. Hover/focus đọc nhanh, click/tap ghim-toggle; giữ bản tra cứu cuối bài. Không biến mọi từ thành badge/card hoặc thêm nút bên trong đáp án.

Danh sách từ mới chỉ hiển thị tên Việt/Anh khi popup được hỗ trợ; mở nghĩa bằng hover/focus hoặc chạm, không in thêm cùng định nghĩa ngay dưới mục. Browser thiếu Popover API hiển thị định nghĩa dạng chữ như fallback. Cùng một nguồn registry được dùng cho cả hai cách hiển thị.

## Phản hồi EDU-10

Giữ palette/type bàn thí nghiệm. Bảng trước–sau3–4 dòng ở ngay dưới điều khiển, tên đại lượng bên trái, số có đơn vị, chỉ ô đổi dùng nền vàng nhạt. Chữ nguyên nhân dưới bảng là vùng đọc chính; desktop vẫn giữ cùng khối, mobile không cuộn ngang. Gợi ý là nút mở theo thứ tự và hai đoạn ngắn; lời giải sai chỉ mở theo yêu cầu. Không thêm chuyển động tự chạy, badge thưởng hoặc màn đăng nhập.

## Ôn tổng hợp EDU-12

Giữ bàn thí nghiệm: hai luồng “xem lịch” và “gửi thông báo” có nhãn/đơn vị riêng. Yêu cầu trước, điều khiển sau, nút chạy rõ ràng, bốn kết quả ràng buộc tiếp theo, nhận định cuối. Mobile một cột, chỉ một tình huống đang mở; trace/so lần thử/nguồn mở khi cần. Kết quả cũ giữ nhìn lại nhưng có nhãn cần chạy lại khi config đổi. Status dùng chữ Đạt/Chưa đạt ngoài màu, focus tới kết quả sau chạy, không dùng màu xanh làm bằng chứng mastery.

### Bài HTTPS/TLS

Đọc tình huống → chọn kênh/chứng chỉ/can thiệp → chạy → ba góc nhìn (máy trường, người trên mạng, trình duyệt) và trace chữ. Mobile một cột; kết quả nằm cạnh thao tác trong lab, trước–sau dùng ObservationPanel. Dữ liệu có trạng thái chữ thay vì chỉ màu/ổ khóa; không vẽ chuỗi mã giả như mã hóa thật.

### Bài concurrency

Bộ đếm chung là điểm nhìn chính, ngay sau đó là hai luồng A/B và số từng luồng đã đọc. Nút ghi rõ “A đọc số chung”/“A ghi số đã đọc +1”; nhãn chờ giải thích ai giữ khóa. Mobile một cột, desktop hai luồng cùng hàng; trace chữ đánh dấu từng thao tác thành công, không dùng animation tự chạy hoặc thời gian giả. Bảng observation giữ cùng chuẩn hiện có.

### Bài CPU/I/O

Giữ bàn thí nghiệm; hiển thị một CPU, hai việc và trạng thái tại mốc hiện tại, không dùng số worker như số CPU. Chọn loại việc/worker →Qua1ms hoặc chạy xong →before/after →timeline chữ từng khoảng. Mỗi dòng timeline chỉ khoảng, CPU và mô tả hai việc để vừa320px; ghi sốms giả định, có chữ nghỉ/I/O/chờworker/chờCPU ngoài màu. Không thêm animation tự chạy.


### Quản lý offline

Một mục tại Tiến độ, cùng kiểu transfer-panel: phạm vi → dung lượng/phiên bản → trạng thái chữ → tải/kiểm tra/xóa. Mobile wrap nút, chiều cao ít nhất44px; không dùng navigator.onLine làm bằng chứng tải đủ. Bản cập nhật chờ có lời hướng dẫn đóng tất cả tab; không thay bài giữa chừng. Xóa gói nói rõ giữ tiến độ, lỗi download có thể thử lại.

### Tìm mã sách

Ba lựa chọn ngắn → xem một mục/chạy xong → số mục và phạm vi còn lại → before/after → trace chữ mở khi cần. Không vẽ128 ô quá nhỏ hoặc dùng ms giả. Danh mục đã sắp, vị trí bắt đầu từ1 trong UI; đổi config bắt đầu lại rõ ràng. Giữ palette và font, kiểm320/390/1280px.

### Học liệu theo lộ trình và bản thiết kế — EDU-25/26

Giữ palette/font bàn thí nghiệm. Trang đầu có sáu bài nhập môn; Khám phá có bộ lọc level/nhánh/capstone/case và tìm kiếm có mã module. Mỗi module dẫn thẳng tới bài. Chương cơ chế dùng details có tiêu đề thật, ví dụ và bước suy luận; không dùng hình trang trí thay nội dung. Bản thiết kế nằm sau câu chuyển giao đúng, một cột textarea có nhãn rõ, đếm ký tự, rubric mở khi cần và phần đổi ràng buộc. Viết từng mục được lưu ngay; lời nhắc chỉ nói đủ bản nháp, không tự đánh giá đúng. Kiểm screenshots thực tế320/390/1280 và tương tác bàn phím/chạm trước phát hành.

## DESIGN-10 — Xưởng vận hành (26/10/2026)

Theo yêu cầu redesign và Game riêng: chuyển nền sang trắng đá #f3f5f1, mực xanh rừng #193b35, action teal #1b6e66. Be Vietnam Pro tiếp tục tự host. Hero là xưởng request tương tác; lớp 3D lazy-load, vẽ khi có thay đổi, có lời giải HTML tương đương. Catalog/lesson vẫn ưu tiên đọc và điều khiển cơ chế.

Game là điểm đến `/games`, độc lập với học và tiến độ bài. Mỗi game 6 lượt, không đếm giờ, có luật giả định, trace và kết quả; local save version riêng, không tính mastery. Ba cơ chế: chia tải, cache freshness, queue capacity/worker budget. GSAP dùng transform theo cuộn ngắn, không pinning/scroll-jacking; tôn trọng reduced-motion. LottieFiles runtime phát JSON tự tạo theo thao tác, không loop vô hạn. Brief và lựa chọn ở docs/design/design10/BRIEF.md.

## QA11 — Trạm điều phối (thay hướng DESIGN-10)

Người dùng yêu cầu phá cách hơn: chuyển sang cobalt #2447d8, mực #142454, giấy #f4f6ff, vàng tín hiệu #f6da59. Hero chữ lớn trên mảng màu đặc cạnh hành trình request thật. Khu Game là ba vùng bất đối xứng, chia tải chiếm hai hàng trên desktop, mobile chuyển thành ba poster liên tiếp. Không còn ba card trắng giống nhau. Be Vietnam Pro và nội dung/luật/saved state giữ nguyên; màn bài học và bàn chơi vẫn nền sáng. Xem docs/design/qa11/BRIEF.md.

## GAME12 — Diễn biến từng lượt

Ba game có sơ đồ SVG riêng lấy số liệu trước/sau từ learning-core. GSAP minh họa gói tải đến máy, đọc nguồn/cache và cập nhật bản lưu, việc vào hàng đợi trước khi worker xử lý/tràn mất. Nút xem lại chỉ chạy hình; thao tác mới hủy chuyển động cũ, không chặn điều khiển hoặc lưu. Không dùng thời gian hoạt ảnh làm tốc độ hệ thống. Reduced-motion và lỗi tải animation giữ ảnh kết quả cùng diễn giải chữ. Xem docs/design/game12/BRIEF.md và REVIEW.md.

## QA13 — Giữ diễn biến trong vùng nhìn

Sau hành động hoặc replay, nếu hình game nằm ngoài viewport (tính cả thanh điều hướng cố định), đưa hình vào giữa màn hình trước khi phát hoạt ảnh. Cuộn tức thì, không chuyển focus và không tự cuộn khi mở/resume trang. Đây là sửa QA13-F1: hoạt ảnh cache/queue từng nằm dưới màn hình sau tap đầu ở390px.
