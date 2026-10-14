# EDU-11 — phản hồi dễ hiểu trên đủ13 bài beta

Plan commit9ae16da trước code, baseline cde6c94; nhánh codex/edu-11-feedback-all-lessons. Scope10 bài còn lại, roadmap mục12. Phi thương mại, local-only progress; mục tiêu là cách giảng nhất quán.

## Hiện thực candidate

Guidance schemaVersion1 cho cả13 bài, hai gợi ý mỗi prediction/challenge. Đáp án/options/explanation và phiên bản tiến độ v1 giữ nguyên; gợi ý lưu độc lập bằng schema hiện có. Case tradeoffs chưa lộ khi sai trước khi yêu cầu lời giải.

Quan sát10 kinds qua hàm thuần observeRemaining và renderer EDU-10; không React/DOM/storage trong core. Mỗi bảng tối đa4 dòng, có đơn vị, reason từ actual snapshot. API renderer điều phối so bước cũ với lab mới; marker reset explicit cho DNS/replica để ghi trở lại giá trị ban đầu không bị hiểu nhầm là reset.

Request cộng các chặng nối tiếp; traffic/design tính lại cửa sổ không có backlog ban đầu; metrics tính lại20 request từ0; replica lag chỉ áp dụng ghi mới; DNS expiry chỉ tra khi lookup; HTTP error code vẫn là response, đổi config chưa nhận response mới; TCP/UDP trace khôi phục có điều kiện; capacity phân biệt lưu/truyền; routing tách IP/route/port. Các giới hạn bài vẫn hiện rõ. Không thêm mô hình hoặc hứa bảo đảm giao đủ/benchmark thật.

## Kiểm chứng

-41 unit test đạt, gồm6 test nhóm observation mới và schema đủ13 bài; fixture assessment/progress v1 giữ nguyên. Build/content validation/typecheck/lint đạt, không nâng dependency.
- Full E2E132: vòng đầu103 pass/28 fail/1 skip vì locator status/value trùng khi thêm bảng và textContent chứa glossary ẩn; không có lỗi engine xác nhận từ các failure này. Đã scope vùng phản hồi/diagram và tách văn xuôi khỏi note khi assert, giữ kiểm tra kết quả. Full rerun đạt131 pass/1 skip (hover touch).
- Sau review ảnh, chuyển observation request xuống sau điều khiển và làm rõ “không có route tới đích và không có route mặc định”. Build cuối được kiểm riêng16 E2E cho10 bài và routing, unit/lint; 16 test đạt, ghi hash và kết quả ở `.cache/edu11/tested-artifact.json`. Không gán full-run trước cho artifact sau hai thay đổi nhỏ này.
-33 screenshot cache QA tại `/private/tmp/edu11-visual/`:10 lab ×320/390/1280 và routing hints ×3. Kiểm không tràn ngang/pageerror, reduced motion. Parent xem ảnh đại diện của cả10 lab; nội dung, bảng có đơn vị và highlight đọc được trên mobile/desktop. Ảnh request/routing cuối được review lại sau hai chỉnh sửa.
- E2E xác nhận: prediction sai→gợi ý1/2→lời giải, observation saved→reload, challenge có mức gợi ý riêng; nguồn/bản sao/TTL, buffer TCP, throughput/storage formulas; legacy checkpoints, import/export, write failure/retry, multi-tab, keyboard/focus và responsive320…1440. Reset DNS/replica dùng marker explicit; ghi giá trị201 với lag0 vẫn là ghi hợp lệ, không tự bị xóa quan sát.

Chưa pilot thật, reviewer người thật, điện thoại thật hoặc assistive technology; không đổi human-reviewed/module complete. Chưa bài ôn/capstone hoặc hoàn thiện36 module. Hai agent QA không được gọi trong task hiện thực này; review bằng evidence/tests của parent.
