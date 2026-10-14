# EDU-10 — phản hồi dễ hiểu cho cache, queue, network

Plan cập nhật trước code tại5c0dbcc, baseline cacefc8, nhánh codex/edu-10-clear-feedback. Phi thương mại, chia sẻ nhỏ, ưu tiên cách giảng; auth/sync hoãn theo nhu cầu. Phạm vi/acceptance nguồn chính ROADMAP mục11 và TEACHING_GUIDE.

## Candidate hiện thực

Engine bổ sung hàm quan sát thuần: kết quả bước ngay trước/sau và nguyên nhân. UI bảng3–4 dòng, tô ô thay đổi và giải thích; cache expiry không tự refresh, queue thay cấu hình không chạy thời gian, network tách ba phần thời gian. Lưu observation string trong lab hiện có; malformed optional observation bị bỏ qua. Reset cache/queue xóa bước cũ.

Guidance schemaVersion1 optional, hai gợi ý tĩnh mỗi prediction/challenge. Đáp án/options/explanation v1 giữ nguyên qua legacy fixture. Progress v1 thêm hints optional với prediction/challenge0–3; bản cũ mặc định0; export/import giữ dữ liệu. Sai mở gợi ý rồi lời giải theo yêu cầu; đúng hiện giải thích. Case đánh đổi chỉ hiện sau đúng hoặc đã yêu cầu lời giải để tránh lộ sớm. Mức gợi ý không chứng nhận mastery. Editorial revision tăng cho ba bài, case và engine semantics/version giữ nguyên; core không phụ thuộc UI/storage.

## Kiểm chứng

- 34 unit test đạt; lint đạt. Build/content validation/typecheck đạt:36 module registry,13 bài beta. Lint đạt. Unit có trace expiry/cache, queue actual/config, network sum và progress v1/hints; schema guidance cũng được kiểm.
- Full E2E120 cases:111 pass,8 fail do hai assertion còn tìm lời phản hồi cache cũ ×4 project,1 skip hover mobile. Đã đổi sang kiểm nội dung observation/source row; không giảm kiểm tra model, write error, retry hoặc reload. Tám case sửa assertion rerun đạt trên cùng artifact. Kết quả gộp119 pass/1 skip; không gọi full run đầu là thành công.
  -12 ảnh ở `/private/tmp/edu10-visual/`, cache/queue/network và hints, width320/390/1280; không tràn ngang, no pageerror, reduced motion. Parent xem ảnh mobile/desktop của ba lab và mobile hints, số/đơn vị và nút đọc được. Keyboard/focus, storage upgrade/import/export, saved→reload, multi-tab conflict và responsive320…1440 được suite kiểm. Emulation chưa thay thiết bị thật/screen reader.
- Bản lưu cũ không có hints/observation vẫn dùng được; malformed observation bỏ qua, không xóa bản lưu. Case assessments v1 khớp fixture.

Chưa có pilot thật hoặc reviewer người thật; EDU-02 và gate module/level còn mở. Chưa triển khai chuẩn cho10 bài còn lại hoặc bài ôn tổng hợp. Không thêm auth/backend/dependency.
