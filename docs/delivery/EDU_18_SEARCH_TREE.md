# EDU-18 — Cùng mã sách, vì sao đường tìm dài hơn?

Phạm vi: một bài nhập môn BST thuộc L0.3, nối library-search; triển khai theo §23 ROADMAP. Giữ phong cách bàn thí nghiệm; chọn hình dạng/mã → xét từng nút/chạy xong → before/after → sơ đồ và trace chữ. Cây cân đối bảy nút vừa mobile, cây lệch vẽ dọc và ghi rõ nhánh phải hướng xuống để tránh cuộn ngang. Không animation tự chạy hoặc node phải kéo/chạm nhỏ.

Nguồn đã đọc 17/10/2026: [CMU 15-122 Fall2026 Lecture15](https://www.cs.cmu.edu/~15122/handouts/lectures/15-bst.pdf), §3.1 invariant toàn cây con, §4 tra khóa/nhánh trống, §5 vai trò hình dạng/chiều cao. Ví dụ, sơ đồ và câu hỏi tự biên soạn; không sao chép mã/hình của nguồn. Parent sẽ rà claim/engine/trace/assessment trước beta, không gọi là human-reviewed hoặc pilot thật.

Acceptance và QA: chưa thực hiện; chỉ ghi đạt sau có kết quả. Không đóng L0.3, chưa heap, tự cân bằng, insert/delete, key trùng, database I/O hoặc benchmark.
