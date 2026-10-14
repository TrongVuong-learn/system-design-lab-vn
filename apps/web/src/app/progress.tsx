import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  emptyProgress,
  updateLesson,
  updateSchoolReview,
  ProgressConflictError,
  type ProgressRepository,
} from '@sdl/learning-core';
import type { Progress, LessonProgress, SchoolReviewProgress } from '@sdl/content-schema';
import { progressRepository } from '../adapters/progress-repository';
interface Context {
  progress: Progress;
  ready: boolean;
  saving: string;
  saveState: 'loading' | 'idle' | 'saving' | 'saved' | 'write-error' | 'read-error' | 'conflict';
  retrySave(): void;
  update(id: string, patch: Partial<LessonProgress>): void;
  replace(p: Progress): void;
  updateReview(p: SchoolReviewProgress): void;
}
const ProgressContext = createContext<Context | null>(null);
export function ProgressProvider({
  children,
  repository = progressRepository,
}: {
  children: ReactNode;
  repository?: ProgressRepository;
}) {
  const [progress, setProgress] = useState(emptyProgress);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState('Đang mở bản lưu…');
  const [saveState, setSaveState] = useState<Context['saveState']>('loading');
  const latest = useRef(progress);
  const loadError = useRef(false);
  const queue = useRef(Promise.resolve());
  const generation = useRef(0);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    let active = true;
    repository
      .load()
      .then((p) => {
        if (active) {
          latest.current = p;
          setProgress(p);
          setSaving('Lưu trên thiết bị này');
          setSaveState('idle');
        }
      })
      .catch(() => {
        if (active) {
          loadError.current = true;
          setSaving('Chưa mở được bản lưu. Tiến độ đang học chỉ được giữ trong tab này.');
          setSaveState('read-error');
        }
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
      mounted.current = false;
    };
  }, [repository]);
  function save(p: Progress) {
    const revision = ++generation.current;
    setSaving('Đang lưu…');
    setSaveState('saving');
    queue.current = queue.current
      .catch(() => {})
      .then(() => repository.save(p))
      .then(() => {
        if (revision === generation.current && mounted.current) {
          setSaving('Đã lưu trên thiết bị');
          setSaveState('saved');
        }
      })
      .catch((error: unknown) => {
        if (revision === generation.current && mounted.current) {
          if (error instanceof ProgressConflictError) {
            setSaving('Tiến độ đã đổi ở tab khác. Phần đang học trong tab này chưa được ghi.');
            setSaveState('conflict');
          } else {
            setSaving('Chưa lưu được thay đổi mới. Tiến độ đang học vẫn ở trong tab này.');
            setSaveState('write-error');
          }
        }
      });
  }
  function retrySave() {
    if (ready && !loadError.current && saveState === 'write-error') save(latest.current);
  }
  function replace(p: Progress) {
    if (!ready) return;
    loadError.current = false;
    latest.current = p;
    setProgress(p);
    save(p);
  }
  function update(id: string, patch: Partial<LessonProgress>) {
    if (!ready) return;
    const next = updateLesson(latest.current, id, patch);
    latest.current = next;
    setProgress(next);
    if (!loadError.current) save(next);
  }
  function updateReview(review: SchoolReviewProgress) {
    if (!ready) return;
    const next = updateSchoolReview(latest.current, review);
    latest.current = next;
    setProgress(next);
    if (!loadError.current) save(next);
  }
  return (
    <ProgressContext.Provider
      value={{ progress, ready, saving, saveState, retrySave, update, updateReview, replace }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('ProgressProvider missing');
  return ctx;
}
