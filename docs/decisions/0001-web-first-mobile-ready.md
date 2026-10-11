# ADR 0001 — TypeScript, web mobile trước và app sau

Trạng thái: đề xuất dùng làm baseline triển khai. Đây là quyết định thiết kế, chưa phải stack đã cài hoặc kết quả benchmark.

## Bối cảnh

Sản phẩm có bài đọc tiếng Việt, hình/SVG, thao tác từng bước, mô phỏng và hoạt động thiết kế; người dùng chính giai đoạn đầu học trên trình duyệt điện thoại. App chỉ triển khai sau khi web được kiểm chứng. Phải giữ học liệu dễ hiểu và đủ sâu, hoạt động tốt với trợ năng và mạng yếu.

## Quyết định

Chọn **TypeScript + React DOM + Vite** cho web. Tách engine, mô hình học tập và schema nội dung thành package độc lập UI. Thêm PWA theo một mốc nghiệm thu riêng. Khi đủ điều kiện phát hành app, thử **Capacitor** với bundle web đã build; bổ sung lưu trữ, lifecycle, deep link và chức năng native cần thiết.

TypeScript là ngôn ngữ chính cho UI, engine, công cụ build nội dung và API tương lai. HTML/CSS dùng cho presentation; Markdown/JSON cho học liệu; SQL khi thêm database. Python chỉ bổ sung nếu phát sinh pipeline AI/data cần thư viện tương ứng. Swift/Kotlin chỉ cần khi viết hoặc sửa tích hợp native cụ thể.

## Các phương án đã so sánh

| Phương án | Lợi thế trong dự án | Đánh đổi / quyết định |
| --- | --- | --- |
| React + Vite → Capacitor | Giữ HTML/CSS/SVG và phần lớn presentation web; cùng TypeScript cho core | Chọn baseline. App dùng giao diện web trong native container; phải kiểm tra thiết bị thật |
| Expo / React Native + web | Phù hợp nếu native là ưu tiên ngang web; giữ được core TypeScript và mô hình nội dung | Phương án thay thế khi yêu cầu native trở thành trọng tâm; DOM/CSS web cần renderer hoặc tích hợp riêng |
| Flutter / Dart | Phù hợp đội ngũ Dart và trải nghiệm ứng dụng có đồ họa tùy biến sâu | Chưa chọn: nội dung thiên về tài liệu; engine TS không trực tiếp trở thành Dart |
| Next.js cho website | Hữu ích khi server rendering, SEO, web backend là yêu cầu đầu tiên | Chưa cần cho lab chạy phía client. Các tính năng server không tự đóng gói vào app; có thể bổ sung lớp website công khai sau |

Capacitor hỗ trợ thêm vào một ứng dụng JavaScript có bundle web và `index.html`. [Tài liệu cài đặt](https://capacitorjs.com/docs/getting-started)

Expo hỗ trợ web và static rendering; component DOM viết riêng cho web không tự render thành native. Expo DOM components là cơ chế dùng WebView cho mã web. [Expo Web](https://docs.expo.dev/workflow/web/), [Expo DOM](https://docs.expo.dev/guides/dom-components/)

Flutter nêu các đánh đổi của nội dung thiên về tài liệu/text và hướng kết hợp HTML khi phù hợp. Đây là lý do lựa chọn theo loại sản phẩm, không phải kết luận Flutter thiếu khả năng trợ năng. [Flutter Web FAQ](https://docs.flutter.dev/platform-integration/web/faq)

## Phạm vi tái sử dụng

- Engine, rubric xác định, schema, ID, nội dung và fixtures dùng lại nếu giữ độc lập browser/runtime.
- Capacitor dùng bundle web, nhưng storage, authentication, bàn phím, safe area, Back, deep link và vòng đời app cần triển khai/kiểm chứng riêng.
- Nếu chuyển Expo native, giữ core TS và nội dung; lên kế hoạch cho presentation native, runner và adapter. Không cam kết phần trăm tái sử dụng khi chưa thử.
- Thiết bị, trình duyệt và app có vùng lưu riêng; việc chuyển tiến độ cần export/import hoặc sync.

## Điều kiện xem lại quyết định

Thử lab đại diện trên Android/iPhone mục tiêu. Chỉ đổi sang Expo native khi có bằng chứng về giới hạn WebView ảnh hưởng hoạt động cốt lõi sau tối ưu hợp lý, hoặc nhu cầu sản phẩm chuyển sang native sâu. Quyết định dựa trên hành vi thực, trợ năng, hiệu năng và công sức vận hành.

App được nghiệm thu riêng về offline, lifecycle, storage migration, signing và phân phối. Quy trình store có kiểm duyệt riêng; khả năng đóng gói không đồng nghĩa tự động được phát hành. [Capacitor iOS deployment](https://capacitorjs.com/docs/ios/deploying-to-app-store)

Chi tiết: [kiến trúc](../engineering/ARCHITECTURE.md), [thiết lập](../engineering/SETUP.md), [roadmap](../delivery/ROADMAP.md).
