# EDU-16 — Tìm sách mà không xem mọi mục

Phạm vi: L0.3 nhập môn mảng, duyệt tuần tự và tìm nhị phân. Owner Codex; không claim module đầy đủ. Nguồn Princeton BinarySearch.java và CMU15-122 Lecture4 Search, đọc15/10/2026; trang overview Princeton bị403, không coi trang đó đã kiểm chứng.

Mảng mã chẵn2…2N, N8/32/128, sorted và truy cập vị trí trực tiếp. Mục tiêu2/2N/2N+1. Linear không early-stop theo thứ tự; binary inclusive lo/hi, floor midpoint. Đơn vị số mục được xem, một phép so quan hệ trừu tượng mỗi bước; không CPU instruction/ms. Không chi phí sort/update/memory/network. UI bảng từng bước, giới hạn phạm vi còn lại, không vẽ128ô nhỏ; cùng palette/design bàn thí nghiệm. Đổi config/reset xóa trace, giữ kết quả học; restore chỉ config/step bounded/model1.

Acceptance: tính tay8/cuối linear8 vs binary4;32/cuối32vs6;128/cuối128vs8; đầu linear1; missing binary kết thúc đúng. Unit đối chiếu oracle mọi preset/prefix và forged checkpoint. E2E bốn browser + responsive, hints/terms/reload/import/export/offline; review screenshot320/390/1280. Không human/pilot.

Kết quả: đang thực hiện.
