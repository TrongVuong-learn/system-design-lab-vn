# Student tester Minh — 2026-10-14
AI mô phỏng góc nhìn học sinh. Persona v1.0.0, Minh 16 tuổi/lớp 10/chưa học lập trình; mode first-use, context Chromium mới, touch 390×844 CSS px. Đây là emulation, không phải pilot thật.

Checkout HEAD xác minh: 4425af078ea484f58aec106698ea39bd49e6218f. URL local http://127.0.0.1:4173/; bundle do parent cung cấp, chưa xác minh mapping bundle với commit độc lập. Đọc persona, README, CONTRIBUTING, WORKFLOW, skill mobile Playwright; không đọc code/JSON/rubric/đáp án/test/report cũ trước khám phá.

## Routing — báo cáo sớm
Đi trang chủ → Khám phá → “Đúng địa chỉ, đúng dịch vụ?” (#/learn/routing). Đọc story/prerequisite; mở “Giải thích từ mới”, tap “Cổng dịch vụ” và “Đóng”. Dự đoán hợp lý là A vì glossary tách IP với dịch vụ; cố ý chọn B để thử nhánh lỗi (không coi là ngộ nhận học sinh), đọc “Cùng nhìn lại nguyên nhân.” rồi chọn lại A. Nút “Mở thí nghiệm” khóa trước chọn dự đoán và mở sau đó.

Lab: gửi tới router → chuyển máy đích → chọn dịch vụ TCP 8080; đổi một yếu tố port sang 9090, đi lại ba chặng và đọc kết quả thư viện cùng IP. Đợi “Đã lưu trên thiết bị”, reload: giữ chặng 3, TCP 9090 và kết quả thư viện. Sang case, chọn B theo lý do port không tạo route; “Thử lại trong thí nghiệm” giữ port 9090. Bỏ route, gửi router: UI báo dừng ở router. Quay case, đáp án B và lời giải giữ nguyên; đợi đã lưu/reload giữ chặng 4 + lời giải. Chưa tap nút lưu hoàn thành ở thời điểm báo cáo sớm.

Không phát hiện defect chặn học trong hành trình đã chạy. Điểm tốt: tên bước tiếp cụ thể, glossary mở/đóng, lựa chọn sai có nguyên nhân và cho sửa, ba trạng thái đường đi mô tả bằng chữ, dữ liệu lab/câu trả lời giữ khi quay và reload. Hình routing là ba thẻ dọc theo cơ chế, không có trục hoặc số đo cần suy luận.

Giả thuyết khó hiểu (P3, chưa xác minh với học sinh): định nghĩa port “Số ở tầng vận chuyển … cùng giao thức và địa chỉ IP” đòi hỏi thêm khái niệm tầng/giao thức trước ví dụ trực tiếp. Story/prerequisite đã giúp giới hạn; có thể thêm câu “cùng máy trường, số này chọn lịch học hay thư viện”. Không coi là lỗi kiến thức.

Ảnh đã chụp và xem: /private/tmp/student-tester-2026-10-14-current/routing-lab.png; /private/tmp/student-tester-2026-10-14-current/routing-case.png. home.png đã chụp, chưa xem. Chưa thử 320px/desktop/cache/hoàn thành.

## Final cập nhật — cache và hoàn thành
Cache (#/learn/cache): từ lộ trình tap thẻ bài; đọc story, mở tooltip cache (“Dữ liệu được giữ để trả lời những lần tra cứu sau.”) và đóng. Dự đoán A/201 có lý do: story nói bản ghi gần chưa đổi. Lab: đổi nguồn 201→205, tap Xem lịch; cache còn201, nguồn205, lượt xem1/cache1/nguồn0/cũ1. Đợi “Đã lưu trên thiết bị”, reload giữ các số và trạng thái. Tap Lấy lịch mới rồi Xem lịch: chuyển sang205. Sang case chọn B vì giữ cũ5 phút vượt yêu cầu1 phút; quay lab qua “Thử lại trong thí nghiệm” giữ dữ liệu, tap Qua1 phút rồi trở lại case vẫn giữ B/lời giải. Đợi đã lưu rồi reload giữ chặng4 và câu trả lời. Tap “Lưu bài đã hoàn thành”, thấy “Đã hoàn thành bài nhập môn”, đợi đã lưu/reload còn hoàn thành.
Routing: đã tap lưu hoàn thành sau báo cáo sớm. Sau hoàn thành cache, quay lộ trình→routing xác nhận vẫn chặng4, B và “Đã hoàn thành bài nhập môn”. Không xem việc chọn đúng/hoàn thành là bằng chứng học sinh hiểu.

Responsive bổ sung: xem ảnh cache case và routing hoàn thành ở320×844; chữ và nút nằm trong cột, không thấy cắt nội dung/đè nhau. Routing đo document scrollWidth=320 với innerWidth=320. Không chạy toàn hành trình ở320. Cache-stale390 ảnh thấy skip link “Đến nội dung chính” đang hiện tại vùng đầu stepper; chưa kiểm định thêm nguồn focus nên chỉ là quan sát chưa xác minh, không kết luận lỗi. Các ảnh cache-stale.png, cache-case-320.png, routing-complete-320.png đã chụp và xem.

Kết luận trong phạm vi: không phát hiện defect tái hiện ảnh hưởng tiếp tục học hoặc mất dữ liệu. Chỉ có giả thuyết P3 diễn đạt glossary port ở trên; cần pilot thật để xác định độ hiểu. Cache tốt ở số liệu có chú thích rõ chỉ đếm Xem lịch, và hình ba nơi nối bằng mũi tên hỗ trợ giải thích nguồn/cache.

Chưa thử: desktop/điện thoại thật, Safari/Firefox, keyboard/screen-reader chuyên sâu, offline, reload lúc đang lưu, các lựa chọn IP khác/port8181, hết hạn cache/thay thời hạn, reset, sai case cache, xem mọi glossary/nguồn/giới hạn, các bài ngoài scope. Homepage chỉ đi UI khám phá; chưa thao tác demo đầu trang. home.png chụp nhưng chưa xem (không dùng làm bằng chứng review). Không đọc code/JSON/đáp án/rubric/test học liệu trong run; không thay source/commit/deploy/server. Browser riêng đóng sau final.
