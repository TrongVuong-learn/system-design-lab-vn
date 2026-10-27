# PIXEL-CITY — Rework UI toàn site

Ngày: 27/10/2026. Nhánh triển khai: `codex/pixel-city-ui`. Nguồn phạm vi: [plan đã chốt](../design/PIXEL_CITY_REWORK_PLAN.md). Đã phát hành theo master qua [PR #25](https://github.com/TrongVuong-learn/system-design-lab-vn/pull/25); các yêu cầu đã chốt trong plan được giữ nguyên.

## Phạm vi và điều kiện hoàn tất

Trang đầu, shell/điều hướng, Khám phá, trang level/module và bộ lọc nhánh, màn học, bài ôn, Tiến độ/nhập/xuất/offline, khu Game và ba bàn chơi dùng cùng palette, controls và ngôn ngữ pixel. Giữ 6 level/36 module/7 nhánh/85 bài, ID/đáp án/engine/schema/bản lưu hiện có. UI phải đọc được ở 320px, không cuộn ngang; thao tác mới/replay/resume/reduced-motion và lỗi lưu tiếp tục hoạt động.

## Quyết định thiết kế

- Vật thể đặc trưng: bưu kiện yêu cầu đi xuyên các trạm; sáu khu học đưa người học về level; bản đồ tiến độ lấy số bài hoàn thành thật. Không thêm điểm thưởng, timer hoặc nhân vật trang trí.
- Tokens chính cập nhật ở `tokens.css`, các rules hiện hữu ở `main.css`/`desk.css`; `workshop.css` thay bố cục cũ, không thêm một theme ghi đè lên theme cũ. Be Vietnam Pro tự host giữ dấu tiếng Việt.
- Hero là SVG gốc dựa lưới 4 đơn vị, có mô tả HTML, chỉ chuyển động khi bấm và tôn trọng reduced-motion. Không còn cần tải Three.js hoặc ScrollTrigger cho trang đầu. Không thêm dependency/asset bên thứ ba.
- Khám phá có sáu khu, một khu mở; tìm kiếm/lọc đứng trước bản đồ. Khi tìm hoặc lọc, bản đồ ẩn để bài khớp xuất hiện ngay dưới controls. Catalog dài dùng danh sách thay 85 hình minh họa. Lối vào level/module/nhánh giữ nguyên.
- Ba game có hình sân riêng: trạm nhận gói tải, quầy bản tin có mái, băng chuyền sáu chỗ và khay tràn. Xem trước một lượt dùng `playGame`/`GameScene` trong bộ nhớ component; không ghi game hoặc tiến độ học. Bàn chơi và replay dùng số liệu từ engine hiện hữu, giữ QA13 cuộn diễn biến vào viewport trước khi phát.
- Bảng chặng hiện tại nền vàng/viền vuông; vùng đọc, form, glossary và before/after giữ rõ. Tiến độ, nhập/xuất/offline tiếp tục dùng cùng adapters và nguồn dữ liệu cũ.

## Skill và review

Đã đọc frontend-design, Taste app-screen, React best practices và Playwright mobile-testing trong bộ skill project. Taste đề xuất framed-sheet; lấy nguyên tắc vùng làm việc sáng và dữ liệu thật, thay sidebar/radius/hue budget theo brief pixel/mobile đã chốt. Lưới city và palette của plan có ưu tiên cao hơn mẫu dashboard thư viện.

Inspector trước: hero 88px, 50% viewport đầu màu đậm, 50% text dưới 13px. Bản đầu sau sửa: hero 68px desktop/42px mobile, 20% viewport đầu màu đậm, khoảng 49% text dưới 13px. Đây là phép đo bố cục, không phải chứng nhận chất lượng. Inspector nhận nhầm SVG thành chart nhiều màu; màu dùng để phân biệt sprite/khu, không mã hóa series dữ liệu. Bóng khối nút 3px và nét vuông là ngoại lệ có chủ ý theo brief, không phải glow. Các cảnh báo headline/below-fold thuộc trang đầu có hero, không áp đặt quy tắc dashboard lên toàn bộ hành trình học.

Review ảnh đầu phát hiện nested SVG dùng kích thước mặc định khiến tòa nhà phóng lớn; đã đặt viewport 96×80 cho sprite. Test đầu phát hiện hai vùng `status` trên home; mô tả hành trình đổi thành `aria-live` để không lẫn phản hồi cache. Một lần chạy hai tiến trình Playwright chung output gây lỗi xóa trace; chạy kiểm cuối tách output và tuần tự các đợt dùng chung build.

Ảnh và dữ liệu QA ở `.cache/pixel-city/` và `/private/tmp/pixel-city-before`, `/private/tmp/pixel-city-after`; không đưa vào bundle. Test pixel riêng kiểm keyboard/filter, preview không lưu, và chụp 10 màn thật ở 320/390/768/1280. Responsive matrix hiện hữu kiểm đủ 85 route qua chặng học/lab/áp dụng.

## Kiểm chứng

- `pnpm build`, `pnpm lint`, `pnpm content:check`, `git diff --check`: đạt. `pnpm test:unit`: 110/110, 30 files.
- Responsive matrix: 63/64 đạt ở lượt đầy đủ; một ca lỗi ghi trace do hai tiến trình dùng chung output, không có assertion UI thất bại. Chạy lại ca đó và bảy ca danh mục/lỗi lưu trong output riêng: 8/8 đạt. Toàn bộ 85 bài đã đi qua chặng câu chuyện/dự đoán/lab/áp dụng ở 320/360/390/430/768/1024/1440; cỡ nút lab >=44px và không tràn trang.
- Sau sửa cỡ chữ/sơ đồ mobile, chạy lại các ca danh mục bảy viewport và learning batch đầu ở 320: 8/8 đạt. Đợt E2E chức năng cuối: 63 passed / 1 skipped (hover trên thiết bị touch), 0 failed; gồm pixel-city, games/game-motion, learning, progress-recovery, school-review, term-notes và offline trên mobile/desktop Chromium.
- Source lint Taste: 0 fail/0 warn. Inspector cuối ở 1280/768/390: 0 fail, 6 warn; áp dụng ngoại lệ `button-fx,rainbow-chart` theo brief. Inspector không có preset cho 320 nên tạo viewport cao 200px, sinh cảnh báo khoảng trống không phù hợp điện thoại; dùng ảnh Playwright 320×900 và kiểm overflow/touch thật trong browser thay cho phép đo đó. Lỗi chữ 7px mà inspector phát hiện đã sửa thành 12px, thẻ bài mobile chuyển thành một cột.
- Đã xem ảnh thật trang đầu desktop/mobile, Khám phá, level, màn học, Game và Tiến độ. Màn học giữ font dễ đọc/focus; CTA và bản đồ có lối HTML. Bộ ảnh 10 route ×4 viewport ở `.cache/pixel-city/`.
- Bundle chính cuối 1,603.42 kB / gzip 399.62 kB; CSS 52.22 kB / gzip 10.88 kB. Không còn tải chunk Three.js 746.77 kB và ScrollTrigger 43.55 kB cho hero. Đây là số build, không phải đo tốc độ mạng/FPS.

QA ban đầu dùng Node 26.11.1; build kiểm phát hành và CI sau đó dùng Node 24.21.0/pnpm 11.25.0 theo pin. Không coi kiểm source hoặc ảnh mockup là tính năng đã phát hành.

## Giới hạn và phát hành

Không đổi curriculum, assessment hoặc persistence; không gọi Minh vì lượt này không giao task tester học sinh. Chưa kiểm điện thoại thật hoặc pilot học sinh. CI remote, merge master và production smoke đã đạt; xem kết quả phát hành bên dưới. Gate bảo mật: đã cập nhật Zod 4.6.6, dùng validation jitless và audit production không báo advisory; thêm CSP, chống nhúng, nosniff, referrer/permissions policy và bước audit high trong CI. Có kiểm CSP/WASM/offline và packaging headers; không gọi đây là pentest. Build còn cảnh báo bundle chính trên 500 kB; không tuyên bố 60fps khi chưa đo thiết bị thật.

## Chuẩn bị phát hành theo yêu cầu deploy

- Build lại bằng Node 24.21.0 có sẵn trong cache đã kiểm của EDU-26; không thay runtime pin. Không thay curriculum hoặc định dạng tiến độ.
- Security headers dùng cùng nguồn `vercel.json` cho production và Vite preview; script Build Output API hiểu wildcard toàn site. Unit test kiểm cả headers toàn cục và giữ cache theo đúng URL.
- CSP chỉ cho script cùng origin và WASM, không cho JavaScript eval; style inline còn cần cho React/GSAP. Zod dùng interpreter để tránh thử `new Function`. Test ghi nhận mọi securitypolicyviolation khi đi qua hero, game animation và tải offline.
- Advisory nguồn: https://github.com/advisories/GHSA-mrhx-c7xc-m3w5 ; hướng dẫn headers: https://vercel.com/docs/cdn-security/security-headers . Rà nguồn 27/10/2026.
- Production baseline để rollback: master `0d8480dedf134f0afb25b31f5a8480447adf511d`, deployment `dpl_RHeGg8Tty3bjzRJvBH3b9iL5kHVR` (READY).
- Kết quả CI, SHA tích hợp và deployment đã được đối chiếu với artifact và smoke; chi tiết bên dưới.

WebKit local phát hiện `upgrade-insecure-requests` nâng URL asset từ HTTP localhost lên HTTPS làm preview trắng; bỏ directive dư này khỏi CSP dùng chung. Production tiếp tục HTTPS/HSTS do Vercel, còn CSP `self` vẫn giới hạn script cùng origin. Tám kiểm tra WebKit về game, CSP/offline và dữ liệu cũ đã đạt trước merge.

CI #55 dừng tải tại gói font từ Azure Ubuntu mirror hơn 8 phút, chưa chạy E2E. Bổ sung mirror Ubuntu chính thức và timeout/retry cho apt trong runner ephemeral; không đổi app artifact hoặc runtime pin. CI #56 trên head mới đã đạt trước merge.

## Kết quả phát hành — 27/10/2026

- URL: https://system-design-lab-vn.vercel.app ; master `f9f4e37c5a85589a6ca031ea1f1445948d838a59`.
- [Quality #56](https://github.com/TrongVuong-learn/system-design-lab-vn/actions/runs/40499298040) tại head `0984e4e6232902ad8856b9517ea60d34f1862f08`: audit, content/lint/format, 110 unit, build và 603 E2E đạt; một hover test skip cho touch.
- Vercel deployment `dpl_7zUTDB14rKXTFGoTSwFC7hyziLuc`: READY, target production, source SHA đúng master.
- Artifact `2d57d6e94830b8c0`: 21/21 file công khai khớp SHA-256 bản kiểm local; security/cache headers đã xác minh.
- Production smoke: 44/44 browser test đạt; mở đủ 85 bài ở 390/1280, không có pageerror hoặc tràn ngang. Học/resume, game, nhập/xuất, offline và CSP đều qua.
- Bằng chứng local ignored: `.cache/pixel-city/release.json`, `production-http.json`, `production-routes.json`, `production-e2e/` và bộ ảnh thật.
