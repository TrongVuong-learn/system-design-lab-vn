# QA-07 — cập nhật nền tham chiếu và review kiến thức

Owner root; user yêu cầu15/10/2026. Baseline application f5ab3182879a212c7f3ce4456cf00a37d9d9b029.

Trình tự: nghiên cứu nguồn sơ cấp → Astra medium cập nhật profile/reference guide → parent kiểm evidence/TOML/checksum → Sol low đọc profile mới và review → parent phân loại findings. Runtime giữ gpt-6-sol low.

Phạm vi research: giao thức, bảo mật TLS/danh tính, cache/replication/queue, metrics/capacity và OS concurrency cho nội dung L0 kế tiếp. Tài liệu ghi section/version/ngày, phản ví dụ và giới hạn; không gọi đây là huấn luyện model hoặc bảo đảm không sai.

Phạm vi review: inventory14 bài beta và1 bài ôn; review sâu TLS và school-day mới, gợi ý/quan sát13 bài theo rủi ro. Claim matrix ghi phần thực sự đọc/nguồn/trace; phần thiếu evidence giữ insufficient-evidence. Không tái dùng nhãn beta-checked làm chứng minh. Reviewer chỉ đọc/kiểm/report, không sửa source/phát hành.

Acceptance: profile1.1.0 parse được, runtime không đổi, reference guide có nguồn thực đọc, checksums khóa; report và matrix có commit/model và evidence tái lập. AI không đóng pilot người thật hay chứng nhận36 module/6 level/7 nhánh đầy đủ. Findings được parent xác minh trước mọi sửa; task hiện không bao gồm tự phát hành thay đổi ứng dụng.

## Kết quả và parent acceptance — 15/10/2026

Profile1.1.0 đã author bởi gpt-6-astra medium, parent áp dụng TOML/checksum, giữ runtime gpt-6-sol low.19 nguồn sơ cấp/tác giả và8 calibration pitfalls ở [guide](../research/knowledge-reviewer/REFERENCE_GUIDE.md); phạm vi/gaps ở [research](../research/knowledge-reviewer/RESEARCH_2026-10-15.md). Đã lưu cả original checkout để các lần sau tìm thấy agent; không ghi đè source/plan dirty của checkout đó.

[Report expanded](../research/knowledge-reviewer/RUN_2026-10-15_QA07.md) và [claim matrix](../research/knowledge-reviewer/claims-2026-10-15-qa07.json):23 rows (19 registry+4 school) verified-with-conditions trong14 bài beta+1 bài ôn, không phải chứng nhận mọi phát biểu hoặc giáo trình đầy đủ. Reviewer đọc story/explanation/limit/terms/questions/case/guidance, mở primary sections và chạy75 checked cases:24 TLS+8 school+43 older.2 malformed TLS chỉ quan sát, không tính là checked pass.

Lượt đầu ngắt usage limit; resume cùng Sol low. Firstpass7 verified/16 insufficient được giữ nguyên trong evidence. Parent yêu cầu mở rộng, sửa metadata status boilerplate và citation DNS: RFC1035§3.2.1, không phải§4.3.4. Parent mở lại RFC1035/1034; section4.3.4 thuộc negative caching của1034. Guide được sửa rõ phạm vi section và đếm10 RFC trong19 nguồn. Không viết đè bản firstpass để thay đổi lịch sử.

Parent đã đọc report/matrix và scripts, kiểm math (request sum, units network/capacity, queue conservation, replica/DNS timeline, metrics median/nearest-rank), chạy lại75 checked cases vào parent-traces*.json, không mismatch. Nguồn TLS/identity/PKIX/HTTP và DNS được parent đối chiếu mẫu; phần còn lại dựa trên evidence reviewer, không gọi là chuyên gia độc lập.

Không confirmed P0/P1/P2. Góp ý biên tập duy nhất: school-day dùng “đúng75%” trong mô hình công suất tỷ lệ;6 lượt/giây cho4,5 hit kỳ vọng, còn databaseReads làm tròn. UI bài ôn không hiển thị số DB reads và assessment không chấm sốhit; parent đồng ý tác động thấp, backlog chỉnh câu thành tỷ lệ kỳ vọng/ước lượng. Không sửa engine/assessment/học liệu hoặc deploy trong task review này.

Evidence bền vững: [thư mục](../research/knowledge-reviewer/evidence/qa07-2026-10-15/). Scripts giữ đường dẫn import gốc; chạy ở checkout khác phải tạo evidence mới có commit/path phù hợp. Raw report vẫn ghi artifact path ban đầu; bản copy ở đây giữ nguyên để bảo toàn provenance. Source ứng dụng so vớif5ab318 không đổi; không cần build/E2E lại cho thay đổi tài liệu/profile. TOML,9 checksum của hai profiles và local markdown links đã được kiểm.

Giới hạn: UI source-only, chưa browser/mobile/screen reader/persistence trong lượt knowledge audit; không thực thi PKI/DB/broker thực, chưa full RFC errata/update chains, chưa pilot người thật hay reviewer chuyên gia độc lập.6 level/36 module/7 nhánh vẫn roadmap. Kết luận pass-with-scope chỉ trong những điều kiện model/claim ghi trong matrix.
