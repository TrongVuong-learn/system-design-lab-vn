# EDU-17 — Hai mã sách, cùng một ngăn

Phạm vi: L0.3 nhập môn hash table/separate chaining, nối library-search. Owner Codex. Cùng design bàn thí nghiệm, một cột mobile, bảng4/8 ngăn; không vẽ node nhỏ phải kéo. Config ngắn → xem1khóa/chạy xong → số so sánh → bảng ngăn/trace chữ và before-after. Cấu hình/đặt lại không xóa tiến độ bài khác.

Mã sách2,6,10,14; h(k)=k mod B (phần dư), B4/8; khóa trong chain theo thứ tự chèn. Mục tiêu2/14/18. Linear so cả danh mục theo thứ tự, hash so chain trong bucket; so bằng khóa đầy đủ, không kết luận tồn tại chỉ vì cùng bucket. Một bước là so1khóa, không hash cost, xây bảng, CPU instruction hoặc ms. Không bảo đảm O(1) từ4key, chưa có resize/eviction/crypto/concurrent writes.

Acceptance: tính tay4ngăn/mã14 hash4vslinear4,8ngăn/mã14 hash2vslinear4; mã2 cả hai1; mã18 không có, hash4/8 kiểm4/2 khóa. Unit mọi preset/prefix/restore invalid, independent buckets/invariants; E2E320/keyboard/hints/case/reload, responsive và offline. Chưa kiểm chứng; nguồn/kết quả bổ sung sau thực hiện.
