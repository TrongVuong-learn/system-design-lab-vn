# AI mô phỏng góc nhìn học sinh — bounded retest
Mode regression/repeat-user; Minh persona v1.0.0. Đã biết baseline và đáp án từ run trước, không phải first-use. Context riêng mới; Chromium touch390×844 CSS, thêm320×844; emulation, không điện thoại thật. URL127.0.0.1:4173 parent rebuild; checkout HEAD f8ae271c2c1e9c3618f1742f2efcee84f4e0dffa tự xác minh. Bundle rebuild có thay đổi chưa commit theo parent; không đọc source.

## Payload — #/learn/network
Tìm bài qua Khám phá, predictionB, hai thay đổi lab, case650 để hiện Lợi ích và đánh đổi. Tap “payload” tại “Đường truyền nhanh hơn giảm phần chuyển payload.” ở390: mở “Dữ liệu cần truyền (Payload)”, giải thích “Phần nội dung cần truyền; trong bài là dữ liệu ảnh, không tính phần điều khiển của giao thức.” Có Đóng.
Xem ảnh retest-payload390.png; đổi320 làm popover đóng, tap lại và chụp/xem retest-payload320-open.png. Tap Đóng ở320 thành công. Sau đóng, về390, chờ Đã lưu trên thiết bị, reload: case650 vẫn đúng. Ảnh320 chứa đủ giải thích/Đóng, không cắt cạnh.

## Backlog — #/learn/queue
Qua Khám phá→predictionA→lab hai bước→case4worker. Tap “backlog” tại phản hồi đúng “Cần công suất lớn hơn tốc độ đến để giảm một backlog đã có.”: mở “Việc tồn đọng (Backlog)”, giải thích “Các công việc chưa hoàn thành đang tích lại. Trong bài, đây là số việc còn trong hàng đợi sau mỗi chặng giây.”
Chụp/xem retest-backlog390-open.png và retest-backlog320-open.png. Tap Đóng390 thành công; đổi320 tap lại/Đóng thành công; về390 đợi Đã lưu rồi reload: case4worker vẫn đúng. Ảnh320 đủ nội dung và nútĐóng, không cắt cạnh.

## Outcome và giới hạn
Hai giả thuyết baseline thiếu giải thích tại chỗ nay được xử lý bằng glossary tap. Không xác nhận defect mới trong phạm vi. Không đánh giá learning gain hoặc độ hiểu học sinh thật. Không thử bàn phím/screen-reader, desktop, thiết bị thật, mọi route hay race lưu. Baseline report.md giữ nguyên.
Một screenshot fullpage backlog đầu tự đóng popover trước ảnh; không dùng ảnh đó làm evidence mở. Thử lại viewport screenshot với dialog visible xác nhận mở/đóng; lỗi locator strict từ hidden definition là lỗi harness đã sửa, không finding UI. Snapshot320 đổi viewport tự đóng glossary được ghi là quan sát, không defect.
Browser riêng đóng sau run, server parent giữ nguyên. Không sửa source/commit/deploy.
