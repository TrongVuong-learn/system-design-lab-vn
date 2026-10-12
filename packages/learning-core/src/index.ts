import { progressSchema, type Progress, type LessonProgress } from '@sdl/content-schema';
export const emptyProgress = (): Progress => ({ version: 1, lessons: {} });
export const newLessonProgress = (): LessonProgress => ({
  stage: 0,
  prediction: -1,
  challenge: -1,
  actions: 0,
  completed: false,
  lab: {},
});
export interface ProgressRepository {
  load(): Promise<Progress>;
  save(progress: Progress): Promise<void>;
}
export const MAX_PROGRESS_BYTES = 2_000_000;
export function parseProgress(text: string): Progress {
  if (
    text.length > MAX_PROGRESS_BYTES ||
    new TextEncoder().encode(text).byteLength > MAX_PROGRESS_BYTES
  )
    throw new Error('Bản lưu quá lớn. Giới hạn là 2 MB.');
  return progressSchema.parse(JSON.parse(text));
}
export function serializeProgress(progress: Progress): string {
  return JSON.stringify(progressSchema.parse(progress), null, 2);
}
export function updateLesson(
  progress: Progress,
  id: string,
  patch: Partial<LessonProgress>,
): Progress {
  return progressSchema.parse({
    ...progress,
    lessons: {
      ...progress.lessons,
      [id]: { ...newLessonProgress(), ...progress.lessons[id], ...patch },
    },
  });
}

export class ProgressConflictError extends Error {
  constructor() {
    super('Progress changed in another tab.');
    this.name = 'ProgressConflictError';
  }
}
