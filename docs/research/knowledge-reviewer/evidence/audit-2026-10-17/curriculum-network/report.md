# Knowledge review — worktree hiện hành

- Checkout xác minh: `/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning`; HEAD `8f2afa8bb6a6dc832ca246e1f41f01de9fcdd197`; `git status --short` rỗng.
- Profile theo yêu cầu: `knowledge_reviewer`, `gpt-6-sol`, reasoning `low`. AI review, không phải human review.
- Đọc diff ba tài liệu chính so với checkout gốc `6a9f917` (báo cáo riêng ở thư mục cha), cùng toàn bộ `web-network.json`, `routing.json`, `tls.json` và ba engine `network.ts`, `routing.ts`, `tls.ts`. Đọc prediction, challenge, caseStudy, guidance và limit cùng cơ chế. Không quan sát UI/browser.
- Cố chạy `pnpm exec vitest run packages/simulation-engine/src/{network,routing,tls}.test.ts` trong worktree, nhưng Vitest bị `EPERM` khi tạo `node_modules/.vite-temp` vì checkout này nằm ngoài writable root. Do đó các đối chiếu engine dưới đây là **suy luận từ source**, không phải trace đã chạy. Không xin mở rộng quyền chỉ để tăng một mức bằng chứng cho review read-only.

## Kết luận: pass-with-scope, cần sửa trạng thái tài liệu

Không phát hiện lỗi kiến thức P0/P1/P2 trong ba bài network/HTTP/routing/TLS đã đọc và phần đặc tả bổ sung. Bài network tính đúng 650 ms; routing giữ tách biệt IP/port; TLS tách bảo vệ kênh khỏi độ tin cậy nội dung và chặn chứng chỉ sai tên. Chưa chứng nhận engine bằng thực thi hoặc UI. `claim-matrix.json` lưu verdict và loại bằng chứng từng claim.

### Lỗi xác nhận về kiến thức

Không có finding P0/P1/P2 trong phạm vi đã trực tiếp rà. Không biến phần Primer mới chỉ là backlog thành bài đã dạy.

### Bất nhất trạng thái/biên tập

- `TEACHING_GUIDE.md:3` nói web có 13 bài beta, trong khi đếm trực tiếp JSON trong `content/lessons/vi/*.json` tại HEAD này cho 18 record, cả 18 có `status: beta`. `CURRICULUM_MAP.md:22` nói ánh xạ 12 bài beta. Các con số cần cập nhật hoặc ghi rõ mốc lịch sử; không ảnh hưởng đáp án kỹ thuật.
- `SYSTEM_DESIGN_WEB_PLAN.md:284` trong worktree mới lặp lại chỉ dẫn bootstrap workspace/bắt đầu bài cache từ đầu, trái trạng thái hiện thực trên cùng file và README. Đây là roadmap cũ, không phải lỗi chuyên môn.
- `CURRICULUM_MAP.md:178` nói cache ở L1, còn `TEACHING_GUIDE.md:57` nêu dẫn nhập L0 và cơ chế L2. Khi phát hành nên diễn đạt các độ sâu cho nhất quán.

### Bằng chứng kỹ thuật chính

- Network: theo đơn vị thập phân, 1.000 kB = 8.000.000 bit. Ở 8 Mbps mất 1.000 ms; 16 Mbps mất 500 ms; cộng RTT 100 và xử lý 50 thành 650 ms. `network.ts` cho công thức tương ứng, nhưng chưa chạy. [RFC 6349](https://www.rfc-editor.org/info/rfc6349/) là Informational về kiểm thử TCP throughput, không cung cấp số toy này và không được coi là chuẩn bảo đảm tốc độ.
- Routing: [RFC 1122 §3.3.1](https://www.rfc-editor.org/rfc/rfc1122.html) và [RFC 9293 §3.1](https://www.rfc-editor.org/rfc/rfc9293.html) hỗ trợ tách đường IP và TCP port. Trong mã, đổi port giữ nguyên IP; `route=false` dẫn đến `no-route` trước khi chọn dịch vụ. Câu hỏi nói rõ không có default route.
- TLS: [RFC 9846 §1, §1.2](https://www.rfc-editor.org/info/rfc9846/) là Proposed Standard TLS 1.3, obsoletes RFC 8446; bảo vệ kênh, không che toàn bộ metadata. [RFC 9525 §6](https://www.rfc-editor.org/rfc/rfc9525.html) yêu cầu đối chiếu danh tính dịch vụ. Bài nói rõ máy/khóa an toàn, không mô phỏng PKI thật, và HTTPS không chứng minh website đáng tin. `tls.ts` dừng trước HTTP khi chứng chỉ sai tên/hết hạn/không tin cậy, theo đọc source.
- HTTP: nội dung 404/503 là phản hồi, 200 không hứa độ mới. URL RFC 9110 trong lesson không mở được trực tiếp qua công cụ lượt này; claim phù hợp registry đã đọc của project nhưng nguồn trực tiếp mới chưa xác minh, ghi uncertainty trong matrix. Case dữ liệu cũ ghi rõ là suy luận, không nói engine HTTP mô phỏng cache.

### Chưa xác minh

- `CURRICULUM_MAP.md` §9 gồm 23 nhóm PRIMER-K, case C01–C08, flashcards và kế hoạch; đây là đặc tả, chưa phải bài/assessment. Tôi đọc các ràng buộc quan trọng (CAP, availability, security, consistency) nhưng chưa xác minh từng link tới revision Primer vì không có claim chi tiết được dạy ở đây. `TEACHING_GUIDE` phần mini-case là chuẩn, không chứng minh case đã hiện thực.
- Không rà các bài OS/data structures hoặc sáu bài intro và các bài khác; parent và agent khác phụ trách. Không pilot học sinh thật. Không kiểm toàn bộ errata RFC; RFC 9846 status/supersession đã xác nhận, errata page chưa kiểm entries. Không dùng RFC mới để quy citation cũ thành lỗi khi chưa thấy tác động lên đáp án.
