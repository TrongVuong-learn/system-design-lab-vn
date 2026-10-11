import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { emptyProgress, updateLesson, type ProgressRepository } from '@sdl/learning-core';
import type { Progress, LessonProgress } from '@sdl/content-schema';
import { progressRepository } from '../adapters/progress-repository';
interface Context {
  progress: Progress;
  ready: boolean;
  saving: string;
  update(id: string, patch: Partial<LessonProgress>): void;
  replace(p: Progress): void;
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
  const latest = useRef(progress);
  const loadError = useRef(false);
  const queue = useRef(Promise.resolve());
  const generation = useRef(0);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    repository
      .load()
      .then((p) => {
        if (mounted.current) {
          latest.current = p;
          setProgress(p);
          setSaving('Lưu trên thiết bị này');
        }
      })
      .catch(() => {
        if (mounted.current) {
          loadError.current = true;
          setSaving('Chưa mở được bản lưu. Bạn vẫn có thể học và xuất bản mới.');
        }
      })
      .finally(() => {
        if (mounted.current) setReady(true);
      });
    return () => {
      mounted.current = false;
    };
  }, [repository]);
  function save(p: Progress) {
    const revision = ++generation.current;
    setSaving('Đang lưu…');
    queue.current = queue.current
      .catch(() => {})
      .then(() => repository.save(p))
      .then(() => {
        if (revision === generation.current && mounted.current) setSaving('Đã lưu trên thiết bị');
      })
      .catch(() => {
        if (revision === generation.current && mounted.current)
          setSaving('Chưa lưu được. Hãy xuất bản lưu trong Tiến độ.');
      });
  }
  function replace(p: Progress) {
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
  return (
    <ProgressContext.Provider value={{ progress, ready, saving, update, replace }}>
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('ProgressProvider missing');
  return ctx;
}
