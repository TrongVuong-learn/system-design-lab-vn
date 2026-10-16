# Workflow phát triển và quản lý repository

Đây là quy ước áp dụng cho dự án. CI, branch protection và môi trường phát hành được hiện thực theo [ROADMAP.md](ROADMAP.md); file hướng dẫn không đồng nghĩa các dịch vụ đó đã hoạt động.

## 1. Từ ý tưởng đến task có thể thực hiện

Luồng task: **Backlog → Ready → In progress → Review → Verified → Done**. Task bị chặn có lý do và phụ thuộc cụ thể, không dùng trạng thái Done cho phần còn thiếu.

Mỗi task gồm ID, vấn đề người học gặp, kết quả mong muốn, phạm vi, phần ngoài phạm vi, dependencies, owner, acceptance và cách kiểm chứng. Tách việc thành phần có thể demo/review; thay đổi engine và học liệu phải có task liên kết khi ảnh hưởng cùng một bài.

Ready khi mục tiêu rõ, phụ thuộc cần thiết đã sẵn sàng và có cách kiểm tra kết quả. Done khi acceptance đạt, thay đổi đã review/tích hợp theo workflow đang có và tài liệu/version đã cập nhật. Với công việc chỉ yêu cầu thiết kế, tài liệu được review là đầu ra; không ghi ứng dụng đã triển khai.

## 2. Git và review

Tạo nhánh riêng khi bắt đầu một phần việc cụ thể cần tách: tính năng, lab, sửa lỗi hoặc refactor có phạm vi đáng kể. Codex dùng `codex/<task-id>-<topic>`. Giai đoạn lập kế hoạch ban đầu và repository chưa có baseline commit chưa cần nhánh riêng. Sau khi có baseline, tạo nhánh lúc task sẵn sàng thực hiện; không tạo trước một loạt nhánh theo toàn bộ roadmap.

Giữ tên nhánh chính hiện có của repository. Chỉ chuẩn hóa sang `main` khi thiết lập dự án/remote có quyết định tương ứng; không tự đổi tên nhánh của người dùng. Không tạo nhánh `develop` hoặc nhánh môi trường thường trực nếu chưa có nhu cầu.

Commit theo mục đích, ví dụ `feat(lesson-player): resume saved stage` hoặc `docs(workflow): define release gates`. PR tập trung một kết quả; thay đổi lớn chia theo dependency để review được.

PR mô tả vấn đề, hành vi sau thay đổi, cách kiểm chứng, ảnh/video mobile nếu hữu ích, tác động nội dung/dữ liệu và giới hạn còn lại. Review mã xem xét hành vi và ranh giới; review bài học xem xét độ đúng, cách giải thích và assessment. Khi nhóm hỗ trợ, bài kỹ thuật quan trọng có reviewer khác tác giả.

Khi remote đã được thiết lập, cấu hình kiểm tra bắt buộc và quyền merge phù hợp nhóm. Cách merge baseline đề xuất là squash để giữ một commit rõ cho mỗi PR; các release được nhận diện bằng tag/artifact, không bằng nhánh môi trường.

## 3. Workflow mã nguồn

```text
Task Ready → Thiết kế thay đổi → Hiện thực
    → Kiểm tra liên quan → PR/review → CI
    → Preview/staging → Nghiệm thu → Tích hợp/phát hành
```

Quyết định ảnh hưởng nhiều package hoặc thay contract cần ADR trước khi nhân rộng. Với thay đổi nhỏ, ghi lý do trong task/PR là đủ. Test theo rủi ro; các thay đổi mô phỏng phải có fixture hoặc invariant chứng minh kết quả, không chỉ snapshot giao diện.

Thay luồng học phải kiểm tra mobile, focus, text alternative và khả năng tiếp tục học. Thay persistence/schema cần migration và trường hợp dữ liệu cũ. Giữ một artifact đã kiểm tra xuyên staging/production khi có thể, thay vì build lại không kiểm soát.

## 4. Workflow học liệu

```text
Năng lực + prerequisite → Storyboard mobile → Nội dung/scenario
    → Validation → Review kỹ thuật/cách giảng
    → Pilot/sửa → Duyệt version → Xuất bản
```

Tác giả ghi nguồn, giả định, giới hạn ví dụ, thuật ngữ, rubric và trace mẫu. Pipeline chặn ID trùng, prerequisite lỗi, reference thiếu, cấu hình/đáp án không hợp lệ và nội dung chưa duyệt xuất hiện như đã phát hành.

Thay lời diễn đạt giữ mục tiêu có thể dùng patch version; thay cơ chế, đáp án hoặc đầu ra học cần version tương thích và xử lý bằng chứng học cũ. Quy tắc version cụ thể được triển khai trong content-schema; không dùng timestamp đơn lẻ thay định danh phiên bản.

## 5. Môi trường, release và lỗi

Môi trường: local → preview → staging → production. Native có beta/release riêng. Cấu hình và secret được quản lý theo môi trường; source không chứa credentials.

Một release có commit, phiên bản nội dung/engine/schema, artifact, kết quả kiểm tra và changelog. Web/PWA phải kiểm tra update, offline và dữ liệu đang học. Native bổ sung signing, lifecycle, storage và thiết bị thật. Quyền phát hành áp dụng theo phạm vi người dùng/nhóm đã giao.

Sau phát hành, xác minh luồng chính và theo dõi lỗi có thể hành động. Hotfix đi từ baseline phát hành, có kiểm tra liên quan và được đồng bộ về nhánh chính. Rollback có tiêu chí: chặn học, mất dữ liệu, sai kiến thức hoặc lỗi nghiêm trọng tương đương; rollback bundle không được giả định tự khôi phục database/schema.

## 6. Quy tắc thư mục

| Nơi đặt | Trách nhiệm |
| --- | --- |
| `apps/web/src/features/<feature>/` | Component, hook, model và kiểm thử riêng feature |
| `apps/web/src/ui/` | Thành phần trình bày thực sự dùng chung, không chứa quy tắc bài học |
| `apps/web/src/adapters/` | IndexedDB, runtime, network và các tích hợp nền tảng |
| `packages/*/src/` | Logic/API dùng chung có ranh giới rõ |
| `content/` | Học liệu nguồn, scenarios, glossary, review metadata |
| `tests/` | E2E, fixture tích hợp, workload kiểm tra |
| `scripts/` | Công cụ validation/build/report, không chứa business logic UI |
| `docs/decisions/` | ADR có số thứ tự, bối cảnh, quyết định và hệ quả |
| `docs/engineering/` | Kiến trúc, setup và quy ước kỹ thuật |
| `docs/design/` | Flow, mobile và accessibility |
| `docs/delivery/` | Roadmap, workflow và kế hoạch nghiệm thu |

Trong feature dùng các thư mục như `components`, `hooks`, `model` khi cần; không tạo mọi thư mục cho feature chỉ có một file. Tên thư mục dùng `kebab-case`; React component dùng `PascalCase.tsx`; module logic có tên theo trách nhiệm. Public export qua `index.ts` chọn lọc; feature không import nội bộ của feature khác.

Root giữ README, CONTRIBUTING, AGENTS và cấu hình workspace/tooling. Ba tài liệu sản phẩm hiện có được giữ đường dẫn vì đã được tham chiếu; README là điểm vào và xác định nguồn chính. Mọi di chuyển tài liệu sau này phải cập nhật liên kết, tránh duy trì hai bản đầy đủ cùng nội dung.

Build output, generated content và test reports không chỉnh tay hoặc trộn với source. Cache và file local không commit; manifest/lockfile/config cần để tái lập được commit. Mỗi thư mục mới cần có trách nhiệm rõ và consumer thật.


## Hosting đang dùng —16/10/2026

Vercel production tại https://system-design-lab-vn.vercel.app là nơi phát hành chính theo yêu cầu người dùng. Dùng CLI prebuilt từ artifact đã kiểm; không rebuild lúc upload. Ghi commit/config, fingerprint, deploymentID/READY và HTTP/browser smoke theo REL_02_VERCEL.md. Không coi GitHub Actions hay auto-deploy đang chạy khi chưa có remote/workflow thực tế. Site cũ giữ để người học export dữ liệu, không tự phát hành/đổi sharing trên đó trong các đợt Vercel.
