import { readFile, readdir, writeFile } from 'node:fs/promises';
import {
  lessonSchema,
  moduleSchema,
  validateCatalog,
  validatePathways,
} from '../packages/content-schema/src/index';

const map = await readFile('CURRICULUM_MAP.md', 'utf8');
const modules = [...map.matchAll(/^\| (L[0-5]\.[1-6]) \| ([^|]+) \|/gm)].map((m) =>
  moduleSchema.parse({
    id: m[1],
    level: m[1]!.slice(0, 2),
    title: m[2]!.trim().split(';')[0],
    topics: m[2]!.trim(),
  }),
);
if (modules.length !== 36 || new Set(modules.map((m) => m.id)).size !== 36)
  throw new Error('Expected 36 unique modules');
const lessons = (
  await Promise.all(
    (await readdir('content/lessons/vi'))
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map(async (f) => JSON.parse(await readFile(`content/lessons/vi/${f}`, 'utf8')) as unknown[]),
  )
)
  .flat()
  .map((l) => lessonSchema.parse(l));
const { editorial, coverage } = validateCatalog(
  modules,
  lessons,
  JSON.parse(await readFile('content/editorial.json', 'utf8')),
);
const rows = coverage.map((c) => {
  const competencies = editorial.competencies.filter((x) => x.moduleId === c.moduleId);
  const depths = ['introductory', 'mechanism', 'design'].map(
    (depth) => competencies.filter((x) => x.depth === depth).length,
  );
  return `| ${c.moduleId} | ${c.betaLessonIds.join(', ') || '—'} | ${depths.join(' / ')} | Chưa hoàn chỉnh |`;
});
const pathways = validatePathways(
  JSON.parse(await readFile('content/pathways.json', 'utf8')),
  lessons,
);
const pathwayRows = pathways.tracks
  .map((t) => `| ${t.title} | ${t.lessonIds.join(', ')} |`)
  .join('\n');
const report = `# Độ bao phủ học liệu — báo cáo sinh từ source

Chạy lại bằng \`pnpm coverage:write\`; kiểm tra drift bằng \`pnpm coverage:check\`.
Bài beta và năng lực đã đăng ký không đại diện cho toàn bộ năng lực cần có.
Số theo độ sâu là metadata biên tập, không phải số người học đã thành thạo hoặc chứng nhận review chuyên gia.
Phạm vi bắt buộc vẫn ở [CURRICULUM_MAP](../../CURRICULUM_MAP.md) và [roadmap](ROADMAP.md).

| Module | Bài beta khả dụng | Năng lực đăng ký: nhập môn / cơ chế / thiết kế | Module |
| --- | --- | --- | --- |
${rows.join('\n')}

Tổng: ${lessons.filter((l) => l.status === 'beta').length} bài beta; ${coverage.filter((c) => c.betaLessonIds.length > 0).length}/36 module có ít nhất một bài; 0/36 module được công nhận hoàn chỉnh.
Không tính bài ôn liên module thành một module đầy đủ. Số bài phản ánh nội dung khả dụng, không phải chứng nhận mastery hoặc hoàn tất mọi năng lực.

## Nhánh chuyên sâu và bài tổng hợp khả dụng

| Nhánh | Bài beta |
| --- | --- |
${pathwayRows}

Sáu capstone: ${pathways.capstones.join(', ')}.

Tám case tích hợp: ${pathways.cases.join(', ')}.

${lessons.filter((l) => l.designTask).length} bài có bản thiết kế tự viết, rubric tự đối chiếu và đề đổi ràng buộc. Chưa chấm thiết kế tự động, chưa review chuyên gia/pilot học sinh.
`;
const path = 'docs/delivery/CONTENT_COVERAGE.md';
if (process.argv.includes('--write')) await writeFile(path, report);
else if ((await readFile(path, 'utf8')) !== report)
  throw new Error('Coverage drift: run pnpm coverage:write');
console.log(`Coverage verified: ${coverage.length} modules, no completion inferred`);
