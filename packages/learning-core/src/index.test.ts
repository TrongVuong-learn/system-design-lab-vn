import { describe, it, expect } from 'vitest';
import { emptyProgress, parseProgress, updateLesson, serializeProgress } from './index';
describe('learning checkpoints', () => {
  it('restores position, answers and experiment state without completing another lesson', () => {
    const p = updateLesson(emptyProgress(), 'cache', {
      stage: 2,
      actions: 3,
      lab: { source: 205, cached: 201 },
    });
    expect(parseProgress(serializeProgress(p))).toEqual(p);
    expect(p.lessons['queue']).toBeUndefined();
  });
  it('rejects unsupported versions and invalid stages on import', () => {
    expect(() => parseProgress('{"version":2,"lessons":{}}')).toThrow();
    expect(() => updateLesson(emptyProgress(), 'cache', { stage: 5 })).toThrow();
  });
});
