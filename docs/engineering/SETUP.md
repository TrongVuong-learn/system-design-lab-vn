# Hướng dẫn thiết lập dự án

Trạng thái: hướng dẫn cho milestone bootstrap; chưa chạy các lệnh cài đặt hoặc tạo ứng dụng trong repository này. Những lệnh kiểm tra của sản phẩm chỉ dùng sau khi milestone tạo script/config tương ứng hoàn tất.

## 1. Môi trường và phiên bản

Baseline đề xuất: **Node.js 24 LTS**, **pnpm 11.25.0**, TypeScript strict và Git. Chọn patch Node 24 hiện được hỗ trợ khi bootstrap, ghi đúng patch vào `.node-version` và dùng cùng patch trong CI. Production nên dùng dòng LTS theo [chính sách Node.js](https://nodejs.org/en/about/previous-releases).

Kết quả kiểm tra môi trường khi lập kế hoạch: máy đang có Node `v26.11.1`, npm `11.20.0`, pnpm `11.25.0`. Đây là trạng thái đã quan sát, không phải baseline đã được áp dụng. Dùng version manager hoặc phương thức cài chính thức để chọn Node 24 cho riêng dự án; hướng dẫn này chưa thay đổi runtime máy.

Khóa pnpm bằng `packageManager`; commit lockfile; CI dùng `pnpm install --frozen-lockfile`. Không phụ thuộc việc Corepack có sẵn trong mọi bản Node. Nếu chưa có pnpm, dùng phương thức trong [tài liệu cài đặt pnpm](https://pnpm.io/installation) và chọn phiên bản đã chốt; không tự nâng cả repository theo một phiên bản `latest` trong CI.

Kiểm tra đầu vào:

```sh
node --version
pnpm --version
git status --short
```

## 2. Bootstrap workspace

Làm trong root repository hiện tại. Giữ nguyên các tài liệu sản phẩm. Tạo root `package.json` ban đầu:

```json
{
  "name": "system-design-lab",
  "private": true,
  "packageManager": "pnpm@11.25.0",
  "engines": { "node": ">=24 <25" }
}
```

Tạo `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Workspace và giao thức `workspace:` theo [pnpm Workspaces](https://pnpm.io/workspaces). Cấu trúc package tham khảo [ARCHITECTURE.md](ARCHITECTURE.md).

Bootstrap web bằng template React/TypeScript:

```sh
pnpm create vite apps/web --template react-ts --no-interactive
```

Đây là bước khởi tạo một lần; ghi lại phiên bản generator/dependencies được chọn và kiểm tra trước commit lockfile. Người tham gia dự án về sau clone và install từ lockfile, không chạy lại generator. Vite cung cấp template `react-ts`. [Vite Getting Started](https://vite.dev/guide/)

Sau khi tạo, đặt tên package web là `@sdl/web`, `private: true`. Tạo ba package private: `@sdl/content-schema`, `@sdl/learning-core`, `@sdl/simulation-engine`, mỗi package có `src/index.ts`, `package.json`, cấu hình TypeScript và lệnh typecheck/test. Dùng exports công khai; không import xuyên vào nội bộ package khác.

Các bước thêm dependency sau khi package đã tồn tại:

```sh
pnpm --filter @sdl/web add react-router
pnpm --filter @sdl/content-schema add zod
pnpm --filter @sdl/web add '@sdl/content-schema@workspace:*' '@sdl/learning-core@workspace:*' '@sdl/simulation-engine@workspace:*'
pnpm --filter @sdl/learning-core add '@sdl/content-schema@workspace:*'
pnpm --filter @sdl/simulation-engine add '@sdl/content-schema@workspace:*'
pnpm add -Dw typescript vitest @playwright/test eslint prettier tsx
pnpm --filter @sdl/web add -D @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
pnpm install
```

Sau mỗi nhóm dependency, chạy kiểm tra tương thích và khóa phiên bản. Không cần Docker, database, tài khoản cloud hoặc native SDK để chạy bài đầu.

## 3. Cấu hình phải có ở milestone bootstrap

- TypeScript: strict, kiểm tra truy cập index và null; cấu hình môi trường DOM chỉ ở web/adapter. Core không dựa vào global browser.
- ESLint/formatter thống nhất; quy tắc chặn core import UI/browser/native SDK. Các script core phải fail khi không có tests, không dùng kết quả kiểm tra rỗng làm bằng chứng.
- Web: router, error boundary, design tokens mobile, mock lesson fixture, code splitting và worker entry.
- Package exports: có typecheck ở nguồn; build output rõ khi một consumer Node cần package đã biên dịch.
- `.gitignore`: dependencies, build, test output, secrets, local overrides; giữ `.env.example` với placeholder.
- CI: runtime/package manager đúng version, cài theo lockfile, kiểm tra cấu trúc nội dung và mã nguồn.

Nhóm script sản phẩm phải được hiện thực ở M1; đây là hợp đồng dự kiến, chưa phải lệnh đang có:

| Lệnh ở root | Trách nhiệm |
| --- | --- |
| `pnpm dev` | Chạy web development server |
| `pnpm content:check` | Schema, IDs, prerequisite, reference, trạng thái xuất bản |
| `pnpm content:build` | Biên dịch lesson blocks, search index và manifests |
| `pnpm typecheck` | Kiểm tra tất cả app/package đang có |
| `pnpm lint` | Kiểm tra quy ước và ranh giới import |
| `pnpm test:unit` | Core và component behavior |
| `pnpm test:e2e` | Hành trình học trên web |
| `pnpm build` | Content build + web production bundle |
| `pnpm preview` | Xem bundle production cục bộ |

Chỉ công bố README là “chạy được” sau khi một checkout sạch chạy đúng bộ lệnh trên. [Vitest](https://vitest.dev/guide/) và [Playwright emulation](https://playwright.dev/docs/emulation) là tài liệu cấu hình kiểm thử; giả lập không thay thế thiết bị thật.

## 4. Cấu hình môi trường

Ban đầu web không cần secret hoặc backend URL. Khi có API, `.env.example` chỉ chứa ví dụ các biến công khai như `VITE_API_BASE_URL` và `VITE_APP_TARGET=web`. Mọi biến được đưa vào bundle phải coi là công khai.

Khi thêm API: `DATABASE_URL`, credentials xác thực và AI key ở môi trường server; không đặt vào biến frontend. Tách development/staging/production; không dùng dữ liệu học sinh thật làm fixture. Docker Compose cho PostgreSQL chỉ thêm ở milestone API với phiên bản DB và migration được kiểm chứng.

## 5. Local preview và CI/CD

Kiểm tra hàng ngày trên viewport 360/390/430 px, thêm 320 px, tablet và desktop. Thử thiết bị thật iOS/Android cho bàn phím, safe area, mạng yếu, lifecycle và lưu trạng thái. Khi chia sẻ dev server qua LAN, dùng mạng kiểm thử tin cậy; service worker cần môi trường được trình duyệt coi là secure context nên kiểm tra PWA qua HTTPS preview hoặc localhost phù hợp.

Luồng PR dự kiến: frozen install → content check → typecheck/lint → unit/invariant tests → production build → E2E quan trọng → artifact preview. Khi nội dung thay đổi, bổ sung kiểm tra trace/assessment liên quan và review cách giảng. Chỉ phát hành artifact đã qua gate, lưu commit/content/engine version; rollback về artifact trước.

Web có thể triển khai trên static hosting/CDN. Nếu dùng Sites, làm theo workflow của Sites và đặt static directory đúng output; không giả định API Node được host trong cùng runtime. Khi GitHub chưa được kết nối, cấu hình `.github/workflows` chỉ là source cấu hình, chưa phải pipeline đang hoạt động.

## 6. PWA sau vertical slice

Đánh giá `vite-plugin-pwa` cùng phiên bản Vite được khóa; service worker update theo cơ chế thông báo và checkpoint trước khi đổi version. [Vite PWA](https://vite-pwa-org.netlify.app/guide/)

Tạo manifest/icons, offline route, downloadable lesson manifest, cache policy và màn hình quản lý gói. Test download gián đoạn, thiếu tài nguyên, cập nhật gói, mất mạng và mở lại. Không precache toàn bộ giáo trình hoặc dữ liệu cá nhân của API.

## 7. Capacitor sau khi web đạt gate

Tạo `apps/mobile/package.json` private tên `@sdl/mobile`. Dùng các package Capacitor cùng dòng phiên bản đã kiểm tra, rồi thêm iOS/Android. [Capacitor installation](https://capacitorjs.com/docs/getting-started)

```sh
pnpm --filter @sdl/mobile add @capacitor/core @capacitor/android @capacitor/ios
pnpm --filter @sdl/mobile add -D @capacitor/cli
pnpm --filter @sdl/mobile exec cap init
```

App ID được chọn theo tên miền/đơn vị sở hữu trước khi tạo native project. Cấu hình `webDir: '../web/dist-native'`. Tạo script `build:mobile-assets` ở web: build mode native vào `dist-native`, không đăng ký service worker website và sử dụng runtime adapter phù hợp. Nếu web adapter import Capacitor SDK, package web phải khai báo dependency tương ứng.

Sau khi đã có script/config và Xcode/Android Studio/SDK tương thích:

```sh
pnpm --filter @sdl/web build:mobile-assets
pnpm --filter @sdl/mobile exec cap add ios
pnpm --filter @sdl/mobile exec cap add android
pnpm --filter @sdl/mobile exec cap sync
pnpm --filter @sdl/mobile exec cap open ios
pnpm --filter @sdl/mobile exec cap open android
```

`cap add` chỉ chạy lúc tạo platform; các lần sau build rồi sync. Thử bằng local assets, deep links, Back, keyboard, offline, resume và storage migration trên thiết bị. Signing, tài khoản store, metadata và review là phần việc phát hành riêng; không nằm trong bootstrap web.
