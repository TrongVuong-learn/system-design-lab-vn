# UP-01 — Giao diện "Vở ô li"

Ngày: 16/11/2026. Nhánh: `claude/astryx-redesign` (dựng lại trên `master` sau PR #29). Trạng thái: **đã kiểm cục bộ; phát hành production khi PR merge vào `master` (Vercel Git integration tự deploy).** Trạng thái READY và smoke sau deploy ghi ở mục cuối khi có.

Yêu cầu người dùng: bản hiện tại nhìn "phèn"; cần một phiên bản lột xác hoàn toàn, học sinh cấp 3 hiểu được. Chẩn đoán ban đầu ở [docs/specs/UI_UPGRADE_2026-11-15.md](../specs/UI_UPGRADE_2026-11-15.md); hướng thiết kế ở mục "Vở ô li" của [DESIGN.md](../../DESIGN.md).

## Phạm vi

Đổi: nhận diện (màu, chữ, logo), khung trang, trang đầu, Khám phá, trang level, Tiến độ, danh sách Game, phần khung của màn học/bàn chơi/bài ôn, màu sơ đồ game.

Không đổi: nội dung bài, đáp án, ID, engine, schema, `compatibility-v1.json`, định dạng bản lưu, câu chữ mà test kiểm.

## Đã làm

- `styles/tokens.css` mới: bảng màu giấy/mực tím/lề đỏ/dạ quang, sáu màu level, thang chữ (body 16 px, tiêu đề 800), bo góc, bóng. `styles/base.css` viết lại phần khung và các trang; phần lab/bảng/game giữ cấu trúc, đổi kiểu.
- `ui/Button.tsx`: bọc Button của Astryx, gắn class theo variant; 30 file đổi import. Nút có cạnh dày và lún khi nhấn.
- Khung trang: header riêng (logo mới, điều hướng dạng viên, nhãn bản thử nghiệm), chân trang nền mực có liên kết, thanh dưới mobile. Tiêu đề tab đổi theo trang.
- Trang đầu: trang vở kẻ ô có lề đỏ; hành trình yêu cầu vẽ lại với bốn hình trạm khác nhau; thẻ "Bạn đang học dở" khi có tiến độ; sáu bài nhập môn (dải vuốt ngang trên điện thoại); dải tím cho thí nghiệm cache; sáu ô level có màu và số bài; dải Game.
- Khám phá và trang level: hàng gọn có hình thu nhỏ cơ chế, nhóm theo level; accordion sáu khu có màu level và số bài.
- Tiến độ: vòng tiến độ, sáu ô level 3×2, khối ôn tổng hợp, offline và nhập/xuất giữ nguyên nhãn và hành vi.
- Màn học: thanh chặng một hình dạng ba trạng thái (xong: mực tím; hiện tại: dạ quang; chưa mở: nét đứt), đáp án có cạnh nhấn, khối "Điều vừa thấy có nghĩa gì?" nền dạ quang nhạt.
- Game: ba bìa có màu riêng, sơ đồ bỏ mã màu cứng, nhãn có viền nền nên đường nối không cắt chữ.
- Gỡ Lottie (`LottieSignal.tsx`, gói `@lottiefiles/dotlottie-web`): bundle bớt file wasm 1,24 MB.

## Lỗi trong spec đã sửa

| ID | Kết quả |
| --- | --- |
| B1 chữ đen trên nút accent | Sửa: nút đặt màu chữ tường minh |
| B2 hai màu xanh | Sửa: token info/hover trỏ về mực tím |
| B3 giãn dòng trong lab | Sửa: nguyên nhân là `min-height: 44px` áp lên nút thuật ngữ inline |
| B4 chữ đè nét trong sơ đồ game | Giảm: nhãn có viền nền; nhãn "Còn chờ" dời sang trái |
| B5 khối lệch lề | Sửa: các khối đó viết lại |
| B6 tiêu đề tab | Sửa |
| B7 theme-color, logo pixel | Sửa |
| S1 Khám phá mobile 31.370 px | Giảm còn khoảng 14.100 px (hàng gọn có hình cơ chế); chưa đạt mục tiêu 6.000 px vì test yêu cầu mỗi bài hiện xem trước cơ chế |
| T3 Lottie wasm | Sửa |

## Kiểm chứng

Môi trường: Node 22.20 (repo khóa Node 24), pnpm 11.25.0 qua corepack, bản build chạy bằng preview ở cổng 4173.

- `pnpm lint`, `pnpm format:check`, `pnpm typecheck` (trong `pnpm build`): đạt.
- `pnpm test:unit`: 110/110. `pnpm content:check`: đạt.
- `pnpm test:e2e` đủ năm project: 603 đạt, 1 bỏ qua (có sẵn), 0 lỗi. Lượt đầu lộ tràn ngang 3–14 px ở 320 px trên Firefox/WebKit (nhãn bản thử nghiệm, ô tìm kiếm); đã sửa rồi chạy lại toàn bộ.
- Thay đổi test: chỉ đổi tên một test trong `games.spec.ts` (bỏ chữ "Lottie"). Không đổi điều kiện kiểm nào.
- Ảnh review 390 px và 1280 px: trang đầu, Khám phá, level L0, bài học (chặng đọc, dự đoán, thí nghiệm), Game, bàn chơi, Tiến độ; thêm trang đầu ở 320 px.

## Chưa làm / giới hạn

- Sau lượt E2E đầy đủ có một chỉnh CSS nhỏ cho nhãn bản thử nghiệm ở màn ≤ 380 px; sau đó chỉ chạy lại lint/format/build và 42 test (learning, site-audit, pixel-city, games trên mobile-chromium và desktop-webkit, đều đạt), chưa chạy lại toàn bộ.
- Chưa chạy `pnpm audit` (có gỡ một dependency, không thêm gói nào).
- Chưa chạy trên Node 24, chưa thử thiết bị thật, chưa kiểm trình đọc màn hình, chưa đo tương phản bằng công cụ (màu chọn theo tính toán tay).
- Chưa có pilot học sinh hay review của người; "học sinh cấp 3 hiểu được" là mục tiêu thiết kế, chưa được chứng minh.
- Bundle JS chính vẫn khoảng 2 MB (catalog 1,2 MB); tách chunk là Giai đoạn 4 của spec, cần ADR.
- Chế độ tối chưa làm. Sơ đồ trong từng lab vẫn giữ hình cũ, chỉ theo token màu mới.
- Bài ôn tổng hợp và các lab ngoài `cpu-io` chưa được soi ảnh từng màn; chỉ có E2E bảo đảm hành vi và không tràn ngang.
