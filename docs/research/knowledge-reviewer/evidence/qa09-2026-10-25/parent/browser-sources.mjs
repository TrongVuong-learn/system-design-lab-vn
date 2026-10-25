import {chromium,expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
const catalog=JSON.parse(await readFile('apps/web/src/generated/catalog.json','utf8'));
const browser=await chromium.launch({channel:'chromium'});const results=[];
try {
for(const width of [320,1280]) {
 const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===320});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['case-query-cache','case-school-feed','track-data','capacity-tail']){
  const l=catalog.lessons.find(l=>l.id===id);
  await page.goto('http://127.0.0.1:4173/#/learn/'+id);
  await expect(page.getByRole('heading',{level:1})).toHaveText(l.title);
  const notes=page.locator('.model-notes');if(await notes.getAttribute('open')===null)await notes.locator('summary').click();
  await expect(notes.locator('a')).toHaveCount(l.sources.length);
  for(const s of l.sources)await expect(notes.getByRole('link',{name:s.title+' ↗',exact:true})).toHaveAttribute('href',s.url);
  await notes.scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({path:'.cache/qa09/'+id+'-'+width+'.png'});
  results.push({id,width,links:l.sources.length,overflow:false,errors:[...errors]});
 }
 expect(errors).toEqual([]);await context.close();
}
}finally{await browser.close();}
await writeFile('docs/research/knowledge-reviewer/evidence/qa09-2026-10-25/parent/browser-sources.json',JSON.stringify(results,null,2)+'\n');
