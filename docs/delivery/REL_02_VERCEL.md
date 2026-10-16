# REL-02 — Vercel cho bản tự học

Yêu cầu16/10/2026: đưa ứng dụng lên Vercel, cho phép dùng AI khác kiểm tra. Owner Codex. Baseline f9d1334,17 bài/1 ôn; không đổi học liệu/mô phỏng. Không chặn bản học thử vì chưa có reviewer con người; vẫn giữ nhãn và giới hạn thực tế.

Acceptance: artifact build khóa Node24.21.0/pnpm11.25.0; unit/content/type/lint liên quan; Vercel terminal Ready và URL; kiểm shell/assets/SW MIME và cache, route hash và học/resume. Không đăng tài liệu nội bộ/credential; chỉ static artifact khi có thể. Cache SW/index/offline manifest phải revalidate; assets có tên hash cache immutable. Domain mới có IndexedDB riêng, không mất dữ liệu ở domain cũ; export/import để chuyển.

## Kết quả chuẩn bị

- Vercel CLI64.3.1 tra từ npm chính thức, dùng cache ngoài repo, không đổi dependency app.
- `vercel.json` cấu hình root workspace/build/output và cache; `.vercelignore` loại local/internal files; `.vercel/` được Git ignore.
- `scripts/vercel-output.ts` tạo Build Output APIv3 từ artifact đã kiểm integrity. Chỉ18file static, không rebuild lúc upload. Dùng thư mục output mới; không ghi đè gói cũ âm thầm.
- Typecheck/lint đạt;66unit/18files đạt. Test mới xác minh byte/static/hash, cache áp đúng URL, không nuốt URL sai, không đóng gói artifact bị thay hoặc file ngoài manifest.
- SHA25618file khớp toàn bộ artifact EDU-16 đã kiểm E2E. Không thay runtime UI/engine/content, nên không chạy lại192E2E cho thay đổi đóng gói này. Vercel HTTP/CDN/smoke đã xác nhận sau deploy, xem phần kết quả cloud.
- `docs/research/AI_REVIEW_HANDOFF.md` có prompt, nguồn/trace, phản ví dụ và các ngộ nhận trọng điểm cho AI khác.

## Kết quả cloud —16/10/2026

Đã đăng nhập theo xác nhận của người dùng và phát hành production bằng prebuilt, không rebuild artifact.

- URL chính: https://system-design-lab-vn.vercel.app
- Workspace: `trongvuonglearns-projects`; project `system-design-lab-vn`.
- ProjectID: `prj_TjpYW7MVEm9xe3c5dIQ7fTlYvq8I`.
- DeploymentID: `dpl_3r9jajGK5ua93xX8fhKTmHApLyGi`, readyState `READY`, target production.
- URL bất biến: https://system-design-lab-r36ascg5y-trongvuonglearns-projects.vercel.app
- Source config commit19174ea, artifact ứng dụng baseline f9d1334/EDU-16;18file SHA256 khớp cả trước upload và khi GET công khai qua production domain.
- Không cần Vercel login ở production URL:18file HTTP200, hash đúng; missing asset404. Shell/SW/offline manifest có no-cache/max-age0/must-revalidate, assets hash có immutable1năm, MIME đúng. URL deployment có thể có protection; dùng production alias cho AI khác.
- Chromium390/1280px: catalog17 bài, mở lab/từng bước, lưu/reload, tải offline và reload, mở bài TLS chưa ghé khi mất mạng đều đạt; không tràn ngang hoặc pageerror. Chưa thử Safari iOS/Chrome Android thật ở domain mới.
- Evidence ignored `.cache/rel02/`: unit.log, tested-artifact.json, cloud-http.json, live-browser.json. Bản Site cũ không bị thay audience hoặc gỡ bỏ.
- CLI tạo `.env.local` và `.vercel/project.json`; đều ignored, không commit hoặc copy vào18file static. Loại hai dòng ignore dư do CLI thêm để giữ ngoại lệ `.env.example` đã có.

Trạng thái REL-02: hoàn tất triển khai và smoke theo phạm vi. Không gán ready của hosting cho chứng nhận toàn bộ kiến thức/36module. Hướng dẫn AI review vẫn là bước kiểm độc lập do người dùng thực hiện.


## Triển khai sau đăng nhập

Dùng CLI đã khóa64.3.1, kiểm `vercel whoami`, liên kết/tạo project trong tài khoản người dùng rồi `vercel deploy --prebuilt --prod`. Không truyền token trong chat/command/Git. `.vercel/output` đã chuẩn bị từ `dist`; nếu chuẩn bị lại, chọn thư mục output mới rồi kiểm và đưa vào đúng `.vercel/output` của checkout phát hành. Không upload cả repository như static root.

Nếu dùng Git-based build về sau, root directory là repository root, `pnpm install --frozen-lockfile`, `pnpm build`, output `dist`; packageManager khóa pnpm11.25.0, Node24.x cloud cần xác nhận tương thích. Đợt đầu prebuilt dùng artifact Node24.21.0 đã kiểm, không suy cloud đã chạy đúng patch.

Sau khi Ready: kiểm HTTP200 root/sw.js/offline.json/assets, content-type và cache; mở hash route, progress và học/resume; thử offline trên domain Vercel. Không chỉnh alias hoặc sharing của Site cũ. Domain Vercel giữ storage riêng: xuất từ domain cũ rồi nhập lại. Dùng URL thật của Vercel trả về, không dự đoán tên miền.

## Nguồn cấu hình

- https://vercel.com/docs/cli/deploy — prebuilt, production và trạng thái deployment.
- https://vercel.com/docs/build-output-api/configuration — version3, static, routes/headers.
- https://vercel.com/docs/project-configuration/vercel-json — cache headers.
- https://vercel.com/docs/cli/login — đăng nhập chính thức.

Đọc16/10/2026. Đây là cấu hình và local verification; chưa là bằng chứng cloud deploy.
