# EDU-17 — Hai mã sách, cùng một ngăn

Phạm vi: L0.3 nhập môn hash table/separate chaining, nối library-search. Owner Codex. Cùng design bàn thí nghiệm, một cột mobile, bảng4/8 ngăn; không vẽ node nhỏ phải kéo. Config ngắn → xem1khóa/chạy xong → số so sánh → bảng ngăn/trace chữ và before-after. Cấu hình/đặt lại không xóa tiến độ bài khác.

Mã sách2,6,10,14; h(k)=k mod B (phần dư), B4/8; khóa trong chain theo thứ tự chèn. Mục tiêu2/14/18. Linear so cả danh mục theo thứ tự, hash so chain trong bucket; so bằng khóa đầy đủ, không kết luận tồn tại chỉ vì cùng bucket. Một bước là so1khóa, không hash cost, xây bảng, CPU instruction hoặc ms. Không bảo đảm O(1) từ4key, chưa có resize/eviction/crypto/concurrent writes.

Acceptance: tính tay4ngăn/mã14 hash4vslinear4,8ngăn/mã14 hash2vslinear4; mã2 cả hai1; mã18 không có, hash4/8 kiểm4/2 khóa. Unit mọi preset/prefix/restore invalid, independent buckets/invariants; E2E320/keyboard/hints/case/reload, responsive và offline. Đã kiểm chứng cục bộ theo kết quả bên dưới; phát hành ghi riêng sau READY.


## Nguồn và đối chiếu

Đọc ngày 16/10/2026: [CMU 15-122 Lecture 13, §4–8](https://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15122-s14/www/13-hashtables.pdf) và [MIT 6.006 Fall 2011 Lecture 8](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/d3e4d64266d481c74c9e7c15e09999fe_MIT6_006F11_lec08.pdf). Nguồn hỗ trợ chaining, va chạm, so khóa và điều kiện/giới hạn hiệu quả; bộ mã sách, câu hỏi và case tự biên soạn. Parent đối chiếu nguồn + engine + assessment; không ghi human-reviewed hoặc pilot thật. Xác nhận của người dùng về kiến thức trước đợt này không tự áp dụng cho bài mới.

| Preset | Khóa cần so theo ngăn | Từng khóa |
| --- | --- | --- |
| 4 ngăn, mã 14 | 2, 6, 10, 14 → thấy | 4 lần so |
| 8 ngăn, mã 14 | 6, 14 → thấy | 4 lần so |
| 4 ngăn, mã 18 | 2, 6, 10, 14 → không có | 4 lần so |
| 8 ngăn, mã 18 | 2, 10 → không có | 4 lần so |
| Mã 2, cả hai số ngăn | 2 → thấy | 1 lần so |

## Kiểm chứng cục bộ

- Content/schema, TypeScript/build và lint đạt; 36 module trong catalog, 18 bài nhập môn + 1 bài ôn, engine 1.8.0. Không nâng dependency, không thay assessment hoặc schema tiến độ cũ.
- 68 unit / 19 files đạt. Mọi preset/prefix có fixture độc lập; checkpoint sai version/bước không hợp lệ không được giả kết quả hoàn thành.
- 24 E2E liên quan đạt: bài mới trên bốn project browser, responsive 320–1440 px và offline/update/failure. Đây là trình duyệt giả lập, chưa phải Safari iOS/Android thật.
- Chromium 320/390/1280 px: ảnh đã xem, không tràn ngang; chạy từng bước, lưu/reload, export/import, tải gói rồi mở/reload bài khi offline đều đạt, không pageerror. Evidence tạm ở `/private/tmp/edu17-visual/`, sẽ lưu vào cache phát hành ignored.
- Chưa có pilot con người, chưa đo hiệu quả học tập hoặc thời gian chạy hash thực tế. Chỉ hoàn tất lát cắt nhập môn; không đóng L0.3 hay toàn bộ roadmap.
