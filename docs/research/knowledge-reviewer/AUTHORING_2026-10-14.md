# Thiết kế native profile knowledge_reviewer

Ngày: 2026-10-14. Session tác giả được parent yêu cầu/spawn với gpt-6-astra, reasoning medium; không đổi model của session. Model cấu hình cho những lần chạy profile sau: gpt-6-sol, reasoning medium.

Profile: `/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/.codex/agents/knowledge_reviewer.toml`.

## Kết quả thiết kế

Đã giữ tiêu chuẩn review senior 10+ năm dưới dạng vai trò AI, không nhận kinh nghiệm nghề nghiệp thật hoặc human-reviewed. Giữ độ sâu nhập môn và nguyên tắc không coi giới hạn mô hình đã công bố đúng là lỗi.

Bổ sung các ràng buộc trực tiếp giúp giảm false verification:

- Xác minh checkout/HEAD, dùng absolute path và ghi diff chưa commit ảnh hưởng phạm vi.
- Tách đọc source, thực thi engine và quan sát UI thật. So đơn vị/giả định giữa JSON, controls, feedback, kết quả và case.
- Tách đoạn nguồn trực tiếp hỗ trợ khỏi suy luận reviewer và giả định của tác giả. Không dùng Primer thay nguồn sơ cấp hoặc gán ví dụ số tự đặt thành benchmark có nguồn.
- Lưu input/expected độc lập/actual/cách chạy; trace đọc code phải nhận là suy luận. Kiểm thay TTL/lag/tải và restore/checkpoint.
- Giữ kiểm đáp án, phương án hợp lệ, giả định, lộ đáp án, ý nghĩa case, version/migration.
- Định nghĩa severity theo tác động học tập; bắt buộc report.md + claim-matrix.json, phần chưa kiểm giữ insufficient-evidence/out-of-scope và ghi partial khi bị chặn.

Không sửa app, content, editorial registry, docs, lock, không commit/deploy hoặc spawn thêm. Parent sở hữu cập nhật lock/docs.

## Kiểm chứng

TOML parse thành công bằng Python tomllib hoặc fallback tomli có sẵn; kiểm đúng 5 trường, model/reasoning và các yêu cầu trọng yếu. Chi tiết + SHA-256 ở `validation.json`. Đây là xác nhận cú pháp và cấu hình; không khẳng định native loader đã reload hoặc đã chạy profile qua custom-role selector.

## Bằng chứng kế thừa từ audit đã dừng

Audit kiến thức ban đầu dừng khi parent đổi phạm vi sang tác giả profile. Không có kết luận toàn bộ 13 bài; không tạo nhãn toàn bộ verified.

**KR-01 — P2, cache: case giới hạn ghi sai đơn vị đồng hồ.** Baseline ứng dụng đọc trực tiếp: `4425af078ea484f58aec106698ea39bd49e6218f`.

- `/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/content/lessons/vi/intro.json:212`, field cache.caseStudy.limitations: “Đồng hồ trong lab dùng giây; câu hỏi dùng phút.”
- `/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/apps/web/src/features/lab/Lab.tsx:68`: badge “Phút {state.time} mô phỏng”; line 93: “Qua 1 phút”; line 114: TTL “phút kể từ lần lấy mới”.
- `/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/index.ts:67`: TTL feedback dùng phút; wait tăng một tick và feedback dùng phút. Cache challenge cũng dùng giới hạn một phút và cache năm phút.
- Phản chứng dựa đọc source: 5 ticks mang nghĩa 5 phút = 300 giây theo UI; case nói 5 giây. Đây là đối chiếu source, **chưa chạy browser hoặc trace thực thi** trong session này.
- Tác động: người học có thể quy đổi sai giới hạn độ mới theo hệ số 60. Đề xuất sửa riêng case limitation thành đơn vị phút nhất quán; không đổi engine, challenge hay đáp án.
- Kiểm lại đề xuất: mở chặng Áp dụng và lab cache; xác nhận giới hạn, TTL control, clock, feedback thống nhất phút, rồi kiểm đúng boundary TTL. Nếu chỉ sửa lời giải thích, parent áp dụng workflow revision tương ứng.
- Nguồn sơ cấp trực tiếp cho finding là chính source nội dung/UI/engine tại baseline, vì lỗi là mâu thuẫn đơn vị nội bộ. [Azure Cache-Aside — Problems and considerations](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) đã được mở cho cơ chế expiration/staleness, nhưng không chứng minh đơn vị đồng hồ của ứng dụng này.

Những ghi chú đang kiểm khác chưa được nâng thành finding xác nhận sau khi đổi scope. Không đọc báo cáo student_tester.
