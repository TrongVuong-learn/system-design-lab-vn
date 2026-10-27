# Kế hoạch rework — Thành phố dữ liệu pixel

Trạng thái: UI đã hiện thực và phát hành ngày 27/10/2026 qua [PR #25](https://github.com/TrongVuong-learn/system-design-lab-vn/pull/25). Kế hoạch được giữ làm nguồn phạm vi; kết quả thực tế nằm trong [báo cáo phát hành](../delivery/PIXEL_CITY_UI.md). Phạm vi: trang đầu, Khám phá, khu Game và ba bàn chơi, màn học, Tiến độ. Giữ6level/36module/7nhánh/85bài, các ID/đáp án/luật/phiên lưu hiện có.

## Ý tưởng chủ đạo

**Phạm vi đã chốt: rework UI toàn site, không chỉ khu Game.** Trang đầu, điều hướng chung, Khám phá, trang level/module/nhánh, toàn bộ màn học và bài ôn, Tiến độ, nhập/xuất và offline đều thuộc cùng hệ thiết kế. Game là một phần của trải nghiệm. Phác thảo khu Game hiện tại chỉ minh họa ý tưởng, chưa đại diện bản thiết kế toàn site.

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

**P1 — Hệ thiết kế và mẫu toàn site.** Chốt palette, sprite grid, typography, điều hướng, khung/nút và trạng thái lỗi qua các màn đại diện: trang đầu, Khám phá, một bài học, Tiến độ và Game. Review đồng thời ở 320/390 và 1280 với nội dung thật để chứng minh phong cách xuyên suốt. Sau đó hoàn thiện một lát cắt game cache với engine hiện tại để kiểm ngôn ngữ chuyển động trước khi nhân rộng.

**P2 — Ba game.** Hoàn thiện sprite/đường đi cho chia tải và queue. Kiểm đủ nhánh thắng, sai, tràn, bản cũ, reset, replay, bấm nhanh và resume. Không đổi luật để khớp hình đẹp.

**P3 — Shell và khám phá.** Rework header/nav, trang đầu, danh mục, level và tiến độ trên cùng hệ UI. Mobile có bố cục riêng; tránh danh sách dài toàn ảnh khiến chọn bài khó hơn.

**P4 — Màn học.** Chuyển khung/stage/feedback, kiểm các loại lab đại diện và cả85route. Giữ phần đọc, glossary, form và trợ năng, không chỉ chụp trang chủ rồi coi toàn site xong.

**P5 — Kiểm thử và phát hành.** Review ảnh320/390/768/1280; touch/keyboard/focus/reduced-motion; replay/nhánh sai/offline/old saves; CI. Gọi Minh kiểm khi có task được giao và runtime khả dụng; kết quả vẫn ghi AI mô phỏng. PR→master→Vercel READY, đối chiếu artifact và smoke trên URL công khai. Nếu có vấn đề dữ liệu/chặn học, dùng bản master trước đã kiểm để rollback.

## Điều kiện đạt

### Gate bảo mật trước phát hành rework

Kiểm tra sơ bộ ngày 27/10/2026: ứng dụng hiện là React/TypeScript/Vite tĩnh trên Vercel, chưa có API/tài khoản/database server. Tiến độ lưu IndexedDB, game lưu localStorage; import tiến độ qua schema và giới hạn 2 MB. Backend Node/Fastify và PostgreSQL trong kiến trúc là phương án tương lai, chưa triển khai.

- HTTP production hiện có HTTPS/HSTS, chưa thấy CSP, chống nhúng trang, `X-Content-Type-Options` hoặc `Referrer-Policy` trong phản hồi trang chủ. Cần bổ sung chính sách phù hợp và kiểm tương thích GSAP/Lottie/WASM/offline trước phát hành.
- `pnpm audit --prod` báo một advisory high cho Zod 4.6.5: [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), bản vá được công bố là 4.6.6. Đây là phát hiện dependency; chưa chứng minh khai thác được qua luồng import có giới hạn của ứng dụng. Cần vá và kiểm dữ liệu cũ/import lỗi.
- Bổ sung kiểm dependency tự động, rà nguồn asset/script và xử lý dữ liệu nhập. Không lưu secret vào bundle hoặc browser storage; không coi tiến độ phía client là bằng chứng chống gian lận.
- Nếu thêm tài khoản/sync, phải có phạm vi riêng cho xác thực, phân quyền phía server, giới hạn request, backup và bảo vệ dữ liệu học sinh trước mở tính năng.

Các mục trên là việc cần hoàn tất, không phải tuyên bố đã vá hay đã pentest. Kiểm thử chức năng hiện có không thay kiểm toán bảo mật.

- Nhìn trang Game nhận ra chủ đề pixel, ba game phân biệt được bằng cơ chế và bố cục.
- Trên320px không cuộn ngang ngoài ý muốn; nút chạm tối thiểu44px; văn bản Việt đủ dấu và dễ đọc.
- Thao tác→chuyển động→kết quả dễ theo dõi; có thể xem lại/tắt chuyển động mà vẫn hiểu trạng thái bằng chữ.
- Không mất dữ liệu cũ, không tự tăng điểm/đánh dấu bài đã học khi xem hoạt ảnh, không làm hỏng offline.
- Không thêm dependency nếu sprite/SVG/CSS/GSAP hiện có đủ dùng; mọi asset có nguồn/license rõ. Đo bundle và công việc mỗi frame, không tự tuyên bố60fps khi chưa đo.
- Chỉ ghi hoàn tất khi toàn bộ màn trong phạm vi đã kiểm, không coi mockup hay một hero pixel là rework xong.

Ngoài phạm vi đợt này: multiplayer, leaderboard thật, đăng nhập/cloud save, đổi curriculum/đáp án, nền tảng native, âm thanh hoặc hệ thưởng gây nhầm với năng lực học.

## Theo dõi triển khai

Source UI đã merge vào master và Vercel READY ngày 27/10/2026; gate bảo mật và production smoke đã đạt trong đợt PR #25. Xem [báo cáo triển khai/phát hành](../delivery/PIXEL_CITY_UI.md) để phân biệt source, kiểm chứng và trạng thái production; các phát hiện sơ bộ ở trên là baseline trước sửa.
