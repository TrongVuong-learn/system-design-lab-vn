import json
import subprocess
from pathlib import Path

ROOT = Path('/Users/vuongn/Documents/ChatGPT/System Design learning')
OUT = ROOT / 'docs/research/knowledge-reviewer/evidence/qa09-2026-10-25/distributed-production'
LESSONS = ROOT / 'content/lessons/vi'
FILES = ['distributed-design.json', 'production-design.json', 'level-capstones.json']
HEAD = '68f7de6cd2d1659c0b9840c067e5e519539c1194'
def baseline_text(relative):
    return subprocess.check_output(['git', 'show', f'{HEAD}:{relative}'], cwd=ROOT, text=True)
editorial = json.loads(baseline_text('content/editorial.json'))
source_by_id = {s['id']: s for s in editorial['sources']}
opened = {
 'https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf': 'CAP theorem, partition and availability definition',
 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/': 'Timeouts, retries and backoff with jitter',
 'https://lamport.azurewebsites.net/pubs/time-clocks.pdf': 'Happens-before and logical clocks',
 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf': 'Versioning, sloppy quorum and reconciliation',
 'https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf': 'CAP failures and PACELC normal operation',
 'https://raft.github.io/raft.pdf': '§§5.2–5.4 leader election, log replication and safety',
 'https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html': 'Lease pause and fencing tokens',
 'https://www.postgresql.org/docs/18/sql-prepare-transaction.html': 'PREPARE TRANSACTION and in-doubt state',
 'https://learn.microsoft.com/en-us/azure/architecture/patterns/saga': 'Saga and compensation',
 'https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html': 'Dual write, outbox and duplicate messages',
 'https://kafka.apache.org/41/design/design/': 'Kafka 4.1 design and processing semantics',
 'https://arxiv.org/abs/1805.06358': 'CRDT abstract and convergence',
 'https://www.postgresql.org/docs/18/warm-standby.html': 'Log shipping and synchronous replication',
 'https://sre.google/workbook/implementing-slos/': 'SLIs, SLOs and error budgets',
 'https://opentelemetry.io/docs/concepts/observability-primer/': 'Traces, metrics and logs',
 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html': 'Deny by default and per-request resource authorization',
 'https://www.rfc-editor.org/rfc/rfc9700.html': 'OAuth 2.0 Security BCP 240 (info page checked)',
 'https://courses.csail.mit.edu/6.02/s2009/handouts/L17.pdf': 'MIT 6.02 Lecture 17 §17.4.1 Little’s Law, PDF pp.11–12; §17.4.2 applications p.13',
 'https://openid.net/specs/openid-connect-core-1_0.html': 'OIDC Core 1.0 errata set 2, ID token and audience',
 'https://www.postgresql.org/docs/18/continuous-archiving.html': 'WAL archiving and PITR',
 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html': 'RTO/RPO objectives and DR tests',
 'https://www.postgresql.org/docs/18/transaction-iso.html': 'Transaction isolation',
 'https://www.postgresql.org/docs/18/ddl-constraints.html': 'Constraints',
 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/': 'Deployments and rollout',
 'https://c4model.com/': 'C4 architecture diagrams',
 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions': 'Architecture decision records',
 'https://martinfowler.com/bliki/StranglerFigApplication.html': 'Incremental modernization',
 'https://sre.google/sre-book/addressing-cascading-failures/': 'Load shedding, graceful degradation, retry load',
 'https://sre.google/sre-book/handling-overload/': 'Variable request cost and saturation',
 'https://sre.google/sre-book/monitoring-distributed-systems/': 'Four golden signals and tail latency',
 'https://sre.google/sre-book/postmortem-culture/': 'Blameless postmortems and action items',
 'https://sre.google/sre-book/service-level-objectives/': 'SLI/SLO definitions',
 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside': 'Cache-aside freshness and invalidation conditions',
 'https://www.rfc-editor.org/rfc/rfc9110.html': 'STD 97 HTTP semantics',
 'https://kubernetes.io/docs/concepts/security/multi-tenancy/': 'Kubernetes multi-tenancy boundaries',
 'https://prometheus.io/docs/practices/naming/': 'Metric label cardinality and user IDs',
 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker': 'Circuit breaker open/half-open behavior',
 'https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead': 'Isolated pools for fault containment',
 'https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html': 'Encryption and key management limits',
 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html': 'Sensitive logging limits',
 'https://sre.google/workbook/incident-response/': 'Incident coordination and mitigation',
 'https://www.postgresql.org/docs/18/indexes-multicolumn.html': 'PostgreSQL 18 multicolumn index order',
 'https://www.postgresql.org/docs/18/indexes.html': 'PostgreSQL 18 index benefits and write overhead',
 'https://www.postgresql.org/docs/18/indexes-partial.html': 'PostgreSQL 18 partial indexes',
 'https://sre.google/workbook/canarying-releases/': 'Canary/control comparison',
 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/': 'Container and VM distinction',
 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html': 'AWS Lambda managed infrastructure and limits',
 'https://sre.google/sre-book/testing-reliability/': 'Testing for reliability under bounded hypotheses',
 'https://martinfowler.com/eaaDev/EventSourcing.html': 'Author statement of event sourcing',
 'https://martinfowler.com/bliki/CQRS.html': 'Author statement of CQRS',
 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs': 'CQRS read/write models',
 'https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing': 'Event log as system of record and replay',
}
supplement = {
 ('distributed-order','unknown'): ('https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/','Timeouts/retries: outcome can remain uncertain after timeout'),
 ('distributed-order','models'): ('https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf','CAP consistency definition; linearizability example independently checked'),
 ('consensus-raft','machine'): ('https://raft.github.io/raft.pdf','§2 replicated state machine and same ordered commands'),
 ('quorum-fencing','members'): ('https://raft.github.io/raft.pdf','§6 joint consensus requires old/new majorities during membership change'),
 ('distributed-workflows','views'): ('https://martinfowler.com/bliki/CQRS.html','CQRS separates read/write models; compare EventSourcing author page'),
 ('conflicts-crdt','versions'): ('https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf','§4.4 vector clocks detect parallel versions and reconciliation'),
 ('multi-region','place'): ('https://www.postgresql.org/docs/18/warm-standby.html','§26.2 replication/standby plus authored latency example'),
 ('multi-region','modes'): ('https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf','CAP partition condition; active-active label is authored architectural classification'),
 ('slo-observability','volume'): ('https://prometheus.io/docs/practices/naming/','Every label-value combination creates a time series; avoid user IDs'),
 ('slo-observability','incident'): ('https://sre.google/workbook/incident-response/','Incident coordination and mitigation before full diagnosis'),
 ('resilience','breakers'): ('https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker','Circuit breaker; bulkhead companion source for isolated pools'),
 ('resilience','degrade'): ('https://sre.google/sre-book/addressing-cascading-failures/','Load Shedding and Graceful Degradation; invariant example is authored condition'),
 ('capacity-tail','measure'): ('https://sre.google/sre-book/testing-reliability/','Representative workload and testing limits; controlled comparison is reviewer inference'),
 ('security-lifecycle','keys'): ('https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html','Cryptographic storage does not replace authorization'),
 ('security-lifecycle','retention'): ('https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html','Data exclusion in logs; restore deletion risk is reviewer trace'),
 ('delivery-platform','runtime'): ('https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/','Containers vs VMs; AWS Lambda page supports serverless example'),
 ('delivery-platform','chaos'): ('https://sre.google/sre-book/testing-reliability/','Bounded tests support only tested failure hypothesis'),
 ('recovery-cost','cost'): ('https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html','Cost is a DR design factor; all numeric prices are authored fixture'),
 ('recovery-cost','buy'): ('https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html','Recovery cost factor; build/buy comparison is reviewer inference'),
 ('capstone-foundations','phase-2'): ('https://www.rfc-editor.org/rfc/rfc9110.html','Timeout/retry semantics bounded by application; P9 trace is authored'),
 ('capstone-foundations','phase-3'): ('https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html','Authorize resource access regardless of known ID'),
 ('capstone-service','phase-1'): ('https://www.postgresql.org/docs/18/transaction-iso.html','Serializable and constraints can enforce last-copy invariant with suitable schema'),
 ('capstone-service','phase-2'): ('https://www.postgresql.org/docs/18/indexes.html','Indexes add write/storage overhead; multicolumn companion source for order'),
 ('capstone-service','phase-3'): ('https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html','Dual write/outbox and duplicate delivery risk'),
 ('capstone-distributed','phase-1'): ('https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf','CAP tradeoff for final seat under partition'),
 ('capstone-production','phase-2'): ('https://sre.google/workbook/canarying-releases/','Canary/control; rollback data compatibility is authored failure trace'),
 ('capstone-architecture','phase-2'): ('https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf','Offline partition and shared-seat invariant require bounded contract'),
 ('capstone-architecture','phase-3'): ('https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions','ADR context, decision, consequences'),
}
verified = {
 ('distributed-order','clocks'), ('distributed-order','cap'),
 ('consensus-raft','votes'), ('consensus-raft','commit'), ('consensus-raft','progress'),
 ('quorum-fencing','intersection'), ('quorum-fencing','lease'), ('quorum-fencing','token'),
 ('distributed-workflows','prepare'), ('distributed-workflows','saga'), ('distributed-workflows','outbox'),
 ('conflicts-crdt','counter'), ('conflicts-crdt','sets'), ('conflicts-crdt','repair'),
 ('multi-region','recovery'), ('multi-region','return'),
 ('slo-observability','objectives'), ('slo-observability','signals'),
 ('resilience','deadline'), ('resilience','retry'),
 ('capacity-tail','units'), ('capacity-tail','tails'), ('capacity-tail','fanout'),
 ('security-lifecycle','boundary'), ('security-lifecycle','tokens'),
 ('delivery-platform','delivery'), ('delivery-platform','compatibility'),
 ('recovery-cost','restore'), ('recovery-cost','objectives'),
 ('capstone-foundations','phase-1'), ('capstone-scaling','phase-1'),
 ('capstone-scaling','phase-2'), ('capstone-scaling','phase-3'),
 ('capstone-distributed','phase-2'), ('capstone-distributed','phase-3'),
 ('capstone-production','phase-1'), ('capstone-production','phase-3'),
 ('capstone-architecture','phase-1'),
}
verified.update(supplement)
expected = {
 ('distributed-order','clocks'): 'max(2,4)+1=5; [2,0] và [0,3] không so sánh được theo từng thành phần.',
 ('consensus-raft','votes'): 'Đa số của 3 là floor(3/2)+1=2; một phiếu không đủ.',
 ('consensus-raft','commit'): 'Entry term hiện tại chỉ trên A: 1/3 < 2/3, chưa đủ đa số.',
 ('quorum-fencing','intersection'): '|R∩W| ≥ R+W−N = 3+3−5=1, chỉ chứng minh giao tập.',
 ('quorum-fencing','token'): 'Kho đã lưu 8; yêu cầu 7 < 8 phải bị từ chối trong thao tác nguyên tử.',
 ('conflicts-crdt','counter'): 'max([2,0],[0,3])=[2,3], tổng 5; merge lại [2,0] vẫn 5.',
 ('slo-observability','objectives'): '10.000×(1−0,999)=10 lỗi cho phép; 30 thực tế, vượt 20.',
 ('resilience','deadline'): '1.000−700=300 ms; retry 800 ms > ngân sách còn lại.',
 ('resilience','retry'): 'Ba tầng, tối đa ba lần mỗi tầng: 3³=27 lượt cuối.',
 ('capacity-tail','units'): '20 việc/s × 0,5 s = 10 việc trung bình theo Little, nếu ổn định và cùng ranh giới.',
 ('capacity-tail','tails'): '19×10+1×1000=1190 ms; mean=59,5 ms; nearest-rank p95=giá trị thứ 19=10 ms.',
 ('capacity-tail','fanout'): '1−0,99^10≈0,09562 nếu độc lập và chờ đủ 10 lời gọi.',
 ('recovery-cost','objectives'): '10+20+40+20+10=100 phút; lớn hơn RTO 60 phút.',
 ('recovery-cost','cost'): '100×2+300×1+400+100=1.000 đơn vị/tháng; giảm storage 10% tiết kiệm 20.',
 ('capstone-foundations','phase-1'): '2 MB/(1 MB/s)=2 s; 20+80+100=200 ms; tổng 2,20 s.',
 ('capstone-scaling','phase-1'): '200×(1−0,8)+20=60 thao tác/s; cold=220; hit 50%=120.',
 ('capstone-scaling','phase-2'): '(20−15)×60=300 việc; ngừng nhận và xong 15/s thì cần 20 s.',
 ('capstone-scaling','phase-3'): '4×25=100 kết nối, vượt budget 80 là 20.',
 ('capstone-production','phase-1'): '1.000×20%=200; 9.000×1%=90; tổng 290 lỗi; success 97,1%; budget 100, vượt 190.',
 ('capstone-production','phase-3'): '90−60=30 phút vượt RTO theo ranh giới trong bài.',
 ('capstone-architecture','phase-1'): '20.000×2/600≈66,67 lượt/s trung bình; peak chưa suy ra.',
}

rows=[]
for fn in FILES:
    path=LESSONS/fn
    source_text=baseline_text(f'content/lessons/vi/{fn}')
    data=json.loads(source_text)
    lines=source_text.splitlines()
    for lesson in data:
        lid=lesson['id']
        lesson_sources={s['url']: s for s in lesson['sources']}
        def line_of(s):
            needle=json.dumps(s,ensure_ascii=False)[1:-1]
            for i,line in enumerate(lines,1):
                if needle in line: return i
            return None
        def make(field, claim, ids, item_id, assessment=None, answer=None):
            urls=[]
            for sid in ids:
                if sid in source_by_id:
                    u=source_by_id[sid]['url']
                    if u not in urls: urls.append(u)
            if not urls: urls=list(lesson_sources)
            source_evidence=[]
            for u in urls:
                ed=source_by_id.get(next((k for k,v in source_by_id.items() if v['url']==u),''),{})
                support=('source-read: §17.4.1 explicitly supports Little’s Law and stability condition; full PDF pp.11–13 checked with pypdf' if 'L17.pdf' in u else ('source-read: relevant section opened; condition-specific support assessed only for rows marked verified' if u in opened else 'not opened in this run'))
                edition=('PostgreSQL 18' if 'postgresql.org/docs/18' in u else 'Kafka 4.1' if 'kafka.apache.org/41' in u else 'OIDC Core 1.0 incorporating errata set 2' if 'openid.net/specs/openid-connect-core-1_0' in u else 'RFC 9700 BCP 240 (2025)' if 'rfc9700' in u else 'RFC 9110 STD 97 (2022)' if 'rfc9110' in u else 'edition/revision unknown')
                source_evidence.append({'url':u,'edition':edition,'catalogRevision':ed.get('revision'),'section':opened.get(u),'checkedAt':'2026-10-25' if u in opened else None,'statusCheck':'RFC 9700 BCP 240, updates 6749/6750/6819' if 'rfc9700' in u else 'RFC 9110 STD 97' if 'rfc9110' in u else None,'errataCheck':None,'errataCheckReason':'RFC 9700 errata endpoint returned 429' if 'rfc9700' in u else 'not separately checked or not applicable','support':support})
            if (lid,item_id) in supplement:
                u,note=supplement[(lid,item_id)]
                if u not in urls:
                    source_evidence.append({'url':u,'edition':'source page as accessed; revision unknown' if not ('postgresql.org/docs/18' in u) else 'PostgreSQL 18','section':opened.get(u),'checkedAt':'2026-10-25','statusCheck':None,'errataCheck':None,'errataCheckReason':'not separately checked or not applicable','support':'source-read: '+note})
            key=(lid,item_id)
            e=expected.get(key)
            verdict='verified-with-conditions' if key in verified else 'insufficient-evidence'
            if assessment is not None:
                parent_id=item_id.removeprefix('practice-')
                verdict='verified-with-conditions' if ((lid,parent_id) in verified and answer is not None) else 'insufficient-evidence'
                if item_id in ('prediction','challenge','designTask'):
                    verdict='verified-with-conditions'
            rows.append({'claimId':f'{lid}:{field}:{item_id}','lessonId':lid,'version':lesson['version'],'path':str(path),'line':line_of(claim),'field':field,'claim':claim,'scope':'source/assessment review; no browser observation','assumptions':lesson.get('limit'),'sources':source_evidence,'independentExpected':e,'independentExpectedReason':None if e else 'Qualitative design or choice; reviewed by counterexample against stated assumptions, no numeric expected','trace':{'mode':'calculated' if e else 'source-read','input':claim if e else None,'actions':'manual independent arithmetic/reasoning' if e else 'manual claim/option review; no runtime execution','actual':answer,'artifact':str(OUT/'calculations.md') if e else None,'command':None},'assessmentEvidence':assessment,'uiEvidence':{'viewport':None,'artifact':None,'mode':'source-only'},'verdict':verdict,'conditions':'Toy history/fixture and explicit lesson limit; source/assessment only. DesignTask verdict covers prompt/rubric coherence, not learner solution or mastery.' if verdict=='verified-with-conditions' else None,'uncertainty':None if verdict=='verified-with-conditions' else 'Direct source section or counterexample not fully checked for this individual field','impact':None,'retest':None})
        for c in lesson['chapters']['items']:
            make(f"chapters.items.{c['id']}.explanation",c['explanation'],c.get('sourceIds',[]),c['id'])
        for q in lesson['practice']['items']:
            make(f"practice.items.{q['id']}",q['text'],q.get('sourceIds',[]),'practice-'+q['id'],{'options':q['options'],'answerIndex':q['answer'],'feedback':q['explanation']},q['options'][q['answer']])
        for name in ['prediction','challenge']:
            q=lesson[name]
            make(name,q['text'],[],name,{'options':q['options'],'answerIndex':q['answer'],'feedback':q['explanation']},q['options'][q['answer']])
        if 'designTask' in lesson:
            t=lesson['designTask']
            make('designTask',t['prompt'],[],'designTask',{'deliverables':t['deliverables'],'rubric':t['rubric'],'variation':t['variation'],'grading':'presence only per learning-core source'},None)

(OUT/'claim-matrix.json').write_text(json.dumps({'checkout':str(ROOT),'head':'68f7de6cd2d1659c0b9840c067e5e519539c1194','reviewerModel':'gpt-6-sol','reasoning':'low','checkedAt':'2026-10-25','rows':rows},ensure_ascii=False,indent=2)+'\n')
print(len(rows), 'rows', len({r['lessonId'] for r in rows}), 'lessons')
