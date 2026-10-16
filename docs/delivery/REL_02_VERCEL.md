# REL-02 — Vercel cho bản tự học

Yêu cầu16/10/2026: đưa ứng dụng lên Vercel, cho phép dùng AI khác kiểm tra. Owner Codex. Baseline f9d1334,17 bài/1 ôn; không đổi học liệu/mô phỏng. Không chặn bản học thử vì chưa có reviewer con người; vẫn giữ nhãn và giới hạn thực tế.

Acceptance: artifact build khóa Node24.21.0/pnpm11.25.0; unit/content/type/lint liên quan; Vercel terminal Ready và URL; kiểm shell/assets/SW MIME và cache, route hash và học/resume. Không đăng tài liệu nội bộ/credential; chỉ static artifact khi có thể. Cache SW/index/offline manifest phải revalidate; assets có tên hash cache immutable. Domain mới có IndexedDB riêng, không mất dữ liệu ở domain cũ; export/import để chuyển.

## Kết quả chuẩn bị

- Vercel CLI64.3.1 tra từ npm chính thức, dùng cache ngoài repo, không đổi dependency app.
- `vercel.json` cấu hình root workspace/build/output và cache; `.vercelignore` loại local/internal files; `.vercel/` được Git ignore.
- `scripts/vercel-output.ts` tạo Build Output APIv3 từ artifact đã kiểm integrity. Chỉ18file static, không rebuild lúc upload. Dùng thư mục output mới; không ghi đè gói cũ âm thầm.
- Typecheck/lint đạt;66unit/18files đạt. Test mới xác minh byte/static/hash, cache áp đúng URL, không nuốt URL sai, không đóng gói artifact bị thay hoặc file ngoài manifest.
- SHA25618file khớp toàn bộ artifact EDU-16 đã kiểm E2E. Không thay runtime UI/engine/content, nên không chạy lại192E2E cho thay đổi đóng gói này. Vercel HTTP/CDN/smoke chưa thể xác nhận trước deploy.
- `docs/research/AI_REVIEW_HANDOFF.md` có prompt, nguồn/trace, phản ví dụ và các ngộ nhận trọng điểm cho AI khác.

Trạng thái: sẵn sàng upload; CLI xác nhận Logged out và đang chờ người dùng hoàn thành đăng nhập chính thức. Chưa có URL Vercel và chưa tuyên bố deploy thành công. Không dùng deployment tạm vô chủ thay bản trong tài khoản người dùng.

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
