import {simulateTls} from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/tls.ts';
import {evaluateSchoolReview} from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/school-review.ts';
const results=[];
for(const secure of [false,true]) for(const certificate of ['valid','wrong-name','expired','untrusted']) for(const attack of ['none','listen','tamper']){
 const input={secure,certificate,attack};const actual=simulateTls(input);
 const expected={sent:!secure||certificate==='valid',blocked:secure&&certificate!=='valid',rejected:secure&&certificate==='valid'&&attack==='tamper',browser:secure&&certificate!=='valid'?'Chưa có lịch':secure&&attack==='tamper'?'Không nhận lịch đã bị sửa':!secure&&attack==='tamper'?'Phòng 999 (đã bị sửa trên đường)':'Phòng 201'};
 results.push({kind:'tls',input,expected,actual:{sent:actual.sent,blocked:actual.blocked,rejected:actual.rejected,browser:actual.browser,observer:actual.observer,outcome:actual.outcome},pass:Object.entries(expected).every(([k,v])=>actual[k]===v)});
}
for(const id of ['opening','rush']) for(const config of [{servers:2,cache:true,ttl:1,workers:id==='opening'?3:5},{servers:1,cache:false,ttl:5,workers:1},{servers:2,cache:true,ttl:2,workers:6},{servers:4,cache:true,ttl:1,workers:6}]){
 const a=evaluateSchoolReview(id,config);const s=id==='opening'?{read:12,job:6,initial:0,budget:7}:{read:6,job:8,initial:8,budget:8};
 const capacity=Math.min(config.servers*6,config.cache?16:4);const completed=Math.min(s.read,capacity);const finalQueue=Math.max(0,s.initial+4*s.job-4*config.workers*2);const cost=config.servers+config.workers+(config.cache?1:0);const expected={completed,waiting:s.read-completed,queued:finalQueue,cost,passed:completed===s.read&&finalQueue===0&&(!config.cache||config.ttl<=1)&&cost<=s.budget};
 results.push({kind:'school',id,config,expected,actual:{completed:a.reads.completed,waiting:a.reads.waiting,queued:a.queue.queued,cost:a.cost,passed:a.passed,checks:a.checks,trace:a.trace},pass:expected.completed===a.reads.completed&&expected.waiting===a.reads.waiting&&expected.queued===a.queue.queued&&expected.cost===a.cost&&expected.passed===a.passed});
}
for(const input of [{secure:'false',certificate:'weird',attack:'weird'},{secure:false,certificate:'wrong-name',attack:'tamper'}]){const a=simulateTls(input);results.push({kind:'tls-restored',input,actual:a});}
console.log(JSON.stringify(results,null,2));
