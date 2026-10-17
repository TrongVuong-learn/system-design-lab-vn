# Giao bản học thử cho AI khác kiểm tra

Bản hiện tại 21 bài +1 bài ôn, không phải toàn bộ36module. Người dùng dùng để tự học, chưa có reviewer con người; có thể dùng bản học thử ngay, ghi rõ lỗi phát hiện để sửa. AI review không tự biến thành human-reviewed.

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
