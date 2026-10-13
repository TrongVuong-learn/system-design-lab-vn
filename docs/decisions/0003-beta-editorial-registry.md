# ADR 0003 — Registry học liệu cho các bài beta

Ngày: 2026-10-13. Trạng thái: áp dụng cho EDU-04, phần đầu ENG-03.

## Bối cảnh

Catalog có sáu bài thử nghiệm, chưa có máy kiểm tra module/level, prerequisite hoặc hồ sơ nguồn/review. Thêm bài theo Primer cần biết bài nào được phép hiển thị và không đánh đồng bài nhập môn với module hoàn chỉnh.

## Quyết định

- Giữ lesson schema/version 1 và progress JSON version 1. Thêm bốn giá trị `kind` trong whitelist renderer; học liệu không chứa mã thực thi. Engine là hàm thuần, version 1.1.0.
- Tách metadata biên tập khỏi nội dung đọc: `content/editorial.json` schema 1 chứa source ID/URL/revision/attribution, năng lực/module/depth/planRefs, lesson prerequisite và hồ sơ review.
- `scripts/content.ts` đọc các file JSON trong `content/lessons/vi`, parse schema rồi kiểm tra quan hệ qua `validateCatalog`. Chặn ID trùng, module/level lệch, năng lực sai module, claim thiếu source trong bài, prerequisite không tồn tại/chưa khả dụng/có chu trình, beta chưa được đánh dấu kiểm tra.
- Trạng thái hiện thực ở đợt này chỉ có `draft` và `beta`; draft không vào catalog người học. `beta-checked` là bước kiểm tra nội bộ, có loại reviewer `agent` hoặc `human`; không tương đương duyệt chuyên gia hay pilot. UI giữ nhãn thử nghiệm và nói rõ giới hạn review.
- Danh mục 36 module vẫn từ CURRICULUM_MAP. Coverage chỉ liệt kê bài beta và số năng lực đã đăng ký, luôn `complete: false` cho đợt này. Không suy ra phần trăm thành thạo từ số bài.
- Prerequisite là gợi ý điều nên biết và liên kết bài, chưa khóa điều hướng. Không tự công nhận năng lực vì người học mở trang.

## Giới hạn và phần tiếp theo

Đây chưa phải toàn bộ ENG-03/B0: còn registry cho mọi năng lực dự kiến, trạng thái reviewed/published chính thức, chuyên gia/pilot, rubric nhiều mức, coverage theo track và migration attempt/engine/lesson version. Một chuỗi trong trường review không chứng minh đã review; evidence phải trỏ tới báo cáo kiểm chứng và người chịu trách nhiệm. Không dùng metadata này để tuyên bố nội dung chính xác tuyệt đối.

Không thay storage hoặc đáp án sáu bài cũ trong EDU-04. Khi đổi cơ chế/đáp án của bài đã có, phải thiết kế migration bằng chứng học cũ trước khi phát hành.
