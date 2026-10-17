# EDU-19 — Việc đến trước có luôn được lấy trước?

Phạm vi: heap/hàng đợi ưu tiên nhập môn L0.3, nối search-tree theo §24 ROADMAP. Cùng bảy việc A4/B7/C2/D6/E5/F1/G3, số nhỏ ưu tiên trước; tất cả đã vào hàng, không có mức trùng. FIFO đầu A4; min-heap đầu F1, mảng theo tầng F1/E5/C2/B7/D6/A4/G3, chưa được sắp tăng. Core dựng heap bằng insert/swim và lấy gốc/replace-last/sift-down; UI mỗi bước là một lần lấy xong và sửa heap xong, không hiển thị trạng thái heap hỏng như đã ổn định.

Nguồn đọc 17/10/2026: [CMU 15-122 Fall2025 Lecture25](https://www.cs.cmu.edu/~15122-archive/n25/handouts/lectures/25-pq.pdf), §1 priority/FIFO, §3 heap-order, §4 shape/array, §5/6 insert/removal. Sơ đồ, câu hỏi, case và code tự biên soạn, không chép mã/hình. Parent kiểm claim/nguồn/trace/assessment trước beta; chưa human-reviewed/pilot.

Thiết kế: giữ bàn thí nghiệm; chọn chính sách → lấy1/lấy hết/reset → before/after → sơ đồ7 nút với ID/mức → mảng theo tầng và trace chữ. FIFO dùng danh sách thứ tự vào, không dùng hình heap. Có trạng thái còn/hết và đầu tiếp theo bằng chữ, không chỉ màu. Mỗi nút không phải nút bấm; điều khiển chuẩn44px; không animation tự chạy hoặc diagram cần kéo ngang. Case hàng việc in giả định, không đo thời gian thực tế hoặc công bằng.

Acceptance/QA chưa chạy; chỉ ghi đạt khi có kết quả. Tiến độ/model version1, engine/version tăng khi thêm activity; không thay câu hỏi hoặc schema progress của19 bài cũ. Không đóng L0.3, còn locality/serialization/compression và nội dung sâu.
