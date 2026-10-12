import {
  emptyProgress,
  ProgressConflictError,
  parseProgress,
  serializeProgress,
  type ProgressRepository,
} from '@sdl/learning-core';
import type { Progress } from '@sdl/content-schema';
const DB = 'system-design-lab';
let lastStored: string | null | undefined;
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 2);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('progress'))
        request.result.createObjectStore('progress');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Hãy đóng tab cũ để mở bản lưu.'));
  });
}
export const progressRepository: ProgressRepository = {
  async load() {
    const db = await open();
    try {
      return await new Promise<Progress>((resolve, reject) => {
        const request = db
          .transaction('progress', 'readonly')
          .objectStore('progress')
          .get('current');
        request.onsuccess = () => {
          try {
            lastStored = request.result === undefined ? null : String(request.result);
            resolve(lastStored !== null ? parseProgress(lastStored) : emptyProgress());
          } catch (e) {
            reject(e);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  },
  async save(progress) {
    const db = await open();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('progress', 'readwrite');
        const value = serializeProgress(progress);
        const store = tx.objectStore('progress');
        const current = store.get('current');
        current.onsuccess = () => {
          const stored = current.result === undefined ? null : String(current.result);
          if (stored !== lastStored) {
            reject(new ProgressConflictError());
            tx.abort();
            return;
          }
          try {
            store.put(value, 'current');
          } catch (error) {
            reject(error);
            tx.abort();
          }
        };
        tx.oncomplete = () => {
          lastStored = value;
          resolve();
        };
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  },
};
