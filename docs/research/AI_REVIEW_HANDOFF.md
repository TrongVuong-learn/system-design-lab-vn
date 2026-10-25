# Giao bản học thử cho AI khác kiểm tra

Catalog source hiện tại 85 bài +1 bài ôn, có học liệu ở cả36module nhưng chưa chứng nhận đủ mọi năng lực. Người dùng dùng để tự học, chưa có reviewer con người; có thể dùng bản học thử ngay, ghi rõ lỗi phát hiện để sửa. AI review không tự biến thành human-reviewed.

## Prompt có thể sao chép

Bạn là reviewer System Design. Kiểm tra website được cung cấp theo từng bài. Đừng xác nhận đúng chỉ vì lời giải hoặc AI khác nói đúng. Với mỗi claim kỹ thuật, mở nguồn sơ cấp phù hợp (RFC, tài liệu sản phẩm đúng phiên bản, paper/tài liệu tác giả); ghi section/phiên bản và các giả định. Phân biệt trực giác, cơ chế trong mô hình và bảo đảm trong hệ thống thật.

Trước khi chạy lab, tự tính ít nhất một trace đúng, một biên và một phản ví dụ; sau đó mới so với UI/engine. Kiểm đáp án, từng phương án sai, gợi ý và tình huống áp dụng có khớp cơ chế không. Phát biểu không thể kiểm được phải ghi CHƯA XÁC MINH, không tự suy nguồn. Không tự sửa code/deploy, không gắn human-reviewed. Trả finding có mức độ, bài/claim, expected/actual, bước tái hiện, nguồn trực tiếp, giới hạn và đề xuất sửa. Không dùng kết quả UI làm oracle cho chính nó.

Nếu chỉ truy cập website: ưu tiên phần Giả định mô hình và nguồn đọc thêm, ghi rõ không có source code. Nếu có repository: đọc content/lessons/vi, content/editorial.json, packages/simulation-engine/src, fixtures/tests; dùng docs/research/knowledge-reviewer/REFERENCE_GUIDE.md làm hướng tra cứu, không coi guide là nguồn sơ cấp.

## Tình huống kiểm trọng điểm

- Cache: hit không đồng nghĩa mới; TTL không tự bảo đảm mọi loại freshness; refresh khác hit.
- Queue: công suất bằng arrival giữ backlog không tăng, chưa rút backlog; ACK/retry không tự bảo đảm exactly-once.
- Replica: replica có thể cũ; không suy failover an toàn từ lab lag.
- TLS: bảo vệ kênh/identity theo mô hình; không chứng minh website trung thực.
- Concurrency: mất cập nhật ngay cả một CPU; cùng mutex phải bao cả đọc/tăng/ghi.
- CPU/I/O: worker không phải CPU; số ms là preset, không benchmark.
- Library search: cần sorted + random access; số mục xem không phải ms; tính cả chi phí sort/update nếu chọn thiết kế thật.
- Ôn tổng hợp: hit75% là giả định mô hình, không dữ liệu đo; tự nhận định không có AI chấm ngữ nghĩa.

## Kiểm vận hành

Mở ở320/390px; đi hết4 chặng, thử đáp án sai/hint/thuật ngữ, bàn phím, reload/resume, export/import. Tải offline → chờ báo đủ → mất mạng → mở bài chưa ghé → reload. Bản mới cần đóng các tab cũ; không xóa progress để cập nhật. Link nguồn ngoài vẫn cần mạng.

Khi chuyển sang Vercel, export tiến độ từ site cũ, import ở site mới. Hai origin giữ storage riêng; không tự chuyển tiến độ hoặc gói offline. Không cần tài khoản trong ứng dụng.

## Mẫu finding

Bài / claim / severity / nguồn+section / giả định / tính tay / actual trace / bước tái hiện / giải thích / đề xuất / chưa xác minh. Phân biệt lỗi kiến thức với lỗi thao tác hoặc giới hạn đã công bố.

## Đợt bổ sung OS và web protocol (18/10/2026)

Bảy route mới: `/#/learn/address-space`, `file-handles`, `event-loop`, `cookie-session`, `reverse-proxy`, `multiplexing`, `os-practice` (cùng tiền tố `/#/learn/`). Scope/nguồn/fixture và evidence nằm trong báo cáo EDU_22_OS_FOUNDATIONS, EDU_23_WEB_PROTOCOLS và EDU_24_MODULE_PRACTICE tại docs/delivery. Số bài tăng không chứng minh module đã hoàn chỉnh; CONTENT_COVERAGE.md tách số năng lực nhập môn/cơ chế và luôn giữ gate fullmodule.

- RAM: A/B cùng VA 0 nhưng tới PA 4/8; VA 4 bị chặn trước ghi, RAM OS/process khác không đổi. Đổi config khởi tạo lại RAM, không phải chuyển process trong cùng lịch ghi.
- File: một tên/mộtfd; open→unlink→readfd→close. Đừng đồng nhất xóa tên với đóng handle, hoặc giải phóng file với xóa byte an toàn.
- Eventloop: một luồng / CPU, A cần CPU 1 → I/O 3 → CPU 1, B cần CPU 1; A xong mốc 5 ở cả hai chế độ, B xong mốc 2/6. I/O sẵn ở mốc 4 khác với phần CPU cuối đã chạy xong; không benchmark Node.
- Session: cookie ID và server record độc lập; server thu hồi phiên khiến cookie cũ không còn nhận diện An; không thêm đăng nhập thật.
- Proxy: public host cố định chọn backend theo path; routing không tự là cache hoặc nhanh hơn.
- HTTP: cùng lỗi A, B nhận được không đồng nghĩa B đã giao qua TCP; QUIC stream độc lập trong ví dụ, còn congestion/flow control, phụ thuộc header hoặc ứng dụng ngoài mô hình.
- Bài OS áp dụng: thử chưa trả lời/sai/đúng 6/6, đổi đáp án/reset, reload và export/import/offline. Không tin score/pass nhập, ready đòi toàn bộ đúng và đã kiểm tra; không dùng điểm này như chứng nhận mastery / human review.

Kiểm trên 320/390 px và desktop và tìm counterexample ngoài assumptions trước khi kết luận sai. Báo rõ chưa xác minh thay vì suy nguồn gắn URL là mọi claim đã chuẩn. AI review vẫn không thay pilot học sinh hoặc thiết bị thật.

## EDU-25 — L1 từ yêu cầu đến vận hành

Sáu route mới: requirements-boundaries, api-contracts, data-models, database-indexes, transactions-isolation, service-delivery. Chặng đầu có 27 chương cơ chế/ví dụ/điều dễ nhầm, chặng luyện có 40 câu và cuối mỗi bài có case chuyển giao. Đối chiếu nguồn ở từng bài và editorial registry, không lấy đáp án khớp UI làm bằng chứng kiến thức đúng. Đây là bài phân tích quyết định, không phải DB/cloud thật chạy trong browser. Cần kiểm các giới hạn: timeout/cancellation không rollback; token retry có phạm vi/payload; cursor không tự snapshot; SQL constraint không tự mọi invariant; planner cost khác ms; PostgreSQL18 Read Committed khác snapshot toàn transaction; rollback deployment khác dữ liệu. Xem báo cáo EDU-25 để biết source/build/QA/publication; chưa chứng nhận toàn L1 hoặc 36 module.

## EDU-26 — toàn lộ trình tự luyện

49 bài mới ngoài EDU-25: L0 bổ trợ/L2–L5, 7 track, 6 capstone, 8 case; 27 bài thiết kế có textarea và rubric. Dùng bộ lọc tại Khám phá để mở từng nhóm. Kiểm trace/số tự tính trong chương, assumptions và counterexample theo nguồn sơ cấp, đặc biệt quorum không tự linearizable, lease cần fencing, Raft commit cần điều kiện term, CRDT convergence khác invariant, saga compensation khác rollback, RPO khác cam kết phục hồi, RAG không tự quyền truy cập. Bài mới là lịch suy luận và lựa chọn thiết kế, không chạy dịch vụ phân tán thật.

Thử bản nháp thiếu mục/chỉ khoảng trắng, điền đủ, reload, quay lại làm lại bài tập, xuất–nhập và mở bài chưa ghé offline. Đã điền không được báo đã chấm đúng. Các nguồn/lịch/câu hỏi phải được review riêng với tính năng web. Không lấy 85 bài làm chứng nhận 36 module hoàn chỉnh; không tự ghi human-reviewed.
