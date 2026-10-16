# AI mô phỏng góc nhìn học sinh
Mode first-use; persona Minh v1.0.0. Không đo độ hiểu học sinh thật.
Checkout HEAD xác minh f8ae271c2c1e9c3618f1742f2efcee84f4e0dffa; parent cung cấp build 24625a3, bundle chưa tự xác minh. URL http://127.0.0.1:4173/. Chromium context mới, mobile touch 390×844 CSS px; DNS case thêm 320×844. Không đọc code/học liệu/đáp án/lịch sử.

## DNS — #/learn/dns
Từ trang chủ tap Khám phá, chọn thẻ “Tên website tìm ra địa chỉ thế nào?”. Đọc story giữ DNS 5 giây; dự đoán .10 vì bản ghi còn hạn. Cố ý chọn B sai để thử nhánh phản hồi: “Cùng nhìn lại nguyên nhân.”, resolver vẫn dùng .10; chọn lại A. Nút “Mở thí nghiệm” khóa trước dự đoán.
Mở glossary “Thời hạn dùng”: giải thích số giây được giữ cache; tap đóng thành công. Tra lần đầu → đổi IP nguồn → tra lại: cache .10 còn5 giây, nguồn .20, kết quả .10. Chờ “Đã lưu trên thiết bị” rồi reload: chặng3, trạng thái cache/nguồn/kết quả được giữ. Qua5 giây rồi tra; tới case giây5. Cố ý chọn A sai rồi B đúng, case→lab→case giữ đáp án đúng. Tap “Lưu bài đã hoàn thành” xuất hiện “Đã hoàn thành bài nhập môn”.
Ảnh đã chụp và xem: dns-lab390.png, dns-case320.png. Bố cục case320 không thấy cắt chữ hoặc tràn ngang trong ảnh. Chưa test desktop/điện thoại thật/refresh khi đang lưu.
Chưa xác nhận defect. Các lỗi locator exact trong tooling đã sửa bằng tên accessible regex, không coi là lỗi UI.

## Mạng — #/learn/network
Đọc story tải ảnh trường (sau khi quay chặng trước vì dump đầu gặp chuyển trang chưa xong). Dự đoán chỉ phần truyền giảm, chọn A sai có chủ ý rồi B sửa; nút lab ban đầu khóa. Glossary RTT mở/đóng được: trao đổi đi đích và về. Lab ghi ms/1.000ms=1giây, Mbps triệu bit/giây, kB=1.000byte, 1byte=8bit; ba thanh có nhãn và số cụ thể.
Đổi tốc độ8→9: truyền1.000→888,89ms; RTT100/xử lý50 giữ. Đổi RTT100→120: tổng1.058,89ms. Đợi đã lưu rồi reload: giữ120/9/1000 và chặng3. Case poster cố ý chọn575 sai, lời giải100+50+500=650; sửa650. Case→lab→case giữ đúng; ở320px chụp case; completion→đã lưu→reload vẫn hoàn thành và đúng650.
Ảnh network390.png và network-case320.png. Chưa xác nhận defect. Giả thuyết khó hiểu P3: case phản hồi dùng từ “payload” trong “Đường truyền nhanh hơn giảm phần chuyển payload.”, không có giải thích inline ở đoạn này; người chưa học lập trình có thể cần “dữ liệu ảnh” hoặc glossary. Đây là giả thuyết từ UI, không quan sát học sinh thật.

## Hàng đợi — #/learn/queue
Từ Khám phá chọn “Nhận việc chưa phải làm xong”; đọc story câu lạc bộ gửi lời mời, 2việc/người/giây. Dự đoán tăng4 khi đến6/xong2. Glossary Người xử lý mở/đóng: thành phần lấy việc từ hàng đợi. Nút lab khóa trước chọn; cố ý B sai rồi A sửa; lời giải4việc thêm/giây.
Lab bước1: nhận6/xong2/chờ4. Bước2 chờ8; tăng1→2worker, bước3: nhận18/xong8/chờ10. Đã lưu→reload giữ giây3,2worker,18/8/10, chặng3. Case đến8, mỗiworker2: cố ý2worker sai, sửa4; phản hồi nói cân tốc độ chỉ không tăng, cần dư để giảm tồn cũ. Case→lab→case giữ đáp án; 320px screenshot; completion→đã lưu→reload giữ hoàn thành.
Ảnh queue390.png, queue-case320.png đã xem. Không xác nhận defect. Giả thuyết khó hiểu P3: phản hồi case dùng “backlog” trong “Cần công suất lớn hơn tốc độ đến để giảm một backlog đã có.” không có giải thích inline; đề xuất “hàng chờ đã có”. Expected với Minh: câu tiếng Việt tự đủ nghĩa hoặc term có giải thích; actual thuật ngữ tiếng Anh chưa giải thích ở câu đó. Không phải bằng chứng học sinh thật khó hiểu.

## Kết luận phạm vi
Đã chạy ba bài qua story/prediction/lab/case/completion, sai→sửa có chủ ý, glossary touch, lab lưu-confirmed/reload và case-lab-case. Case320 cả3 đã xem ảnh, không thấy tràn/cắt chữ trong ảnh. Bài mạng/queue completion đã xác nhận sau reload; DNS completion thấy từ thẻ khám phá “Đã hoàn thành”. Không test toànsite, desktop, điện thoại thật, offline, assistive technology, race reload đang lưu, đóng/mở browser mới. Không đọc nguồn để kiểm kỹ thuật sâu.
Lỗi tái hiện xác nhận: không có trong phạm vi này. Hai giả thuyết diễn đạt P3 payload/backlog; cần parent cân nhắc thay từ hoặc glossary, cần pilot người thật để kiểm độ hiểu. Số thao tác/hoàn thành không chứng minh learning gain.
Các screenshot full-page đôi chỗ hiện “Đến nội dung chính” do focus tự động của lần thao tác Playwright; chưa kiểm định focus bằng thiết bị thật, không phân loại thành defect touch.
Browser riêng đóng khi kết thúc; server parent giữ nguyên. Không sửa source, commit, deploy, pilot/human-reviewed/EDU-02.
