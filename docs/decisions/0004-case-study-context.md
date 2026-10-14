# ADR 0004 — Tình huống áp dụng và tương thích tiến độ

Ngày: 14/10/2026. Trạng thái: áp dụng cho CASE-01–03, giai đoạn A của EDU-09.

## Quyết định

Bổ sung `caseStudy` schemaVersion 1 vào lesson schema hiện hành, giữ lesson version 1, editorial schema 1 và progress JSON 1. Trường optional ở parser để đọc draft/fixture cũ, nhưng catalog chặn beta thiếu case. Nội dung chỉ bổ sung context, yêu cầu, hướng thử, đánh đổi và giới hạn cho `challenge` cũ; không đổi assessment, ID, module hoặc luật hoàn thành. Fixture legacy-assessments-v1 kiểm toàn bộ prediction/challenge/version/module của 12 bài.

Case có ID/revision/familyId, provenance, activityRef whitelist và assessmentRef cố định `challenge`. `documented-case` yêu cầu source IDs và adaptation note; source phải nằm trong editorial và lesson. Tình huống tự viết vẫn dựa trên claim/source của bài; UI ghi rõ giả định. Không chứa mã thực thi hoặc tự áp preset lên lab.

Editorial có `caseReview` tham chiếu case ID/revision, người/ngày/loại review/evidence. Beta phải có review đúng revision và beta-checked; sửa case làm review cũ không đủ qua gate. Source review nội bộ bằng agent không thay review chuyên gia hay pilot. Gate metadata kiểm cấu trúc; tính đúng của evidence vẫn cần người rà.

Renderer tái sử dụng bốn chặng, TermNote và SaveStatus. Context trước câu hỏi, trade-off sau khi chọn. Nút về thí nghiệm chỉ đổi stage sang 2, giữ lab/actions/đáp án/completed. Các assessment mới, evidence mở, activity preset và capstone có contract/attempt-version/migration riêng theo ENG-03; hoàn thành cũ không tự công nhận năng lực mới.

## Giới hạn

Đợt này chỉ nâng 12 bài beta, không đóng 36 module, không thêm engine hay track/capstone. Bài HTTP/design chứa phần suy luận chưa mô phỏng, được ghi rõ. Không đổi database hoặc runtime/dependency.
