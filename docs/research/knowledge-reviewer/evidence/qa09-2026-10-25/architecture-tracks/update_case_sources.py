import json,pathlib
p=pathlib.Path('/Users/vuongn/Documents/ChatGPT/System Design learning/docs/research/knowledge-reviewer/evidence/qa09-2026-10-25/architecture-tracks')
m=json.loads((p/'claim-matrix.json').read_text())
# Mỗi URL dưới đây được mở 2026-10-25. Support chỉ là phần nguồn thật sự nói, không chứng minh fixture.
U={
'pg':'https://www.postgresql.org/docs/18/ddl-constraints.html',
'pgiso':'https://www.postgresql.org/docs/18/transaction-iso.html',
'cache':'https://www.rfc-editor.org/rfc/rfc9111.html',
'owasp':'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',
'kafka':'https://kafka.apache.org/41/design/design/',
'robots':'https://www.rfc-editor.org/rfc/rfc9309.html',
'bfs':'https://www.ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/1208e162775f6f5cedfbb9f2b694ede0_MIT6_006F11_lec13.pdf',
'azure':'https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside',
'flink':'https://nightlies.apache.org/flink/flink-docs-release-2.0/docs/concepts/time/',
'dataflow':'https://research.google/pubs/the-dataflow-model-a-practical-approach-to-balancing-correctness-latency-and-cost-in-massive-scale-unbounded-out-of-order-data-processing/',
'sre':'https://sre.google/sre-book/service-level-objectives/',
'overload':'https://sre.google/sre-book/handling-overload/',
'pgrep':'https://www.postgresql.org/docs/18/warm-standby.html',
'adr':'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions',
'cloudfront':'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html',
'karger':'https://people.csail.mit.edu/karger/Papers/web.pdf',
}
meta={
'pg':('PostgreSQL 18','§5.5.3 Unique Constraints','Unique constraint chặn cùng key; không chứng minh thuật toán sinh mã.'),
'pgiso':('PostgreSQL 18','§13.2 Transaction Isolation','Phạm vi isolation/cập nhật đồng thời của PostgreSQL, không là policy ledger.'),
'cache':('RFC 9111 STD 98, 2022','§4.2 Calculating Freshness Lifetime','Freshness HTTP cache theo lifetime/age, không là quyền hoặc expiry nghiệp vụ.'),
'owasp':('OWASP live; revision unknown','Validate Permissions on Every Request; static resources','Cần kiểm quyền trên request/tài nguyên; không xác định policy thu hồi cụ thể.'),
'kafka':('Apache Kafka 4.1','Design: delivery semantics, ordering','Kafka có retry/duplicate trong phạm vi cấu hình; không chứng minh analytics/ledger tùy ý.'),
'robots':('RFC 9309 Proposed Standard, 2022','§§2.3.1, 3','Quy tắc robots và lỗi; không cấp authorization.'),
'bfs':('MIT 6.006 Fall 2011','Lecture 13, pp. 1–6','BFS lớp khoảng cách, parent/shortest path đồ thị không trọng số; fixture tính riêng.'),
'azure':('Microsoft Azure Architecture Center live; revision unknown','Context and problem; Solution; Problems and considerations','Cache-aside có thể stale; invalidation/expiration do ứng dụng định nghĩa.'),
'flink':('Apache Flink 2.0.1','Timely Stream Processing','Event/processing time, watermark theo triển khai; không chứng minh con số fixture.'),
'dataflow':('Akidau et al., PVLDB 8 (2015)','Abstract; model of event-time windows','Dữ liệu out-of-order/late/retraction cần policy; không chứng minh phép đếm case.'),
'sre':('Google SRE Book','Service Level Objectives: Objectives; Indicators in Practice; Aggregation','SLI/SLO, workload và phân phối; đây là kinh nghiệm Google, không là benchmark case.'),
'overload':('Google SRE Book','Handling Overload: introduction; QPS pitfalls','Bottleneck và chi phí request khác nhau; không chứng minh kiến trúc feed cụ thể.'),
'pgrep':('PostgreSQL 18','§26.2 Log-Shipping Standby Servers','Replica/lag theo PostgreSQL; không bảo đảm đọc ngay sau ghi.'),
'adr':('Michael Nygard, 2011','Context; Status; Consequences','ADR ghi quyết định và hệ quả; không chứng minh milestone vận hành đã đạt.'),
'cloudfront':('AWS CloudFront live; revision unknown','How signed URLs work; When CloudFront checks expiration','Ví dụ sản phẩm: kiểm expiry lúc HTTP request kể cả edge cache; request bắt đầu trước expiry có thể hoàn tất sau.'),
'karger':('Karger et al., STOC 1997','Consistent hashing; distributed caching','Nguồn gốc consistent hashing cho cache; không chứng minh cold miss cụ thể khi thêm node.'),
}
# mapping theo ba chapter mỗi case; số học/nhánh khác giữ authored fixture + suy luận.
mapping={
'case-short-links':[['pg','owasp'],['cache','owasp','cloudfront'],['kafka']],
'case-school-feed':[['overload'],['kafka'],['owasp']],
'case-fixture-crawler':[['bfs'],['robots'],['kafka']],
'case-club-ledger':[['pg','kafka'],['pgiso'],['owasp','kafka']],
'case-social-path':[['bfs'],[],['owasp','bfs']],
'case-query-cache':[['azure'],['azure','cache'],['karger','azure']],
'case-book-ranking':[['flink','dataflow'],['kafka','dataflow'],['flink','owasp']],
'case-growth-roadmap':[['sre','overload'],['pgrep','azure'],['sre','adr']],
}
gap={
'case-short-links':[None,'Expiry 24 giờ là hợp đồng case; RFC 9111 không tự thực thi expiry ứng dụng. CloudFront chỉ ví dụ product-specific.','Đếm unique eventId và đường đọc không chặn là policy case; Kafka không chứng minh hai điều này.'],
'case-school-feed':['Fan-out write/read và số mục là thiết kế + phép nhân của fixture; nguồn Google SRE chỉ hỗ trợ đánh đổi tải nói chung.','Kafka không bảo đảm idempotence của feed/search; cần unique/upsert ở ứng dụng.','OWASP không định nghĩa chính sách feed cụ thể hoặc độ trễ thu hồi.'],
'case-fixture-crawler':['BFS nguồn gốc chỉ hỗ trợ traversal; distributed claim/unique là thiết kế thêm.','RFC 9309 không quy định quota theo host hay quyền nội dung riêng.','Kafka Design không xác nhận content hash/index version; cần nguồn indexing riêng nếu muốn claim có trích dẫn trực tiếp.'],
'case-club-ledger':['Tổng 70 là phép tính từ fixture; unique key là lựa chọn schema.','categoryOverride là policy sản phẩm tự đặt, PostgreSQL isolation không chứng minh ưu tiên thủ công.','Alert threshold/correction/retention là policy case; OWASP chỉ hỗ trợ quyền.'],
'case-social-path':[None,'DynamoDB partition-key design chỉ nói phân bố tải/partition, không chứng minh số request BFS qua shard. Đề xuất không gắn nguồn hoặc bổ sung paper về distributed graph traversal.','Snapshot/độ mới graph là hợp đồng case; OWASP chỉ hỗ trợ quyền.'],
'case-query-cache':['LRU trace là quy tắc fixture tự đặt; Azure không định nghĩa thứ tự LRU này.',None,'Karger hỗ trợ minimal remapping theo mô hình; 90% hot key và cold cache là giả định/suy luận case.'],
'case-book-ranking':['A2/B1 là phép đếm fixture, không benchmark Flink.','Kafka không bảo đảm sink upsert theo window/book/version; đó là thiết kế ứng dụng.','E3 hủy và tie-break là policy case.'],
'case-growth-roadmap':['SRE không chứng minh index là bottleneck trong case; cần query plan thật nếu kết luận hệ thực.','Các rủi ro cache/LB/shard ngoài phần PostgreSQL replica cần nguồn riêng nếu khẳng định cụ thể.','Gate/rollback là kế hoạch tự đặt; ADR hỗ trợ ghi quyết định, không chứng nhận triển khai.'],
}
for row in m['claims']:
 lid=row['lessonId']
 if lid not in mapping: continue
 field=row['field']
 if field.startswith('chapters.items[') or field.startswith('practice.items['):i=int(field.split('[')[1].split(']')[0])
 elif field=='prediction':i=0
 else:i=2
 selected=mapping[lid][i]
 row['sources']=[{'url':U[k],'edition':meta[k][0],'section':meta[k][1],'checkedAt':'2026-10-25','statusCheck':'version/status theo edition; xem report cho RFC','errataCheck':'chưa xác nhận erratum có tác động claim','support':meta[k][2]} for k in selected] or None
 row['sourceGap']=gap[lid][i] or (None if selected else 'Không có nguồn hiện tại hỗ trợ trực tiếp.')
 row['verdict']='verified-with-conditions' if row['independentExpected'] else 'insufficient-evidence'
 row['uncertainty']='Đã map nguồn theo hỗ trợ trực tiếp; phần fixture/policy tự đặt vẫn là inference. Chưa quan sát UI hoặc chạy hệ thống thật.'
m['caseSourceMapping']={k:[{'chapter':i+1,'sourceKeys':v,'gap':gap[k][i]} for i,v in enumerate(vals)] for k,vals in mapping.items()}
(p/'claim-matrix.json').write_text(json.dumps(m,ensure_ascii=False,indent=2))
print('updated',sum(r['lessonId'] in mapping for r in m['claims']))
