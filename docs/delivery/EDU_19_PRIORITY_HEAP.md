# EDU-19 — Việc đến trước có luôn được lấy trước?

Phạm vi: heap/hàng đợi ưu tiên nhập môn L0.3, nối search-tree theo §24 ROADMAP. Cùng bảy việc A4/B7/C2/D6/E5/F1/G3, số nhỏ ưu tiên trước; tất cả đã vào hàng, không có mức trùng. FIFO đầu A4; min-heap đầu F1, mảng theo tầng F1/E5/C2/B7/D6/A4/G3, chưa được sắp tăng. Core dựng heap bằng insert/swim và lấy gốc/replace-last/sift-down; UI mỗi bước là một lần lấy xong và sửa heap xong, không hiển thị trạng thái heap hỏng như đã ổn định.

Nguồn đọc 17/10/2026: [CMU 15-122 Fall2025 Lecture25](https://www.cs.cmu.edu/~15122-archive/n25/handouts/lectures/25-pq.pdf), §1 priority/FIFO, §3 heap-order, §4 shape, §5/6 insert/removal và §7 mảng theo tầng. Sơ đồ, câu hỏi, case và code tự biên soạn, không chép mã/hình. Parent kiểm claim/nguồn/trace/assessment trước beta; chưa human-reviewed/pilot.

Thiết kế: giữ bàn thí nghiệm; chọn chính sách → lấy1/lấy hết/reset → before/after → sơ đồ7 nút với ID/mức → mảng theo tầng và trace chữ. FIFO dùng danh sách thứ tự vào, không dùng hình heap. Có trạng thái còn/hết và đầu tiếp theo bằng chữ, không chỉ màu. Mỗi nút không phải nút bấm; điều khiển chuẩn44px; không animation tự chạy hoặc diagram cần kéo ngang. Case hàng việc in giả định, không đo thời gian thực tế hoặc công bằng.

Acceptance/QA cục bộ đã thực hiện theo kết quả dưới đây. Tiến độ/model version1, engine/version tăng khi thêm activity; không thay câu hỏi hoặc schema progress của19 bài cũ. Không đóng L0.3, còn locality/serialization/compression và nội dung sâu.


## Model và đối chiếu

| Chính sách | Thứ tự lấy hết (ID/mức) | Sau lần lấy đầu |
| --- | --- | --- |
| Min-heap | F1 → C2 → G3 → A4 → E5 → D6 → B7 | F1 ra; G3 từ cuối lên gốc, đổi với con C2; mảng còn C2/E5/G3/B7/D6/A4 |
| FIFO | A4 → B7 → C2 → D6 → E5 → F1 → G3 | A4 ra, B7 ở đầu; không chọn theo mức |

Min-heap ban đầu F1/E5/C2/B7/D6/A4/G3: từng cha không lớn hơn con, nhưng 5 đứng trước 2 khi đọc theo tầng, nên không là mảng đã sắp. Mỗi prefix bảo toàn đủ bảy ID/mức giữa phần đã lấy và còn chờ, không lặp. Lần lấy cuối không thay gốc từ phần tử đã rỗng. Parent đối chiếu nguồn, heap-order/shape, output và prediction/challenge/case; không suy hiệu quả/fairness ngoài bộ việc cố định.

## Kiểm chứng local

- Node24.21.0/pnpm11.25.0, không đổi dependency/lockfile. Engine1.10.0; content/schema 36module,20bài/1ôn, TypeScript/build và lint đạt; không thay assessment hoặc schema tiến độ 19bài cũ.
- 76 unit / 21file đạt. Hai chính sách/mọi prefix, fixture đầu ra và mảng độc lập, heap-order/root-minimum, bảo toàn ID/mức, trace replace/swap và last-removal; checkpoint malformed/version, forged data và mutation giữa lần gọi.
- Lượt E2E đầu:20test responsive/offline đạt,4test bài mới lỗi locator chỉ chọn strong nhãn “Thứ tự đã lấy” thay vì p chứa output. Sửa locator giữ nguyên kỳ vọng; retest4/4 đạt trên mobile Chromium và desktop Chromium/Firefox/WebKit. Không sửa app để né assertion, chưa chạy full E2E local trong task này; CI sẽ chạy full trước merge.
- Chromium320/390/1280: ảnh heap trước/sau lấy, mảng theo tầng và FIFO đã xem, không tràn ngang; export/import, checkpoint1việc đã lấy, reload offline, lấy hết/reset/đổi FIFO đều đạt; không pageerror. Danh sách có role list rõ khi bỏ bullet để giữ ngữ nghĩa trên Safari. Sơ đồ có label và danh sách tương đương, root/next bằng chữ, không chỉ màu.
- Evidence ảnh/log/artifact fingerprint ignored ở `.cache/edu19/`. Không có pilot/human review hoặc thiết bị thật. Phát hành đã qua PR/CI, merge master và kiểm production theo evidence dưới đây.


## Kết quả CI và phát hành

[PR #8](https://github.com/TrongVuong-learn/system-design-lab-vn/pull/8) đã squash merge thành `f4a7b7b31a8cb58a78551617bbd1a0593fda3ebd` (feature source6298670). [Quality run39022629541](https://github.com/TrongVuong-learn/system-design-lab-vn/actions/runs/39022629541) success: **76unit,219E2E đạt/1skip**, skip hover mobile có touch test riêng. Parent rà source/invariant, trace/assessment và ảnh trước merge; không gán kết quả này cho lượt CI tự chạy của commit chỉ tài liệu về sau.

Vercel Git deployment đầu của ứng dụng EDU-19: `dpl_7QRivumsp67hWTXEu7yyYYDFfpmf`, READY production, branch master, SHA f4a7b7b. Alias https://system-design-lab-vn.vercel.app ; [bài hàng đợi ưu tiên](https://system-design-lab-vn.vercel.app/#/learn/priority-heap). API xác nhận alias production/source SHA. 18file static khớp SHA256 artifact local đã kiểm; HTTP200, cache/MIME đúng và missing JS404. Số file không phải số bài: catalog20bài/1ôn.

Chromium production320/390/1280: catalog20, lấy F1 và trace G3 đổi C2, lưu/reload, tải gói/reload offline, lấy hết/rỗng và đổi FIFO/đầu B7 đều đạt; không overflow/pageerror. Evidence `.cache/edu19/{tested-artifact,cloud-http,live-browser,release}.json`, logs/ảnh ignored. Commit tài liệu ghi kết quả không đổi app/artifact; Git deployment cuối theo master được xác minh READY khi bàn giao.

EDU-19 hoàn tất scope nhập môn. Locality/serialization/compression và phần sâu L0.3 còn mở; chưa pilot/human review hoặc điện thoại thật. Gói offline cũ cần tải bản mới ở Tiến độ rồi đóng tất cả tab cũ để kích hoạt; không tự xóa tiến độ hoặc ép cập nhật.
