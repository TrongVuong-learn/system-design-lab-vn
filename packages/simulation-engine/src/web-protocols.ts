export const WEB_PROTOCOL_MODEL_VERSION = 1;
function stepOf(input: Record<string, unknown>, max: number) {
  return input.modelVersion === WEB_PROTOCOL_MODEL_VERSION &&
    typeof input.step === 'number' &&
    Number.isInteger(input.step) &&
    input.step >= 0 &&
    input.step <= max
    ? input.step
    : 0;
}
export function cookieSession(input: Record<string, unknown>) {
  const mode = input.mode === 'drop' || input.mode === 'revoke' ? input.mode : 'keep';
  const step = stepOf(input, 3);
  const cookie = step >= 1 && mode !== 'drop' ? 'S1' : null;
  const active = step >= 1 && !(mode === 'revoke' && step >= 2);
  const identity = step === 3 && cookie && active ? 'An' : 'Khách';
  return {
    config: { mode },
    step,
    cookie,
    active,
    identity,
    finished: step === 3,
    events: [
      `Server tạo session S1 → An; ${mode === 'drop' ? 'browser không giữ cookie' : 'Set-Cookie: sid=S1'}`,
      mode === 'revoke'
        ? 'Server thu hồi S1, cookie ở browser vẫn còn'
        : 'Server giữ S1 còn hiệu lực',
      `Browser gửi GET /lich ${cookie ? 'với Cookie: sid=S1' : 'không có Cookie'} → ${identity}`,
    ].slice(0, step),
  };
}
export function reverseProxy(input: Record<string, unknown>) {
  const mode = input.mode === 'direct' ? 'direct' : 'proxy';
  const resource = input.resource === 'image' ? 'image' : 'class';
  const step = stepOf(input, 3);
  const backend = resource === 'class' ? 'Máy lịch' : 'Máy ảnh';
  const path = resource === 'class' ? '/lop' : '/anh';
  const host =
    mode === 'proxy' ? 'portal.example' : resource === 'class' ? 'lich.example' : 'anh.example';
  const events =
    mode === 'proxy'
      ? [
          `Browser gửi GET ${host}${path} → reverse proxy`,
          `Proxy chọn ${backend} theo đường dẫn ${path}`,
          `${backend} → proxy → browser: 200`,
        ]
      : [
          `Browser gửi GET ${host}${path} → ${backend}`,
          `${backend} xử lý trực tiếp`,
          `${backend} → browser: 200`,
        ];
  return {
    config: { mode, resource },
    step,
    backend,
    path,
    host,
    events: events.slice(0, step),
    finished: step === 3,
  };
}
export function multiplexLoss(input: Record<string, unknown>) {
  const protocol = input.protocol === 'h2' ? 'h2' : 'h3';
  const loss = input.loss !== false;
  const step = stepOf(input, 3);
  const aReceived = (step >= 1 && !loss) || step === 3;
  const bReceived = step >= 2;
  const aDelivered = aReceived;
  const bDelivered = bReceived && (protocol === 'h3' || aReceived);
  const events = [
    loss ? 'Gói dữ liệu A bị mất; chưa nhận được A' : 'Nhận gói dữ liệu A',
    `Nhận gói dữ liệu B: ${protocol === 'h2' && loss ? 'TCP giữ B sau khoảng byte còn thiếu' : 'giao B cho stream B'}`,
    loss
      ? 'Nhận lại dữ liệu A; các stream đủ dữ liệu được giao'
      : 'Hai stream đã đủ dữ liệu, không cần truyền lại',
  ].slice(0, step);
  return {
    config: { protocol, loss },
    step,
    aReceived,
    bReceived,
    aDelivered,
    bDelivered,
    events,
    finished: step === 3,
  };
}
