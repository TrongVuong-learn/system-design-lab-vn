# Kế hoạch rework — Thành phố dữ liệu pixel

Trạng thái: kế hoạch theo yêu cầu27/10/2026, chưa hiện thực/phát hành. Đây là hướng kế tiếp sau QA13, không mô tả giao diện đang chạy. Phạm vi: trang đầu, Khám phá, khu Game và ba bàn chơi, màn học, Tiến độ. Giữ6level/36module/7nhánh/85bài, các ID/đáp án/luật/phiên lưu hiện có.

## Ý tưởng chủ đạo

Người học là người vận hành một thành phố phần mềm thu nhỏ. Yêu cầu là bưu kiện, máy chủ là trạm xử lý, cache là quầy giữ bản tin, hàng đợi là băng chuyền sáu chỗ. Mỗi vật thể phải giải thích một cơ chế; không thêm nhân vật, đồng xu hoặc hiệu ứng chỉ để lấp chỗ trống.

So sánh bốn hướng: máy arcade neon (dễ lẫn với game giải trí/tạo áp lực thời gian), desktop máy tính cổ (nặng cửa sổ và chữ nhỏ), sổ pixel (vẫn là bộ card cũ), thành phố pixel (chọn vì gắn được đường đi, điểm đến và giới hạn tài nguyên). Điểm nhận diện: bưu kiện đi xuyên các trạm theo thao tác, các game có sân khấu riêng; không chỉ đổi font và thêm viền răng cưa.

## Hệ thị giác

- Góc nhìn2.5D/isometric cho cảnh khám phá; hình nhìn thẳng cho bàn chơi để đọc số dễ.
- Mực #14203b; giấy đọc #f4f7ff; trời #b9e6ff; hành động cobalt #2447d8; tín hiệu #ffcf56; trạng thái phụ xanh lá #7dc89a; lỗi #db5b52. Kiểm tương phản theo từng cặp thực dùng, màu luôn đi cùng chữ/ký hiệu.
- Be Vietnam Pro tiếp tục cho nội dung, luật, câu hỏi và nút. Pixel nằm ở wordmark, sprite, khung và icon. Chỉ thêm font tiêu đề pixel nếu đủ dấu tiếng Việt và tự host được; không ép chữ nhỏ thành pixel.
- Một lưới pixel thống nhất cho sprite; nét vuông sắc, bóng khối ngắn có hướng. Không outline dày mọi đoạn văn hoặc phủ nền texture phía sau chữ. Vùng học để sáng và thoáng.
- Bộ asset riêng: bưu kiện, trạm A/B, quầy bản tin, bản v1/v2/v3, worker, băng chuyền, khay mất việc,6biểu tượng khu học. Ký hiệu số/phiên bản luôn là text thật, không đóng cứng vào ảnh.

## Từng màn hình

1. Trang đầu: cảnh thành phố nhỏ thay hero hộp hiện tại. Một thao tác gửi yêu cầu làm bưu kiện đi qua bốn trạm. Nút bắt đầu/tiếp tục học rõ, không bắt người học chơi intro trước khi vào bài.
2. Khám phá: sáu khu ứng với sáu level. Mobile cuộn dọc, một khu đang mở, có danh sách bài/tìm kiếm/lọc dễ dùng; không bắt kéo một bản đồ rộng hay zoom để tìm bài. Bản đồ là cách nhìn thêm, mọi đích có liên kết HTML và thứ tự focus rõ.
3. Game: ba sân chơi khác hình dáng, không ba card cùng mẫu. Mỗi game xem trước cơ chế bằng một hành động ngắn có chủ ý; có mục tiêu và nút vào chơi.
4. Bàn chơi: nút, cảnh và kết quả nằm trong cùng cụm. Chia tải là hai trạm nhận bưu kiện có trọng lượng; cache là quầy bản tin với dấu phiên bản; queue là băng chuyền sáu ô với worker nhận việc và khay tràn. Cảnh sống động nhưng số liệu, thời điểm vào/ra và thứ tự bước lấy từ engine thật.
5. Màn học: tab chặng mang hình bảng điều khiển pixel nhẹ, nội dung câu chuyện/câu hỏi vẫn là chữ rõ. Minh họa riêng cho cơ chế, không thay tất cả lab bằng cùng một cảnh.
6. Tiến độ: dấu khu đã học trên bản đồ và danh sách tiếp tục học. Giữ nhãn phân biệt hoàn thành tự luyện với thành thạo; giữ nhập/xuất/offline ở nơi dễ tìm.

## Chuyển động và khả năng dùng

GSAP hiện có điều phối chuyển động theo hành động; sprite đổi pose bằng ít frame, không chạy vòng nền liên tục. LottieFiles giữ các phản hồi ngắn và có fallback tĩnh. Three.js chỉ dùng cho cảnh chiều sâu nếu đo được lợi ích; không bắt WebGL để chơi/học. Không thêm engine game nặng, scroll-jacking, timer hoặc âm thanh tự phát.

Kế thừa QA13-F1: mỗi lần chọn hành động phải nhìn thấy cảnh trước khi hoạt ảnh bắt đầu; tính vùng bị nav che, giữ focus, replay không tính thêm lượt. Reduced-motion hiện ngay cùng kết quả. Scene không được báo hoàn tất/đúng trước khi engine xác nhận. Giữ các giả định đơn vị/tốc độ, thứ tự enqueue-before-service và cache invalidation rõ ràng.

## Thứ tự thực hiện và mốc nghiệm thu

**P1 — Mẫu có thể chơi.** Dựng một lát cắt hoàn chỉnh trang Game + game cache ở390/320 và1280, dùng nội dung thật và engine hiện tại. So sánh với giao diện cũ qua ảnh/video. Chốt palette, sprite grid, khung/nút và cách hiện lỗi trước khi nhân rộng.

**P2 — Ba game.** Hoàn thiện sprite/đường đi cho chia tải và queue. Kiểm đủ nhánh thắng, sai, tràn, bản cũ, reset, replay, bấm nhanh và resume. Không đổi luật để khớp hình đẹp.

**P3 — Shell và khám phá.** Rework header/nav, trang đầu, danh mục, level và tiến độ trên cùng hệ UI. Mobile có bố cục riêng; tránh danh sách dài toàn ảnh khiến chọn bài khó hơn.

**P4 — Màn học.** Chuyển khung/stage/feedback, kiểm các loại lab đại diện và cả85route. Giữ phần đọc, glossary, form và trợ năng, không chỉ chụp trang chủ rồi coi toàn site xong.

**P5 — Kiểm thử và phát hành.** Review ảnh320/390/768/1280; touch/keyboard/focus/reduced-motion; replay/nhánh sai/offline/old saves; CI. Gọi Minh kiểm khi có task được giao và runtime khả dụng; kết quả vẫn ghi AI mô phỏng. PR→master→Vercel READY, đối chiếu artifact và smoke trên URL công khai. Nếu có vấn đề dữ liệu/chặn học, dùng bản master trước đã kiểm để rollback.

## Điều kiện đạt

- Nhìn trang Game nhận ra chủ đề pixel, ba game phân biệt được bằng cơ chế và bố cục.
- Trên320px không cuộn ngang ngoài ý muốn; nút chạm tối thiểu44px; văn bản Việt đủ dấu và dễ đọc.
- Thao tác→chuyển động→kết quả dễ theo dõi; có thể xem lại/tắt chuyển động mà vẫn hiểu trạng thái bằng chữ.
- Không mất dữ liệu cũ, không tự tăng điểm/đánh dấu bài đã học khi xem hoạt ảnh, không làm hỏng offline.
- Không thêm dependency nếu sprite/SVG/CSS/GSAP hiện có đủ dùng; mọi asset có nguồn/license rõ. Đo bundle và công việc mỗi frame, không tự tuyên bố60fps khi chưa đo.
- Chỉ ghi hoàn tất khi toàn bộ màn trong phạm vi đã kiểm, không coi mockup hay một hero pixel là rework xong.

Ngoài phạm vi đợt này: multiplayer, leaderboard thật, đăng nhập/cloud save, đổi curriculum/đáp án, nền tảng native, âm thanh hoặc hệ thưởng gây nhầm với năng lực học.
