import json, pathlib
root=pathlib.Path('/Users/vuongn/Documents/ChatGPT/System Design learning')
out=root/'docs/research/knowledge-reviewer/evidence/qa09-2026-10-25/architecture-tracks'
files=['architecture-design','specialist-tracks','integrated-cases']
opened={
 'https://www.postgresql.org/docs/18/ddl-constraints.html':('PostgreSQL 18','5.5 Constraints','product-specific; current supported 18; errata not applicable'),
 'https://www.postgresql.org/docs/18/transaction-iso.html':('PostgreSQL 18','13.2 Transaction Isolation','product-specific; current supported 18; errata not applicable'),
 'https://www.postgresql.org/docs/18/warm-standby.html':('PostgreSQL 18','26.2 Log-Shipping Standby Servers','product-specific; current supported 18; errata not applicable'),
 'https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html':('AWS Prescriptive Guidance live','Intent; Issues and considerations','live; revision unknown; errata not applicable'),
 'https://www.rfc-editor.org/rfc/rfc9111.html':('RFC 9111 June 2022 STD 98','4.2 Freshness','published; obsoletes RFC 7234; errata not checked'),
 'https://www.rfc-editor.org/rfc/rfc9309.html':('RFC 9309 September 2022 Proposed Standard','2 Specification; 3 Security Considerations','published; status checked; errata not checked'),
 'https://www.rfc-editor.org/rfc/rfc8216.html':('RFC 8216 August 2017 Informational','2 Overview','published informational; status checked; errata not checked'),
 'https://www.rfc-editor.org/rfc/rfc6455.html':('RFC 6455 December 2011 Proposed Standard','1 Introduction','published; updated by 7936,8307,8441; errata not checked'),
 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html':('OWASP live','Validate Permissions on Every Request','live; revision unknown; errata not applicable'),
 'https://kafka.apache.org/41/design/design/':('Apache Kafka 4.1','Design','versioned; errata not applicable'),
 'https://nightlies.apache.org/flink/flink-docs-release-2.0/docs/concepts/time/':('Apache Flink 2.0.1','Timely Stream Processing','versioned 2.0.1; errata not applicable'),
 'https://docs.stripe.com/api/idempotent_requests':('Stripe API live','Idempotent requests','live; revision unknown; errata not applicable'),
}
expect={
 'end-to-end-design':('4000/600=6.6667 lượt/s; đây là trung bình giả định, không là peak', 'chapters.items[0].example'),
 'track-media':('1000*10*60*2e6/8=150e9 B=150 GB thập phân', 'chapters.items[3].example'),
 'case-short-links':('11:59 + 10 phút = 12:09 > expiresAt 12:00; distinct(E1,E2,E1)=2', 'chapters.items[1:3].example'),
 'case-school-feed':('1*10000=10000; 100*20=2000; 100*10000=1000000 mục', 'chapters.items[0].example'),
 'case-fixture-crawler':('BFS FIFO: A, enqueue B,C; B không thêm C; C thêm D; D kết thúc => A,B,C,D', 'chapters.items[0].example'),
 'case-club-ledger':('T1 100 + T2 -30 =70; replay T1 cùng ID không cộng; correction T2 -60 tạo delta -30', 'chapters.items[0:3].example'),
 'case-social-path':('BFS lớp 0 A, lớp1 B,C, lớp2 D,E, lớp3 F; đường 3 cạnh, có 2 đường bằng nhau', 'chapters.items[0].example'),
 'case-query-cache':('LRU 2: A miss, B miss, A hit, C miss đẩy B, B miss đẩy A => 1/5=20%', 'chapters.items[0].example'),
 'case-book-ranking':('unique E1:A,E2:B,E3:A => A2,B1; hủy E3 => A1', 'chapters.items[0:3].example'),
 'track-business':('A -10 + B +10 =0 trong sổ khép kín không phí', 'chapters.items[2].example'),
 'track-data':('event 09:55 thuộc cửa sổ [09:00,10:00) dù nhận 11:00', 'chapters.items[1].example'),
}
rows=[];inventory=[]
for file in files:
 for l in json.loads((root/f'content/lessons/vi/{file}.json').read_text()):
  path=str(root/f'content/lessons/vi/{file}.json')
  inventory.append({'lessonId':l['id'],'version':l['version'],'moduleId':l['moduleId'],'title':l['title'],'file':path,'chapters':len(l['chapters']['items']),'practice':len(l['practice']['items']),'terms':len(l['terms']),'sources':len(l['sources']),'prerequisite':None,'prerequisiteReason':'Không có field prerequisite trong lesson; quan hệ curriculum/pathway chưa audit trong run này.'})
  for kind,items in [('chapter',l['chapters']['items']),('practice',l['practice']['items'])]:
   for i,item in enumerate(items):
    field=f'{"chapters" if kind=="chapter" else "practice"}.items[{i}]'
    claim=item.get('explanation') if kind=='chapter' else item.get('text')+' — đáp án: '+item['options'][item['answer']]
    sources=[]
    for s in l['sources']:
     if s['url'] in opened:
      e,section,status=opened[s['url']]
      sources.append({'url':s['url'],'edition':e,'section':section,'checkedAt':'2026-10-25','statusCheck':status,'errataCheck':'chưa kiểm chi tiết; không có khác biệt đã xác nhận ảnh hưởng claim','support':'Nguồn liên quan chủ đề; mức hỗ trợ trực tiếp phải đọc theo từng claim, không quy tất cả sourceIds là bằng chứng.'})
    independent=expect.get(l['id']) if i==0 and kind=='chapter' else None
    verdict='verified-with-conditions' if independent else 'insufficient-evidence'
    rows.append({'claimId':f'{l["id"]}-{kind}-{i+1}','lessonId':l['id'],'version':l['version'],'path':path,'field':field,'claim':claim,'scope':'source-read + calculation' if independent else 'source-read/inferred; chưa chạy mô phỏng','assumptions':l['limit'],'sources':sources or None,'sourceGap':None if sources else 'Nguồn của bài chưa mở đoạn trực tiếp trong run này.','independentExpected':independent[0] if independent else None,'trace':{'mode':'calculated' if independent else 'source-read','input':l['story'] if independent else None,'actions':'Tính tay từ fixture được mô tả' if independent else None,'actual':item.get('example') if independent else None,'artifact':None,'command':None},'assessmentEvidence':{'mode':'source-read','answerIndex':item['answer'],'options':item['options']} if kind=='practice' else None,'uiEvidence':{'viewport':None,'artifact':None,'mode':'not-observed'},'verdict':verdict,'conditions':l['limit'],'uncertainty':'Chưa thực thi service/cloud hoặc quan sát UI; nguồn mở chưa xác nhận riêng mọi mệnh đề trong claim.' if not independent else 'Expected tính độc lập; không phải benchmark/service trace.','impact':None,'retest':None})
  for kind in ['prediction','challenge']:
   q=l[kind]; rows.append({'claimId':f'{l["id"]}-{kind}','lessonId':l['id'],'version':l['version'],'path':path,'field':kind,'claim':q['text']+' — đáp án: '+q['options'][q['answer']],'scope':'assessment source-read','assumptions':l['limit'],'sources':None,'sourceGap':'Đối chiếu logic nội bộ với chapters/practice; chưa gắn đoạn nguồn sơ cấp riêng.','independentExpected':None,'trace':{'mode':'inferred','input':q['text'],'actions':None,'actual':q['options'][q['answer']],'artifact':None,'command':None},'assessmentEvidence':{'mode':'source-read','answerIndex':q['answer'],'options':q['options'],'feedback':q['explanation']},'uiEvidence':{'viewport':None,'artifact':None,'mode':'not-observed'},'verdict':'insufficient-evidence','conditions':l['limit'],'uncertainty':'Chưa chạy UI/chấm điểm và chưa đối chứng trực tiếp mọi lựa chọn với nguồn.','impact':None,'retest':None})
(out/'claim-matrix.json').write_text(json.dumps({'commit':'68f7de6cd2d1659c0b9840c067e5e519539c1194','model':'gpt-6-sol','reasoning':'low','checkedAt':'2026-10-25','inventory':inventory,'claims':rows},ensure_ascii=False,indent=2))
print(len(inventory),len(rows))
