# EDU-03 — Kiểm định kiến thức và độ bao phủ

Ngày: 12/10/2026. Baseline: `6a72cd35601be74d9dc665c10fddd9fcfdc0b21f`. Phạm vi: sáu bài trong `content/lessons/vi/intro.json`, lời hiển thị trong `Lab.tsx`, simulation-engine 1.0.1, schema/pipeline, catalog, CURRICULUM_MAP và roadmap. Đối chiếu online System Design Primer và nguồn gốc bên dưới. Đây là rà soát bởi agent; chưa có chuyên gia độc lập ký duyệt hoặc pilot học sinh.

## Kết luận

**Học liệu hiện tại chưa đầy đủ.** Khung 6 level/36 module/7 nhánh rộng, nhưng tiêu đề module không phải bằng chứng đã có bài học. Sáu bài beta dạy một số trực giác; chưa đủ cho thiết kế hệ thống end-to-end, thực hành production hoặc toàn bộ nội dung Primer. Không tính 6/36 thành phần trăm hoàn thành: bài và module là hai đơn vị khác nhau.

| Level | Bài beta hiện có | Module được bài beta tham chiếu | Module đã có đủ bằng chứng nghiệm thu toàn bộ |
| --- | ---: | --- | ---: |
| L0 | 2 | L0.1 (request, cache) | 0/6 |
| L1 | 0 | Chưa có | 0/6 |
| L2 | 4 | L2.1, L2.3, L2.5, L2.6 | 0/6 |
| L3 | 0 | Chưa có | 0/6 |
| L4 | 0 | Chưa có | 0/6 |
| L5 | 0 | Chưa có | 0/6 |

Bảy nhánh chưa có học liệu tương tác chuyên sâu. Tổng cộng chỉ năm module được tham chiếu bởi bài beta. Cache nhập môn nằm L0.1, không hoàn thành module cache L2.2. Bài ngày hội là bài kết hợp, không chứng minh người học đã hiểu toàn bộ rate limiting/backpressure L2.6.

## 1. Đối chiếu phạm vi với Primer

Dùng [mục lục Primer](https://github.com/donnemartin/system-design-primer#system-design-topics-start-here) làm chỉ mục; mapping và đánh giá trạng thái dưới đây là phân tích của dự án, không phải nhận xét của tác giả Primer. Đây là đối chiếu nhóm chủ đề, chưa phải duyệt từng khẳng định trong toàn bộ repo hoặc mọi liên kết ngoài.

| Nhóm đối chiếu | Nơi chịu trách nhiệm trong chương trình | Học liệu hiện tại |
| --- | --- | --- |
| Hiệu năng, mở rộng, latency/throughput | L0.6, L2.1, L4.3 | Request và balance giới thiệu một phần; thiếu phân bố/p95/ước lượng |
| CAP và consistency | L3.1, L3.3 | Chưa có; replica lag không thay bài consistency |
| Availability, failover | L2.3, L3.6, L4.6 | Chưa có bài lỗi/chuyển vai/khôi phục |
| DNS, TCP/UDP | L0.4 | Chưa có |
| CDN | L2.2; Media, Platform | Chưa có |
| Load balancer, reverse proxy | L0.5, L2.1 | Có bottleneck; chưa có thuật toán phân tải hoặc health check |
| Application layer, discovery | L2.1, L5.2 | Chưa có |
| Relational, NoSQL | L1.3–L1.5 | Chưa có mô hình dữ liệu, index hoặc transaction |
| Replication | L2.3, L3.6 | Một primary/replica và độ trễ; chưa lỗi |
| Federation, sharding | L1.3, L2.4 | Chưa có |
| Cache và policies | L2.2 | Cache cũ/TTL/manual refresh; chưa eviction, stampede hoặc write policy |
| Async, queue, backpressure | L2.5–L2.6 | Queue công suất cố định; chưa delivery/retry/ACK |
| REST/RPC | L1.2 | Chưa có |
| Security | L1.2, L4.4 | Chưa có |
| Ước lượng và bài thiết kế | L0.6, L5.1; capstones | Ngày hội đơn giản; chưa API/data model/failure review |

Các chi tiết chưa nêu rõ trong khung cũ (push/pull CDN, refresh-ahead, federation và một số nhóm case study) đã có mục phân bổ bổ sung trong CURRICULUM_MAP, không tạo level/module mới. Bản đồ còn có transaction, consensus, SRE, migration và các nhánh ứng dụng; các phần đó vẫn cần nguồn trực tiếp và kiểm định riêng khi được biên soạn.

## 2. Kiểm tra độ đúng của sáu bài

| Bài | Kết quả đối chiếu và tính tay | Giới hạn cần giữ |
| --- | --- | --- |
| request | Luồng client → xử lý → dữ liệu → response phù hợp [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview). 20 + 80 + 20 = 120 ms đúng với ba chặng nối tiếp | Không suy thành mọi website luôn đọc DB hoặc mọi tác vụ đều nối tiếp; chưa mô phỏng DNS/TLS/render/fan-out |
| balance | Không cache: min(số máy × 6, 4) = 4 lượt/giây. Tăng máy không tăng công suất DB. Với hit giả định 75%, giới hạn DB của mô hình là 4/(1−0,75) = 16 | Đây là công suất lý tưởng, không benchmark; cache vẫn đi qua máy xử lý. Workload thực không có chi phí đồng đều; xem [Google SRE](https://sre.google/sre-book/handling-overload/) |
| cache | Đổi nguồn không tự đổi bản cache; cache-aside không bảo đảm cache luôn khớp nguồn. Tại tuổi bản ghi bằng TTL, lần đọc tiếp lấy nguồn. Phù hợp phạm vi [Azure Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) | Nguồn luôn sẵn sàng, không concurrent writes/eviction; TTL không đồng nghĩa chủ động tải mới đúng thời điểm hết hạn |
| queue | 6 việc đến − 1 worker × 2 = tăng 4 việc mỗi bước. Với 8 việc đến, 4 worker giữ backlog; 5 worker có thể giảm backlog 2 việc/bước đến 0. Phù hợp [Azure load leveling](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling) | Công việc và tốc độ cố định; bằng nhau không phải lời khuyên chạy production ở 100% công suất. Chưa có mất việc/duplicate/lỗi downstream |
| replica | Ghi 205 ở t=0, lag=3: trước t=3 bản sao giữ 201, đến t=3 thành 205. Async có thể trả dữ liệu cũ, phù hợp [PostgreSQL 18 Hot Standby](https://www.postgresql.org/docs/18/hot-standby.html) | Không suy lag=0 là đồng bộ; read-after-write phụ thuộc tuyến đọc/commit/isolation/failover. Không bảo đảm backup hoặc quorum |
| design | 2 máy + cache + 3 worker: min(12,16)=12 lượt đọc/giây; 3×2=6 việc gửi/giây; chi phí 2+1+3=6. Đạt đúng đề giả lập | Không có headroom khi tải biến động; chưa đạt độ tin cậy, bảo mật, SLO hoặc ngân sách tiền thật |

Không phát hiện đáp án cốt lõi sai trong 12 câu prediction/challenge khi giữ đúng giả định. Điều này không chứng minh mọi chuỗi thao tác đều đúng, mọi mô hình đúng ngoài đời, hoặc mọi học sinh đã hiểu.

### Lỗi và chỗ mơ hồ đã xử lý trong EDU-03a

1. **Phạm vi đếm cache:** `misses` chỉ tăng khi bấm Xem lịch phải đọc nguồn. Manual refresh cũng đọc nguồn nhưng không tăng `misses`. Nhãn cũ “Đọc nguồn” khiến người học hiểu đó là tổng I/O. Đổi thành “Xem qua nguồn”, đi cặp “Xem qua cache”, thêm giải thích rõ chỉ đếm lượt xem. Không đổi engine/checkpoint và không suy lại số refresh trong dữ liệu cũ.
2. **Đơn vị backlog:** metric còn chờ là số lượt còn lại của một cửa sổ, không phải tốc độ. Đổi hậu tố từ “/ giây” sang “lượt”; giữ giải thích cửa sổ một giây không tích lũy backlog.
3. **Công suất queue:** thêm lời giải thích cần dự phòng khi tải/service time biến động. Đáp án bốn worker vẫn đúng trong đề mô hình cố định.
4. **Điều chỉnh replica lag:** engine giữ thứ tự bằng cách chờ ghi trước. Mức 0 đưa replica về giá trị mới nhất và bỏ pending. Công khai đây là chế độ lý tưởng, không phải giao thức synchronous replication.
5. **Roadmap cũ:** bỏ câu “Chưa bắt đầu phát triển ứng dụng”, trỏ đến trạng thái beta thật.

Những chỉnh sửa này làm rõ lời hiển thị và giả định; không thay đáp án, thuật toán, mục tiêu, schema hoặc đánh dấu mất hiệu lực tiến độ cũ. Revision được định danh bằng commit phát hành; schema bài vẫn khóa `version: 1`. Version học liệu độc lập với format tiến độ chưa được hiện thực (ENG-03).

## 3. Rủi ro chất lượng còn mở

- **Năng lực và prerequisite chưa thành dữ liệu:** schema chưa có competencyId/depth/prerequisite/reviewer/reviewedAt. Pipeline kiểm tra 36 ID module, ID bài duy nhất, module tồn tại và schema; chưa kiểm tra level bài khớp module, prerequisite graph, claim-level sources hoặc reviewer gate. Những yêu cầu trong plan hiện là đặc tả.
- **Độ sâu đánh giá còn thấp:** một prediction và một challenge mỗi bài; nhiều phương án sai quá lộ. Hai thao tác bất kỳ có thể mở challenge. Đạt bài không chứng minh biết thiết kế hay vận hành. Cần bài mới không gợi ý, rubric giải thích và nhiệm vụ thí nghiệm có mục tiêu.
- **Lối học L0→L2 bị thiếu cầu nối:** gắn level L2 cho bài trực giác không có nghĩa người mới đã học API/database L1. Khi registry sẵn sàng, tách độ sâu nhập môn khỏi năng lực module chuyên sâu mà không chặn người học khám phá.
- **Thuật ngữ còn thiếu bước đệm:** throughput, backlog, hit/miss, ms, tỷ lệ 75% cần ví dụ và giải nghĩa ngay tại chỗ trong lô nội dung tiếp theo; định nghĩa latency nên ghi rõ điểm bắt đầu/kết thúc đo của từng bài.
- **Nguồn còn trôi phiên bản:** URL PostgreSQL hiện tại dùng `/current/`; cần khóa bản khi biên soạn nâng cao. Primer được đọc theo master ngày audit, chưa ghim upstream SHA; trước khi nhập/chuyển thể tài liệu phải khóa revision, nguồn mục cụ thể và attribution.
- **Chưa có review con người/pilot:** báo cáo này không thay reviewer chuyên gia cho transaction, consensus/security; chưa có chứng cứ học sinh cấp 3 hiểu và áp dụng được.

## 4. Những ngộ nhận phải chặn khi mở rộng

Các mục sau là guardrail cho bài chưa viết, không cáo buộc sáu bài hiện tại đang dạy sai:

- CAP không chỉ là khẩu hiệu “chọn hai trong ba”. Nêu mô hình phân vùng, linearizability và định nghĩa availability; không lẫn consistency của CAP với invariant trong ACID. Nguồn: [Gilbert–Lynch, 2002, §2–3](https://sites.cs.ucsb.edu/~rich/class/cs293b-cloud/papers/cap-proof.pdf).
- SQL/NoSQL không tự quyết định consistency, transaction hay khả năng mở rộng. Chọn theo workload, sản phẩm và cấu hình; isolation cùng tên có thể khác hành vi. Nguồn ví dụ: [PostgreSQL 18 Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html).
- Queue không tự bảo đảm xử lý nghiệp vụ đúng một lần. Nêu ACK, duplicate, transaction boundary, idempotency và hệ thống ngoài. Nguồn: [Apache Kafka 4.1, Message Delivery Semantics](https://kafka.apache.org/41/design/design/#message-delivery-semantics).
- Replication đồng bộ cần định nghĩa thời điểm xác nhận ghi và trạng thái replica chờ đợi; không suy từ một thanh trượt delay. Nguồn: [PostgreSQL 18, Synchronous Replication](https://www.postgresql.org/docs/18/warm-standby.html#SYNCHRONOUS-REPLICATION).

## 5. Cách dùng repo tham khảo lâu dài

Giữ Primer là chỉ mục tìm khoảng trống. Viết giải thích tiếng Việt riêng với tình huống → dự đoán → mô hình → phản ví dụ → áp dụng → lớp kỹ thuật. Mỗi bài có nguồn trực tiếp cho từng claim quan trọng, giả định/đơn vị và trace kiểm chứng. Không sao chép một sơ đồ thành kiến trúc chuẩn cho mọi workload.

Repo công bố [CC BY 4.0](https://github.com/donnemartin/system-design-primer/blob/master/LICENSE.txt). Khi chuyển thể cần ghi tác giả, nguồn, license và thay đổi; nguồn bên ngoài repo cần xem riêng. Đợt này không nhập code, hình hoặc dịch nguyên bài từ Primer.

Thứ tự và acceptance của việc lấp khoảng trống được cập nhật tại [ROADMAP.md §8](ROADMAP.md#8-edu-03--ưu-tiên-sau-kiểm-định-học-liệu-12102026). CURRICULUM_MAP vẫn là nguồn chính cho phạm vi; không tạo một giáo trình song song.

## 6. Bằng chứng kiểm tra

Đã đọc toàn bộ sáu bài, đối chiếu công thức engine/renderer và 12 đáp án; tham khảo nguồn online ghi ở từng mục. Kiểm tra thực thi sau sửa được ghi trong IMPLEMENTATION_STATUS khi có kết quả. Không dùng kết quả E2E thay bằng chứng chính xác của kiến thức chưa viết.
