# ADR 0005 — Chặn thay đổi ngầm cách hiểu tiến độ đã phát hành

Ngày: 17/10/2026. Trạng thái: áp dụng phần bảo vệ compatibility của ENG-03; không đóng toàn ENG-03.

Tiến độ JSON v1 lưu answer index và checkpoint theo lesson ID. Editorial revision là lần biên tập, độc lập lesson version; không được so hai số này như cùng một phiên bản. Đổi đáp án/cơ chế có thể làm dữ liệu cũ bị hiểu sai.

`content/compatibility-v1.json` khóa ID, version, module, activity kind và toàn bộ prediction/challenge của 20 bài đã phát hành. Pipeline chặn bài beta thiếu baseline, xóa/hạ draft ID đã phát hành hoặc thay các trường trên. Thêm bài mới phải thêm record tương ứng sau review. Sửa title/story/giải thích ngoài assessment vẫn được phép qua review nội dung bình thường.

Không tự sinh lại baseline để làm test xanh. Khi cần đổi assessment/cơ chế của ID cũ, phải có ADR migration, fixtures progress cũ, kiểm tra import/export/resume và version engine/checkpoint phù hợp trước thay baseline. Cơ chế hiện tại cố ý chặn cả sửa câu chữ assessment; reviewer có thể duyệt ngoại lệ câu chữ nếu chứng minh không đổi ý nghĩa/index và ghi rõ PR. Baseline không phải chữ ký chống tác giả sửa hoặc chứng minh engine không đổi; engine vẫn cần fixture/invariant/review.

Báo cáo `CONTENT_COVERAGE.md` sinh từ catalog/editorial, CI kiểm drift. Chỉ đếm năng lực đã đăng ký theo depth; chưa có registry đầy đủ mọi năng lực bắt buộc, nên không tính phần trăm hoàn thành hay tự đóng module. Không đổi format tiến độ/storage, không nâng bằng chứng v1 thành attempt có version. Phần migration/attempt/rubric sâu và lifecycle reviewed/published vẫn mở trong ENG-03.

## Ngoại lệ editorial QA-09 — 25/10/2026

Review nguồn của tám integrated cases xác nhận citation gắn quá rộng. Áp dụng ngoại lệ biên tập đã nêu ở trên: chỉ vá 70 mảng `sourceIds` của chapters/practice (48 mảng của tám case và 22 mảng bổ sung nguồn cho sáu nhánh chuyên sâu cùng token bucket) trong baseline tương ứng với mapping được parent review; không sinh lại baseline, không nới validator. Đối chiếu toàn 85 contract với release `68f7de6` chứng minh mọi trường khác (ID, version, text, options, answer, explanations, designTask và thứ tự) giống hệt. Script/evidence ở `docs/research/knowledge-reviewer/evidence/qa09-2026-10-25/parent/check-contract.py` và `contract-check.json`; rationale/mapping ở `source-mapping.json`. Vì không đổi cách diễn giải answer/checkpoint, không cần migration tiến độ. Mọi thay đổi assessment/cơ chế sau này vẫn bị chặn như trước; ngoại lệ này không cho phép tự tái tạo baseline để vượt kiểm tra.
