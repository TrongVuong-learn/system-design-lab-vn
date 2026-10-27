# QA13-F1 regression — AI mô phỏng góc nhìn học sinh

Mode regression, Minh definition1.0.0. Phạm vi finding QA13-F1 được parent giao; không đọc source/engine/test. Local http://127.0.0.1:4173, branch codex/qa13-animated-games, base4e624da + sửa chưa commit theo parent. Fingerprint05d66a798997c44b do parent cung cấp; tester chưa tự xác minh bundle.

## Kết luận
QA13-F1 không còn tái hiện trong ma trận đã thử. Cả3 game ×390/320×normal/reduced-motion (12 tổ hợp) sau first tap có nút và toàn SVG cùng vùng nhìn, trên thanh nav khoảngy779. Replay khi hình đang hiện không cuộn thêm. Replay khi hình bị khuất đưa hình trở lại vùng nhìn và giữ Lượt2/6. Focus vẫn trên nút vừa tap. Không phát hiện defect mới trong phạm vi regression.

## Thực hiện
Chromium context mới riêng cho từng tổ hợp, viewport390×844 hoặc320×844 CSSpx, hasTouch=true/isMobile=true/deviceScaleFactor1. Đây là emulation, không phải điện thoại thật. Mở route #/games/balance, #/games/cache, #/games/queue; riêng smoke cache390 còn đi từ trang danh sách qua Vào chơi.
1. Mở trang, chờ nút hiện; đo scrollY và sau2 animation frames: đều0, không tự cuộn khi mở.
2. Tap lần đầu Gửi máy A / Đọc nguồn /1worker. UI lần lượt A3, cachev1 đúng1/1 chi phí3, queue xử lý2/chờ0 chi phí1; Lượt2/6. Chụp ảnh và đo bounding box của nút/SVG đang render.
3. Tap Xem lại lượt khi hình đang hiện: scrollY giữ nguyên ở cả12 tổ hợp, focus= Xem lại lượt.
4. Cuộn lên đầu rồi reload, chờ Lượt2/6: scrollY=0 ngay sau render và sau2frames ở cả12 tổ hợp. Phiên được resume mà không tự đưa xuống hình. Không có nhãn đang lưu/đã lưu quan sát được; không thử reload giữa ghi.
5. Vòng riêng12 context mới: sau tap đầu, đặt viewport sao nút replay ởy700 (mô phỏng vị trí cuộn của người dùng), SVG bắt đầu khoảngy756, phần lớn khuất. Tap replay: toàn SVG vềy318–526 tại390, y339–505 tại320, nút hành động vẫn hiện; Lượt2/6 giữ nguyên. Không thao tác vào storage/source để tạo trạng thái.

## Vị trí sau tap đầu
Normal và reduced có cùng bounding box. Tọa độ theo CSSpx.

| Game | Rộng | Nút hành động y | Hình chính y |
| --- | --- | --- | --- |
| balance | 390 | 397.7–445.7 | 537.7–745.3 |
| cache | 390 | 178.3–226.3 | 318.3–525.9 |
| queue | 390 | 178.6–226.6 | 318.6–526.3 |
| balance | 320 | 398.2–446.2 | 538.2–703.2 |
| cache | 320 | 199.6–247.6 | 339.6–504.6 |
| queue | 320 | 397.7–445.7 | 537.7–702.7 |

scrollWidth bằng innerWidth ở cả12 tổ hợp, không tràn ngang trong trạng thái đã thử. Nhãn focus sau first tap lần lượt Gửi máy A / Đọc nguồn /1worker. Đọc nguồn/các nút worker và hình sau sửa có thể xem cùng lúc; tại320 queue và balance phần3bước có thể cần cuộn nhưng hình chính không bị nav che.

## Bằng chứng
- reg-cache390-first.png: đã xem, firsttap cache390 từ danh sách.
- reg-queue-390-no-preference-first.png: đã xem, nút và toàn hình queue390.
- reg-balance-390-no-preference-first.png: đã xem, toàn hình balance trên nav.
- reg-cache-320-reduce-first.png và reg-queue-320-reduce-first.png: đã xem, kết quả tĩnh reduced vẫn có hình/nhãn.
- reg-queue320-replay-from-offscreen.png: đã xem, replay đưa SVG vào giữa viewport.
- Các ảnh khác đặt tên reg-{game}-{width}-{motion}-{first|replay}.png.
- regression-measurements.json và regression-replay-measurements.json lưu số đo UI của cả12 tổ hợp mỗi vòng. Trường turn=1 trong replay JSON nghĩa locator Lượt2/6 xuất hiện đúng1lần, không phải lượt1.

## Giới hạn
Không chạy lại6lượt kết thúc ở lượt regression vì F1 liên quan vùng nhìn; các nhánh kết thúc đã ở report first-use. Không đo tốc độ/cuộn từng frame, không test thiết bị thật/desktop/screenreader. Kiểm không tự cuộn chỉ trong thời điểm render+2frames và replay khi hình đã hiện; không khẳng định mọi tình huống lifecycle. Không suy ra learning gain. Không đổi source, không dừng server parent. Browser do tester tạo đã đóng.
