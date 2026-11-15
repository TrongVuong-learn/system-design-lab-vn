# ASTRYX — Chuyển toàn bộ UI sang thư viện Astryx

Ngày: 15/11/2026. Nhánh: `claude/astryx-redesign` (từ `master`). Yêu cầu người dùng: redesign tất cả các trang bằng Astryx, lấy theo cách dùng trong dự án FamilyGuys-World; chọn phương án chuyển toàn bộ ngay thay vì thử một trang.

## Phạm vi và điều kiện hoàn tất

Khung app, trang đầu, Khám phá, level/module, Tiến độ/nhập/xuất/offline, màn học (câu chuyện, dự đoán, chương cơ chế, lab, áp dụng, bản thiết kế), bài ôn và khu Game dùng component và token Astryx. Giữ nguyên 6 level/36 module/7 nhánh/85 bài, ID, đáp án, engine, schema, bản lưu và hợp đồng `compatibility-v1.json`. Điều kiện hoàn tất: không cuộn ngang ở 320 px, mọi E2E hiện có đạt trên các project Playwright, lint/format/typecheck/unit đạt.

## Quyết định

- Thêm `@astryxdesign/core`, `@astryxdesign/theme-neutral` 0.7.16, `@stylexjs/stylex` 0.19.0 (peer) và `@astryxdesign/cli` 0.7.16 (dev), ghim phiên bản chính xác. Script postinstall của Astryx chỉ in gợi ý chạy `astryx init`, được đặt `false` trong `pnpm-workspace.yaml`. Ghi nhận trong `docs/design/tooling-lock.json`.
- Theme `lab` tạo bằng theme editor từ neutral (accent cobalt, warning, Be Vietnam Pro), cố định chế độ sáng. File sinh ra (`apps/web/themes/`, `apps/web/src/themes/`, `src/astryx-themes.js`) được loại khỏi ESLint/Prettier; ảnh preview của editor bị git ignore.
- Phần tử gốc giữ có chủ đích (thanh điều hướng dưới, `select` lộ trình, `details/summary`, nút đáp án `aria-pressed`, bảng trước–sau, sơ đồ SVG cơ chế); chỉ dùng token, lý do ghi trong `DESIGN.md`. Hero pixel được thay bằng sơ đồ bốn trạm SVG; `PixelCity.tsx` và ba file CSS cũ bị xóa.
- CSS còn lại: `styles/base.css` (khung, trang, phần tử gốc) và `styles/mechanisms.css` (rule sơ đồ cơ chế chuyển từ CSS cũ, mọi mã màu đổi sang token). Không còn mã màu cứng.

## Thay đổi test và lý do

- Mỗi `Button` của Astryx luôn render một vùng `role="status"` rỗng để báo "Loading" (không tắt được bằng prop). Truy vấn `getByRole('status')` trong E2E được giới hạn vào thông báo có nội dung bằng `.filter({ hasText: /\S/ })`; nội dung và thông điệp được kiểm giữ nguyên.
- Không đổi câu chữ, đáp án hoặc điều kiện kiểm của bất kỳ test nào khác.

## Lỗi tìm thấy khi kiểm và đã sửa

- Ô tìm kiếm dùng `type="search"` làm đổi vai trò truy cập thành searchbox: đổi lại ô văn bản.
- Canvas Lottie mất kích thước cố định làm trang Game rộng 547 px trên điện thoại (trình duyệt thu nhỏ cả trang): đặt lại kích thước 120×60 và ẩn ở đầu trang Game dưới 560 px.
- Chiều cao sơ đồ game đổi theo pha hoạt ảnh làm nút "Chơi lại từ đầu" xê dịch: giữ chỗ cho tiêu đề cảnh, ghi chú pha và vùng phản hồi.
- Thanh điều hướng dưới che nút sau khi cuộn: thêm `scroll-padding-bottom` trên mobile.
- Lab DNS tràn 12 px ở 320 px trên Firefox/WebKit do cột grid co theo chuỗi dài: panel lab/game dùng một cột `minmax(0, 1fr)` và cho phép ngắt dòng.

## Kiểm chứng

Môi trường cục bộ: Node 22.20 (repo khóa Node 24), pnpm 11.25.0 qua corepack, Playwright với preview build tại cổng 4173.

- Typecheck, ESLint, Prettier check: đạt. Unit: 110/110 (30 files).
- E2E: xem mục kết quả cuối bên dưới.
- Ảnh review ở 390 px và 1280 px cho trang đầu, Khám phá, level, màn học/lab CPU-I/O, Tiến độ, Game, bàn chơi cache và bài ôn.

## Chưa làm / giới hạn

- Bundle JS chính khoảng 2 MB, chủ yếu do `catalog.json` (1,3 MB) vốn có từ trước; chưa tách chunk.
- Chưa chạy trên Node 24 đúng bản khóa; chưa có pilot học sinh hay review thiết kế của người.
- Một số vùng (sơ đồ cơ chế, bảng, `details`) vẫn là phần tử gốc thay vì component Astryx, theo lý do ở trên.
