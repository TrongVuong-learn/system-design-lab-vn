# EDU-22 — lô OS: bộ nhớ, file và event loop

Task18/10/2026: mở rộng scope Ready address-space thành một lô ba bài cùng moduleL0.2 theo yêu cầu hoàn thiện module, không chờ user test từng bài. Engine1.13.0/model1; progressJSON1/IndexedDB2 giữ nguyên; không đổi23contract cũ. Chưa đóng toàn module/roadmap bằng số bài.

Nguồn đọc trực tiếp: OSTEP1.10 chương15§15.3–5, Linuxman-pages unlink(2), NodeLearn blocking/nonblocking/concurrency. Link POSIXOpenGroup bị403 nên không ghi đã đọc; dùng Linuxmanpage cho quy tắc descriptor còn mở. OSTEP39 dùng để đối chiếu tên/handle nhưng không dựa một mình vào đoạn linkcount để suy ra vòng đời handle. Parent review source/engine/trace/assessment; agent beta-check, không human review/pilot.

Ba mô hình thuần: RAM16ô/baseA4/B8/limit4, VA0/3/4 và read/write riêng; filesystem một tên/mộtfd với open→unlink→read→close; eventloop một luồng, ACPU1/I/O3/CPU1 vàBCPU1, hai cách chờ. Không thực thi code nội dung, đọcRAM/file thật hoặc làm benchmark. UI reset cấu hình rõ, before/after, nhãn chữ không chỉ màu; mobile2cột RAM/desktop4cột; timeline ít cột theo hàng dọc.

Acceptance: kiểm bounds trước truy cập, không chạm RAMOS/B khiAghi, replayderive trạng thái không tin dữ liệu nhập; unlink không tự đóngfd; mốcB2/6 vàA5, kết quảI/O sẵn mốc4 nhưngcallback chưa xong. Fixture/invalid/version/immutability; E2E bốn browser, responsive320–1440, keyboard/hints/thuật ngữ/case/resume, export/import/offline và screenshot320/390/1280. CI/master/Vercel giữ workflow hiện hành, không nâng dependency.

## Kết quả local

90unit/25files, content/coverage/lint/format/build/typecheck đạt. 23contract cũ deep-equal, chỉ thêm3ID. Lượt E2E đầu28pass/4fail do nhãn select trong RAM gồm cả nội dung option khiến exact label không khớp; bổ sung aria-label rõ cho3select, giữ visiblelabel và expectation. Retest12/12 ba bài trên bốn browser đạt. 20test offline/responsive còn lại đã đạt ở lượt đầu; CI sẽ chạy full trên source cuối. Trong review checkpoint đã sửa nonblocking step6 về0 thay vì clamp thành hoàn tất5, có fixture chặn; không để invalidstep giả hoàn thành.

Standalone sau sửaUI: cả3bài tại320/390/1280 export/import, resume/reload offline và tiếp tục thao tác đều đạt, không overflow/pageerror. Đã review ảnh nội dung thật: RAM có nhãnPA/giá trị, file tách tên/handle/dữ liệu, eventloop timeline chữ. Evidence ảnh/log/fingerprint ignored `.cache/edu22/`. Chưa điện thoại thật/pilot; không dùng beta intro để tự đóngL0.2.

## CI và production

[PR#15](https://github.com/TrongVuong-learn/system-design-lab-vn/pull/15) merge thành `75be58c41cf2dadde69a36cb7f1df49d939eb18f`. [Quality39093005064](https://github.com/TrongVuong-learn/system-design-lab-vn/actions/runs/39093005064) success90unit/243E2E,1skip theo cấu hình hovermobile cũ cótap riêng.

Vercel `dpl_ASArJXT8kcxZ9k8BwfYNHPppn8yz` READY production/master75be58c, alias https://system-design-lab-vn.vercel.app. 18file HTTP/hash/cache/MIME đúng vàmissingJS404. Chromium320/390/1280 cho3bài export/import/checkpoint/reload offline và tiếp tụcđọcghi/chặnRAM, đọcfdđãunlink/đóng, eventloop tớiA5/B2 đạt, khôngoverflow/pageerror. Evidence `.cache/edu22/{release,tested-artifact,cloud-http,live-browser}.json` ignored.

Scope3bài đã phát hành; không đóng toànL0.2/giáo trình, không humanreview/pilot hoặc thiết bịthật mới. BảnEDU23/24 tiếp theo từmaster kếthừa3bài; commit docs cuối không thay cơ chế.
