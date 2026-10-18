# EDU-21 — serialization và compression L0.3

Scope 18/10/2026: hai bài nhập môn, ID serialization/compression, engine1.12.0/model1. Core thuần, checkpoint config/step0–2/model, derive output từ fixture; không tin decoded/restored/counter nhập. Không sửa assessment21ID cũ hoặc tiến độJSON1/IndexedDB2. Không đóng L0.3/toàn roadmap.

Nguồn đọc trực tiếp: RFC8259 §1–8/12 (JSON types/escaping/UTF-8/whitespace/parser); RFC1951 §1.1 chỉ cho giới hạn không thể nén lossless mọi đầu vào. Không gán RLE toy là thuật toán DEFLATE hoặc benchmark nguồn. Parent review bằng nguồn/trace/assessment, reviewerType agent; không phải human review/pilot.

Serialization: ba tên An/Bình/An,"B"; seats2 số nguyên nhỏ, confirmedtrue boolean; JSON gọn/thụt dòng, UTF-8 byte thực, parse lại từ byte. Không CSV/Protobuf/schema evolution/Date/bigint/lossy number/validation nghiệp vụ hoặc gửi mạng. Chưa là module serialization đầy đủ.

Compression: hai chuỗi ASCII A/B16byte; támA/támB hoặc xen kẽ. RLE tự đặt mỗi dãy hai byte countUInt8/symbolASCII, không header/checksum; 16→4 hoặc16→32byte. Giải nén từ byte thực, không từ nhãn hiển thị; khôi phục đúng chuỗi. Không gzip/DEFLATE/bảo mật hoặc benchmark CPU/network.

UI theo DESIGN: bản ghi/chuỗi gốc → thao tác → before–after → biểu diễn byte/văn bản → khôi phục; mobile một cột, cặp nén2cột/desktop4cột, JSON wrap không cuộn ngang. Không auto-animation. Theo frontend-design/React/Playwright skill đã cài, không nâng dependency. Acceptance: fixture byte độc lập/Unicode/quote/kiểu/roundtrip, malformed/version/immutability, bốn browser/resume/case/hints/keyboard, responsive/offline/export/import và ảnh320/390/1280. Chỉ ghi đạt khi chạy thực tế.

## Kiểm chứng local

86unit/24files đạt; content/coverage, lint, format, build/typecheck đạt. Source23bài+1ôn, không đổi runtime/dependency. So deep-equal21contract cũ với master trước đợt, chỉ thêm2ID. Review ảnh320/390/1280 cho cả hai bài; sửa select compression quá nhỏ bằng routing-inputs chung, JSON/byte wrap, focus/reset và nhãn khôi phục rõ.

Lượt E2E đầu23pass/5fail:4test JSON dùng selector tên khớp option/dd/strong; sửa locator trỏ p kết quả khôi phục, giữ nguyên kỳ vọng. Một430px lỗi ENOENT trace do hai lượt Playwright dùng chung output đồng thời, không chứng minh lỗi sản phẩm; đã chạy lại cả bộ tuần tự sau build, không đổi assertion để né lỗi. 8test bài mới retest ban đầu đạt; kết quả bộ cuối ghi sau chạy xong.

Standalone browser sau sửaUI: cả hai bài tại320/390/1280 export/import bản lưu step1, mở lại/reload offline rồi parse/giải nén thành công, không overflow/pageerror; `.cache/edu21/local-browser.json`/ảnh/log/fingerprint ignored. Không pilot hoặc điện thoại thật; không coi emulation là nghiệm thu OS lifecycle.

Bộ cuối28/28E2E liên quan đạt:8test hai bài trên Chromium mobile/desktop, Firefox/WebKit;12offline;7responsive320–1440px và1reduced-motion/landscape. Artifact fingerprint sau build đã ghi; CI full vẫn là gate trước merge/phát hành.
