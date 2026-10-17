import json
from pathlib import Path

root = Path('/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning')
artifact = Path('/private/tmp/sdl-audit-2026-10-17-os')
sources = {
 'os-intro': ('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf','OSTEP 1.10','ch26 §§26.1,26.3-26.4'),
 'os-lock': ('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf','OSTEP 1.10','ch28 §§28.1-28.2'),
 'os-cpu': ('https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf','OSTEP 1.10','ch4 §4.4'),
 'cmu-search': ('https://www.cs.cmu.edu/~15122-archive/s26/handouts/lectures/06-binsearch.pdf','CMU 15-122 Spring 2026','lecture 6, pp1-2'),
 'mit-hash': ('https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/d3e4d64266d481c74c9e7c15e09999fe_MIT6_006F11_lec08.pdf','MIT 6.006 Fall 2011','lecture 8, pp3-4'),
}
claims = [
 ('C-1','concurrency','explanation/prediction','Hai lượt đọc 30 rồi ghi +1 cho kết quả 31',['os-intro'],'ABAB → 31; AABB → 32','concurrency:false:abab','prediction 0; explanation và caseStudy khớp'),
 ('C-2','concurrency','explanation/challenge','Cùng khóa bao đọc–tăng–ghi, cả hai hoàn tất cho 32',['os-lock'],'khóa: A đọc30/ghi31; B đọc31/ghi32','concurrency:true:abab','challenge 0; limit ghi rõ cùng khóa, mọi đường sửa'),
 ('IO-1','cpu-io','explanation/prediction','Thread chờ I/O không giữ CPU; worker khác có thể chạy',['os-intro','os-cpu'],'1 worker 10ms; 2 worker 6ms theo timeline 1+3+1 mỗi việc','cpu:io:2','prediction 0; UI source phân biệt CPU/worker/I/O'),
 ('IO-2','cpu-io','challenge','Hai việc 4ms CPU trên một lõi cần ít nhất 8ms dù thêm worker',['os-cpu'],'4+4=8ms CPU, không overhead','cpu:cpu:2','challenge 0; limit giả định không preempt/overhead'),
 ('S-1','library-search','explanation/prediction','Tìm nhị phân loại nửa khi mảng đã sắp tăng',['cmu-search'],'N=8/32/128, cuối: 4/6/8 lần; đầu tuần tự 1','search:128:binary:last','prediction 0; challenge nêu chưa sắp thì không áp dụng'),
 ('S-2','library-search','limit/caseStudy','Đếm mục xem, không suy trực tiếp ra ms',['cmu-search'],'metric là phép so mục, không benchmark',None,'UI source ghi rõ đơn vị; browser chưa quan sát'),
 ('H-1','hash-table','explanation/prediction','Cùng bucket không đồng nghĩa cùng khóa; phải so khóa đầy đủ',['mit-hash'],'B=4: [2,6,10,14] cùng bucket2; 18 không có','hash:4:hash:missing','prediction/challenge 0; UI source hiển thị chain'),
 ('H-2','hash-table','limit/caseStudy','Nhiều ngăn không bảo đảm tra một bước',['mit-hash'],'B=8: bucket2 [2,10], bucket6 [6,14]; mã14 cần 2 so','hash:8:hash:last','limit nêu rõ không suy O(1); UI source phân biệt số so với ms'),
]
rows=[]
for cid, lesson, field, claim, source_ids, expected, trace_key, assessment in claims:
    row={
      'claimId':cid,'lessonId':lesson,'version':1,
      'path':str(root/'content/lessons/vi'/f'{lesson}.json'),'field':field,'claim':claim,
      'scope':'assigned lesson and matching engine/UI source',
      'assumptions':'toy model, fixed dataset/workload; see lesson.limit',
      'sources':[{'url':sources[k][0],'edition':sources[k][1],'section':sources[k][2],
                  'checkedAt':'2026-10-17','statusCheck':None,'errataCheck':None,
                  'support':'direct source-read for general mechanism; authored numeric example calculated independently'} for k in source_ids],
      'independentExpected':expected,
      'trace':{'mode':'executed' if trace_key else 'source-read + independent calculation',
               'input':trace_key,'actions':'run trace.mjs with Node strip-types' if trace_key else None,
               'actual':None,'artifact':str(artifact/'traces.json') if trace_key else None,
               'command':'node --experimental-strip-types /private/tmp/sdl-audit-2026-10-17-os/trace.mjs' if trace_key else None},
      'assessmentEvidence':assessment,
      'uiEvidence':{'viewport':None,'artifact':None,'mode':'source-read only'},
      'verdict':'verified-with-conditions',
      'conditions':'Only the stated abstract model; source does not establish numeric benchmark or real OS guarantee',
      'uncertainty':'Browser/mobile observation absent; Vitest blocked by read-only worktree',
      'impact':None,'retest':'Run browser lab and unit suite in writable checkout before release if scope expands'
    }
    if trace_key:
        row['trace']['actual']=json.loads((artifact/'traces.json').read_text())[trace_key]
    rows.append(row)
(artifact/'claim-matrix.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
