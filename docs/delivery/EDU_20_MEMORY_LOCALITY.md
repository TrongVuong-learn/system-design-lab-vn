# EDU-20 — tính cục bộ bộ nhớ

Scope: một bài nhập môn L0.3, case danh sách tám mục; tiếp nối library-search. Không đóng L0.3 hoặc toàn roadmap. Engine1.11.0, model1; progressJSON1/IndexedDB2 giữ nguyên; baseline compatibility thêm ID mới, không sửa contract20bài cũ.

Nguồn đọc trực tiếp: [CMU Recitation7](https://www.cs.cmu.edu/afs/cs/academic/class/15213-s14/www/recitations/rec7.pdf), slide8 về temporal/spatial locality, slides10–14 về block/capacity/miss. Không dùng số cycle cũ trong tài liệu làm benchmark. Parent đối chiếu claim/trace/assessment; đây là agent beta-check, không phải chuyên gia con người hoặc pilot.

Mô hình riêng: tám ô0–7; một khối cache ban đầu trống, khối1/4ô căn theo bội kích thước. Ba trace: liền nhau0–7, xen kẽ0/4/1/5/2/6/3/7, lặp ô0 tám lần. Mỗi bước đọc một ô. Miss nạp khối chứa ô, thay khối cũ; hit không nạp. Với4ô/khối: liền nhau2loads/6hits, xen kẽ8/0, lặp1/7. Với1ô/khối: hai trace đầu8/0, lặp1/7. Đổi khối làm sức chứa cũng thay, không phải so cùng dung lượng. Không có ghi, prefetch, nhiều tầng cache, ms hoặc byte thật.

UI theo hướng bàn thí nghiệm: thứ tự đọc → thao tác → số lượt/before–after → khối hiện giữ → trace chữ. Tám ô chia hai cột mobile, bốn cột desktop; trạng thái có chữ ngoài màu. Không tự chạy animation. Lưu chỉ config/step/model; replay derive hit/load/block, bỏ counter nhập.

Acceptance: fixtures sáu cấu hình/mọi prefix, cold miss, conservation, malformed/model/immutability; E2E320px keyboard/resume/reset/case/completion trên bốn browser; responsive/offline và screenshot320/390/1280; build/content/coverage/lint/format/unit. Chỉ ghi kết quả khi đã chạy. Các gate thiết bị thật/pilot và serialization/compression còn mở.


## Kiểm chứng local

83 unit/23 files, content/coverage/lint/format/build/typecheck đạt. 24 E2E liên quan đạt: bài mới bốn browser, offline12test và responsive7bề rộng320–1440 cùng test reduced-motion/landscape. Ma trận chung được bổ sung library-search/hash/tree/heap/locality từng bị bỏ sót. Không gọi đây là kiểm chứng điện thoại thật.

Ảnh lab320/390/1280 đã xem: controls/trace chữ/khối cache không tràn ngang, màu vàng có nhãn “Trong cache”. Export/import, lưu2bước/reload/offline rồi đổi xen kẽ và đọc hết đều đạt, không pageerror. Evidence ignored `.cache/edu20/`, log `/private/tmp/edu20-e2e.log`. Sau bổ sung role=list cho danh sách CSS bỏ bullet cần retest bài mới; CI chạy full trước merge. Compatibility20ID cũ được so deep-equal với baseline, chỉ thêm locality.

Retest sau role=list:4/4 bài locality đạt trên Chromium mobile/desktop, Firefox, WebKit. Không đổi cơ chế hoặc đáp án để làm kiểm thử đạt.
