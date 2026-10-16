# Review kế hoạch và lựa chọn skill — 12/10/2026

Task TOOL-01: review plan theo source hiện có, nghiên cứu repo/skill được sử dụng rộng rãi, cài bộ phù hợp vào project và kiểm chứng cài đặt. Phạm vi gồm tài liệu, skill và công cụ kiểm tra nguồn; ngoài phạm vi thay UI/engine, nâng dependency, triển khai PWA/backend/app, deploy hoặc tuyển pilot. Owner thực hiện: Codex theo yêu cầu người dùng; thay đổi chờ review/tích hợp theo workflow hiện có.

Acceptance: có phát hiện với bằng chứng, ưu tiên cập nhật ở roadmap, nguồn công khai và số liệu có ngày kiểm tra, skill cài theo project với commit/license/checksum, không ghi đè skill cũ hoặc thay đổi UI đang làm, kiểm tra cài đặt thực sự chạy. Repo đang ở nhánh `codex/ui-02-design-direction` với nhiều thay đổi có sẵn; giữ nguyên checkout và không commit gộp phần của người dùng.

## Kết quả review

Hướng sản phẩm phù hợp để tiếp tục: mobile-first, nội dung tiếng Việt cho học sinh chưa code, vòng dự đoán–thử–giải thích, core thuần TypeScript và web trước app. Nút thắt hiện tại là đóng gate chất lượng bài mẫu và contract dữ liệu, không phải chọn thêm framework. Giữ phạm vi 6 level/36 module/7 nhánh.

| Ưu tiên | Phát hiện và bằng chứng | Tác động / xử lý |
| --- | --- | --- |
| P1 — trước nhân rộng | `packages/content-schema/src/index.ts`: lesson có `version: 1`, `status: beta`, chưa có prerequisite/reviewer/competency graph; `scripts/content.ts` kiểm tra schema, 36 module, trùng lesson ID và module reference, chưa có các gate rộng hơn trong plan | Pipeline hiện chưa chứng minh học liệu được duyệt hoặc coverage đủ. Thêm ENG-03 với fixture sai/hợp lệ trước khi nhân rộng; không coi 36 hàng catalog là 36 module đã dạy xong |
| P1 — trước đổi model/content version | `lessonProgressSchema` lưu stage/câu trả lời/lab và `completed`; `progressSchema` chỉ version 1. Chưa có attempt ID và lesson/engine version theo contract mục 6 của plan | Cần xác định cách hiểu bằng chứng học cũ khi đổi đáp án/mô hình; ENG-03 phải có chiến lược migration/từ chối rõ. Đây là khoảng trống roadmap, không khẳng định dữ liệu hiện tại đã mất |
| P1 — trước beta rộng/app | `tests/e2e/learning.spec.ts` có ba kịch bản chạy hai project Chromium: cache/resume, catalog L3, reflow 320 px. Chưa có test browser cho lỗi storage, export/import, keyboard/screen reader, reduced motion hoặc WebKit; IMPLEMENTATION_STATUS ghi chưa pilot/thiết bị thật | QA-02 và EDU-02 đóng gate trước M4/M7. E2E xanh không chứng minh hiệu quả học hoặc độ bền dữ liệu trên iPhone |
| P2 — đã sửa tài liệu | Đầu SYSTEM_DESIGN_WEB_PLAN và ROADMAP ghi chưa xây dựng/chưa bắt đầu, trái README, source và IMPLEMENTATION_STATUS | Cập nhật hai nguồn chính, giữ các phần chưa có là kế hoạch; không tự đánh dấu milestone hoàn tất |
| P2 — quản trị nghiệm thu | Milestone có tiêu chí tốt nhưng owner mới là vai trò; pilot chưa có protocol/nhóm/ngưỡng đạt cụ thể. Git remote hiện chưa cấu hình; workflow Quality mới là file nguồn | Gán owner và chốt tiêu chí pilot khi đưa task Ready. REL-01 xác nhận CI thực thi sau khi có remote; không đổi ước lượng 10–15 tuần thành cam kết |

Sáu bài beta không tương đương sáu lab đầy đủ mô tả trong plan (ví dụ mất ACK/idempotency, transaction hoặc capstone). Trạng thái hiện thực đã nói rõ giới hạn này; giữ cách công bố đó. Worker và backend tiếp tục chỉ thêm khi workload/nhu cầu đo được yêu cầu.

Ưu tiên thực thi được cập nhật trực tiếp trong [ROADMAP.md](ROADMAP.md#ưu-tiên-sau-review-12102026), không tạo roadmap thứ hai ở báo cáo này. Mức độ review: đọc plan, kiến trúc/setup/workflow, manifest, content pipeline, schema/core và test/config; không phải audit toàn bộ ứng dụng.

## Nghiên cứu nguồn

Số liệu GitHub REST API kiểm tra ngày 12/10/2026; [snapshot](../engineering/skill-research-snapshot.json) giữ commit, stars/forks và trạng thái archive. Sao/fork là tín hiệu phổ biến, không phải điểm chất lượng hay số người đánh giá tích cực. Đối chiếu thêm maintainer, nội dung thực tế, license, tương thích phiên bản và chi phí tích hợp; không có benchmark chứng minh các skill sẽ tăng tốc project này.

| Repo | Stars / forks lúc kiểm tra | Đánh giá phù hợp và quyết định |
| --- | --- | --- |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 32.242 / 2.823 | Bộ chính thức của Vercel; cài React best practices và composition patterns. Chọn phần client React, giữ Vite và ranh giới core. Không cài deploy/Next.js/native; web-design-guidelines tải rule từ `main` mỗi lần nên chưa chọn cho bộ khóa nguồn này |
| [anthropics/skills](https://github.com/anthropics/skills) | 180.511 / 21.397 | Giữ frontend-design đã cài đúng commit hiện hành. Đã đọc webapp-testing nhưng không cài thêm: dùng Python Playwright và helper server riêng, trong khi repo đã có runner TypeScript |
| [currents-dev/playwright-best-practices-skill](https://github.com/currents-dev/playwright-best-practices-skill) | 395 / 63 | Ngoại lệ có chủ đích về độ phổ biến: ít sao nhưng chuyên Playwright TypeScript, phù hợp test hiện có. Cài một skill với reference theo tác vụ; không cần dịch vụ Currents hoặc API key |
| [antfu/skills](https://github.com/antfu/skills) | 5.960 / 337 | Có hướng dẫn đúng hệ Vite/pnpm/Vitest, nhưng bản đọc được dựa Vitest 5.0.1 và pnpm 12.x; project khóa Vitest 3/pnpm 11. Chưa cài để tránh áp dụng API/config sai phiên bản |
| [obra/superpowers](https://github.com/obra/superpowers) | 297.710 / 26.593 | Phổ biến, có debugging/review, nhưng bộ đầy đủ thêm quy trình approval/TDD và điều phối agent; trùng workflow hiện có. Không cài toàn bộ hay bật hook |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 79.872 / 4.751 | Đã là nguồn tham khảo trong design tooling lock; không cài chồng hệ design lên frontend-design/DESIGN.md |
| [openai/skills](https://github.com/openai/skills) | 28.006 / 1.921 | Đã xem skill Playwright CLI: wrapper gọi gói CLI không pin và hướng terminal automation. Không thêm một runner khi project đã có `@playwright/test` |
| [microsoft/playwright](https://github.com/microsoft/playwright) | 97.497 / 6.588 | Framework chính thức đã là devDependency. Tiếp tục dùng version trong lockfile; không clone cả repo hoặc nâng framework |
| [vitest-dev/vitest](https://github.com/vitest-dev/vitest) | 17.200 / 2.076 | Framework test hiện có cho core. Giữ version khóa, không cần cài lại hoặc kéo tooling phát triển nội bộ của Vitest |
| [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) | 373.797 / 58.842 | Nguồn đối chiếu chủ đề, CC BY 4.0; không phải skill hoặc engine có thể cài. Lưu link tham khảo, chưa nhập nội dung; nếu chuyển thể cần attribution, review chuyên môn và viết lại cho học sinh |

Các repo được chọn không archived tại thời điểm kiểm tra. Thời gian push không đồng nghĩa commit của nhánh mặc định mới nhất; snapshot giữ riêng hai giá trị. Dữ liệu sao của toàn repo không được coi là độ phổ biến riêng của từng skill.

## Kết quả cài và giới hạn

Đã cài ba skill mới, giữ nguyên frontend-design: tổng bốn skill theo project. Hai skill Vercel khóa `063bee94c3f4df8453406c830b0a7df0f2860278`; Currents khóa `283d5cbc5d11aac1abda058b16ad22c317d54dc0`. Cài qua helper skill-installer với `--ref` và `--dest .agents/skills`, không dùng installer `latest` hoặc cài global.

[AGENT_SKILLS.md](../engineering/AGENT_SKILLS.md) ghi trigger, lệnh sử dụng, license và giới hạn tương thích; [skills-lock.json](../engineering/skills-lock.json) ghi nguồn/checksum. Giữ nguyên nội dung skill upstream; đã kèm MIT LICENSE của Currents. Các bản mới chỉ có Markdown/JSON, không thêm executable hook hay npm package. Đọc manifest và các reference liên quan đến rủi ro hiện tại, kiểm tra danh sách file và rà lệnh/network trong bộ tài liệu; không tuyên bố đã audit toàn bộ ví dụ code.

Kiểm chứng thực hiện:

- `node scripts/check-skills.mjs`: đạt, ba skill / 150 file; kiểm tra manifest, commit, inventory, SHA-256 và local links của entry point.
- Validator `quick_validate.py` của skill-creator: cả ba manifest hợp lệ.
- Prettier và ESLint cho `scripts/check-skills.mjs`: đạt.
- Không chạy build/unit/E2E ứng dụng trong task này vì không sửa runtime, dependency, UI hay logic học. Kết quả cũ trong IMPLEMENTATION_STATUS không được tính là kết quả của lượt review này.

Skill mới có thể dùng ở lượt hội thoại tiếp theo. Chưa đo mức tăng tốc của agent; việc cài skill không đóng các task QA/pilot/schema và không xác nhận production đã phát hành.

## Nghiên cứu bổ sung: các repo nổi bật ngoài đợt đầu

Theo yêu cầu nghiên cứu tiếp, đã sàng lọc **12 repo bổ sung** ngày 12/10/2026. Dùng GitHub search `topic:agent-skills stars:>1000` sắp theo stars để tìm ứng viên, rồi đọc nguồn chính. Đây không phải bảng xếp hạng đầy đủ toàn GitHub: nhiều repo không gắn topic này, các kho tổng hợp cũng khác bộ skill chuyên biệt. API bị giới hạn lượt gọi ở nửa sau; những dòng có dấu ≈ lấy số làm tròn trên trang GitHub. Bằng chứng đợt này ở trường `round2` trong snapshot nghiên cứu.

| Repo mới khảo sát | Stars | Kết luận cho project |
| --- | ---: | --- |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 105.022 | Đáng chọn riêng debugging hoặc performance; có hướng dẫn đo, khoanh vùng và kiểm chứng. Không nhập cả quy trình phát triển |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | ≈94.800 | Thiết kế frontend; vai trò trùng frontend-design/DESIGN.md, chưa cần bổ sung |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 76.880 | Kho khám phá rộng. Đã đọc content-research-writer: hỗ trợ nguồn và biên tập, nhưng không thay chuẩn giảng dạy hoặc reviewer System Design |
| [blader/humanizer](https://github.com/blader/humanizer) | ≈55.800 | Chỉnh văn phong; giá trị bổ sung thấp hơn rubric, câu hỏi chuyển giao và review kiến thức cho học liệu tiếng Việt |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | ≈50.300 | Ứng viên mạnh cho sơ đồ minh họa bài học; cần tích hợp tokens và bố cục mobile của project |
| [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills) | 47.470 | Kho rất rộng, có bản sao cho nhiều harness; dùng để tìm nguồn gốc từng skill. Không cài toàn bộ catalog/CLI/MCP chỉ để bổ sung vài hướng dẫn |
| [github/awesome-copilot](https://github.com/github/awesome-copilot) | 39.925 | Kho cộng đồng hữu ích nhưng cần kiểm tra từng file; phát hiện vấn đề cụ thể trong react19-test-patterns bên dưới |
| [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | ≈28.300 | Để dành audit bảo mật có phạm vi riêng, nhất là khi thêm API/auth/import phức tạp; workflow nhiều giai đoạn, subagent và sandbox không phải tooling hằng ngày cần cài ngay |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | 28.024 | Nhiều lĩnh vực, scripts và tích hợp. Mới sàng lọc catalog/README; chưa đủ bằng chứng chọn một skill cụ thể hơn các ứng viên chuyên biệt |
| [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | 27.397 | Kế hoạch lưu bằng file, phục hồi phiên. Project đã có roadmap/workflow/task; thêm hệ plan thứ hai có nguy cơ lệch nguồn chính |
| [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | ≈26.900 | interview-script có thể hỗ trợ chuẩn bị pilot; cần chuyển mục tiêu từ customer discovery sang quan sát học và câu hỏi chuyển giao |
| [trailofbits/skills](https://github.com/trailofbits/skills) | ≈7.500 | property-based-testing là ứng viên sát core nhất: invariant, serialization roundtrip và dữ liệu đầu vào biên. Ít sao hơn các catalog nhưng phù hợp kỹ thuật hơn |

### Bốn ứng viên nên ưu tiên theo task

1. **property-based-testing — Trail of Bits**, cho ENG-03 và engine. Kiểm tra bảo toàn job qua chuỗi command, TTL ở ranh giới, replay, roundtrip tiến độ với nhiều input. Skill phân biệt property có ý nghĩa với test chỉ lặp implementation; reference có fast-check cho TypeScript. Cần khóa commit, giữ license CC BY-SA-4.0 của bộ skill và xác định invariant trước khi thêm dependency test. Đây là đề xuất, chưa cài fast-check. [Manifest](https://github.com/trailofbits/skills/blob/main/plugins/property-based-testing/skills/property-based-testing/SKILL.md)
2. **diagram-design — Cathryn Lavery**, cho storyboard và minh họa cơ chế. Đã đọc manifest: có sequence/state/data flow, mẫu queue/bottleneck, SVG accessibility và giới hạn độ phức tạp. Cần ánh xạ DESIGN.md, chữ Việt và bố cục điện thoại; hướng dẫn upstream dùng SVG có chiều rộng tối thiểu và cuộn ngang nên không lấy nguyên làm player mobile. HTML/SVG phải trở thành asset/component được review, không nhúng HTML/script tùy ý vào JSON học liệu. [Manifest](https://github.com/cathrynlavery/diagram-design/blob/main/skills/diagram-design/SKILL.md)
3. **debugging-and-error-recovery — Addy Osmani**, cho lỗi build, state hoặc lưu tiến độ khó tái hiện. Đã đọc cùng code-review-and-quality và performance-optimization. Chọn phần tái hiện–khoanh vùng–sửa nguyên nhân–kiểm chứng, dùng lệnh pnpm/Vitest của repo. Kiểm tra đủ reference khi đóng gói: upstream cảnh báo cài riêng không mang theo tài liệu cấp repo; performance có link `../../references/performance-checklist.md`. Các ví dụ/approval/test gate vẫn phải theo phạm vi task và workflow hiện hành. [Nguồn tại commit đã đọc](https://github.com/addyosmani/agent-skills/tree/1be8e34187e34647bb83adc3a1323b26ae6f6abe)
4. **interview-script — PM Skills**, cho EDU-02. Có câu hỏi không dẫn dắt và khung ghi chép. Chỉ dùng phần quan sát hành vi học; các mục willingness-to-pay/JTBD kinh doanh không phải thước đo hiểu System Design. Pilot vẫn cần rubric chuyển giao và người học thật. [Manifest](https://github.com/phuryn/pm-skills/blob/main/pm-product-discovery/skills/interview-script/SKILL.md)

### Phát hiện cho thấy không nên chọn chỉ theo sao

Manifest `react19-test-patterns` của Awesome Copilot ở nhánh main được đọc qua web có lời khẳng định React 19 StrictMode không chạy Effect thêm lần trong development và đề xuất đổi expected calls từ hai thành một. [File đã đọc](https://github.com/github/awesome-copilot/blob/main/skills/react19-test-patterns/SKILL.md)

Đối chiếu [React StrictMode chính thức](https://react.dev/reference/react/StrictMode): Effect vẫn được chạy thêm chu kỳ kiểm tra khi bật StrictMode ở root; trường hợp chỉ bật một phần cây có ngoại lệ ở initial mount. Vì vậy hướng dẫn đổi số lần gọi một cách tổng quát trong skill không đủ đúng để áp dụng. Không chọn skill này chỉ vì nằm trong repo GitHub nhiều sao. Bản raw ghim SHA không lấy được qua web; nhận xét này giới hạn ở nội dung main đã đọc, chưa khẳng định về mọi phiên bản.

### Quyết định của đợt nghiên cứu bổ sung

Ưu tiên thêm **property-based-testing** khi làm invariant/schema và **diagram-design** khi biên soạn minh họa; debugging đứng tiếp theo. Chưa thấy bằng chứng đủ mạnh để thay bộ frontend/React/Playwright hiện có hoặc thêm skill accessibility trùng reference đã có. Số sao, nhà phát hành hoặc tên skill không chứng minh hiệu quả với dự án giáo dục này.

Đợt này hoàn tất nghiên cứu và ghi nhận ứng viên, **không cài thêm skill hay dependency**. Những bản đọc từ `main` chưa là bản khóa có thể tái lập; bước tích hợp phải lấy commit cụ thể, kiểm tra toàn bộ payload/reference/license, cập nhật skills-lock và chạy validator như đợt đầu. Không chạy test/build ứng dụng vì chỉ cập nhật báo cáo và snapshot nghiên cứu.
