# Skill cho System Design Lab

Ngày cài: 12/10/2026. Phạm vi project: `.agents/skills/`; không cài global, hook, MCP, CLI hoặc dependency ứng dụng mới. Skill mới có thể được nạp từ lượt hội thoại tiếp theo. Cách tổ chức repo-local theo [tài liệu OpenAI](https://developers.openai.com/blog/skills-agents-sdk).

## Chọn theo công việc

| Skill / file | Khi dùng | Giới hạn trong project |
| --- | --- | --- |
| [frontend-design](../../.agents/skills/frontend-design/SKILL.md), đã có | Thiết kế hoặc đổi UI | Đọc DESIGN.md; minh họa cơ chế học; review mobile/desktop theo AGENTS.md |
| [vercel-react-best-practices](../../.agents/skills/react-best-practices/SKILL.md) | Viết/review React, phân tích re-render và bundle | Chỉ áp dụng React client/Vite; đo trước tối ưu; phần Next.js/RSC/server không áp dụng |
| [vercel-composition-patterns](../../.agents/skills/composition-patterns/SKILL.md) | Component có nhiều chế độ, API tái sử dụng, tách UI player/lab | React 19 phù hợp; chỉ trừu tượng hóa khi có consumer; state/logic học và mô phỏng vẫn ở core |
| [playwright-best-practices](../../.agents/skills/playwright-best-practices/SKILL.md) | Viết/sửa E2E, lỗi lưu, mobile, keyboard, accessibility | Dùng Playwright TypeScript hiện có; chỉ đọc reference liên quan; emulation không thay điện thoại thật |

Ví dụ yêu cầu: “Dùng vercel-react-best-practices review re-render của Lab, giữ nguyên engine”; “Dùng playwright-best-practices bổ sung test lỗi lưu và resume cho QA-02”. Skill là hướng dẫn, không tự tạo bằng chứng kiểm thử hoặc bảo đảm tăng tốc phát triển.

## Quy tắc tích hợp

- Runtime/dependency theo SETUP.md và lockfile. Chuyển lệnh ví dụ `npm`/`npx` sang `pnpm`/`pnpm exec` dùng phiên bản đã cài. Không chạy generator, `latest`, đổi framework hoặc thêm dịch vụ theo ví dụ upstream.
- Quy tắc public API của ARCHITECTURE.md cao hơn khuyến nghị tránh barrel import: không deep-import xuyên package. Với Vite dùng dynamic import/React.lazy khi phù hợp, không thêm `next/dynamic`, SWR hoặc API Next.js chỉ vì ví dụ có chúng.
- Composition chỉ áp dụng presentation. Không chuyển quy tắc đánh giá, simulation hoặc storage vào React provider; không refactor toàn repo chỉ để đổi `useContext`/`forwardRef`.
- Test theo hành vi/rủi ro. Dùng production build trước E2E, config và browser cache hiện có. Ưu tiên locator theo role/name và assertion có auto-wait; không chờ timeout cứng để che lỗi. Chỉ lặp test khi đang chẩn đoán flake hoặc có rủi ro cụ thể.
- Reference có ví dụ axe, Lighthouse, auth, CI, cloud reporting: chỉ thêm khi task cần và đã kiểm tra tương thích; bản cài skill này chưa cài chúng. Không tắt rule accessibility để làm báo cáo xanh. Dữ liệu test tổng hợp; không upload trace chứa dữ liệu học sinh lên dịch vụ ngoài mặc định.
- Giữ phạm vi task được giao; skill không mở rộng quyền deploy, gửi thông tin hay áp đặt thêm bước xin phép cho việc đã được ủy quyền.

## Nguồn và kiểm chứng

[skills-lock.json](skills-lock.json) khóa commit và SHA-256 từng file của ba skill mới. [Design tooling lock](../design/tooling-lock.json) tiếp tục quản lý frontend-design, không tạo bản khóa thứ hai cho skill cũ. [Snapshot nghiên cứu](skill-research-snapshot.json) ghi số sao/fork, commit và nguồn API lúc chọn.

Hai skill Vercel khai báo MIT trong frontmatter; upstream tại commit này không cung cấp LICENSE ở root. Giữ nguyên manifest, metadata tác giả và các reference. Currents có MIT LICENSE ở root; đã chép nguyên văn vào thư mục skill. Không chỉnh nội dung upstream; giới hạn áp dụng được ghi ở tài liệu này.

Kiểm tra cài đặt, không cần mạng hoặc dependency mới:

```sh
node scripts/check-skills.mjs
```

Lệnh kiểm tra inventory, checksum, commit pin, manifest và local links từ SKILL.md của ba skill mới; không chứng nhận mọi ví dụ upstream là đúng hoặc đã chạy. Đánh giá chất lượng vẫn cần kết quả task thực tế.

Khi cập nhật: chọn commit cụ thể, đọc diff và license, kiểm tra tương thích stack rồi thay đúng thư mục skill trong thay đổi riêng; cập nhật checksum sau review. Không tự theo `main`, không ghi đè thay đổi local. Có thể cài lại bằng `skill-installer --repo … --ref <commit> --path <sourcePath> --dest <thư mục tạm>` rồi đối chiếu với lock trước khi thay thế. Installer từ chối ghi đè thư mục đã tồn tại.

## Motion và redesign — 26/10/2026

Theo yêu cầu DESIGN-10, cài project-local Taste (Leonxlnx), bốn skill GSAP chính thức (core/react/scrolltrigger/performance), Scroll Craft (nateherkai) và Three.js fundamentals/performance (CloudAI-X). Commit, inventory và checksum trong skills-lock.json; license/readme upstream được giữ nguyên. Không tìm thấy tên chính xác `threejs3d`; dùng bộ Three.js nói trên cho nhu cầu 3D.

Taste dùng app-screen workflow cho app học tương tác; giữ font tiếng Việt, controls tối thiểu 44px, nội dung và khả năng truy cập của repo. Scroll Craft dùng working-surface grammar, depth/reveal/visual verification; không áp dụng generator, dịch vụ tạo ảnh trả phí, page-length quota hay engine HTML độc lập vào React. Không tạo ảnh stock để đạt số lượng hình. GSAP quản lý cleanup/matchMedia; Three.js chỉ presentation, lazy import và fallback HTML. Animation Lottie JSON là artwork gốc trong repo, dùng runtime LottieFiles, không tải asset của tác giả khác hay tuyên bố đã dùng Creator.
