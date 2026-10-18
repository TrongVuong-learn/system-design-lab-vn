# EDU-24 — khung bài áp dụng tổng hợp và bài OS đầu tiên

18/10/2026, sau lôOS/web: thêm một consumer thật os-practice/L0.2 với sáu tình huống thread/counter, CPUworker, địa chỉảo/bounds, filedescriptor và eventloopCPU. Không tự đóng toàn module. Xem ADR0006 về schema/compatibility/progress. Sources dùng đúng từng câu từ các bài đã kiểm, không thêm thuật toán mới.

Core chấm độc lậpReact/storage; câu trả lời/checked lưu tronglab scalarJSON của ID mới, version1. Không tin điểm imported; sai checkpoint từ chối nguyên mảng. UI từng fieldset/legend, nútaria-pressed, lời giải đúng/sai/chưatrảlời, đổi đáp án ẩn kết quả cũ, reset, status; không chỉ màu. Không biến câu trả lời đúng thành chứng nhận hệ thống thật hết lỗi.

Acceptance: schema/binding/unique/source/answerbounds/noexecute, contract29ID cũ giữ nguyên, thaypracticepayload ID cũ bị chặn; corecorrect/missing/wrong/corrupt/version/immutability; fixtureprogress v1 vẫn giữ unknownlessonlabanswers roundtrip; mobile320/390/desktop, keyboard/focus/hints/case/resume/export/import/offline vàảnh. CI/full/master/Vercel giữ workflow. Không humanreview/pilot/thiết bị thật mới.

## Kết quả local

100unit/27files, content/coverage/lint/format/build đạt. Binding/payload/ID/source/đápán/schema strict và compatibility được kiểm;29contract cũ deep-equal. FixtureprogressJSON1 roundtrip ID mới và labscalar, không đổi persistence/schema cũ. Core yêu cầu chọn đúng hết vàcheckedtrue mới ready; đổi đápán/reset làm mất completion của bài mới và phải kiểm lại. LessonPlayer chỉ áp dụnggate này khi cópractice; các bài cũ giữ quy tắc trước.

LượtE2E đầu18pass/6fail, ma trận chỉ ra nút đápán chưa dùng style chuẩn, có chiều cao31.6px. Sửa classanswer-option cóminheight60, không hạ ngưỡng44px của project. Bộcuối24/24E2E liên quan đạt:4bài tập trên4browser,12offline,7responsive320–1440 và1reducedmotion/landscape. Thửchưađủ/sai/đúng/đổiđápán/ẩnfeedback, gateđóng/mở, reload và hoàn thànhchặng cuối.

Standalone320/390/1280: xuất/nhập bài dởđúng1/6, reload offline giữlựa chọn, sửađúng6/6 và kiểmgateđạt, khôngoverflow/pageerror. Đã xemảnh câu hỏi/đápán/lời giải mobile/desktop; readonlyscore khớp lựa chọn. Evidence ảnh/log/fingerprint ignored `.cache/edu24/`; không pilot/humanreview hoặc thiết bị thật mới. Đây chưa đóngENG-03/fullmodule; vẫn thiếu plannedcompetency/attempt/depth đầy đủ.

## CI và tích hợp

[PR#17](https://github.com/TrongVuong-learn/system-design-lab-vn/pull/17) merge thành `7065277e1f0aff8a9ef374deadd926007324ba7b`; tree bằng a89a5f4 đã kiểm. [Quality39094126331](https://github.com/TrongVuong-learn/system-design-lab-vn/actions/runs/39094126331) success100unit/259E2E,1skip theo cấu hình cũ; content/coverage/lint/format/build đạt. Không gán CI của commit docs kế tiếp thành kiểm chứng mới cho app. Runtime/dependency không đổi.

## Production

Vercel `dpl_E4boN64PzWJyT8GUxAS2FX1SRPWu` READY, ref `master`, SHA `7065277e1f0aff8a9ef374deadd926007324ba7b`, alias https://system-design-lab-vn.vercel.app. Đối chiếu 18 file HTTP với artifact đã kiểm: SHA-256 khớp toàn bộ, MIME/cache đúng, asset không tồn tại trả 404. Browser production 320/390/1280: chọn dở → xuất/nhập → reload offline → sửa đúng và kiểm tra gate đạt; không overflow/pageerror. Bằng chứng local ignored `.cache/edu24/cloud-http.json` và `live-browser.json`. Không thay pilot học sinh thật hoặc chứng nhận hoàn tất module.
