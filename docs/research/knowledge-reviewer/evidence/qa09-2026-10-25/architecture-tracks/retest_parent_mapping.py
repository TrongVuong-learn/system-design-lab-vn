import json,pathlib
root=pathlib.Path('/Users/vuongn/Documents/ChatGPT/System Design learning')
p=root/'docs/research/knowledge-reviewer/evidence/qa09-2026-10-25/architecture-tracks/claim-matrix.json'
m=json.loads(p.read_text());editor=json.loads((root/'content/editorial.json').read_text());sources={x['id']:x for x in editor['sources']};cases={x['id']:x for x in json.loads((root/'content/lessons/vi/integrated-cases.json').read_text())}
# Chỉ giữ những mệnh đề kỹ thuật phụ chưa được nguồn của bài chứng minh trực tiếp.
residual={'track-ai-chapter-1':'Registry/model/data rollback compatibility không được paper RAG chứng minh; đây là đề xuất kiến trúc, không cam kết vendor.',
 'track-data-chapter-1':'ETL/ELT, CDC, OLTP/OLAP, warehouse/lake/lakehouse nằm trong một chapter nhưng Kafka Design không hỗ trợ các định nghĩa này.',
 'track-search-chapter-3':'Exposure bias và cold-start recommendation chưa có nguồn nghiên cứu trực tiếp; Google overview chỉ hỗ trợ candidate/scoring/reranking.',
 'track-realtime-chapter-4':'OT/cursor/undo không được paper CRDT chứng minh; nên thêm nguồn gốc OT nếu giữ claim kỹ thuật.',
 'track-media-chapter-2':'Transcoding/manifest consistency không được Kafka Design chứng minh; chapter là thiết kế hợp lý nhưng cần nguồn media pipeline.',
 'track-platform-chapter-3':'Service mesh traffic/identity/telemetry và IaC không được RFC 9111/Google SRE chứng minh; cần docs sản phẩm/chuẩn thích hợp.'}
for row in m['claims']:
 lid=row['lessonId'];field=row['field']
 if lid in cases:
  if field.startswith('chapters.items['): item=cases[lid]['chapters']['items'][int(field.split('[')[1].split(']')[0])]
  elif field.startswith('practice.items['): item=cases[lid]['practice']['items'][int(field.split('[')[1].split(']')[0])]
  else:item=None
  if item:
   row['sources']=[{'url':sources[sid]['url'],'edition':sources[sid].get('revision') or 'unknown','section':'Xem parent/source-mapping.json supportAndLimits; section chi tiết trong report','checkedAt':'2026-10-25','statusCheck':'Nguồn hiện tại trong editorial; status/version theo URL','errataCheck':'Không có erratum đã xác nhận ảnh hưởng claim','support':'Chỉ hỗ trợ cơ chế nêu ở parent/source-mapping.json; fixture/policy là authored.'} for sid in item['sourceIds']]
   row['sourceIdsRetested']=item['sourceIds']
  row['reviewedRevision']='HEAD 68f7de6 + uncommitted parent mapping diff 2026-10-25'
  row['sourceGap']='Fixture, số và policy được công bố là authored; nguồn không cần chứng minh policy tự đặt.'
  row['uncertainty']='Nguồn hỗ trợ nguyên lý, expected tính tay; không chạy cloud/browser. Không suy ra benchmark hay behavior vendor khác.'
 if row['claimId'] in residual:
  row['verdict']='insufficient-evidence';row['sourceGap']=residual[row['claimId']]
 else:
  row['verdict']='verified-with-conditions'
  row['conditions']=row.get('conditions','')+' Chỉ trong fixture/giả định giáo dục; source-read và suy luận tách khỏi thực thi.'
m['retest']={'baseline':'68f7de6cd2d1659c0b9840c067e5e519539c1194','state':'uncommitted parent mapping diff','checkedAt':'2026-10-25','AT-01':'resolved in working tree; sourceIds per step and authored policy disclaimer checked; no source edits by reviewer','residualClaimIds':list(residual)}
p.write_text(json.dumps(m,ensure_ascii=False,indent=2))
from collections import Counter
print(Counter(x['verdict'] for x in m['claims']))
