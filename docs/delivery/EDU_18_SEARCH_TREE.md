# EDU-18 — Cùng mã sách, vì sao đường tìm dài hơn?

Phạm vi: một bài nhập môn BST thuộc L0.3, nối library-search; triển khai theo §23 ROADMAP. Giữ phong cách bàn thí nghiệm; chọn hình dạng/mã → xét từng nút/chạy xong → before/after → sơ đồ và trace chữ. Cây cân đối bảy nút vừa mobile, cây lệch vẽ dọc và ghi rõ nhánh phải hướng xuống để tránh cuộn ngang. Không animation tự chạy hoặc node phải kéo/chạm nhỏ.

Nguồn đã đọc 17/10/2026: [CMU 15-122 Fall2026 Lecture15](https://www.cs.cmu.edu/~15122/handouts/lectures/15-bst.pdf), §3.1 invariant toàn cây con, §4 tra khóa/nhánh trống, §5 vai trò hình dạng/chiều cao. Ví dụ, sơ đồ và câu hỏi tự biên soạn; không sao chép mã/hình của nguồn. Parent sẽ rà claim/engine/trace/assessment trước beta, không gọi là human-reviewed hoặc pilot thật.

Acceptance và QA cục bộ đã thực hiện theo bằng chứng bên dưới. Không đóng L0.3, chưa heap, tự cân bằng, insert/delete, key trùng, database I/O hoặc benchmark.


## Model và đối chiếu

| Mã cần tìm | Cây cân đối | Cây lệch phải |
| --- | --- | --- |
| 14 | 8 → 12 → 14; thấy, 3 nút | 2 → 4 → 6 → 8 → 10 → 12 → 14; thấy, 7 nút |
| 2 | 8 → 4 → 2; thấy, 3 nút | 2; thấy, 1 nút |
| 9 | 8 → 12 → 10 → nhánh trái trống; không có, 3 nút | 2 → 4 → 6 → 8 → 10 → nhánh trái trống; không có, 5 nút |

Parent đối chiếu nguyên tắc nguồn với cả sáu trace, predicate direction, điểm dừng và prediction/challenge/case. Fixtures kiểm invariant với khoảng min/max của toàn subtree, không chỉ so hai con trực tiếp; mọi khóa xuất hiện một lần. Không tuyên bố cây cân đối luôn tốt hơn với từng truy vấn hoặc BST luôn chia đôi. Đổi hình dạng là đổi preset dựng sẵn, không phải thuật toán xoay cân bằng.

## Kiểm chứng local

- Node24.21.0/pnpm11.25.0; đồng bộ node_modules theo lockfile, không đổi dependency/lockfile. Content/schema 36module, 19bài/1ôn; TypeScript/build và lint đạt; engine1.9.0. Không sửa assessment/progress của 18bài cũ.
- 73 unit / 20file đạt, gồm mọi preset/prefix, BST invariant toàn subtree, restore invalid/version, chống forged trace/result và không rò mutation giữa lần gọi.
- 24 E2E liên quan đạt: bài mới bốn project browser, responsive320–1440, keyboard/hints/challenge/resume, offline/install failure/update. Chưa phải thiết bị iOS/Android thật.
- Chromium320/390/1280: ảnh sơ đồ cân đối/lệch đã xem, chữ và số đọc được, không cuộn ngang; export/import, bước đang làm, tải gói/reload offline đều đạt; không pageerror. Highlight có danh sách “Đã xét” và trace chữ tương đương ngoài màu. Cache/ảnh/log ignored trong `.cache/edu18/`.
- Một lượt kiểm ảnh gặp timeout ở cơ chế duyệt quyền trước khi browser chạy; lần thử lại được phép và đạt. Đây không phải lỗi ứng dụng.
- Chưa human-reviewed/pilot thật; chưa benchmark, heap hoặc duy trì cân bằng. Phát hành chỉ sau PR/CI và merge master; deployment/source SHA sẽ xác minh trên Vercel.
