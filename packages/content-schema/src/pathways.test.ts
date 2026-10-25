import { readdirSync, readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import {
  lessonSchema,
  designTaskSchema,
  validatePathways,
  validateCompatibility,
  lessonContract,
} from './index';
import pathways from '../../../content/pathways.json';
const lessons = readdirSync('content/lessons/vi')
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) => JSON.parse(readFileSync(`content/lessons/vi/${f}`, 'utf8')) as unknown[])
  .map((l) => lessonSchema.parse(l));
it('validates all seven tracks, level capstones and case references against available design lessons', () => {
  expect(validatePathways(pathways, lessons).tracks).toHaveLength(7);
  const missing = structuredClone(pathways);
  missing.cases[0] = 'missing';
  expect(() => validatePathways(missing, lessons)).toThrow('Unavailable');
  const duplicate = structuredClone(pathways);
  duplicate.tracks[1]!.id = duplicate.tracks[0]!.id;
  expect(() => validatePathways(duplicate, lessons)).toThrow('Duplicate');
  const wrongLevel = structuredClone(pathways);
  wrongLevel.capstones.reverse();
  expect(() => validatePathways(wrongLevel, lessons)).toThrow('level mismatch');
});
it('rejects executable design fields, duplicate deliverables and changes to a published rubric', () => {
  const lesson = lessons.find((l) => l.id === 'end-to-end-design')!;
  const task = lesson.designTask!;
  expect(() => designTaskSchema.parse({ ...task, script: 'run()' })).toThrow();
  expect(() =>
    designTaskSchema.parse({ ...task, deliverables: [task.deliverables[0], task.deliverables[0]] }),
  ).toThrow();
  const baseline = { version: 1, progressVersion: 1, lessons: [lessonContract(lesson)] };
  const changed = structuredClone(lesson);
  changed.designTask!.rubric[0] = 'Một yêu cầu hoàn toàn mới.';
  expect(() => validateCompatibility([changed], baseline)).toThrow('Progress migration required');
});
