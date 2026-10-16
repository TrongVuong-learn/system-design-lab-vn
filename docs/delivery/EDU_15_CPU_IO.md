# EDU-15 — CPU/I/O và worker

Bài cpu-io/L0.2, content/case/guidance1, engine1.6.0/model1;15 bài cũ không đổi cơ chế/assessment. Checkpoint chỉ config/step/modelVersion, derive state≤10tick; không tin jobs/time/finished được import. Progress1/IndexedDB2 không đổi.

Nguồn OSTEP1.10: chương4§4.4 ready/running/blocked,26§26.1 dùng CPU lúc thread khác chờI/O,36§36.4 cho ngủ chờ sự kiện thay vì polling. Truy cập15/10/2026. Không triển khai scheduler/interrupt/API thật; các số1/3/4ms là giả định tác giả.

Timeline độc lập: I/O1worker A_CPU[0,1),wait[1,4),CPU[4,5);B_CPU[5,6),wait[6,9),CPU[9,10).2worker: A_CPU[0,1),B_CPU[1,2),CPUnghỉ[2,4),A_CPU[4,5),B_CPU[5,6);I/OA[1,4),B[2,5) độc lập. CPU-only1/2worker đều8msCPU, A[0,4),B[4,8), không tính phí switch. Tất cả arrival0: thời gian B xong10/6/8ms gồm cả chờworker/CPU.

QA15/10/2026:

-Content16 bài/36 module/1 bài ôn, typecheck/build/lint đạt.61 unit test đạt;4 test mới kiểm4 lịch tính tay, mọi prefix0–10, CPU≤1 việc mỗi khoảng, worker không vượt slot,3msI/O/job, thời điểm admission/completion và restore invalid/version.
-12 E2E mới đạt trên mobile Chromium và desktop Chromium/Firefox/WebKit:1/2worker, I/O/CPU, waiting/ready/queued, reload, completion, Enter/focus, gợi ý/glossary320px, export/import và invalidstep.
-Full regression trước sửa nhãn:175 đạt/1 skip hover mobile. Review ảnh phát hiện option bị cắt chữ320px; rút gọn nhãn và chuyển tham sốms xuống mô tả theo mode, không đổi engine/assessment. Build cuối và20 E2E liên quan (12 CPU/I/O+8 responsive) đạt sau sửa. Không gọi full176 là lượt chạy sau sửa nhãn.
-Responsive320/360/390/430/768/1024/1440 đạt;12 ảnh viewport900px cao ở320/390/1280 cho controls/wait/timeline/CPU-only, fittrue/pageerror0. Parent đã xem controls390/timeline320/CPU1280 và ảnh wait320 cuối xác nhận đọc đủ option/parameter.

Evidence ignored tại `.cache/edu15/`: targeted/full/final-related test results, screenshots-before-label-fix/screenshots-final, traces.json, tested-artifact.json với SHA256 build. JS599.66KB/177.88KB gzip: cảnh báo chunk500KB/Zod annotation không chặn build; chưa tối ưu bundle toàn site trong task này.

Parent trực tiếp đối chiếu nguồn và trace; không chạy knowledge/student agent trong EDU-15, không dùng QA-07 cũ để chứng nhận bài mới. Model chỉ hai việc hữu hạn, một CPU, I/O không tranh thiết bị, worker giữ slot đến khi xong. Không hứa tăngworker luôn nhanh; không eventloop/nonblocking API, memory/filesystem đầy đủ hoặc scheduler/thiết bị thật. Chưa kiểm điện thoại thật, pilot hoặc chuyên gia độc lập; L0.2 vẫn chưa hoàn tất. Tiếp theo cấu trúc dữ liệu L0.3.

