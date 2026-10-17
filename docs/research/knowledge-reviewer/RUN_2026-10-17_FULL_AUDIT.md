# Review kiến thức — 18 bài nhập môn, ngày 17/10/2026

**Kết luận:** chưa tìm thấy lỗi P0/P1 trong đáp án hoặc cơ chế cốt lõi đã kiểm. Có một lỗi minh họa sai chủ đề, hai điểm diễn đạt/số liệu cần làm rõ và tài liệu trạng thái chưa đồng bộ. Cần chỉnh các điểm bên dưới; không dùng kết quả này để tuyên bố mọi kiến thức đều chính xác tuyệt đối.

## Phạm vi và phiên bản

- User yêu cầu rà toàn bộ kiến thức đang có, kể cả chi tiết nhỏ, liệt kê điểm sai; không yêu cầu sửa hoặc phát hành. Không sửa học liệu/engine/UI, không commit/deploy.
- Checkout ban đầu: `/Users/vuongn/Documents/ChatGPT/System Design learning`, HEAD `6a9f9177c5aad2d1c2eb0bf21e9afd49d25daae6`, sáu bài, có thay đổi của người dùng. Giữ nguyên các thay đổi đó.
- Bản hiện hành được tìm thấy qua `git worktree list`: `/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning`, HEAD `8f2afa8bb6a6dc832ca246e1f41f01de9fcdd197`, 18 bài và một bài ôn. Worktree sạch trước và sau kiểm tra. Báo cáo chính này áp dụng cho bản hiện hành.
- Website `https://system-design-lab-vn.vercel.app/` được mở thật: trang chủ hiển thị 18 bài; đã thao tác bài DNS đến lab và tra địa chỉ. Chưa đối chiếu hash toàn bộ bundle cloud với source hoặc đi hết mọi bài trên browser.
- Ba reviewer dùng role `knowledge_reviewer`, runtime `gpt-6-sol`, reasoning `low`, chỉ đọc/kiểm/report; parent rà bằng chứng và bổ sung kiểm tra. Đây là AI review, không phải human-reviewed hoặc pilot học sinh.

## Danh sách cần chỉnh

### AUD-01 — Minh họa ba bài hiển thị nhầm cơ chế request

**Loại:** lỗi trình bày học liệu xác nhận, ưu tiên sửa; chưa phải đáp án kỹ thuật sai.

**Vị trí:** `apps/web/src/features/catalog/LessonSketch.tsx:111`, được gọi trên thẻ bài `concurrency`, `cpu-io`, `tls`.

**Actual:** cả ba thẻ hiện “Một yêu cầu, ba chặng”, `20 ms + 80 ms + 20 ms`, “Tổng thời gian: 120 ms”. Đã quan sát cả ba trên trang chủ production. Hàm không có nhánh cho ba kind này nên rơi vào hình mặc định của bài request.

**Vì sao cần sửa:** phép cộng đúng, nhưng không phải cơ chế hay dữ liệu của ba bài. Bài concurrency minh họa lost update 30→31/32; CPU/I/O dùng timeline 6/10/8 ms; TLS minh họa bảo vệ kênh và xác thực, không mô hình hóa ba chặng 120 ms. Hình giới thiệu gắn sai dữ kiện vào chủ đề, đặc biệt dễ khiến người mới nghĩ đây là trace TLS.

**Đề xuất:** minh họa riêng read–write xen kẽ, CPU/chờ I/O và kênh TLS; hoặc bỏ hình kỹ thuật khi chưa có hình đúng. Không cần đổi đáp án.

**Kiểm lại:** ba thẻ trên trang chủ/khám phá không còn dùng hình request; đối chiếu với nội dung thật của từng bài trên mobile/desktop.

### AUD-02 — Mũi tên DNS có thể bị hiểu thành chuỗi chuyển tiếp truy vấn

**Loại:** nguy cơ ngộ nhận cần làm rõ; không xếp là lỗi cơ chế DNS đã xác nhận vì bài có ghi “rút gọn”.

**Vị trí:** `apps/web/src/features/lab/FoundationLabs.tsx:130`; `content/lessons/vi/foundations.json`, `dns.limit`.

**Actual trên website:** sau “Tra địa chỉ”, dòng “Đường tra rút gọn: resolver → root → máy chủ tên miền cấp cao → nơi quản lý tên → resolver.”

**Điểm dễ hiểu sai:** người học có thể đọc mũi tên như root chuyển câu hỏi sang TLD, rồi TLD chuyển sang authoritative. Với quy trình tra lặp đang minh họa, resolver nhận chỉ dẫn và tự hỏi server tiếp theo. [RFC 1034 §5.3.3](https://www.rfc-editor.org/info/rfc1034/) mô tả resolver phân tích delegation và quay lại bước chọn server. Parent và reviewer đã mở đoạn này ngày 17/10/2026.

**Đề xuất câu thay:** “Resolver lần lượt hỏi root, máy chủ tên miền cấp cao, rồi nơi quản lý tên. Các máy chủ trả chỉ dẫn để resolver hỏi nơi tiếp theo.” Nếu dùng hình, vẽ các lượt hỏi–đáp qua resolver. Giữ nguyên bài cache/TTL; không bắt bài nhập môn mô phỏng toàn DNS.

**Kiểm lại:** học sinh trả lời được ai gửi truy vấn tiếp theo sau khi root trả referral. Chưa có pilot chứng minh ngộ nhận thực sự xảy ra.

### AUD-03 — Tỷ lệ cache 75% và số đọc nguồn nguyên thiếu quy ước làm tròn

**Loại:** thiếu điều kiện/giải thích của số liệu; không kết luận công thức công suất sai.

**Vị trí:** `apps/web/src/features/lab/Lab.tsx:288`; `packages/simulation-engine/src/index.ts:112`; `packages/simulation-engine/src/remaining-observations.ts:93`; `content/reviews/vi/school-day.json:35`.

**Actual đã chạy engine:** bật cache, hai server, hai yêu cầu đến → hoàn tất hai, `databaseReads=1`. Với sáu yêu cầu → hoàn tất sáu, đọc nguồn hai. Bảng phản hồi gắn nhãn số đọc nguồn này là lượt/giây. Lời giới thiệu nói 75% lượt không đọc nguồn; bài ôn còn dùng từ “đúng 75%”.

**Phép tính độc lập:** nếu 75% là tỷ lệ trung bình của mô hình thì hai lượt tương ứng 0,5 lượt đọc nguồn kỳ vọng, sáu lượt tương ứng 1,5. Engine làm tròn thành 1 và 2. Không thể đòi đúng 75% cho từng nhóm rời rạc chỉ có hai hoặc sáu yêu cầu. Người học chưa được báo số nào là tỷ lệ trung bình, số nào đã làm tròn.

**Đề xuất:** nói rõ mô hình tỷ lệ trung bình và nhãn “đọc nguồn ước tính, làm tròn”; hoặc giữ số thực như 0,5 lượt/giây trong mô hình dòng tải. Nếu muốn đếm từng request, cần trace hit/miss và cửa sổ phù hợp. Tỷ lệ này cũng không phải kết quả đo thực tế hay tự suy từ TTL.

**Kiểm lại:** dùng tải 1/2/3/6/12, bật cache, đối chiếu tỷ lệ, nhãn và bảng trước–sau. Trace lưu ở `parent/traces.json`, mục `rounding`.

### AUD-04 — Tài liệu mô tả trạng thái cũ như trạng thái hiện tại

**Loại:** lỗi tài liệu, không phải lỗi kiến thức System Design.

- `TEACHING_GUIDE.md:3`: “Web hiện có 13 bài beta”, thực đếm 18 và website cũng hiện 18.
- `CURRICULUM_MAP.md:22`: ánh xạ 12 bài beta và “chưa phải case đã hiện thực”, trong khi phiên bản hiện hành đã có mini-case cho 18 bài. Nếu đây là mốc lịch sử phải ghi rõ ngày/phạm vi.
- `SYSTEM_DESIGN_WEB_PLAN.md:284`: vẫn chỉ dẫn bootstrap workspace và bắt đầu bài cache, không phù hợp khi được đọc là bước tiếp theo hiện hành.

**Đề xuất:** cập nhật trạng thái hoặc đánh dấu mốc lịch sử, giữ nguyên các báo cáo lịch sử. Không dùng số 18 bài nhập môn để suy ra đã hoàn thành 36 module.

## Những điểm nghi vấn đã loại sau đối chiếu

- Cache “Lấy lịch mới” không tăng số “Xem qua nguồn”: bản hiện hành có chú thích rõ chỉ đếm nút “Xem lịch”; không phải lỗi đếm mọi lần đọc nguồn.
- Giảm replication lag không cho ghi mới vượt ghi cũ, lag0 bỏ pending: UI hiện hành công bố rõ quy tắc mô hình và nói không mô phỏng giao thức đồng bộ. Không báo lại như lỗi còn tồn tại.
- Hình metrics `median550/p951900`: đúng với **hai worker** và hai việc cuối chậm. Bốn worker có kết quả khác nhưng không làm ví dụ này sai; có thể bổ sung “hai thủ thư” trên thẻ để đủ ngữ cảnh.
- Queue công suất bằng arrival không rút backlog: nội dung và đáp án hiện hành đã phân biệt đúng; bài còn nhắc công suất dự phòng khi tải thực có biến động.
- TLS không bảo đảm website trung thực; hash không luôn O(1); binary search cần mảng đã sắp/truy cập vị trí; replica không thay backup: các giới hạn này đã được nói, không tạo finding giả vì mô hình nhập môn chưa triển khai mọi cơ chế production.

## Độ bao phủ thực tế

| Nhóm đã đọc | Bài/hoạt động | Bằng chứng chính |
| --- | --- | --- |
| Luồng yêu cầu và mở rộng | request, balance, cache, queue, replica, design | Toàn bộ lesson fields, nguồn, engine, assessment/case/guidance; trace chọn lọc và unit |
| Nền tảng | metrics, dns, transport, capacity | Phép tính độc lập, nguồn, engine/assessment; DNS thêm browser thật |
| Mạng và bảo mật | http, network, routing, tls | Source/nguồn/assessment; parent bổ sung 120 assertion thực thi trên cấu hình thường/biên |
| OS | concurrency, cpu-io | OSTEP, trace read/write và timeline tính độc lập, engine/assessment/UI source |
| Cấu trúc dữ liệu | library-search, hash-table | CMU/MIT, trace số phép so, cấu hình biên, engine/assessment/UI source |
| Ôn tổng hợp | school-day: opening, rush | Tính tải đọc, backlog bốn giây, ngân sách, policy TTL; không chấm ngữ nghĩa lời tự giải thích |
| Đặc tả giáo trình | CURRICULUM_MAP, TEACHING_GUIDE, SYSTEM_DESIGN_WEB_PLAN | Đọc kiến thức/bài mẫu/ràng buộc; tách đề mục dự kiến khỏi bài đã dạy |

Đã đọc toàn bộ 18 JSON lesson gồm story/explanation/terms/limit/prediction/challenge/caseStudy/guidance theo phân công. Ma trận có **96 dòng claim/nhóm claim**, không tương đương chứng minh độc lập từng câu trong mọi tài liệu repository. Các đề mục nâng cao CAP/PACELC/consensus/security… mới có phạm vi/kế hoạch không được ghi thành module đã kiểm định đầy đủ.

## Kiểm chứng và giới hạn

- Content check ở worktree hiện hành đạt: 18 bài, một bài ôn, registry36 module.
- Parent chạy unit suite hiện có: **68/68 test, 19 file đạt**, Vitest3.2.7, Node26.11.1. Lượt đầu reviewer bị sandbox chặn tạo cache; parent chạy lại sau khi quyền được chấp thuận. Không sửa lịch sử report reviewer để biến lượt bị chặn thành lượt pass.
- Parent chạy thêm **121 assertion độc lập**: network36, TLS24, HTTP12, routing48, metrics1; tất cả khớp. Các số toy được tính từ giả định bài, không gán cho nguồn như benchmark. Các trace reviewer ở artifact được đọc đối chiếu.
- Chưa tái lập build bằng Node24.21.0 được project khóa; kết quả Node26 chỉ là bằng chứng kiểm tra trong runtime đã ghi. Không nâng dependency hoặc thay lockfile.
- Nguồn sơ cấp đã mở gồm RFC, PostgreSQL18, tài liệu Microsoft, Google SRE, NIST, OSTEP, CMU/MIT; URL/section và phần chưa xác minh nằm trong từng ma trận. Parent bổ sung [HTTP Semantics RFC9110](https://httpwg.org/specs/rfc9110.html), §§15.3.1,15.5.5,15.6.4, giải quyết khoảng trống truy cập HTTP của reviewer. Chưa audit toàn bộ errata và mọi update của mọi RFC.
- Browser chỉ quan sát trang chủ và bài DNS, không kiểm toàn bộ luồng18 bài/mobile/thiết bị thật. Không dùng tests pass để chứng minh kiến thức đúng tuyệt đối; không dùng AI review để đóng pilot.

## Artifact tái lập

- [Manifest và provenance](evidence/audit-2026-10-17/manifest.json).
- [Ma trận tổng hợp96 dòng](evidence/audit-2026-10-17/claim-matrix.json), giữ nguyên verdict reviewer; đọc cùng bổ sung parent trong report này.
- [Review intro/foundations/ôn](evidence/audit-2026-10-17/lessons/report.md).
- [Review curriculum/network/TLS](evidence/audit-2026-10-17/curriculum-network/report.md).
- [Review OS/data structures](evidence/audit-2026-10-17/os-data-structures/report.md).
- [Script parent](evidence/audit-2026-10-17/parent/verify.mjs), [actual traces](evidence/audit-2026-10-17/parent/traces.json).

Các script giữ absolute import của checkout đã kiểm để bảo toàn provenance. Khi chạy ở checkout khác, sao chép script và đổi đường dẫn vào run mới; không ghi đè actual cũ.
