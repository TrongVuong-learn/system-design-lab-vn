# QA-07 — cập nhật nền tham chiếu và review kiến thức

Owner root; user yêu cầu15/10/2026. Baseline application f5ab3182879a212c7f3ce4456cf00a37d9d9b029.

Trình tự: nghiên cứu nguồn sơ cấp → Astra medium cập nhật profile/reference guide → parent kiểm evidence/TOML/checksum → Sol low đọc profile mới và review → parent phân loại findings. Runtime giữ gpt-6-sol low.

Phạm vi research: giao thức, bảo mật TLS/danh tính, cache/replication/queue, metrics/capacity và OS concurrency cho nội dung L0 kế tiếp. Tài liệu ghi section/version/ngày, phản ví dụ và giới hạn; không gọi đây là huấn luyện model hoặc bảo đảm không sai.

Phạm vi review: inventory14 bài beta và1 bài ôn; review sâu TLS và school-day mới, gợi ý/quan sát13 bài theo rủi ro. Claim matrix ghi phần thực sự đọc/nguồn/trace; phần thiếu evidence giữ insufficient-evidence. Không tái dùng nhãn beta-checked làm chứng minh. Reviewer chỉ đọc/kiểm/report, không sửa source/phát hành.

Acceptance: profile1.1.0 parse được, runtime không đổi, reference guide có nguồn thực đọc, checksums khóa; report và matrix có commit/model và evidence tái lập. AI không đóng pilot người thật hay chứng nhận36 module/6 level/7 nhánh đầy đủ. Findings được parent xác minh trước mọi sửa; task hiện không bao gồm tự phát hành thay đổi ứng dụng.
