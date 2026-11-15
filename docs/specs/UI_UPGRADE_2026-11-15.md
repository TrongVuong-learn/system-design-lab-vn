# SPEC — Nâng cấp giao diện và chất lượng sản phẩm (UP-01)

Ngày: 15/11/2026. Nhánh khảo sát: `claude/astryx-redesign` (commit `f6b9bf3`, chưa có PR, chưa lên `master`).
Trạng thái (cập nhật 16/11/2026): người dùng yêu cầu lột xác hoàn toàn thay vì nâng cấp từng bước. Hướng "Sổ thí nghiệm" ở mục 3 được thay bằng hướng **"Vở ô li"**; phần chẩn đoán ở mục 2 vẫn đúng. Việc đã làm, đã kiểm và còn lại ghi ở [docs/delivery/UP_01_VO_O_LI.md](../delivery/UP_01_VO_O_LI.md). Giai đoạn 4 (tách bundle) chưa làm.

Yêu cầu người dùng: trang hiện tại nhìn "phèn"; cần danh sách việc phải sửa, hướng nâng cấp và kế hoạch chi tiết.

## 1. Cách khảo sát

- Chụp bản build đang chạy ở `127.0.0.1:4173` bằng Playwright Chromium, 390×844 và 1280×800: trang đầu, Khám phá, bài học (chặng 1 và chặng lab của `cpu-io`), Game, Tiến độ.
- Đo computed style (màu chữ, nền, cỡ chữ, chiều cao) trên các nút và tiêu đề chính.
- Đọc `DESIGN.md`, `docs/delivery/ASTRYX_UI.md`, theme `lab`, `styles/base.css`, `styles/mechanisms.css`, kích thước `dist/assets`.

Chưa khảo sát: Firefox/WebKit, thiết bị thật, trình đọc màn hình, trang level, bàn chơi từng game, bài ôn, 320 px. Các mục đó phải được chụp lại ở bước đầu của Giai đoạn 0.

## 2. Chẩn đoán: vì sao nhìn "phèn"

Nguyên nhân gốc: đợt chuyển Astryx thay component nhưng giữ gần như nguyên theme `neutral`. Kết quả là một bản wireframe xám–trắng có đúng một màu nhấn, không có nhận diện riêng. Cụ thể:

### 2.1 Lỗi cần sửa ngay (sai, không chỉ xấu)

| ID | Vấn đề | Bằng chứng |
| --- | --- | --- |
| B1 | Nút dạng liên kết có **chữ đen trên nền cobalt**, không đạt tương phản AA. Nút `<button>` cùng kiểu lại chữ trắng. | "Bắt đầu bài đầu tiên", "Khám phá Game", "Vào chơi": `color rgb(0,0,0)` trên `rgb(36,71,216)` (khoảng 2,9:1). "Gửi một yêu cầu": chữ trắng. |
| B2 | Hai màu xanh khác nhau cùng lúc: nhãn "Bản thử nghiệm" dùng `#0074e2` của theme neutral, không phải accent `#2447d8`. Viền hover/selected (`--shadow-inset-*`) cũng còn `#0074e2`. | Computed `rgb(0,116,226)`; `lab.css` dòng 341–342. |
| B3 | Đoạn mở đầu trong lab có khoảng cách dòng giãn bất thường (khoảng 44 px giữa các dòng, có khoảng trống sau thuật ngữ). | Ảnh chặng "Tự thử" của `cpu-io`, cả 390 và 1280 px. Nghi do rule `min-height: 44px` trong `mechanisms.css` áp lên phần tử inline; cần xác minh. |
| B4 | Chữ trong sơ đồ Game đè lên nét vẽ: "Máy A/Máy B" đè thanh ngang, "Người nhận" đè đường nối, "Mất +0" đè cột, "Còn chờ" sát khối đỏ. | Ảnh `/games` ở cả hai viewport. |
| B5 | Các khối "Ba game, ba cơ chế", "Thử sai cũng có ích", "Bắt đầu bằng một câu hỏi nhỏ", "Điều vừa thấy có nghĩa gì?" có padding của thẻ nhưng không có nền/viền, nên lệch 24 px so với lề của mọi khối khác. | Mép trái 80 px so với 56 px trên desktop. |
| B6 | Tiêu đề tab trình duyệt không đổi theo trang: mọi route đều là "System Design Lab · Hiểu bằng cách thử". | Đo `document.title` ở `/`, `/explore`, `/levels/L0`, `/learn/cpu-io`. |
| B7 | `theme-color` trong `index.html` là `#244edb`, lệch accent `#2447d8`. Logo vẫn là tòa nhà pixel của hướng Pixel City đã bỏ. | `apps/web/index.html`, `public/icon.svg`. |

### 2.2 Vấn đề thị giác

| ID | Vấn đề |
| --- | --- |
| V1 | **Nền xám chết `#f1f1f1` + thẻ trắng viền mảnh, không bóng.** Mọi thứ cùng một mặt phẳng, không phân biệt thẻ bấm được với khối thông tin. |
| V2 | **Chữ nhỏ và yếu.** Body 14 px (thấp cho học sinh đọc trên điện thoại), H1 desktop 35 px weight 600, chữ phụ xám nhạt. Không có thang display; tiêu đề trang và tiêu đề thẻ gần bằng nhau. |
| V3 | **Hero không có điểm nhìn.** Bốn ô vuông xám đánh số trông như thanh bước của form, không phải hành trình một yêu cầu. Nửa trái desktop trống. |
| V4 | **Một màu duy nhất.** Sáu level đều dùng cùng huy hiệu xanh nhạt; không có mã màu theo level, không có màu thứ hai có chủ đích (amber của theme chỉ xuất hiện ở một chấm tròn). |
| V5 | **Banner thông tin xanh đậm đặc `#b9d7ff`** dùng cho nội dung phụ ("Không cần viết code", "Bản thử nghiệm đang có 85 bài") nhưng lại là khối nổi nhất trang. Khối "Ghép các kiến thức lại" ở Tiến độ cũng vậy. |
| V6 | **Lưới có hàng mồ côi.** Trang đầu 4 cột + 2 thẻ lẻ; Tiến độ 5 cột + 1 thẻ lẻ; Game 3 thẻ trong lưới 4 cột để trống cột phải. |
| V7 | **Thẻ bài học không đồng nhất.** Mỗi thẻ có vùng phác thảo cao thấp khác nhau, kiểu số liệu khác nhau; "Bắt đầu thí nghiệm →" lặp sáu lần. |
| V8 | **Sơ đồ cơ chế và Game là SVG nét đen mặc định**, góc vuông, khối đỏ đặc; lệch hẳn phần còn lại (bo tròn, cobalt). |
| V9 | **Hoạt ảnh Lottie ba chấm** (xanh lá/cam) trôi lẻ loi ở góc trang Game và trong khối "Thử cơ chế qua Game"; không ai hiểu nó là gì. |
| V10 | **Nút quá nhỏ trên desktop** (32–36 px, chữ 14 px), ba kiểu nút lẫn lộn trong cùng một hàng. `select` gốc của trình duyệt trong lab. |
| V11 | **Thanh chặng bài học**: chặng xong, chặng hiện tại và chặng khóa dùng ba hình dạng khác nhau (viền trên, khối đặc, không khung). |
| V12 | **Chân trang trơ**: ba dòng chữ, không liên kết, không nguồn/giấy phép/báo lỗi. |
| V13 | Gần như không có chuyển động: 8 dòng transition/animation trong toàn bộ CSS. Bấm nút, mở accordion, chuyển chặng đều đổi tức thì. |

### 2.3 Vấn đề cấu trúc trang

| ID | Vấn đề |
| --- | --- |
| S1 | **Khám phá trên điện thoại cao 31.370 px** (desktop 9.443 px): 85 thẻ đầy đủ xếp một cột. Không thể duyệt. |
| S2 | Trang đầu mobile cao 4.824 px; sáu thẻ nhập môn cỡ đầy đủ đẩy lộ trình sáu khu xuống rất sâu. |
| S3 | Accordion sáu khu ở Khám phá: hàng thấp (khoảng 33 px trên desktop), huy hiệu dính mép trái, hai nút "Mở khu L0" / "Lọc bài của khu này" khó phân biệt. |
| S4 | Trang đầu không có trạng thái "đang học dở": người quay lại vẫn thấy "Bắt đầu bài đầu tiên". |
| S5 | Tiến độ: số "0 / 85" là thông tin chính nhưng nằm trong một thẻ dẹt; phần Offline và Nhập/Xuất (ít dùng) chiếm hơn nửa trang. |

### 2.4 Kỹ thuật

| ID | Vấn đề | Số liệu |
| --- | --- | --- |
| T1 | Bundle JS chính quá lớn, không tách theo route. | `index-*.js` 2,07 MB; `catalog.json` 1,2 MB nằm trong đó. |
| T2 | CSS lớn. | `index-*.css` 345 KB (theme Astryx gồm cả token chế độ tối không dùng). |
| T3 | Runtime Lottie nặng cho một hoạt ảnh ba chấm. | `dotlottie-player.wasm` 1,24 MB. |
| T4 | Thiếu metadata chia sẻ và cài đặt. | Không có Open Graph, `manifest.webmanifest`, `apple-touch-icon`; `public/` chỉ có `icon.svg`. |
| T5 | Môi trường cục bộ lệch bản khóa. | Máy đang Node 22.20, repo khóa Node 24; `pnpm` không có trong PATH (chạy qua corepack). |
| T6 | Chế độ tối: theme đã có token `light-dark()` nhưng app khóa sáng. | `DESIGN.md` mục Astryx. |

## 3. Hướng thiết kế đề xuất: "Sổ thí nghiệm"

Giữ Astryx, Be Vietnam Pro tự host, cobalt `#2447d8` và mọi nội dung/đáp án/engine. Thay phần "neutral mặc định" bằng một nhận diện có chủ đích. Mọi thay đổi màu/font đi qua theme editor của Astryx theo `DESIGN.md`, không ghi đè `:root`, không mã màu cứng trong CSS của app.

**Nguyên tắc:** một trang học phải có *một* điểm nhìn chính; thứ bấm được phải trông bấm được; màu mang nghĩa (level, trạng thái), không trang trí.

| Hạng mục | Hiện tại | Đề xuất |
| --- | --- | --- |
| Nền trang | Xám `#f1f1f1` | Giấy lạnh rất nhạt ngả xanh (khoảng `#f5f7fc`), thẻ trắng |
| Mực | Đen `#000` | Navy đậm (khoảng `#14203b`) cho chữ chính; xám-xanh cho chữ phụ, đạt AA |
| Accent | Cobalt + xanh neutral lẫn lộn | Chỉ cobalt `#2447d8`; chữ trên accent luôn trắng |
| Màu thứ hai | Gần như không có | Amber tín hiệu (đã có trong theme) dành riêng cho "điều vừa thay đổi" và chặng hiện tại |
| Màu level | Sáu huy hiệu giống nhau | Sáu sắc từ bảng `--color-background-*` của Astryx (teal, blue, purple, pink, orange, green) cho L0–L5; luôn kèm nhãn chữ "L0…L5" |
| Body | 14 px | 16 px, line-height 1,6; chữ phụ 14 px; chú thích tối thiểu 13 px |
| Tiêu đề | H1 35 px / 600 | Thang display: H1 mobile 32, desktop 48–56 px, weight 700, tracking âm nhẹ; H2 24–28; H3 18–20 |
| Độ nổi | Không bóng | Hai mức: khối thông tin phẳng viền mảnh; thẻ bấm được có `--shadow-low`, hover nâng `--shadow-med` |
| Bo góc | Lẫn 6/10/12 px | Thẻ `--radius-container`, điều khiển `--radius-element`, sơ đồ SVG dùng cùng bán kính |
| Nút | 32–36 px, ba kiểu lẫn | Mặc định `md` (40 px desktop, 44 px mobile); mỗi khối tối đa một nút chính |
| Sơ đồ | Nét đen, góc vuông | Một bộ quy tắc SVG chung: nét 2 px màu mực, bo 6 px, nền token, nhãn có nền che nét |
| Chuyển động | Gần như không | 150–200 ms cho hover/nhấn/mở; chuyển chặng trượt nhẹ; tất cả tắt theo `prefers-reduced-motion` |

Các giá trị màu ở trên là điểm xuất phát; giá trị cuối chốt sau khi kiểm tương phản trong theme editor (Giai đoạn 1).

Giữ nguyên các phần tử gốc có chủ đích đã ghi trong `DESIGN.md` (thanh điều hướng dưới, `details/summary`, nút đáp án `aria-pressed`, bảng trước–sau). Riêng `select` trong lab chỉ đổi kiểu hiển thị bằng CSS, không đổi phần tử.

## 4. Kế hoạch theo giai đoạn

Mỗi giai đoạn là một PR riêng vào `master`, có báo cáo trong `docs/delivery/`. Giai đoạn sau chỉ bắt đầu khi giai đoạn trước qua CI.

### Giai đoạn 0 — Sửa lỗi, chốt nền (ước lượng 1–2 ngày)

Mục tiêu: nhánh Astryx hiện tại đủ sạch để merge; không đổi hướng thị giác.

| Task | Việc | File chính | Nghiệm thu |
| --- | --- | --- | --- |
| UP-0.1 | Chụp bổ sung các màn chưa khảo sát (level, ba bàn chơi, bài ôn, 320 px, Firefox/WebKit); ghi lỗi mới vào mục 2 | — | Có bộ ảnh nền để so sánh sau này |
| UP-0.2 | Sửa B1: chữ trắng trên mọi nút accent dạng liên kết | `styles/base.css`, `ui/primitives.tsx` | Mọi nút nền accent đạt ≥ 4,5:1; thêm kiểm tra E2E đo màu chữ của một nút liên kết |
| UP-0.3 | Sửa B2: bỏ `#0074e2` khỏi theme (token, viền hover/selected) | `apps/web/themes/lab/` qua theme editor | Không còn `0074e2` trong `src/themes/lab/` |
| UP-0.4 | Sửa B3: tìm nguyên nhân giãn dòng trong đoạn mở đầu lab | `styles/mechanisms.css` | Đoạn văn trong lab có line-height đều; nút/điều khiển vẫn ≥ 44 px trên mobile |
| UP-0.5 | Sửa B4: nhãn sơ đồ Game không đè nét | `features/games/GameScene.tsx`, `mechanisms.css` | Ảnh 390/1280 của ba sơ đồ không còn chữ đè |
| UP-0.6 | Sửa B5: khối không nền bỏ padding ngang hoặc có nền thật | `styles/base.css` | Mọi khối cùng mép trái ở 390 và 1280 px |
| UP-0.7 | Sửa B6: tiêu đề tab theo route ("Tên bài · System Design Lab") | `app/App.tsx` hoặc hook dùng chung | E2E kiểm `document.title` ở 4 route |
| UP-0.8 | Sửa B7: `theme-color` khớp accent | `apps/web/index.html` | — |
| UP-0.9 | Mở PR cho `claude/astryx-redesign` sau khi CI đạt | — | PR có ảnh trước/sau; chỉ merge khi người dùng duyệt |

### Giai đoạn 1 — Nền thị giác (2–3 ngày)

Mục tiêu: đổi theme và thang chữ một lần, toàn site hưởng theo. Đây là bước làm hết "phèn" nhiều nhất trên mỗi dòng code.

| Task | Việc | Nghiệm thu |
| --- | --- | --- |
| UP-1.1 | Theme `lab` v2 qua theme editor: nền giấy, mực navy, chữ phụ, bỏ sắc neutral thừa | Mọi cặp chữ/nền đạt AA; ghi bảng tương phản vào báo cáo |
| UP-1.2 | Thang chữ: body 16 px, thang H1–H3, weight 700 cho tiêu đề | 320 px không vỡ dòng xấu ở tiêu đề dài nhất trong catalog; không cuộn ngang |
| UP-1.3 | Hai mức độ nổi + trạng thái hover/nhấn/focus thống nhất cho thẻ bấm được | Focus ring thấy rõ trên nền giấy và nền trắng |
| UP-1.4 | Màu theo level L0–L5 (token, một nguồn định nghĩa) dùng ở huy hiệu, thẻ tiến độ, tiêu đề khu | Level luôn có nhãn chữ; không dựa vào màu đơn thuần |
| UP-1.5 | Chuẩn hóa nút: cỡ mặc định, tối đa một nút chính mỗi khối; kiểu CSS cho `select` | Điều khiển ≥ 44 px ở mobile |
| UP-1.6 | Giảm tông banner thông tin: nền nhạt + vạch trái, chỉ dùng nền đậm cho cảnh báo thật | Banner không còn là khối nổi nhất trang |
| UP-1.7 | Logo mới (SVG, thay tòa nhà pixel), favicon, `apple-touch-icon`, `manifest.webmanifest`, thẻ Open Graph | Icon tự host; CSP không đổi; offline pack vẫn tạo được |
| UP-1.8 | Cập nhật `DESIGN.md`: thêm mục hướng "Sổ thí nghiệm", chuyển mô tả neutral sang lịch sử | Không còn hai hướng mâu thuẫn |

### Giai đoạn 2 — Làm lại từng trang (5–7 ngày)

| Task | Trang | Việc | Nghiệm thu |
| --- | --- | --- | --- |
| UP-2.1 | Trang đầu | Hero mới: tiêu đề display, một nút chính, sơ đồ hành trình yêu cầu vẽ lại (trình duyệt → máy chủ → dữ liệu → kết quả có hình riêng từng trạm, gói tin đi theo thao tác) | Người mới biết việc đầu tiên cần làm trong màn đầu ở 390 px |
| UP-2.2 | Trang đầu | Khối "Học tiếp" khi có tiến độ (bài đang dở + chặng), thay nút "Bắt đầu bài đầu tiên" (S4) | E2E: có tiến độ lưu thì thấy đúng bài đang dở |
| UP-2.3 | Trang đầu | Thẻ bài nhập môn đồng nhất chiều cao; mobile cuộn ngang có snap hoặc danh sách gọn; lưới desktop 3 cột không mồ côi (V6, V7, S2) | Trang đầu mobile ≤ khoảng 3.000 px |
| UP-2.4 | Khám phá | Thay lưới 85 thẻ bằng danh sách gọn nhóm theo level/module (một dòng: mã, tên, phút, trạng thái); thẻ đầy đủ chỉ cho kết quả nổi bật (S1) | Mobile ≤ khoảng 6.000 px khi mở mặc định; tìm kiếm/lọc và các E2E hiện có vẫn đạt |
| UP-2.5 | Khám phá | Accordion khu: hàng ≥ 48 px, màu level, đếm bài và tiến độ ngay trên hàng (S3) | Bàn phím và trình đọc màn hình giữ hành vi `details/summary` |
| UP-2.6 | Bài học | Thanh chặng một hình dạng với ba trạng thái (xong/hiện tại/khóa); phần đầu bài gọn; nút tiếp theo dính đáy trên mobile | Giữ `aria-current`, focus tới tiêu đề chặng |
| UP-2.7 | Lab | Bố cục chung cho mọi lab: điều khiển → trạng thái hiện tại → bảng trước–sau → trace; bộ quy tắc SVG chung (V8) | Số liệu vẫn lấy từ engine; unit test engine không đổi |
| UP-2.8 | Game | Vẽ lại ba sơ đồ theo quy tắc SVG chung; lưới 3 cột đầy; bỏ khối đỏ đặc | Replay và kết quả vẫn từ engine thật |
| UP-2.9 | Tiến độ | Vòng/thanh tổng tiến độ làm điểm nhìn chính, sáu level trong lưới 3×2 có màu level; Offline và Nhập/Xuất thu vào phần "Dữ liệu và thiết bị" (S5) | Nhãn và hành vi import/export/offline giữ nguyên; E2E hiện có đạt |
| UP-2.10 | Chung | Chân trang có liên kết (lộ trình, báo lỗi, nguồn/giấy phép); trang 404 có lối về; trạng thái rỗng và lỗi cùng một mẫu | — |

### Giai đoạn 3 — Chuyển động và hoàn thiện (2 ngày)

| Task | Việc | Nghiệm thu |
| --- | --- | --- |
| UP-3.1 | Transition cho hover/nhấn/mở accordion/chuyển chặng; phản hồi khi chọn đáp án | Tắt hoàn toàn với `prefers-reduced-motion`; không chuyển động tự chạy |
| UP-3.2 | Bỏ Lottie ba chấm (V9); nếu cần tín hiệu thì dùng SVG/CSS | Không còn tải `dotlottie-player.wasm` |
| UP-3.3 | Skeleton khi tải catalog/tiến độ thay vì nhảy bố cục | Không có layout shift nhìn thấy khi mở bài |

### Giai đoạn 4 — Hiệu năng (2–3 ngày)

| Task | Việc | Nghiệm thu |
| --- | --- | --- |
| UP-4.1 | Tách chunk theo route (`React.lazy`) cho bài học, lab, Game, bài ôn | Chunk đầu vào giảm rõ; ghi số trước/sau |
| UP-4.2 | Tách `catalog.json`: chỉ mục nhẹ cho trang đầu/Khám phá, nội dung bài tải theo yêu cầu | JS trang đầu ≤ khoảng 300 KB gzip (mục tiêu, chốt lại sau khi đo); offline pack vẫn gồm đủ bài và đúng SHA-256 |
| UP-4.3 | Gỡ `@lottiefiles/dotlottie-web` nếu UP-3.2 xong; rà CSS theme không dùng | CSP `vercel.json` không cần nới |
| UP-4.4 | Đo Lighthouse mobile trước/sau trên bản preview | Ghi số thật vào báo cáo, không ước lượng |

UP-4.2 đổi cách nạp catalog và offline pack: cần ADR mới trong `docs/decisions/` trước khi code.

### Giai đoạn 5 — Tùy chọn, quyết sau

- Chế độ tối (T6): theme đã có token; cần rà mọi SVG cơ chế và chụp lại toàn bộ.
- Lượt `student_tester` first-use trên bản mới (chỉ khi người dùng gọi, theo `AGENTS.md`).
- Pilot học sinh thật: kết quả AI không thay thế.

## 5. Ngoài phạm vi

- Không đổi nội dung bài, đáp án, ID, engine, schema, `compatibility-v1.json` hay định dạng bản lưu.
- Không thay Astryx, không nâng React/Vite/Astryx, không thêm font hay CDN ngoài.
- Không thêm tài khoản, backend, đồng bộ.
- Không deploy nhánh tính năng; production chỉ cập nhật khi merge `master`.

## 6. Điều kiện hoàn tất chung cho mỗi PR

1. `pnpm content:check`, `lint`, `format:check`, `test:unit`, `build`, `test:e2e` đạt trên Node 24 (xử lý T5 trước: cài Node 24 và bật pnpm 11.25.0).
2. Ảnh trước/sau ở 320, 390 và 1280 px với nội dung thật cho mọi trang bị đổi.
3. Không cuộn ngang ở 320 px; điều khiển ≥ 44 px trên mobile; focus thấy được; reduced-motion được tôn trọng.
4. Dữ liệu đã lưu của người dùng cũ vẫn đọc được.
5. Báo cáo `docs/delivery/UP_0x_*.md` ghi rõ điều đã kiểm và điều chưa kiểm; cập nhật `IMPLEMENTATION_STATUS.md`.

## 7. Rủi ro

| Rủi ro | Giảm thiểu |
| --- | --- |
| Đổi cỡ chữ 14 → 16 px làm vỡ bố cục lab ở 320 px | Làm UP-1.2 riêng một commit, chạy `responsive-matrix.spec.ts` ngay |
| E2E dựa vào cấu trúc DOM của lưới 85 thẻ ở Khám phá | Đọc `tests/e2e` trước UP-2.4; giữ tên/role truy cập, chỉ đổi trình bày |
| Tách catalog làm hỏng offline pack hoặc CSP | ADR trước, kiểm offline trong E2E, giữ `connect-src 'self' blob:` |
| Đây là lần đổi hướng thị giác thứ năm (bàn thí nghiệm → xưởng → trạm điều phối → Pixel City → Astryx) | Giai đoạn 1 chỉ đổi token và thang chữ; chốt hướng bằng ảnh trang đầu + một bài học trước khi làm Giai đoạn 2 |

## 8. Thứ tự đề xuất

Giai đoạn 0 → 1 → dừng để người dùng duyệt ảnh trang đầu và một bài học → 2 → 3 → 4. Tổng ước lượng 12–17 ngày làm việc cho một người; đây là ước lượng, cập nhật lại sau Giai đoạn 1.
