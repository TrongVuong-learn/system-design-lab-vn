# EDU-02 — Pilot học sinh, vòng 1

Trạng thái: **đã chuẩn bị tài liệu; 0 buổi thực tế, chưa tuyển/xác nhận người tham gia**. Không có kết quả hay kết luận học sinh hiểu bài. Phiên bản bộ pilot: 1, ngày 2026-10-13.

Baseline dự kiến: commit `4032361bdcd502b8a18dac3bb924b3f492cc3045`, engine 1.1.0, lesson version 1. [Website](https://system-design-lab-vn.trongvuong-working.chatgpt.site/). Trước mỗi buổi, người điều phối xác nhận bản đang thử; không đổi bài giữa một vòng mà không ghi phiên bản riêng.

## Mục tiêu và phạm vi

Kiểm tra học sinh cấp 3 có tự bắt đầu, đọc thuật ngữ trên điện thoại, hiểu quan hệ nguyên nhân–kết quả và giải thích một tình huống mới được không. Phân biệt vấn đề giao diện với kiến thức chưa hiểu. Đây là nghiên cứu định tính để sửa bài, không đo hiệu quả giáo dục cho toàn bộ học sinh.

Theo TEACHING_GUIDE, chọn vòng nhỏ 5–8 học sinh; đề xuất vận hành đầu tiên là 6, gồm 4 bạn chưa lập trình và 2 bạn đã học cơ bản. Đây là mục tiêu tuyển, chưa phải danh sách có thật. Ưu tiên điện thoại thật, có Android/iOS nếu người tham gia có sẵn; ghi môi trường thực tế, không coi emulator là điện thoại thật.

Mỗi bạn thử bài cache và một bài mới, khoảng 40–45 phút, được dừng/nghỉ bất cứ lúc nào. Phân bổ dự kiến: metrics 2 bạn, DNS 2, transport 1, capacity 1; đổi theo điều kiện nhưng phải ghi lại. Các nhóm 1–2 người chỉ tìm vấn đề ban đầu; không đủ đóng gate pilot của từng bài. Những bài mới phải có vòng tiếp theo với thêm người mới, hướng tới ít nhất 5 quan sát độc lập/bài. Gate M2/cache không thay thế gate L0 hoặc 36 module.

## Dùng bộ tài liệu

1. Người điều phối đọc [kịch bản và rubric](FACILITATOR.md).
2. Chỉ đưa [phiếu học sinh](STUDENT.md) cho học sinh, một câu theo thời điểm; không cho xem đáp án/rubric trước.
3. Sao chép [phiếu ghi nhận](SESSION_TEMPLATE.md) và CSV header ra thư mục dữ liệu riêng ngoài Git, ví dụ `.cache/pilot/round-01/`. Dùng mã P01, P02... do điều phối gán; không cần tên, trường, số điện thoại hoặc ngày sinh.
4. Ghi câu trả lời thật trước khi diễn giải. Không điền hàng mẫu vào dữ liệu quan sát. AI có thể hỗ trợ tổng hợp bản đã ẩn danh; AI tự đóng vai học sinh không phải buổi pilot.
5. Tổng hợp lỗi → ticket → sửa → thử lại. Cập nhật EDU-02 bằng bằng chứng thực tế; chưa đổi metadata thành human-reviewed chỉ vì có pilot.

## Trước khi bắt đầu

- Cần người điều phối trực tiếp và học sinh thật. Codex chưa có kênh liên hệ hay khả năng tự quan sát các em; chủ dự án thu xếp buổi và chuyển ghi nhận ẩn danh nếu muốn phân tích tại đây.
- Site hiện được phát hành owner-private; đường dẫn không tự cấp quyền cho học sinh. Thử mở đúng thiết bị trước buổi. Có thể tổ chức có người điều phối trên thiết bị đã được chủ site cho phép sử dụng. Nếu cần truy cập từ xa trên máy riêng, chủ site phải quyết định cấp quyền riêng; tài liệu này không đổi audience và không yêu cầu chia sẻ tài khoản.
- Xác nhận học sinh tự nguyện và người phụ trách buổi học đã thống nhất cách tổ chức. Mặc định ghi chép, không thu âm/quay mặt. Nếu muốn ghi hình, thống nhất riêng trước khi bật.
- Dùng môi trường/phiên học dành riêng cho pilot, ghi rõ trạng thái ban đầu. Nếu thiết bị đang có tiến độ cá nhân, bảo toàn/xuất dự phòng; không xóa database của người dùng. Trường hợp không có phiên mới, ghi là “đã có tiến độ”, không tính như quan sát first-use.
- Kiểm tra truy cập, font/zoom, popup, nguồn điện và quyền dùng thiết bị. Đưa máy tính cầm tay nếu cần: kiểm tra hiểu quan hệ, không thi tính nhẩm.

## Điều kiện quyết định sau vòng thử

Quy tắc nội bộ đặt trước khi xem kết quả, không phải ngưỡng thống kê chuẩn:

- Bất kỳ lỗi chặn học/mất tiến độ hoặc bài dạy cơ chế sai: mở ticket ưu tiên cao, chưa đóng gate liên quan.
- Cùng ngộ nhận hoặc cùng chỗ cần chỉ dẫn xuất hiện ở ít nhất 2 người: sửa và thử lại điểm đó; không kết luận “không lặp lại” với bài mới chỉ có 1 người.
- Với cache, chỉ đề xuất qua vòng đầu nếu đủ 5–8 quan sát thật, ít nhất 4/5 (hoặc 5/6, 6/7, 7/8) hoàn tất thao tác không cần chỉ dẫn và đạt cả hai tiêu chí chuyển giao độc lập; không còn lỗi lặp chưa được thử lại. Đây chỉ là tín hiệu cho nhóm đã thử, còn cần review nội dung.
- Trả lời đúng sau gợi ý được ghi riêng. Phần không thử là NA, không phải 0 hoặc đạt. Không dùng nút “đã hoàn thành” hoặc số thao tác thay cho hiểu bài.
- Mẫu báo cáo phải nêu số người thật, nền tảng, thiết bị, số quan sát từng bài, dữ liệu thiếu, kết quả trước/sau và mức hỗ trợ. Điểm sau cao hơn chưa chứng minh quan hệ nhân quả; có thể có tác động của câu hỏi trước và điều phối.

## Nguồn phương pháp

Bộ pilot theo nguyên tắc quan sát tác vụ, yêu cầu nói suy nghĩ và chỉ dẫn trung lập của [GOV.UK: Using moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing). Cỡ vòng nhỏ tham khảo [GOV.UK: Plan user research](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service), đồng thời giữ phạm vi 5–8 đã chốt trong TEACHING_GUIDE. Các đề bài, rubric và ngưỡng quyết định ở đây được viết riêng cho System Design Lab, chưa phải công cụ đo giáo dục đã được kiểm định.
