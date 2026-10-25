# QA-09 — Review kiến thức toàn bộ 55 bài mới

Ngày 25/10/2026. Trạng thái: In progress. Người dùng giao gọi agent review kiến thức, sửa lỗi được xác minh và cập nhật website; quyền phát hành đã có trong yêu cầu. Baseline production: `68f7de6cd2d1659c0b9840c067e5e519539c1194`. Nhánh: `codex/qa09-new-lessons-review`.

## Phạm vi và điều kiện hoàn tất

Rà 55 bài mới từ EDU-25/26 ở độ sâu beta thực có: 16 service/foundation/scaling, 18 distributed/production/capstone, 21 architecture/track/case. Inventory ở `../research/knowledge-reviewer/evidence/qa09-2026-10-25/parent/inventory.json`. Ba agent role knowledge_reviewer, gpt-6-sol / low, chỉ đọc/kiểm/report; parent xác minh nguồn và phép tính trước sửa. Bao gồm nội dung chương, đáp án, giả định/giới hạn và nguồn; đối chiếu hoạt động chọn đáp án/design draft đúng contract.

Hoàn tất khi có báo cáo đủ inventory và verdict có giới hạn, sửa mọi finding được parent xác nhận, kiểm compatibility/tests/build/browser liên quan, PR/CI/merge master và production READY đúng SHA cùng smoke. Không mở rộng thành engine SQL/Raft/cloud thật, không chứng nhận hoàn tất 36 module, không thay pilot học sinh hoặc human review.

## Findings và quyết định

- AT-01: parent xác nhận việc gắn toàn bộ nguồn cho mọi chapter/practice/claim của tám integrated cases là quá rộng. Sửa mapping theo cơ chế được nguồn hỗ trợ; các số và chính sách giả định vẫn là ví dụ tự biên soạn.
- DP-01: parent bác bỏ sau đọc đủ PDF MIT: §17.4.1 trang11 có Little’s Law, trang12–13 có proof/application. Evidence ở parent/mit-source-check.md. Không đổi URL theo finding sai.

## Kiểm chứng / phát hành

Parent đã đối chiếu phần còn thiếu trong `parent/residual-review.md`: 6 cụm kỹ thuật cuối của architecture/specialist có nguồn bổ sung trực tiếp; giữ report ban đầu của agent và phân biệt source-read/inferred với browser/executed. 431 dòng review thuộc ba mức granularity khác nhau, không phải 431 chứng minh hình thức. AT-01 sửa mapping tám case; bổ sung nguồn cho sáu nhánh và token bucket, làm rõ nhãn MIT ở capacity-tail. Không lỗi đáp án/cơ chế được xác nhận cần thay.

Node24.21.0/pnpm11.25.0: content:check/coverage,106 unit/29files,lint,format,typecheck,build đạt.120 E2E trên mobile/desktop Chromium đạt (55 bài mới + pathways + lưu bản thiết kế/khôi phục/import/export/offline). Nguồn bổ sung sau lượt120 không đổi text/assessment/engine; build/check lại và CI sẽ chạy toàn bộ. So85 contract với production baseline: chỉ70 mảng sourceIds thay đổi, mọi trường khác giống hệt. Ngoại lệ editorial ghi ADR0005 và script tự kiểm.

Browser nguồn đọc thêm: 4bài ×320/1280px, đúng href/count, không tràn ngang hoặc pageerror. Parent đã xem ảnh mobile track-data và desktop case-query-cache; chữ/link/giới hạn đọc được. Một lượt script đầu thất bại vì bấm đóng accordion đang mở khi đổi route; sửa script chờ đúng title và chỉ mở khi đang đóng, không sửa app. Artifact cuối: `b1de466206cb8e89`,16assets/1791846bytes.

Chưa merge/deploy ở thời điểm ghi task; PR sẽ lưu CI/deployment SHA/READY/fingerprint và public smoke sau phát hành.
