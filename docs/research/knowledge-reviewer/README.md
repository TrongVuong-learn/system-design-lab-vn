# Agent knowledge_reviewer

Định nghĩa 1.1.0, 15/10/2026. Hồ sơ được thiết kế/rà bởi session GPT-6 Astra medium theo yêu cầu; Native agent tại `.codex/agents/knowledge_reviewer.toml`; model **gpt-6-sol**, reasoning **low** theo yêu cầu người dùng. Quyền/tool/provider kế thừa phiên cha; không chứa API key hoặc đổi model phiên chính.

## Vai trò và cách gọi

Agent dùng tiêu chuẩn thẩm định của senior software engineer/system architect hơn mười năm kinh nghiệm: đọc claims, cơ chế, mô hình, giới hạn và assessment; kiểm tài liệu sơ cấp, tính độc lập ví dụ và tìm phản chứng. Đây là AI reviewer, không phải người có hồ sơ nghề nghiệp thật. Review phải nêu phạm vi và những claim chưa xác minh; không dùng role/model để thay bằng chứng hoặc cam kết không thể sai.

> Dùng knowledge_reviewer review bài routing tại commit [SHA], kiểm source/engine/assessment/case, trả claim matrix, findings cùng nguồn trực tiếp. Dùng gpt-6-sol low.

> Dùng knowledge_reviewer kiểm lại finding KNOW-01 sau sửa tại commit [SHA], so invariant/trace và nguồn; ghi resolved/unresolved/unverified, không ghi human-reviewed.

Parent cung cấp checkout/commit, phạm vi, URL nếu cần và artifact path. Agent đọc native definition rồi chỉ đọc/kiểm/report, không sửa source/commit/deploy hoặc spawn thêm. Parent review findings trước sửa. Không sửa findings/nguồn trong lịch sử để làm kết quả cũ trông thành công.

## Bản Claude Code (16/11/2026)

Định nghĩa 1.2.0 ở [.claude/agents/knowledge-reviewer.md](../../../.claude/agents/knowledge-reviewer.md), theo [tài liệu subagent của Claude Code](https://code.claude.com/docs/en/sub-agents). Giữ nguyên quy trình 1.1.0: claim → nguồn sơ cấp → expected độc lập → trace engine → câu hỏi/UI → verdict; cùng `REFERENCE_GUIDE.md`, cùng định dạng `report.md` và `claim-matrix.json`. Khác bản Codex:

- **Model:** kế thừa model của phiên Claude Code cha. Yêu cầu `gpt-6-sol`/`low` chỉ áp dụng cho bản Codex vì Claude Code không có model đó; không tự chọn model khác thay người dùng.
- **Công cụ:** Read, Grep, Glob, Bash, Write, Edit, WebFetch, WebSearch. Engine được chạy độc lập bằng `node --import tsx <script>.ts` import `packages/simulation-engine/src/index.ts` (đã thử chạy được 16/11/2026).
- **Bản đồ repo** ghi sẵn đường dẫn học liệu, registry, hợp đồng đáp án, engine và lab.
- **Chế độ `triage`:** nhận mục "Nghi vấn chuyên môn" từ báo cáo `student-tester` chế độ `kien-thuc` và kết luận xác nhận / bác bỏ / chưa xác minh. Câu chữ đúng nhưng dễ hiểu sai xếp ngộ nhận có nguy cơ, không xếp lỗi kiến thức.

Kết quả mặc định ở `.cache/knowledge-reviewer/<ngày>-<phạm-vi>/` (Git ignore); parent chép bằng chứng cần giữ sang `evidence/` khi tổng hợp. Agent mới được nạp khi mở phiên Claude Code mới. Chưa có lượt chạy nào bằng định nghĩa 1.2.0.

Cách gọi:

> Dùng agent knowledge-reviewer review bài cache và cpu-io tại commit hiện tại, kiểm claim, engine và câu hỏi; trả report và claim matrix.

> Dùng knowledge-reviewer chế độ triage cho mục nghi vấn chuyên môn trong [đường dẫn report của student-tester].

## Tài liệu truy xuất theo task

[REFERENCE_GUIDE.md](REFERENCE_GUIDE.md) chứa 19 nguồn đã mở, section/edition/checkedAt, điều kiện/phản ví dụ, checklist và tám tình huống tự hiệu chỉnh. [RESEARCH_2026-10-15.md](RESEARCH_2026-10-15.md) ghi phạm vi nghiên cứu, nguồn và giới hạn. Profile yêu cầu đọc phần phù hợp rồi xác minh trực tiếp nguồn cho claim đang review; không nạp toàn bộ mọi nguồn mỗi lượt. Đây là tài liệu hỗ trợ truy xuất, không huấn luyện lại model hay bảo đảm mọi kết luận đúng.

Definition 1.1.0 thêm protocol claim → nguồn → expected độc lập → engine trace → assessment/UI, quản lý edition/supersession/errata và uncertainty. Giữ runtime **gpt-6-sol / low**, quyền chỉ đọc/kiểm/report và parent review evidence. Nghiên cứu trước audit không tự chứng nhận học liệu hoặc đóng pilot.

## Dữ liệu và kết quả

Profile giữ vai trò/model/quy trình. Report từng run giữ claims/nguồn/trace và giới hạn; MEMORY do parent cập nhật sau kiểm evidence. Không hứa một process hoặc context tồn tại mãi. Artifact dùng absolute path trong cache/thư mục tạm, không chứa credentials hay dữ liệu người học thật.

Kết luận: pass-with-scope, changes-required hoặc incomplete. Một bảng mục lục đủ 36 module không nghĩa đã review/dạy đủ 36 module; 14 bài beta chỉ được rà ở độ sâu thực có. AI review hỗ trợ kiểm định, không thay chuyên gia độc lập hoặc pilot thật.

## Cấu hình đã đối chiếu

Theo [official OpenAI documentation — Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), file native dùng name/description/developer_instructions, model và model_reasoning_effort. Đã parse TOML, kiểm model/effort và checksum. Native discovery của app có thể cần phiên mới; khi phiên hiện tại chưa nạp custom role, fallback spawn đọc nguyên definition với context mới và truyền explicit gpt-6-sol/low. Không đổi model nếu requested model không khả dụng; báo lỗi rõ.

Định nghĩa/code kiểm của repository được khóa trong `docs/engineering/agents-lock.json`. Lượt chạy thật được ghi tại MEMORY/report; cú pháp đúng không tự chứng minh runtime tự nạp custom role.

## Audit mới nhất

[QA-07 15/10/2026](RUN_2026-10-15_QA07.md) và [matrix](claims-2026-10-15-qa07.json):14 bài beta+1 bài ôn,23 claim trong phạm vi mô hình nhập môn;75 checked traces khớp. Không confirmed P0/P1/P2, có góp ý wording75%. Parent acceptance/giới hạn tại [QA-07](../../delivery/QA_07_KNOWLEDGE_REVIEW.md). Raw evidence, firstpass và script ở `evidence/qa07-2026-10-15/`. Script giữ absolute checkout/import của run gốc để bảo toàn provenance; khi chạy ở checkout khác cần tạo run mới có đường dẫn/commit đúng và giữ actual cũ. Không dùng kết quả này để chứng nhận production, mọi UI/browser hay toàn36 module.
