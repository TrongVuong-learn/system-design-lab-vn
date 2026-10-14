# Kiến trúc kỹ thuật và cấu trúc dự án

Trạng thái: đặc tả triển khai; các thư mục mã nguồn trong sơ đồ là cấu trúc dự kiến. Xem [ADR](../decisions/0001-web-first-mobile-ready.md) để hiểu quyết định stack.

## 1. Ngôn ngữ và công nghệ

**Ngôn ngữ chính là TypeScript; React là thư viện giao diện, Vite là công cụ build.** TypeScript giúp biểu diễn rõ trạng thái bài học, sự kiện mô phỏng và hợp đồng dữ liệu giữa các phần. Chọn một ngôn ngữ cho UI/core/tooling để giảm số hệ sinh thái đội ngũ phải duy trì. Kiểu tĩnh không thay kiểm tra dữ liệu lúc chạy; dữ liệu nhập vẫn qua schema.

JavaScript thuần vẫn làm được sản phẩm nhưng không phải baseline cho số lượng trạng thái và nội dung này. Python được cân nhắc khi có pipeline AI/data riêng; Go/Java cho server chỉ đáng thêm khi yêu cầu và đội ngũ thực tế cần. Giai đoạn đầu chạy mô phỏng phía client nên thêm một ngôn ngữ backend chưa giải quyết ưu tiên hiện tại.

| Lớp | Lựa chọn | Lý do / thời điểm |
| --- | --- | --- |
| UI web | React + TypeScript strict | Hợp bài đọc, component tương tác và sơ đồ; dùng từ đầu |
| Build | Vite | Tạo static bundle, phù hợp lab phía client và bundle cho Capacitor |
| Routing | React Router, route lazy-loading | Điều hướng level/bài và khôi phục vị trí |
| Style | CSS Modules + CSS variables/design tokens | HTML ngữ nghĩa, ít lớp phụ thuộc; mobile là mặc định |
| Sơ đồ | SVG + điều khiển HTML | Bố cục nhỏ và text tương đương; graph editor chỉ thêm khi hoạt động cần |
| Engine | TypeScript thuần | Logical clock, seeded random, replay; không phụ thuộc React |
| Học liệu | Markdown hạn chế + JSON có schema | Biên dịch thành content blocks chung cho nhiều renderer |
| Validation | Zod trong content-schema | Kiểm tra học liệu, cấu hình và bản lưu ở biên dữ liệu |
| Lưu web | IndexedDB | Progress, attempt, checkpoint; localStorage chỉ cho preference nhỏ |
| Offline | Service worker + Cache Storage + content manifest | Thêm sau vertical slice; download có phiên bản và kiểm tra đủ tài nguyên |
| Kiểm thử | Vitest, React Testing Library, Playwright | Core, hành vi component và hành trình người học |
| App | Capacitor | Thử nghiệm sau khi web đạt gate; đóng gói bundle cục bộ |
| API khi cần | TypeScript + Node.js + Fastify | Một API theo module cho sync/tài khoản; chạy ở runtime hỗ trợ Node |
| Database khi cần | PostgreSQL + SQL migrations | Lưu tài khoản, attempts và tiến độ có phiên bản |

Framework/libraries phải được khóa phiên bản sau lần bootstrap được kiểm tra. [Vite](https://vite.dev/guide/), [React Router](https://reactrouter.com/start/declarative/installation), [Zod](https://zod.dev/), [Fastify](https://fastify.dev/docs/latest/)

Ban đầu dùng state cục bộ và reducer theo feature. Chỉ thêm thư viện state/server-query khi có vấn đề cụ thể; engine không phát từng event thành một React state update. API và PostgreSQL là mốc sau, không điều kiện để học bài đầu.

## 2. Monorepo nhỏ, ranh giới rõ

```text
system-design-lab/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/                 # Router, providers, app shell
│   │   │   ├── features/
│   │   │   │   ├── catalog/         # Level, chủ đề, tìm kiếm
│   │   │   │   ├── lesson-player/   # Chặng học, block renderer
│   │   │   │   ├── lab/             # Điều khiển, SVG, kết quả
│   │   │   │   ├── progress/        # Tiếp tục học, bằng chứng
│   │   │   │   └── offline/         # Tải/xóa gói, trạng thái mạng
│   │   │   ├── ui/                  # Button, dialog, tokens, typography
│   │   │   ├── adapters/            # Storage, content, runtime integration
│   │   │   ├── workers/             # Bridge giữa UI và engine
│   │   │   └── styles/
│   │   ├── public/                 # Icon, manifest, tài nguyên công khai
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── mobile/                     # Thêm khi thử app: Capacitor, ios/, android/
│   └── api/                        # Thêm khi cần sync: modules, migrations
├── packages/
│   ├── content-schema/             # Types, validator, version compatibility
│   ├── learning-core/              # Competencies, attempts, progress, rubric
│   └── simulation-engine/          # Event queue, state, models, metrics
├── content/
│   ├── curriculum/                 # Levels, modules, tracks, prerequisites
│   ├── lessons/vi/                 # Metadata, text, blocks
│   ├── activities/                 # Scenarios và assessment config
│   ├── glossary/vi/
│   ├── assets/
│   └── reviews/                    # Kết quả duyệt có phiên bản
├── scripts/                        # Validate/compile/coverage report
├── tests/
│   ├── e2e/
│   ├── fixtures/                   # Input/trace/kết quả chuẩn
│   └── performance/                # Workload và thiết bị tham chiếu
├── docs/                           # Design, engineering, delivery, decisions
├── .github/workflows/              # Khi repository dùng GitHub
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json
├── tsconfig.base.json
├── .node-version
└── README.md
```

Chỉ tạo `apps/api` và `apps/mobile` khi đến milestone tương ứng. Workspace có một lockfile. Component dùng ở một feature ở lại feature đó; chỉ đưa vào `ui` khi có nhu cầu dùng chung. Tránh thư mục `utils` gom mọi loại logic.

Unit test đặt cạnh module (`*.test.ts`); E2E và fixtures tích hợp ở root. Nội dung nguồn được version trong Git; file JSON sinh ra và build output không chỉnh bằng tay.

Quy tắc đặt tên, public API, ownership thư mục và lifecycle thay đổi nằm trong [WORKFLOW.md](../delivery/WORKFLOW.md). Feature nhỏ chỉ tạo các file cần thiết; khi lớn hơn, chia `components/`, `hooks/`, `model/` trong chính feature. Dependency đi qua API công khai, không import xuyên nội bộ feature/package khác.

## 3. Ranh giới phụ thuộc

```text
Web UI → learning-core → content-schema
Web worker → simulation-engine → content-schema (phần scenario)
Content build scripts → content-schema
Web adapters → các interface do learning-core định nghĩa
API tương lai → learning-core + content-schema
Capacitor shell → bundle web + adapter native
```

- `content-schema` không import UI, storage hoặc server framework.
- `simulation-engine` không import React, DOM, IndexedDB hoặc native SDK. Nhận config/seed/command và trả state/events/metrics.
- `learning-core` giữ mô hình học và interface nhỏ như `ProgressRepository`, `ContentRepository`, `SimulationRunner`; không cài storage cụ thể.
- Browser Worker là runner bên ngoài core. React Native tương lai cần runner riêng; không giả định Web Worker dùng nguyên ở mọi runtime.
- Native plugin được gọi qua adapter; không rải import SDK trong component học.
- Các bài không chứa JavaScript tùy ý hoặc JSX. Activity chọn từ registry đã được review.

Chọn modular monolith ở mức ứng dụng và package; simulator minh họa hệ thống phân tán nhưng nền tảng học không cần microservices hoặc Kubernetes từ đầu.

## 4. Mô hình dữ liệu và nội dung

Các thực thể chính: `Level`, `Module`, `Track`, `Competency`, `LessonVersion`, `ActivityVersion`, `Attempt`, `Evidence`, `ProgressCheckpoint`, `OfflinePack`.

Lesson gồm metadata và content blocks: story, explanation, term, prediction, diagram, table, activity, feedback, assessment, source. Markdown được parse ở build thành tập block hỗ trợ; raw HTML/script bị loại hoặc từ chối. ID ổn định, bản nội dung thay đổi có version.

Mỗi attempt lưu tối thiểu: attempt ID, lesson/activity/engine/schema version, seed, cấu hình, dự đoán, số gợi ý, kết quả xác định, phần tự giải thích và trạng thái đánh giá. Mức độ sâu được lưu riêng; đã xem không tương đương đã hiểu hoặc triển khai được.

Pipeline: năng lực → storyboard mobile → nội dung/scenario → validation → review kỹ thuật/cách giảng → pilot → xuất bản version. Catalog chỉ tính học liệu đã phát hành; coverage report theo 6 level, 36 module và 7 nhánh.

## 5. Engine trên điện thoại

Engine dùng thời gian logic, event queue có thứ tự ổn định và seeded random. Không dùng thời gian hệ thống hay random ngoài kiểm soát để quyết định đáp án. Play, Step và đổi tốc độ phát phải cho cùng kết quả với cùng input/version/seed.

Runner gửi snapshot và sự kiện chọn lọc theo nhịp hiển thị, không gửi mọi event vào React. Giới hạn số node, event và thời lượng theo từng hoạt động; vượt giới hạn phải báo rõ. UI có thể giảm số request vẽ mà không bỏ tính toán quyết định kết quả.

Checkpoint sau hành động có ý nghĩa; khi app ra nền, tạm dừng phát và ghi trạng thái. Nếu worker bị hủy, dựng lại từ checkpoint hoặc seed/command log đã lưu; không dựa vào timer tiếp tục chạy nền. Nội dung và câu trả lời đang có được giữ khi worker gặp lỗi.

Kiểm tra đầu tiên: replay, bảo toàn request, TTL, lag, duplicate/idempotency và ý nghĩa metrics. Bộ scenario chuẩn được chạy trong CI độc lập trình duyệt.

## 6. Local-first, offline và sync

**Web ban đầu:** tài nguyên công khai từ CDN; tải lesson theo nhu cầu; lưu học cục bộ bằng IndexedDB. Không gọi API cho mỗi bước mô phỏng. Export/import có schema, giới hạn kích thước và xử lý version không tương thích.

**PWA:** người học chọn tải module. Manifest mô tả lesson, asset, engine compatibility, version và checksum. Chỉ bật nhãn offline sau khi đủ tài nguyên. Tải version mới vào vùng tạm rồi kích hoạt; giữ version cũ trong khi attempt còn dùng. Khi thiếu dung lượng hoặc tài nguyên bị hệ điều hành thu hồi, báo tình trạng và cho tải lại. Service worker không làm engine chạy liên tục khi app đóng. [MDN offline/background](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)

**Sync sau này:** API nhận attempt theo ID để retry không tạo bản trùng; kiểm tra người sở hữu phía server. Attempts là bản ghi riêng; last-position có chính sách giải quyết xung đột rõ. Không dùng riêng đồng hồ thiết bị làm bằng chứng thứ tự hoặc độ thành thạo. Tạo profile cục bộ và luồng chủ động nhập tiến độ khi đăng nhập; không tự gộp dữ liệu của hai tài khoản.

**Native:** nội dung lõi trong bundle; gói tải thêm có adapter phù hợp. Dữ liệu quan trọng cần kiểm chứng tính bền vững và migration. Web storage không tự chuyển sang app; có export/import hoặc tài khoản sync. Tách cache có thể xóa khỏi tiến độ cần giữ.

## 7. Hosting, backend và bảo mật

Web đầu build ra static assets trên CDN/HTTPS. Host cần route fallback phù hợp để mở trực tiếp URL bài học. Chia bundle theo route/activity và chỉ tải engine chuyên sâu khi cần. Nếu cần SEO cho toàn bộ bài công khai, bổ sung prerender cho các trang đọc; client-only SPA không được coi là đã giải quyết SEO đầy đủ.

Có thể dùng Sites để triển khai bản web tĩnh. API Node/Fastify về sau cần host tương thích Node; nếu chuyển API sang Workers, phải có quyết định runtime/driver riêng, không giả định mã server hoặc TCP PostgreSQL chạy nguyên trong Workers.

Khi có tài khoản: dùng giải pháp xác thực đã được duy trì, phân quyền theo owner ở API, validation đầu vào, rate limit và migrations/backup. Khóa AI/admin chỉ ở server; biến frontend là dữ liệu công khai. Học liệu/version được kiểm tra trước phát hành. Ghi lỗi sản phẩm và metrics tối thiểu, không đưa nội dung trả lời hoặc dữ liệu cá nhân học sinh vào telemetry mặc định.

## 8. Lộ trình app và tiêu chí đổi hướng

Web đạt gate → hoàn thiện PWA/offline → thử Capacitor trên Android/iPhone → xử lý storage/lifecycle/deep link → beta native → store release.

Bundle native có đầu vào build riêng để không đăng ký service worker như website. Capacitor `webDir` trỏ đến bundle tĩnh cục bộ; server API vẫn là dịch vụ từ xa khi cần. Back/URL/callback phải được ánh xạ về route trong app và chỉ chấp nhận nguồn dự kiến.

Nếu lab cốt lõi vẫn không đạt yêu cầu trên WebView sau tối ưu có đo đạc, đánh giá Expo native với cùng core TS và content; viết lại presentation cần thiết. Chọn theo bằng chứng, không hứa app được tạo chỉ bằng một lệnh.

## Bảo vệ ghi tiến độ trong bản beta

Adapter IndexedDB dùng giao dịch readwrite để so sánh bản đang lưu với bản mà tab đã đọc, rồi mới ghi checkpoint. Khác nhau thì trả `ProgressConflictError`; UI giữ phiên học và hướng dẫn xuất trước khi reload, không tự gộp hai snapshot. Hàng đợi trong provider giữ thứ tự ghi cùng một tab. Đây là optimistic conflict protection, không phải sync nhiều thiết bị.

IndexedDB database version 2 giữ nguyên object store/key và progress JSON version 1. Upgrade không xóa dữ liệu; tab dùng adapter cũ mở database version 1 sẽ bị từ chối ghi. Quyết định và giới hạn tại ADR 0002. Checkpoint queue/replica/cache được kiểm tra invariant khi khôi phục; checkpoint mô phỏng không hợp lệ trở về trạng thái đầu của lab, không được dùng để chứng minh năng lực đã đạt. Contract attempt/engine version đầy đủ vẫn thuộc ENG-03.

## Registry beta hiện thực trong EDU-04

Pipeline đọc `content/lessons/vi/*.json` và `content/editorial.json`; kiểm tra graph prerequisite, nguồn theo claim và review trước khi sinh catalog. Chỉ beta đã kiểm tra được đưa vào UI. Mười hai bài thử nghiệm không đồng nghĩa 36 module hoàn tất. Contract triển khai và phần chưa làm của ENG-03 ở [ADR 0003](../decisions/0003-beta-editorial-registry.md). Engine metrics/DNS/transport/capacity vẫn thuần TypeScript; renderer chỉ nối trạng thái với adapter progress hiện có.

EDU-04b thêm engine thuần HTTP exchange và thời gian tải lý tưởng; NetworkLabs trình bày thông điệp và phép tính. Không gửi request thật từ học liệu hoặc đưa logic engine vào adapter.

## Đề xuất tích hợp mini-case — EDU-09

[EDU-09 mục 8](../delivery/EDU_09_CASE_STUDY_PLAN.md) đặc tả contract, ranh giới và đường dẫn cho tình huống áp dụng. Giai đoạn đầu đặt case cùng lesson, dùng editorial registry và whitelist activity hiện có; renderer nằm trong lesson-player, cơ chế mô phỏng vẫn thuộc engine thuần. Chưa thêm package hoặc schema thực thi trong đợt kế hoạch.

CASE-01 phải ghi ADR và kiểm tương thích trước khi sửa schema. Giữ progress v1 khi chỉ thêm ngữ cảnh không đổi nghĩa challenge; assessment/attempt mới có version và migration riêng theo ENG-03. Không ghi đè checkpoint bằng scenario preset hoặc chấm lại đáp án cũ theo câu hỏi mới. Danh mục field trong EDU-09 là đề xuất, không đại diện API đã triển khai.

CASE-01–03 đã hiện thực giai đoạn A theo [ADR 0004](../decisions/0004-case-study-context.md): case schema 1, caseReview theo revision và renderer trong lesson-player. Lesson/progress v1, engine và persistence giữ nguyên; contract attempt mới/preset/capstone vẫn là phần tiếp theo.
