# ADR 0008 — bản thiết kế tự viết và lộ trình học liệu

Ngày 24/10/2026, trạng thái Accepted trong phạm vi EDU-26.

Các bài thiết kế cần đầu ra tự viết ngoài câu lựa chọn. Thêm `designTask` có version, deliverable ID, đề đổi ràng buộc và rubric vào lesson schema; khóa payload trong compatibility contract như practice/chapters. Chỉ ID bài mới dùng contract này, không thay diễn giải câu trả lời của 36 ID đã có.

Bản nháp dùng các khóa `design-part-*` và `design-variation` trong lab checkpoint progress v1, mỗi chuỗi tối đa 2000 ký tự theo giới hạn hiện hữu. Core chỉ kiểm mọi mục có văn bản hợp lệ, không chấm nội dung, không tin cờ điểm nhập. UI nói rõ chưa chấm thiết kế. isLessonComplete đối chiếu cờ hoàn thành bài mới với practice/challenge/bản nháp, không tin cờ nhập thiếu bằng chứng; semantics bài cũ giữ nguyên. Sửa đáp án/bản nháp bỏ cờ hoàn thành; reset practice giữ bản nháp để không xóa công sức viết. Không đổi IndexedDB/progress format, export/import hiện hành mang theo bản nháp.

`content/pathways.json` định danh 7 nhánh, 6 capstone và 8 case, tham chiếu bài beta có designTask. Pipeline kiểm ID/tập hợp/level capstone. Các bài vẫn gắn module để giữ schema hiện hành; report và UI phân biệt nhóm để không suy số bài/track thành chứng nhận module đầy đủ. Không thêm app/package/runtime hoặc code tùy ý vào học liệu.

Đánh đổi: bản nháp có giới hạn độ dài; chưa có reviewer chấm rubric nhiều mức hoặc attempt version migration. Bài được đánh dấu hoàn thành tự luyện chỉ có nghĩa đã làm câu hỏi và điền bản nháp, không là chứng minh mastery. Tiếp tục giữ các gate nghiên cứu/pilot và ENG-03 trong roadmap.
