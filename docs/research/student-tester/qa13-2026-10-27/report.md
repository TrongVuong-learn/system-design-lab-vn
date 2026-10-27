# QA13 — AI mô phỏng góc nhìn học sinh

Mode first-use, Minh definition 1.0.0. Chromium context riêng, 390×844 CSS px, touch, deviceScaleFactor 1; emulation, không phải điện thoại thật. Production https://system-design-lab-vn.vercel.app/#/games. Parent xác minh master 4e624dafa99d41ad185ead60ca21946049a5c03e / fingerprint 465a632d01c85089; tester chưa tự xác minh bundle. Không đọc lịch sử/code/đáp án.

## Báo cáo sớm: Chia tải, giữ nhịp
Từ danh sách Game mở game 1 tại #/games/balance. Mở/đóng Cách tính mỗi lượt; luật giải thích đơn vị/nhịp, gói nguyên và tổng16. Dự đoán gói3 vào A làm A=3; UI đúng3/8. Xem lại lượt giữ Lượt2/6. Cố ý gửi toàn bộ6 gói vào A để thử nhánh thất bại; A16/B0, Kết thúc phiên, phản hồi “Thử một cách khác nhé.” và giải thích trọng lượng. Reload giữ kết quả và nhật ký6 lượt. UI không có chỉ báo đã lưu được quan sát; reload thực hiện sau khi kết quả/nhật ký xuất hiện, không kết luận lỗi mất dữ liệu.

Ảnh balance-start.png (đã xem), balance-action.png (đã xem), balance-end.png. Ở thao tác đầu, nút gửi và hình hai máy cùng viewport; phần ba bước/chú giải phía dưới cần cuộn. Chưa có defect xác nhận. Các game khác/320px/reduced-motion đang tiếp tục.

## Game2: Đừng giao bản cũ
Route #/games/cache. Mở/đóng luật. Dự đoán cache trống không giao được tin; chọn Đọc cache có chủ ý, UI 0/1, chi phí1 và Sai / trống ×. Xem lại lượt không tăng Lượt2/6. Đọc nguồn lượt2 cho v1, đúng1/2 chi phí4. Cố ý Đọc cache lượt3 khi nguồn v2/cachev1: phản hồi sai cụ thể. Hoàn tất bằng nguồn/nguồn/cache: đúng4/6, chi phí12, Thử một cách khác nhé. Reload giữ kết thúc. Chơi lại rồi nguồn/cache xen kẽ6 lượt: đúng6/6, chi phí12, Đạt mục tiêu!
Ảnh cache-empty.png và cache-source.png đã chụp/xem. Quan sát cần xác minh thêm: ở lần tap đầu từ đầu trang, nút y683 nhưng toàn hình nằm dưới thanh điều hướng (ảnh cache-empty); sau cuộn để replay, nút và hình cùng viewport. Thuật ngữ cache chưa có nút glossary trên game; luật mô tả hành vi nhưng chưa gọi rõ là bản sao lưu tạm (giả thuyết khó hiểu cho người mới, không phải kết luận hiểu sai).

## Game3: Qua giờ cao điểm
Route #/games/queue. Luật mở/đóng được, nêu việc vào trước, dư6 chỗ mất trước khi worker xử lý, mỗi worker xử lý2 và tốn1/lượt. Dự đoán chọn1 worker cho2 việc đầu xong2/chờ0; lượt6 việc tiếp xong2/chờ4: UI đúng. Replay giữ Lượt3/6. Cố ý giữ1 worker cả6 lượt để thử nhánh mất việc: kết thúc xử lý12/16, chờ2, mất2, chi phí6/8; nhật ký lượt4 mất2. Reload giữ toàn bộ số và nhật ký. Chơi lại [1,2,1,2,1,1] worker cho16/16, chờ0/mất0/chi phí8, Đạt mục tiêu!
Ảnh queue-first.png đã xem: tương tự cache, nút thao tác đầu hiện ngay trên thanh điều hướng nhưng hình dưới vùng nhìn. queue-end.png lưu toàn trang. Chưa kiểm chứng trên học sinh thật.

## Kết quả bổ sung và phạm vi hoàn tất
- Balance chơi lại chuỗi A,A,B,A,A,B đạt A8/B8 và “Đạt mục tiêu!”.
- Cả3 game thử320×844 touch: thao tác và Xem lại lượt dùng được; document scrollWidth=320 bằng innerWidth=320, không tràn ngang trong các trạng thái đã thử. Ảnh balance-320-replay.png, balance-320-reduced.png, cache-320-replay.png, cache-320-reduced.png, queue-320-replay.png, queue-320-reduced.png. Đã xem ảnh reduced cả3 và replay cache/queue. Sau cuộn đến replay, nút hành động và phần hình chính cùng vùng nhìn; phần danh sách ba bước có thể nằm dưới thanh nav.
- Emulate prefers-reduced-motion: reduce được xác nhận matchMedia=true. Xem lại lượt giữ số lượt/chi phí; ảnh reduced thể hiện kết quả tĩnh, không còn dòng “Đang minh họa lượt vừa chọn”. Văn bản kết quả vẫn có. Không đo chuyển động từng frame hoặc kiểm tiền đình trên người thật.
- Reload phiên đang dở ở Lượt2/6 của từng game tại320 giữ Lượt2/6. Không thấy trạng thái “đang lưu”/“đã lưu”; chỉ xác nhận số hiển thị trước/sau reload. Không thử reload giữa ghi dữ liệu.
- Không có bước story/prediction/transfer tách như bài học; dùng lời giới thiệu→dự đoán đã ghi→hành động→phản hồi cuối/chơi lại. Không mở bài liên quan vì phạm vi3 game. Không có tap glossary quan sát được ở các game; Cách tính mỗi lượt mở/đóng được.

## Finding xác nhận — QA13-F1, P2: bỏ lỡ hoạt ảnh đầu ở390px
Route #/games/cache và #/games/queue.
Bước tái hiện độc lập: context mới390×844 touch→#/games→Vào chơi game2 hoặc3→không cuộn→tap “Đọc nguồn” hoặc “1 worker”. Thử lại trong context riêng verifyContext; không cần mở luật hoặc dữ liệu cũ.
Expected: sau chọn hành động, người học nhìn thấy diễn biến vừa gây ra (ít nhất phần hình chính), hoặc có chỉ dẫn rõ đưa tới diễn biến.
Actual: vẫn ở đầu trang, số liệu đã sang Lượt2/6 nhưng toàn bộ hình nguồn/cache/người nhận hoặc hàng đợi/worker nằm dưới màn hình. Thanh điều hướng cố định bắt đầu khoảngy780. Nút Đọc nguồn y683.25–731.25; Xem lại lượt y767.25–811.25 nên gần như bị nav che. Nút1worker y705.64–753.64; Xem lại lượt y789.64–833.64 bị nav che hoàn toàn. Người học phải tự cuộn tìm hình rồi replay; không phải lỗi không có replay.
Bằng chứng đã chụp và xem: [cache-fresh-first-tap.png](cache-fresh-first-tap.png), [queue-fresh-first-tap.png](queue-fresh-first-tap.png); lần khám phá đầu cũng cùng hành vi ởcache-empty.png/queue-first.png.
Đề xuất: sau hành động đưa cụm nút+hình vào vùng nhìn (tính phần nav), hoặc giảm chiều cao trước vùng tương tác; giữ replay sẵn thấy. Parent kiểm chứng và chọn cách sửa.

## Giả thuyết khó hiểu, không phải lỗi đã chứng minh
QA13-H1, P3: “Cache” và “worker” xuất hiện trong intro/nút nhưng không có định nghĩa tiếng Việt/tap từ mới trên trang game. Luật giải thích chức năng và chi phí, giúp suy luận; tuy nhiên người chưa học lập trình có thể cần một câu “bản sao tạm” / “bộ phận xử lý việc”. Cần pilot thật để xác nhận mức cản trở.
QA13-H2, P3: game cache đổi nổi bật dãy nguồn sang lượt kế tiếp ngay khi hình còn ghi “Diễn biến lượt N”. Ví dụ sau đọc nguồn lượt2, dãy nổi v2 nhưng hình ghi Nguồn v1 và cachev1. Nhãn lượt đã phân biệt, nên không gọi là sai dữ liệu. Có thể làm người mới phân tâm khi so phiên bản; cân nhắc nhãn “lượt tiếp theo” rõ hơn. Không đo được hiểu nhầm thật.

## Điểm tốt và giới hạn
Luật cụ thể đủ để tính tay các chuỗi đã thử; kết quả đúng/sai có lý do và nhật ký từng lượt. Nguồn/cache và hai máy có đường nối, điểm đến, số liệu; hàng đợi có6 ô, worker và xong/mất/chờ. Dấu ✓/× bổ sung màu. Replay không đổi điểm/lượt. Chơi lại đặt về lượt1. Giảm chuyển động vẫn đọc được kết quả. Mọi mô phỏng ghi “Chuyển động minh họa, không phải tốc độ thật.”
Chưa thử desktop, thiết bị thật, trình đọc màn hình, offline, các tổ hợp thao tác toàn bộ, video/frame-by-frame, tốc độ animation, chi phí vượt ngân sách bằng3worker cả6lượt hoặc nguồn cả6lượt. Không có kiểm định code/engine, không đọc rubric, không đánh giá learning gain hoặc điểm hiểu. Không thay pilot/human review. Production fingerprint chỉ được parent xác minh, tester chưa tự kiểm bundle. Browser do tester tạo đã đóng khi kết thúc; không tạo server.
