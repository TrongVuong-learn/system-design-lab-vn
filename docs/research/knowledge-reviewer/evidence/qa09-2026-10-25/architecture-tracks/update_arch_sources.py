import json,pathlib
p=pathlib.Path('/Users/vuongn/Documents/ChatGPT/System Design learning/docs/research/knowledge-reviewer/evidence/qa09-2026-10-25/architecture-tracks')
m=json.loads((p/'claim-matrix.json').read_text())
U={
'c4':('https://c4model.com/','Simon Brown C4 live','Introduction; abstractions; diagrams','Context/container là mức sơ đồ, không chứng minh tính đúng hệ thống.'),
'sre':('https://sre.google/sre-book/service-level-objectives/','Google SRE Book','Objectives; Indicators in Practice; Aggregation','SLI/SLO và cửa sổ, kinh nghiệm Google.'),
'outbox':('https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html','AWS Prescriptive Guidance live','Intent; Issues and considerations','Dual write và duplicate; không tạo exactly-once end-to-end.'),
'pgiso':('https://www.postgresql.org/docs/18/transaction-iso.html','PostgreSQL 18','§13.2','Isolation tùy mức; transaction/constraint phải thiết kế phù hợp.'),
'pgcons':('https://www.postgresql.org/docs/18/ddl-constraints.html','PostgreSQL 18','§5.5','Constraint cụ thể của PostgreSQL, không tự bảo đảm workflow qua nhiều hệ.'),
'retry':('https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/','AWS Builders Library live','Timeouts; Retries; Backoff and jitter','Retry/timeout là kinh nghiệm Amazon; chỉ áp theo budget và idempotence.'),
'overload':('https://sre.google/sre-book/handling-overload/','Google SRE Book','Handling Overload','Nút thắt, overload và chi phí request; không benchmark fixture.'),
'fowler':('https://martinfowler.com/articles/microservices.html','Lewis & Fowler 2014','Business capabilities; Decentralized data; Design for failure','Đặc trưng kiến trúc microservices, không luật bắt buộc.'),
'strangler':('https://martinfowler.com/bliki/StranglerFigApplication.html','Martin Fowler 2024 revision','Strangler Fig','Di chuyển dần chức năng; không chứng minh backfill concurrency.'),
'k8sdeploy':('https://kubernetes.io/docs/concepts/workloads/controllers/deployment/','Kubernetes live','Deployments','Desired/current state và rollout Kubernetes, không mọi orchestrator.'),
'k8stenant':('https://kubernetes.io/docs/concepts/security/multi-tenancy/','Kubernetes live','Multi-tenancy','Namespace/isolation theo cấu hình; không sandbox tuyệt đối.'),
'owasp':('https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html','OWASP live','Validate permissions on every request','Quyền request/tài nguyên; policy tenant cụ thể do app.'),
'adr':('https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions','Michael Nygard 2011','Context; Status; Consequences','Cấu trúc ADR; không chứng minh ma trận trọng số.'),
'dr':('https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html','AWS Well-Architected live','Plan for DR','RTO/RPO là mục tiêu, cần drill để xác minh.'),
'dynamo':('https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf','DeCandia et al., SOSP 2007','Abstract; §1','Thiết kế Dynamo 2007, không là DynamoDB hiện hành.'),
'rag':('https://arxiv.org/abs/2005.11401','Lewis et al., arXiv v4 2021','Abstract','RAG truy hồi + generation; không chứng minh ACL/RAG security.'),
'inject':('https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html','OWASP live','Anatomy; indirect injection; defenses','Tài liệu/tool output không tin cậy; guardrail không là bảo đảm tuyệt đối.'),
'paged':('https://arxiv.org/abs/2309.06180','Kwon et al., arXiv paper','Abstract; PagedAttention','KV-cache memory/serving; không benchmark model của case.'),
'flink':('https://nightlies.apache.org/flink/flink-docs-release-2.0/docs/concepts/time/','Apache Flink 2.0.1','Timely Stream Processing','Event/processing time và watermark thuộc Flink.'),
'kafka':('https://kafka.apache.org/41/design/design/','Apache Kafka 4.1','Design; delivery semantics','Kafka retry/order theo phạm vi; sink/idempotence riêng.'),
'lucene':('https://lucene.apache.org/core/10_3_1/core/org/apache/lucene/codecs/lucene103/package-summary.html','Lucene 10.3.1','Inverted Indexing','Term -> documents, không chứng minh autocomplete/privacy.'),
'hnsw':('https://arxiv.org/abs/1603.09320','Malkov & Yashunin arXiv v4 2018','Abstract','ANN HNSW; không bảo đảm nearest exact.'),
'reco':('https://developers.google.com/machine-learning/recommendation/overview/types','Google Developers live','Candidate generation; scoring; reranking','Pipeline recommendation; không chứng minh exposure bias cụ thể.'),
'postgis':('https://postgis.net/workshops/postgis-intro/indexing.html','PostGIS workshop live','§15 Spatial Indexing; §15.3 Index-Only Queries','Index thu hẹp candidates; exact spatial predicate cần recheck.'),
'ws':('https://www.rfc-editor.org/rfc/rfc6455.html','RFC 6455 Proposed Standard 2011','§1 Introduction','WebSocket 2 chiều; presence/read-receipt là app policy.'),
'crdt':('https://arxiv.org/abs/1805.06358','Preguiça et al., arXiv 2018','Abstract','CRDT convergence theo điều kiện; không chứng minh text editor cụ thể.'),
's3':('https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html','Amazon S3 live','Multipart upload process','Retry part và complete object riêng; không là publish media.'),
'hls':('https://www.rfc-editor.org/rfc/rfc8216.html','RFC 8216 Informational 2017','§2 Overview','HLS playlist/segment; bitrate calculation tự đặt.'),
'cache':('https://www.rfc-editor.org/rfc/rfc9111.html','RFC 9111 STD 98 2022','§4.2 Freshness','HTTP cache freshness, không cấp quyền.'),
'stripe':('https://docs.stripe.com/api/idempotent_requests','Stripe API live','Idempotent requests','Stripe-specific key semantics/retention; không mọi payment provider.'),
'saga':('https://learn.microsoft.com/en-us/azure/architecture/patterns/saga','Microsoft Azure Architecture Center live','Saga pattern','Compensation là thao tác mới có thể lỗi; không transaction toàn hệ.'),
}
map13={
'end-to-end-design':[['sre'],['c4','pgiso','outbox'],['retry','outbox'],['sre','overload']],
'architecture-boundaries':[['fowler'],['fowler'],['outbox','fowler'],['fowler','overload']],
'migration-evolution':[['strangler','k8sdeploy'],['pgiso'],['outbox'],['k8sdeploy']],
'platform-tenants':[['k8stenant'],['k8stenant','owasp'],['overload','k8stenant'],['k8stenant','k8sdeploy']],
'architecture-decisions':[['adr'],['adr'],['dr'],['adr','dr']],
'architecture-review':[['dynamo'],['pgiso','pgcons'],['sre'],['adr','pgcons']],
'track-ai':[['rag'],['rag','owasp'],['paged','overload'],['inject','owasp']],
'track-data':[['kafka'],['flink'],['kafka','flink'],['flink']],
'track-search':[['lucene'],['hnsw'],['reco'],['postgis']],
'track-realtime':[['ws'],['kafka','retry'],['kafka','owasp'],['crdt']],
'track-media':[['s3'],['kafka'],['hls'],['cache','owasp']],
'track-platform':[['k8sdeploy'],['k8stenant'],['cache','overload'],['k8stenant','owasp']],
'track-business':[['pgiso','pgcons'],['stripe'],['pgiso','pgcons'],['saga','stripe']],
}
gaps={
'architecture-decisions':{1:'ADR không chứng minh phép chấm điểm có trọng số; đây là phương pháp quyết định tự đề xuất.'},
'track-ai':{0:'Nguồn RAG không chứng minh model registry/data pipeline; cần nguồn MLOps riêng.',1:'RAG paper không cung cấp ACL; OWASP hỗ trợ quyền ở mức ứng dụng.',2:'PagedAttention nói KV cache, không chứng minh streaming làm tổng latency giảm.'},
'track-data':{0:'Kafka Design không giải thích ETL/ELT, OLTP/OLAP, CDC toàn diện; cần nguồn riêng.',2:'Exactly-once effect tại external sink không suy từ Kafka/Flink alone.',3:'Data quality/lineage cần nguồn riêng; Flink chỉ xử lý time.'},
'track-search':{0:'Lucene file format không chứng minh autocomplete privacy; cần nguồn riêng.',2:'Google recommendation overview không chứng minh exposure bias; cần paper/experiment riêng.',3:'PostGIS hỗ trợ spatial candidate + exact recheck, không riêng geohash.'},
'track-realtime':{0:'RFC6455 không định nghĩa presence/read receipt; do app policy.',2:'Kafka không chứng minh snapshot gap sync; app contract.',3:'CRDT paper không chứng minh OT/text editor cursor/undo cụ thể.'},
'track-media':{1:'Kafka không chứng minh transcoding rendition/manifest consistency; cần nguồn media pipeline.',2:'RFC8216 không chứng minh bitrate 4/2 Mb/s fixture; số tính độc lập.'},
'track-platform':{0:'K8s Deployments là controller cụ thể, không chứng minh mọi platform reconcile.',2:'RFC9111/Google SRE không chứng minh service mesh semantics/IaC; cần nguồn riêng.'},
'track-business':{2:'Ledger double-entry balance là mô hình case tự định nghĩa; PG chỉ cung cấp transaction/constraint.',3:'Saga pattern không thay contract provider về refund; cần policy cụ thể.'},
}
for row in m['claims']:
 lid=row['lessonId']
 if lid not in map13:continue
 field=row['field']
 if field.startswith('chapters.items[') or field.startswith('practice.items['):i=int(field.split('[')[1].split(']')[0])
 elif field=='prediction':i=0
 else:i=len(map13[lid])-1
 selected=map13[lid][i]
 row['sources']=[{'url':U[k][0],'edition':U[k][1],'section':U[k][2],'checkedAt':'2026-10-25','statusCheck':'edition/version as listed; RFC status in report','errataCheck':'chưa xác nhận erratum tác động claim','support':U[k][3]} for k in selected]
 row['sourceGap']=gaps.get(lid,{}).get(i)
 row['uncertainty']='Nguồn đã mở và map theo chương; không đồng nghĩa nguồn hỗ trợ mọi câu trong chương. Phần policy/fixture là authored inference; chưa browser/real service.'
 row['verdict']='verified-with-conditions' if row['independentExpected'] else 'insufficient-evidence'
m['architectureSpecialistSourceMapping']={k:[{'chapter':i+1,'sourceKeys':v,'gap':gaps.get(k,{}).get(i)} for i,v in enumerate(vals)] for k,vals in map13.items()}
(p/'claim-matrix.json').write_text(json.dumps(m,ensure_ascii=False,indent=2))
print('updated',sum(r['lessonId'] in map13 for r in m['claims']))
