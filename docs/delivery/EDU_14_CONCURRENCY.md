# EDU-14 — Concurrency và mất cập nhật

Một bài L0.2, ID/kind concurrency, lesson1/case1/guidance1. Model concurrency1, engine1.5.0 thêm API, không đổi14 cơ chế cũ. Progress1/IndexedDB2 không đổi; checkpoint mới chỉ locked/modelVersion/schedule, replay tối đa4 thao tác thành công. Đợi khóa không ghi vào schedule, không giả làm thời gian tiến. Input sai/không khả thi trả về trạng thái đầu, không tin bộ đếm hay local nhập.

Nguồn OSTEP version1.10 của tác giả, truy cập15/10/2026: chương26 §§26.3–26.4 và phần mở đầu/26.1 về thread/shared data/xen kẽ/parallelism; chương28 §§28.1–28.3 về vùng cần bảo vệ và đánh giá khóa. Không sao chép code/hình; số30/32 và tình huống trường tự biên soạn. Khóa lý tưởng và sequential interleaving, không mô phỏng mutex/UB/language memory model thật.

Expected độc lập: không khóa có6 lịch bảo toàn thứ tự mỗi actor: aabb/bbaa→32; abab/abba/baab/baba→31. Có khóa chỉ aabb/bbaa là lịch4 bước được chấp nhận; thử actor khác lúc owner giữ khóa phải chờ, chưa đọc/ghi. Mọi lịch hoàn tất hợp lệ với khóa có32; không khóa không luôn sai. Khóa giữ từ read đến write, release sau write, không hứa fairness/hiệu năng/multi-server safety.

QA hoàn tất ở scope beta,15/10/2026:

- Content15 bài/36 module/1 bài ôn, typecheck/build/lint đạt.57 unit test đạt, gồm6 lịch không khóa,256 chuỗi chọn actor dài8 ở chế độ khóa, chờ không đổi state, immutability và replay/malformed.
-12 E2E concurrency đạt trên mobile Chromium và desktop Chromium/Firefox/WebKit: lost update, vùng khóa, chờ, reload lúc giữ khóa, completion, hints/inline terms320px, export/import và checkpoint giả.
-Full đầu:156 đạt/7 fail/1 skip;7 fail do matrix44px áp nhầm lên thuật ngữ inline. Chỉnh selector chỉ loại `.term-trigger`; mọi nút thao tác vẫn44px. Full chạy lại:163 đạt/1 skip hover mobile, không failure. Responsive320/360/390/430/768/1024/1440 đều đạt, không tăng timeout/retry hoặc đổi app để né assertion.
-9 ảnh lab lost/wait/locked ở320/390/1280, không overflow/pageerror. Parent đã xem lost320/wait390/locked1280; viewport390 kiểm Enter/Space/focus read→write, toggle reset và chờ có khóa đạt. Một ảnh vùng dài có artifact fixed skip-link từ screenshot; kiểm DOM rect top−100, focusfalse và viewport thật cho thấy không đè lên UI; không thay skip-link.

Evidence ignored tại `.cache/edu14/`: initial/final/targeted test results, screenshots, traces.json, keyboard.json, tested-artifact.json với SHA256 build. BundleJS584.33KB/173.77KB gzip có warning500KB và Zod annotation như trước, chưa code-split trong scope này.

Parent tự đối chiếu OSTEP/source/trace, không gọi knowledge_reviewer hoặc student agent trong task này và không nhận review QA-07 cũ cho bài mới. Chưa pilot người thật, expert review độc lập, điện thoại thật hoặc kiểm mutex/PKI/database production. Không đóng toàn L0.2/OS; tiếp theo CPU/I/O rồi cấu trúc dữ liệu.

