import { initialConcurrency, concurrencyStep, restoreConcurrency } from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/concurrency.ts';
import { simulateCpuIo, restoreCpuIo } from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/cpu-io.ts';
import { librarySearch } from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/library-search.ts';
import { hashTable } from '/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning/packages/simulation-engine/src/hash-table.ts';
const out = {};
for (const locked of [false,true]) for (const seq of ['aabb','abab','bbaa']) {
 let s=initialConcurrency(locked); for(const a of seq) s=concurrencyStep(s,a).state;
 out[`concurrency:${locked}:${seq}`]={shared:s.shared,schedule:s.schedule,restored:restoreConcurrency({locked,modelVersion:1,schedule:JSON.stringify(s.schedule)}).shared};
}
for(const mode of ['io','cpu']) for(const workers of [1,2]) {
 const s=simulateCpuIo({mode,workers,step:10});
 out[`cpu:${mode}:${workers}`]={time:s.time,busy:s.busy,idle:s.idle,doneAt:s.jobs.map(j=>j.doneAt),cpu:s.timeline.map(t=>t.cpu),restored:restoreCpuIo({mode,workers,step:10,modelVersion:1}).time};
}
for(const size of [8,32,128]) for(const method of ['linear','binary']) for(const target of ['first','last','missing']) {
 const s=librarySearch({size,method,target,step:size,modelVersion:1}); out[`search:${size}:${method}:${target}`]={total:s.total,found:s.found,positions:s.trace.map(t=>t.position)};
}
for(const count of [4,8]) for(const method of ['hash','linear']) for(const target of ['first','last','missing']) {
 const s=hashTable({count,method,target,step:4,modelVersion:1}); out[`hash:${count}:${method}:${target}`]={total:s.total,found:s.found,keys:s.trace.map(t=>t.key)};
}
console.log(JSON.stringify(out,null,2));
