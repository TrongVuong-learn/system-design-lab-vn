# Hướng thiết kế System Design Lab

## Bối cảnh

Người học cần mở một bài, dự đoán, thao tác và hiểu kết quả trên điện thoại. Giữ lối nhập môn phù hợp học sinh cấp 3. Đây là sản phẩm học tập; mỗi chi tiết thị giác cần hỗ trợ đọc, nhận biết trạng thái hoặc hành động.

## Hướng mới: bàn thí nghiệm

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
