# DESIGN-10 — Xưởng hệ thống và Game

Trạng thái: In progress. Owner: Codex. Ngày: 26/10/2026.

Người học cần một website có bản sắc và nơi thử quyết định bằng game riêng với bài học.
Phạm vi: redesign shell/home/catalog/lesson presentation; Game riêng gồm cân bằng tải, cache và hàng đợi; GSAP/Three.js/LottieFiles runtime; bảo toàn ID, đáp án và dữ liệu học.
Điều kiện hoàn tất: game có luật/trace/kết quả/retry/liên kết bài; lưu và tiếp tục phiên game; bàn phím/mobile/reduced-motion/offline/WebGL fallback; unit invariants và E2E; ảnh 320/390/desktop; CI; master và Vercel READY với smoke.
Ngoài phạm vi: multiplayer, tài khoản, chứng nhận, thay nội dung đã duyệt, nâng framework.

Skill được pin ở skills-lock.json. Three.js dùng CloudAI-X/threejs-skills cho yêu cầu “threejs3d”; không tìm thấy skill có đúng tên đó. Scroll Craft áp dụng grammar working surface và choreography, không thêm engine HTML thứ hai vào React. Taste áp dụng app-screen rules; font/kích thước đọc tiếng Việt và controls 44px của repo ưu tiên hơn sample 14px/38px. Animation JSON do dự án tự tạo, phát bằng runtime LottieFiles chính thức; không tuyên bố được tạo trong dịch vụ Creator.

## Kiểm chứng trước PR

- 110 unit tests / 30 files passed; game queue kiểm invariant cả 729 tổ hợp hành động.
- 40 E2E targeted passed: Chromium mobile/desktop, Firefox, WebKit; goals/resume/invalid save/storage failure/keyboard/reduced-motion/WebGL fallback/offline và progress recovery.
- content:check, build/typecheck, lint, format passed. Compatibility học liệu không đổi.
- Browser evidence xác nhận Lottie có pixel và thay frame, canvas Three.js có render, request đi tiếp đúng state, không pageerror.
- Responsive matrix và CI toàn bộ đang chạy; chỉ ghi Done sau CI và production smoke. Kết quả cuối cùng tại PR cùng commit phát hành.
