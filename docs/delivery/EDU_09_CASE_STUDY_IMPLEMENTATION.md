# EDU-09 — Hiện thực CASE-01–03 cho 12 bài beta

Ngày: 14/10/2026. Phạm vi: giai đoạn A trong [kế hoạch](EDU_09_CASE_STUDY_PLAN.md), nâng chặng Áp dụng của 12 bài hiện có. CASE-04–10, case module/level/track và gate hoàn chỉnh vẫn còn mở.

## Thay đổi và tương thích

- Thêm context, yêu cầu, gợi ý thử, lợi ích/đánh đổi và giới hạn cho mọi bài. Mỗi case do tác giả giả định, không mô tả một kiến trúc trường/doanh nghiệp đã đo thực tế.
- Giữ nguyên lesson ID/module/version, prediction/challenge/options/answer/explanation, stage 0–3, progress v1 và luật hoàn thành. Fixture `packages/content-schema/src/fixtures/legacy-assessments-v1.json` lưu nguyên assessment baseline trước sửa; unit test đối chiếu đủ 12 bài.
- ADR [0004](../decisions/0004-case-study-context.md) quy định case schema 1 và review theo revision. Beta thiếu case, sai family/activity, case ID trùng, nguồn chuyển thể không hợp lệ hoặc review cũ đều bị chặn. Draft có thể đọc chưa có case; content không chứa mã thực thi.
- CASE-02 thử ba mẫu cache/network/queue rồi CASE-03 mở rộng đủ 12 bài. Các phần suy luận không được engine mô phỏng (HTTP freshness/design) được ghi rõ. Metrics/capacity phân biệt số liệu câu hỏi với cấu hình lab; không tự áp preset.
- Context hiển thị trước lựa chọn; đánh đổi sau khi trả lời. Nút “Thử lại trong thí nghiệm” chỉ đổi stage, giữ lab/đáp án/actions/completed; TermNote và SaveStatus hiện hành được tái sử dụng.

## Review nội dung có phạm vi

Reviewer: Codex (agent), 14/10/2026; mức beta nội bộ. Đối chiếu từng context với assessment baseline, thuật ngữ, engine/limit và claim/source đã có trong `content/editorial.json`. Các số liệu mới về tình huống là giả định, không benchmark. Không thêm bảo đảm kỹ thuật hoặc claim kiến trúc doanh nghiệp; claims và nguồn chuyên môn của bài giữ nguyên. Case review liên kết ID/revision và báo cáo này; thay revision khiến review cũ không qua beta gate.

Kiểm riêng: request cộng chặng tuần tự; cache một phút so năm phút với giả định nguồn; metrics throughput không thay latency; DNS expiry và lần tra; UDP không tự giao đủ; capacity tách storage/transfer; HTTP status không thay freshness; network chỉ giảm phần payload; balance downstream bottleneck; queue cân tốc độ không rút backlog; replica đọc sau ghi khi nguồn truy cập được; design kiểm đủ yêu cầu và giới hạn lab. Review này không thay chuyên gia độc lập hoặc pilot thật.

## Bằng chứng kiểm tra

- `pnpm content:check`: đạt, 36 module và 12 bài beta; không tăng module complete.
- `pnpm typecheck`, `pnpm lint`, `pnpm build`: đạt. Build dùng dependency/runtime hiện hành; cảnh báo annotation Zod có từ baseline, exit 0.
- `pnpm test:unit`: **26/26** đạt. Gồm fixture tương thích toàn bộ assessment, gate case/review/provenance và các engine/core hiện hữu.
- `pnpm test:e2e`: **99 đạt, một bỏ qua** (hover chuột trên project touch, đã có test tap riêng). 100 test trên Chromium mobile/desktop, Firefox, WebKit và responsive.
- E2E mới: ba mẫu chọn/feedback → lưu hoàn thành → về lab giữ nguyên trạng thái → trở lại/reload vẫn hoàn thành. Checkpoint v1 hoàn thành được nạp để mở đủ 12 case và giữ đúng đáp án cũ.
- Responsive matrix: 320/360/390/430/768/1024/1440 px, 12 bài và bốn chặng; lỗi lưu, reduced motion và focus theo suite hiện hành.
- Sáu screenshot context/feedback: cache 390 px, network 1280 px, queue 320 px tại `.cache/case-studies/`. Đã review chữ tiếng Việt, thứ tự context/yêu cầu/lựa chọn, feedback, chiều rộng và thao tác. Script visual không ghi nhận pageerror hoặc overflow. Chụp toàn trang từ scroll top để tránh artefact phần tử fixed ở ảnh dài.
- JavaScript gzip **148,24 kB**, CSS **7,29 kB**; dưới budget JS hiện hành. Đây là kích thước build, không phải số đo Core Web Vitals thực.
- Checksum build đã kiểm được lưu ở `.cache/case-studies/tested-artifact.json`; phải đối chiếu trước packaging. Các file cache/ảnh không nằm trong source bundle/commit.

## Trạng thái và phần tiếp

CASE-01–03 đã hiện thực và kiểm tra nội bộ cho beta; chưa tuyên bố module/level/track hoàn chỉnh, độ dễ hiểu đã được học sinh xác nhận hoặc gate web/app đạt. Chưa chạy tester Minh hoặc pilot thật trong task này. Chưa kiểm thiết bị iOS/Android thật và screen reader thật; các E2E kiểm emulation/bàn phím/focus, không thay kiểm đó.

Tiếp theo CASE-04 theo EDU-04: bù các bài L0 còn thiếu (OS/concurrency, cấu trúc dữ liệu, IP/port/routing, TLS/session…), mô hình/fixture và review trước capstone L0. Giai đoạn B có assessment/attempt mới cần version/migration và nguồn/reviewer riêng; không nâng cấp trạng thái cũ thành năng lực mới.

Phát hành dùng nguồn đã push và artifact đã kiểm, giữ audience owner-private của site hiện hữu; kết quả deployment sẽ được báo từ công cụ phát hành, không suy thành công từ build.
