# ADR0006 — bài tập tổng hợp module có dữ liệu được khóa

18/10/2026. Áp dụng phần bài tập tổng hợp EDU-24, không đóng ENG-03 đầy đủ.

Thêm kind whitelist module-practice và payload practice.version1/items có ID/options/answer/explanation/sourceIDs. Pipeline chặn sai bindingkind/data, IDcâu trùng, đáp án ngoài lựa chọn, source thiếu trong registry/bài hoặc trường thực thi tùy ý. Renderer chọn core đã đăng ký, học liệu không có code thực thi.

Learning-core chấm từ lựa chọn đã lưu, không tin score/pass nhập. Checkpoint lab của ID mới chứa modelVersion1/practiceVersion1/answersJSONstring/checked; sai version/độ dài/giá trị từ chối toàn mảng. Không đổi progressJSON1/IndexedDB2 hoặc diễn giải lại hoàn thành23/26/29bài cũ. App cũ parse progress vẫn giữ ID bài lạ và các scalar lab, có thể roundtrip; không tự tạo evidence depth cho dữ liệu v1. Cần kiểm chứng điều này bằng fixtures import/export.

Compatibility baseline bổ sung toàn payload practice cho bài mới, conditional field để contract cũ giữ nguyên. Đổi thứ tự/đáp án/lời giải/payload practice ID đã phát hành phải qua chính sách ADR0005; không tự regenerate baseline. Đây chưa là migration attempt/depth hoàn chỉnh hoặc rubric năng lực mọi module. Score là tự luyện cho bộ câu hỏi này, không chứng nhận thành thạo/modulecomplete/human review. Coverage vẫn không tự đặt complete:true.

Gate chặng áp dụng của riêng bài cópractice là evaluatePractice.ready = mọi lựa chọn đúng và đãcheck. Đổiđápán/reset ẩn feedback, clearcompleted của ID mới. Không thay gate/action/assessment của bài cũ; không suy flagscompleted v1 thành evidence năng lực. Đây là kiểm tra học tập, không cơ chế chống gian lận hoặc chứng nhận.
