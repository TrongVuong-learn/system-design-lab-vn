import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {estimateDownload,httpExchange} from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/network.ts';
import {routePacket} from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/routing.ts';
import {simulateTls} from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/tls.ts';
import {trafficStep} from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/index.ts';
import {measureBatch} from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/foundations.ts';
const rows=[];
function check(id,input,expected,actual){assert.deepEqual(actual,expected,id);rows.push({id,input,expected,actual,mode:'executed'});}
for(const rtt of [20,100,200])for(const rate of [1,8,16,32])for(const size of [100,1000,10000]){
 const expected=rtt+50+((size*1000*8)/(rate*1000000))*1000;
 check('network',{rtt,rate,size},expected,estimateDownload(rtt,rate,size).totalMs);
}
for(const secure of [true,false])for(const certificate of ['valid','wrong-name','expired','untrusted'])for(const attack of ['none','listen','tamper']){
 const c={secure,certificate,attack}; const x=simulateTls(c);
 const blocked=secure&&certificate!=='valid';
 check('tls',c,{sent:!blocked,blocked,rejected:!blocked&&secure&&attack==='tamper',browser:blocked?'Chưa có lịch':secure&&attack==='tamper'?'Không nhận lịch đã bị sửa':attack==='tamper'?'Phòng 999 (đã bị sửa trên đường)':'Phòng 201'}, {sent:x.sent,blocked:x.blocked,rejected:x.rejected,browser:x.browser});
}
for(const resource of ['timetable','missing'])for(const maintenance of [false,true])for(const step of [0,1,2])check('http',{resource,maintenance,step},step<2?null:maintenance?503:resource==='missing'?404:200,httpExchange(resource,maintenance,step).response?.status??null);
for(const destination of ['school','other'])for(const port of [8080,9090,8181])for(const route of [false,true])for(const step of [0,1,2,3])check('routing',{destination,port,route,step},step===0?'ready':!route?'no-route':step===1?'forwarding':destination==='other'?'other-host':step===2?'at-host':port===8181?'not-listening':port===9090?'library':'timetable',routePacket(destination,port,route,step).outcome);
check('metrics-thumbnail',{workers:2,slow:true},{median:550,p95:1900},((x)=>({median:x.median,p95:x.p95}))(measureBatch(2,true)));
const rounding=[1,2,3,6,12].map(arrivals=>({arrivals,...trafficStep({arrivals,servers:2,serverCapacity:6,databaseCapacity:4,cacheHit:.75})}));
writeFileSync('/private/tmp/sdl-audit-2026-10-17-parent/traces.json',JSON.stringify({runtime:process.version,checks:rows.length,rows,rounding},null,2));
console.log(JSON.stringify({checked:rows.length,runtime:process.version,rounding},null,2));
