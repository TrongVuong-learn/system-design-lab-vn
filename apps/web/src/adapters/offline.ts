export interface OfflinePack {
  version: string;
  bytes: number;
  files: number;
  ready: boolean;
}
export interface OfflineState {
  active: OfflinePack | null;
  waiting: OfflinePack | null;
}
export const offlineSupported = () =>
  'serviceWorker' in navigator && 'caches' in window && window.isSecureContext;

function inspect(worker: ServiceWorker, repair = false): Promise<OfflinePack> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = window.setTimeout(() => {
      channel.port1.close();
      reject(new Error('Không đọc được gói tải. Hãy thử lại.'));
    }, 10000);
    channel.port1.onmessage = (event: MessageEvent<OfflinePack & { error?: string }>) => {
      clearTimeout(timer);
      channel.port1.close();
      if (event.data.error) reject(new Error(event.data.error));
      else resolve(event.data);
    };
    worker.postMessage({ type: repair ? 'SDL_PACK_REPAIR' : 'SDL_PACK_STATUS' }, [channel.port2]);
  });
}
export async function offlineState(): Promise<OfflineState> {
  const registration = await navigator.serviceWorker.getRegistration('/');
  return {
    active: registration?.active ? await inspect(registration.active) : null,
    waiting: registration?.waiting ? await inspect(registration.waiting) : null,
  };
}
function installed(worker: ServiceWorker) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(
      () => finish(new Error('Tải quá lâu. Kết nối mạng rồi thử lại.')),
      60000,
    );
    function finish(error?: Error) {
      clearTimeout(timer);
      worker.removeEventListener('statechange', check);
      if (error) reject(error);
      else resolve();
    }
    function check() {
      if (['installed', 'activated'].includes(worker.state)) finish();
      else if (worker.state === 'redundant')
        finish(new Error('Gói chưa tải đủ. Kiểm tra mạng hoặc dung lượng rồi thử lại.'));
    }
    worker.addEventListener('statechange', check);
    check();
  });
}
export async function downloadOffline(): Promise<OfflineState> {
  const registration = await navigator.serviceWorker.register('/sw.js', {
    scope: '/',
    updateViaCache: 'none',
  });
  if (registration.active) await registration.update();
  if (registration.installing) await installed(registration.installing);
  // First install may be between installed and activated; wait for that transition.
  if (!registration.active && !registration.waiting) await navigator.serviceWorker.ready;
  let state = await offlineState();
  if (!state.active?.ready && !state.waiting?.ready && registration.active) {
    await inspect(registration.active, true);
    state = await offlineState();
  }
  if (!state.active?.ready && !state.waiting?.ready)
    throw new Error('Gói chưa đầy đủ. Bấm tải lại khi có mạng và đủ dung lượng.');
  return state;
}
export async function removeOffline() {
  const registration = await navigator.serviceWorker.getRegistration('/');
  if (registration) await registration.unregister();
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => k.startsWith('sdl-offline-')).map((k) => caches.delete(k)));
}
