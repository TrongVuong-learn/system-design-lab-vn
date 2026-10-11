import {
  emptyProgress,
  parseProgress,
  serializeProgress,
  type ProgressRepository,
} from '@sdl/learning-core';
import type { Progress } from '@sdl/content-schema';
const DB = 'system-design-lab';
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('progress');
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
            resolve(request.result ? parseProgress(String(request.result)) : emptyProgress());
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
        tx.objectStore('progress').put(serializeProgress(progress), 'current');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  },
};
