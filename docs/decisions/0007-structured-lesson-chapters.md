# ADR-0007 — các chương cơ chế có cấu trúc

18/10/2026, Accepted cho EDU-25. Nội dung sâu hơn không nên bị ép thành một paragraph hoặc dồn toàn bộ kiến thức vào lời giải đáp án. Thêm `chapters` optional/version1 trong lesson: ID, title, explanation, example, steps, misconception, sourceIds; schema strict không thực thi code. Catalog chặn duplicate/reference thiếu; compatibility-v1 khóa toàn payload mới. 30 ID đã phát hành không nhận chapters nên contract/progress/storage giữ nguyên.

Renderer là accordion HTML trong lesson-player ở story và lab, dùng từ mới cùng nguồn; mở/đóng không tạo bằng chứng mastery hoặc attempt. Native sau này có renderer riêng đọc cùng data. Đây không thay contract attempt/depth đầy đủ của ENG-03 hoặc hoạt động mô phỏng; bài quyết định vẫn dùng learning-core và được ghi rõ giới hạn.
