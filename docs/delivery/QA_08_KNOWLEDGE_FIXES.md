# QA-08 — Sửa bốn điểm của review kiến thức 17/10/2026

Phạm vi: AUD-01–04 trên baseline8f2afa8, 18 bài beta và một bài ôn. User giao sửa cả bốn điểm; owner Codex. Điều kiện hoàn tất: preview đúng ba cơ chế; DNS nêu resolver hỏi từng server; cache75% hiển thị tốc độ kỳ vọng không làm tròn; tài liệu hiện hành khớp18 bài; kiểm content/unit/build và UI mobile/desktop.

Engine1.8.1 chỉ sửa metric databaseReads thành tốc độ kỳ vọng số thực; không đổi completed/waiting/capacity, đáp án hay tiêu chí đạt. Metric mới được tính từ cấu hình; bảng quan sát cũ vẫn giữ lịch sử và có nhãn đã làm tròn, thao tác tiếp theo tạo bảng mới; lesson/progress/schema version giữ nguyên, không diễn giải lại trạng thái hoàn thành cũ. Editorial revision tăng cho dns/balance/design; chỉ rõ giả định, nguồn RFC1034§5.3.3 và giới hạn. Bài ôn giữ assessment/requirements, làm rõ tỷ lệ trung bình.

Thiết kế giữ palette và Be Vietnam Pro của DESIGN.md, dùng sketch chữ/số có sẵn: lost update31, hai timeline10/6ms, và tính bí mật/toàn vẹn/danh tính củaTLS. Trên thẻ chỉ đưa cơ chế cần học, không thêm animation hoặc sơ đồ mạng giả.

## Kết quả kiểm chứng

- Node24.21.0 và pnpm11.25.0 đúng baseline; không thay dependency hoặc lockfile.
- Content validation18 bài beta/1 bài ôn/36 module registry, lint, typecheck và production build đạt. Engine1.8.1 chỉ đổi metric kỳ vọng, không đổi assessment hay công suất.
- 70/70 unit test,19file đạt; hai test mới kiểm fixed expected0,25/0,5/0,75/1,5/3 và nhãn số lẻ tiếng Việt. Các test fixture giữ nguyên đáp án cũ đều đạt.
- Bản cuối28/28 E2E liên quan đạt trên mobile Chromium và desktop Chromium/Firefox/WebKit. Có DNS cache/TTL đúng biên và reload, fractional rate/resume, nhận diện bảng làm tròn cũ sau import, giữ bài đã hoàn thành, hai tình huống ôn, export/import, lỗi lưu/retry và reset. Không chạy toàn bộ E2E của repository trong task này.
- Preview ba bài ở320/390/1280px đúng chủ đề, không tràn ngang. Parent xem ảnh concurrency320, TLS320/1280, CPU/I/O320/1280, DNS320 và cache rate390. Số10ms/6ms giữ liền đơn vị; chụp thẻ ở giữa viewport tránh thanh điều hướng fixed đè ảnh.
- Báo cáo build còn warning annotation của Zod và chunk trên500kB đã có trước. Bản cuối JS630,40kB,186,75kB gzip; chưa tối ưu bundle trong scope này.

Evidence ignored tại `.cache/qa08/`: logs, ảnh và tested-artifact.json có SHA256 các file dist. Source task report và regression tests là đầu ra reviewable trên nhánh `codex/qa-08-knowledge-fixes`; chưa commit/push/phát hành production. Không đổi trạng thái human-reviewed hoặc đóng pilot.

## Trạng thái finding

| Finding | Xử lý | Bằng chứng |
| --- | --- | --- |
| AUD-01 | Resolved trong source: ba sketch riêng theo cơ chế | Preview E2E và ảnh320/390/1280 |
| AUD-02 | Resolved trong source: resolver tự hỏi server sau referral | DNS E2E, RFC1034§5.3.3, lesson limit/source registry |
| AUD-03 | Resolved trong source: số kỳ vọng không làm tròn, nhãn tỷ lệ trung bình | Fixed unit cases, rate/resume E2E; bảng cũ ghi rõ làm tròn |
| AUD-04 | Resolved trong tài liệu hiện hành:18 bài và bước tiếp theo | README, CURRICULUM_MAP, TEACHING_GUIDE, SYSTEM_DESIGN_WEB_PLAN; giữ lịch sử EDU-09 |


## Tích hợp và phát hành — 17/10/2026

Theo yêu cầu push/deploy và production luôn theo master: [PR #3](https://github.com/TrongVuong-learn/system-design-lab-vn/pull/3) đã merge thành `22c299c13aefd566015c7b867b0dc48c86f3b5f5`. [Quality 38985680874](https://github.com/TrongVuong-learn/system-design-lab-vn/actions/runs/38985680874) success: 70 unit và 211 E2E đạt/1 skip hover mobile có touch test riêng. Phần ghi “chưa commit/push” ở trên là trạng thái khi hoàn tất kiểm tra source, trước lượt phát hành này.

Deploy prebuilt đã thực hiện từ checkout đúng origin/master 22c299c, app/content không khác source QA-08 đã kiểm. Deployment `dpl_AAeAGReEqJvyVnucjsC1K951c7dx` READY production, URL bất biến https://system-design-lab-a33gm03s8-trongvuonglearns-projects.vercel.app ; alias công khai https://system-design-lab-vn.vercel.app . Artifact offline version `40db53f9dd0fcc4b`, 18 file static SHA256 khớp khi GET không đăng nhập, missing JS trả 404. Chromium 320/390/1280 px: catalog 18, ba sketch, DNS referral, rate 0,5, lưu/reload và offline đều đạt; không overflow/pageerror. Evidence `.cache/qa08/{tested-artifact,cloud-http,live-browser}.json` và log deploy/CI ignored.

[PR #4](https://github.com/TrongVuong-learn/system-design-lab-vn/pull/4) đã tích hợp skill/agent research được người dùng đồng ý công khai; CI riêng 39015011942 success. Không chép source hoặc trạng thái plan cũ lên master. Vercel Git connection xác nhận repo TrongVuong-learn/system-design-lab-vn, productionBranch master, Node24.x, build pnpm build, output dist. Các commit tooling/tài liệu không đổi app source; Git deployments sau đó theo cùng ứng dụng QA-08. Kiểm READY/source SHA của deployment cuối khi bàn giao; không coi connection đơn thuần là bằng chứng build thành công.
