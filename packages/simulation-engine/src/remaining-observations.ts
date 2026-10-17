import { boundedNumber, restoreReplica, trafficStep } from './index';
import { measureBatch, estimateCapacity, restoreDns, transferPackets } from './foundations';
import { httpExchange } from './network';
import { routePacket } from './routing';
import type { Observation } from './observations';
type Data = Record<string, unknown>;
export type GuidedKind =
  | 'request'
  | 'balance'
  | 'replica'
  | 'design'
  | 'metrics'
  | 'dns'
  | 'transport'
  | 'capacity'
  | 'http'
  | 'routing';
const n = (v: number, digits = 2) => v.toLocaleString('vi-VN', { maximumFractionDigits: digits });
const row = (label: string, before: string | number, after: string | number) => ({
  label,
  before: String(before),
  after: String(after),
});
const obs = (action: string, rows: Observation['rows'], reason: string): Observation => ({
  schemaVersion: 1,
  action,
  rows,
  reason,
});
const b = (d: Data, key: string, fallback: number, min: number, max: number) =>
  boundedNumber(d[key], fallback, min, max);
export function observeRemaining(kind: GuidedKind, before: Data, after: Data): Observation | null {
  if (kind === 'request') {
    const view = (d: Data) => {
      const step = b(d, 'step', 0, 0, 3),
        delay = b(d, 'delay', 80, 20, 200);
      return {
        step,
        delay,
        elapsed: step === 0 ? 0 : step === 1 ? 20 : step === 2 ? 20 + delay : 40 + delay,
      };
    };
    const a = view(before),
      c = view(after);
    if (c.step === 0 && a.delay === c.delay) return null;
    return obs(
      a.delay !== c.delay ? 'Đổi thời gian tra lịch' : 'Đi thêm một chặng',
      [
        row('Chặng đã qua', `${a.step}/3`, `${c.step}/3`),
        row('Thời gian đã qua', `${a.elapsed} ms`, `${c.elapsed} ms`),
        row('Tra lịch giả định', `${a.delay} ms`, `${c.delay} ms`),
      ],
      a.delay !== c.delay
        ? `Thay thời gian tra lịch nên lần thử bắt đầu lại từ chặng 0. Nếu đi hết ba chặng nối tiếp, tổng là 20 + ${c.delay} + 20 = ${40 + c.delay} ms.`
        : c.step === 3
          ? `Đã đi hết ba chặng: 20 + ${c.delay} + 20 = ${c.elapsed} ms. Đây là tổng thời gian trong mô hình nối tiếp, chưa tính hàng đợi.`
          : `Đã qua ${c.step} chặng với tổng ${c.elapsed} ms; câu trả lời chưa về thiết bị. Các chặng nối tiếp nên thời gian cộng dồn.`,
    );
  }
  if (kind === 'balance' || kind === 'design') {
    const view = (d: Data) => {
      const servers = b(d, 'servers', 1, 1, 4),
        arrivals = kind === 'design' ? 12 : b(d, 'arrivals', 8, 1, 20),
        workers = b(d, 'workers', 1, 1, 5),
        cache = Boolean(d['cache'] ?? false);
      return {
        ...trafficStep({
          arrivals,
          servers,
          serverCapacity: 6,
          databaseCapacity: 4,
          cacheHit: cache ? 0.75 : 0,
        }),
        servers,
        arrivals,
        workers,
        cache,
        cost: servers + workers + (cache ? 1 : 0),
      };
    };
    const a = view(before),
      c = view(after);
    const rows = [
      row('Đọc hoàn tất', `${a.completed} lượt/giây`, `${c.completed} lượt/giây`),
      row('Chưa xong trong cửa sổ', `${a.waiting} lượt`, `${c.waiting} lượt`),
    ];
    if (kind === 'design')
      rows.push(
        row('Công suất gửi', `${a.workers * 2} việc/giây`, `${c.workers * 2} việc/giây`),
        row('Chi phí giả lập', `${a.cost}/6 điểm`, `${c.cost}/6 điểm`),
      );
    else
      rows.push(
        row(
          'Đọc nguồn kỳ vọng',
          `${n(a.databaseReads)} lượt/giây`,
          `${n(c.databaseReads)} lượt/giây`,
        ),
      );
    const change =
      c.cache !== a.cache
        ? `Cache ${c.cache ? 'bật với tỷ lệ hit trung bình giả định 75%' : 'tắt, mọi lượt cần đọc nguồn'}.`
        : c.workers !== a.workers
          ? 'Đổi worker chỉ đổi công suất gửi thông báo, không tăng công suất đọc lịch.'
          : c.servers !== a.servers
            ? 'Đổi số máy xử lý không thay công suất nơi lưu dữ liệu dùng chung.'
            : 'Đổi tải đến để kiểm tra giới hạn phục vụ.';
    return obs(
      'Tính lại cửa sổ 1 giây',
      rows,
      `${change} Hiện hoàn tất ${c.completed}/${c.arrivals} lượt đọc; giới hạn công suất ở ${c.bottleneck}. Mỗi lần tính bắt đầu không có hàng chờ, không cộng số chờ từ lần trước.${kind === 'design' ? ` Công suất gửi ${c.workers * 2} việc/giây, chi phí ${c.cost}/6 điểm; đây mới kiểm tải và ngân sách giả lập.` : ''}`,
    );
  }
  if (kind === 'replica') {
    const view = (d: Data) => {
      let pending: unknown;
      try {
        pending = JSON.parse(String(d['pending'] ?? '[]'));
      } catch {
        pending = null;
      }
      return {
        ...restoreReplica({
          time: d['time'] ?? 0,
          primary: d['primary'] ?? 201,
          replica: d['replica'] ?? 201,
          pending,
        }),
        lag: b(d, 'lag', 3, 0, 5),
      };
    };
    const a = view(before),
      c = view(after);
    const reason =
      a.lag !== c.lag
        ? 'Chỉ đổi độ trễ cho lần ghi tiếp theo. Các thay đổi đã xếp lịch vẫn giữ thời điểm cũ; thời gian chưa trôi thêm.'
        : a.primary !== c.primary
          ? c.lag === 0
            ? 'Trong chế độ lý tưởng độ trễ 0, lần ghi này cập nhật bản sao ngay và bỏ các thay đổi đang chờ. Đây không mô phỏng đầy đủ giao thức đồng bộ.'
            : `Nguồn ghi phòng ${c.primary}; thay đổi được xếp lịch đến bản sao. Bản sao chưa tự đổi ngay sau ghi.`
          : c.replica !== a.replica
            ? `Đồng hồ đến giây ${c.time}; thay đổi đã tới lượt được áp dụng, bản sao hiện phòng ${c.replica}.`
            : `Đồng hồ đến giây ${c.time}; chưa có thay đổi tới lượt làm bản sao đổi. Giá trị đọc tại bản sao vẫn là phòng ${c.replica}.`;
    return obs(
      a.lag !== c.lag
        ? 'Đổi độ trễ ghi tiếp theo'
        : a.primary !== c.primary
          ? 'Ghi vào nguồn'
          : 'Qua 1 giây',
      [
        a.lag !== c.lag
          ? row('Độ trễ ghi mới', `${a.lag} giây`, `${c.lag} giây`)
          : row('Đồng hồ', `${a.time} giây`, `${c.time} giây`),
        row('Nguồn chính', `Phòng ${a.primary}`, `Phòng ${c.primary}`),
        row('Bản sao', `Phòng ${a.replica}`, `Phòng ${c.replica}`),
        row('Thay đổi đang chờ', a.pending.length, c.pending.length),
      ],
      reason,
    );
  }
  if (kind === 'metrics') {
    const view = (d: Data) => measureBatch(b(d, 'workers', 1, 1, 4), d['slow'] === true),
      a = view(before),
      c = view(after);
    return obs(
      'Tính lại đợt 20 yêu cầu',
      [
        row('Median', `${n(a.median)} ms`, `${n(c.median)} ms`),
        row('p95', `${n(a.p95)} ms`, `${n(c.p95)} ms`),
        row('Cả đợt', `${n(a.windowMs)} ms`, `${n(c.windowMs)} ms`),
        row('Throughput đợt', `${n(a.throughput)} lượt/giây`, `${n(c.throughput)} lượt/giây`),
      ],
      `Mỗi cấu hình tính lại 20 yêu cầu cùng đến lúc 0, không nối tiếp đợt trước. Median lấy hai giá trị giữa dãy đã sắp; p95 lấy giá trị thứ 19. ${a.median === c.median ? 'Median giữ nguyên ở lần đổi này; nhìn thêm p95 để thấy nhóm chờ lâu.' : 'Median đổi vì hai giá trị giữa dãy thay đổi.'} Throughput = 20 ÷ ${n(c.windowMs / 1000, 3)} giây; không phải công suất dài hạn.`,
    );
  }
  if (kind === 'dns') {
    const a = restoreDns(before),
      c = restoreDns(after),
      ip = (v: number) => (v ? `203.0.113.${v}` : 'Chưa có');
    const wait = c.time > a.time,
      move = c.source !== a.source;
    return obs(
      wait ? 'Qua 1 giây' : move ? 'Đổi IP ở nguồn' : 'Tra địa chỉ',
      [
        row('IP ở nguồn', ip(a.source), ip(c.source)),
        row('Bản ghi gần', ip(a.cached), ip(c.cached)),
        row('Lần tra gần nhất', ip(a.last), ip(c.last)),
        row(
          'Thời hạn còn lại',
          `${Math.max(0, a.expiresAt - a.time)} giây`,
          `${Math.max(0, c.expiresAt - c.time)} giây`,
        ),
      ],
      move
        ? 'IP ở nguồn đổi, bản ghi gần chưa được cập nhật. Kết quả lần tra trước là lịch sử; bấm “Tra địa chỉ” để kiểm tra lần mới.'
        : wait
          ? c.time >= c.expiresAt
            ? 'Chỉ đồng hồ đổi. Bản ghi hiện không dùng được; hết hạn chưa tự tra nguồn. Lần tra tiếp theo mới lấy lại địa chỉ.'
            : 'Chỉ đồng hồ đổi, bản ghi vẫn còn hạn; chưa có lượt tra mới.'
          : c.route === 'cache'
            ? `Lần tra dùng bản ghi gần còn hạn, trả ${ip(c.last)}.${c.last !== c.source ? ' IP này khác nguồn hiện tại.' : ''}`
            : `Lần tra lấy địa chỉ ${ip(c.last)} từ nguồn và giữ bản ghi đến giây ${c.expiresAt}. DNS tìm địa chỉ, chưa tải nội dung website.`,
    );
  }
  if (kind === 'transport') {
    const view = (d: Data) => {
        const protocol = d['protocol'] === 'udp' ? 'udp' : 'tcp',
          loss = d['loss'] !== false,
          step = b(d, 'step', 0, 0, 3);
        return { protocol, loss, step, ...transferPackets(protocol, loss, step) };
      },
      a = view(before),
      c = view(after);
    const configured = a.protocol !== c.protocol || a.loss !== c.loss;
    if (c.step === 0 && !configured) return null;
    const reason = configured
      ? 'Đổi giao thức hoặc giả định mất mảnh nên bắt đầu một lần truyền mới; chưa có dữ liệu đến ứng dụng.'
      : c.step < 2
        ? 'Các phần mới được gửi đi; chưa tới bước nhận tại đích.'
        : c.protocol === 'tcp' && c.loss && c.step === 2
          ? 'TCP đã nhận vùng 1 và 3, nhưng chỉ giao vùng 1 cho ứng dụng; vùng 3 chờ vùng 2 để giữ thứ tự byte.'
          : c.protocol === 'udp' && c.loss
            ? 'Ứng dụng nhận thông điệp 1 và 3; UDP không tự gửi lại thông điệp 2 trong lần thử này.'
            : c.protocol === 'tcp' && c.loss
              ? 'Trace giả định lần gửi lại vùng 2 thành công, nên giao đủ ba vùng byte. Mạng thực có thể tiếp tục lỗi; TCP không bảo đảm luôn khôi phục thành công.'
              : 'Đã giao đủ ba phần trong lần thử không mất mảnh; sơ đồ này không so sánh tốc độ giao thức.';
    return obs(
      configured ? 'Cấu hình lần truyền mới' : 'Đi thêm một bước truyền',
      [
        row('Giao thức', a.protocol.toUpperCase(), c.protocol.toUpperCase()),
        row('Ứng dụng đã nhận', `${a.delivered.length} phần`, `${c.delivered.length} phần`),
        row('Giữ trong bộ đệm', a.buffered, c.buffered),
        row('Lần gửi lại', a.retransmissions, c.retransmissions),
      ],
      reason,
    );
  }
  if (kind === 'capacity') {
    const view = (d: Data) => ({
        students: b(d, 'students', 1000, 100, 5000),
        views: b(d, 'views', 10, 1, 50),
        size: b(d, 'size', 100, 10, 500),
        peak: b(d, 'peak', 4, 1, 10),
      }),
      a = view(before),
      c = view(after),
      x = estimateCapacity(a.students, a.views, a.size, a.peak),
      y = estimateCapacity(c.students, c.views, c.size, c.peak);
    const reason =
      a.views !== c.views
        ? 'Đổi lượt xem chỉ đổi số lượt tải và dữ liệu truyền; số ảnh duy nhất cần lưu không đổi.'
        : a.peak !== c.peak
          ? 'Hệ số đỉnh chỉ đổi tải đỉnh giả định; không đổi tổng lượt/ngày hoặc dung lượng ảnh.'
          : a.size !== c.size
            ? 'Đổi kích thước ảnh làm dung lượng lưu và dữ liệu truyền đổi; số lượt tải giữ nguyên.'
            : 'Đổi số học sinh làm số ảnh duy nhất và tổng lượt tải đổi theo giả định mỗi người có một ảnh.';
    return obs(
      'Tính lại ước lượng',
      [
        row('Lượt mỗi ngày', `${n(x.daily)} lượt`, `${n(y.daily)} lượt`),
        row('Đỉnh giả định', `${n(x.peakRps, 3)} lượt/giây`, `${n(y.peakRps, 3)} lượt/giây`),
        row('Truyền mỗi ngày', `${n(x.transferMB)} MB`, `${n(y.transferMB)} MB`),
        row('Ảnh duy nhất lưu', `${n(x.storageMB)} MB`, `${n(y.storageMB)} MB`),
      ],
      `${reason} Dùng MB thập phân; đây là phép tính từ giả định, không phải đo tải thật hoặc suy ra số máy cần mua.`,
    );
  }
  if (kind === 'http') {
    const view = (d: Data) => {
        const resource = d['resource'] === 'missing' ? 'missing' : 'timetable',
          maintenance = d['maintenance'] === true,
          step = b(d, 'step', 0, 0, 2);
        return { resource, maintenance, step, ...httpExchange(resource, maintenance, step) };
      },
      a = view(before),
      c = view(after);
    const configured = a.resource !== c.resource || a.maintenance !== c.maintenance;
    if (c.step === 0 && !configured) return null;
    const status = (v: typeof a) => (v.response ? String(v.response.status) : 'Chưa nhận');
    return obs(
      configured ? 'Chuẩn bị yêu cầu mới' : 'Đi thêm một bước HTTP',
      [
        row('Đường dẫn', a.request.target, c.request.target),
        row('Bảo trì', a.maintenance ? 'Bật' : 'Tắt', c.maintenance ? 'Bật' : 'Tắt'),
        row('Mã đã nhận', status(a), status(c)),
      ],
      configured
        ? 'Đổi tài nguyên hoặc trạng thái máy chủ nên bắt đầu request mới. Mã của lần trước không phải kết quả của lần mới.'
        : !c.response
          ? 'Yêu cầu đã tới máy chủ; chưa xem phản hồi. Bấm “Xem phản hồi” để đọc mã và nội dung.'
          : c.response.status === 404
            ? 'Đã nhận phản hồi HTTP 404: không tìm thấy tài nguyên ở đường dẫn này. Đây không phải mất kết nối.'
            : c.response.status === 503
              ? 'Đã nhận phản hồi HTTP 503: bộ nhận HTTP hoạt động, dịch vụ đang bảo trì trong mô hình.'
              : 'Đã nhận 200 và nội dung phòng 201 trong lần này. Mã thành công HTTP không tự chứng minh dữ liệu luôn mới nhất.',
    );
  }
  const a = routePacket(before['destination'], before['port'], before['route'], before['step']),
    c = routePacket(after['destination'], after['port'], after['route'], after['step']);
  const configured =
    a.ip !== c.ip || a.destinationPort !== c.destinationPort || a.hasRoute !== c.hasRoute;
  if (c.phase === 0 && !configured) return null;
  const names = {
    ready: 'Chưa gửi',
    forwarding: 'Ở router',
    'no-route': 'Không có route',
    'at-host': 'Tới máy trường',
    'other-host': 'Tới máy khác',
    'not-listening': 'Không có dịch vụ',
    library: 'Thư viện',
    timetable: 'Lịch học',
  };
  return obs(
    configured ? 'Chuẩn bị đường đi mới' : 'Đi thêm một chặng IP',
    [
      row('IP đích', a.ip, c.ip),
      row('Port TCP đích', a.destinationPort, c.destinationPort),
      row('Route tới đích', a.hasRoute ? 'Có' : 'Không', c.hasRoute ? 'Có' : 'Không'),
      row(
        'Vị trí/kết quả',
        names[a.outcome as keyof typeof names],
        names[c.outcome as keyof typeof names],
      ),
    ],
    configured
      ? 'Đổi cấu hình nên yêu cầu quay về bước chưa gửi. IP chọn máy, route chọn đường đi IP, port TCP chọn dịch vụ tại máy đích.'
      : c.outcome === 'no-route'
        ? 'Dừng ở router vì bảng giả định không có route tới đích và không có route mặc định. Chỉ đổi port không tạo đường đi IP.'
        : c.outcome === 'forwarding'
          ? 'Router tìm được route theo IP, chưa tới máy đích để chọn dịch vụ.'
          : c.outcome === 'at-host'
            ? 'Đã tới đúng máy theo IP; bước tiếp theo mới chọn dịch vụ theo port TCP.'
            : c.outcome === 'other-host'
              ? 'IP đã đưa yêu cầu tới máy khác. Đúng port ở máy khác không chuyển yêu cầu về máy trường.'
              : c.outcome === 'not-listening'
                ? 'Đã tới máy trường nhưng port 8181 không có dịch vụ TCP lắng nghe trong cấu hình giả định.'
                : `Máy trường chọn dịch vụ ${c.outcome === 'library' ? 'thư viện ở 9090' : 'lịch học ở 8080'} theo port TCP. Chưa mô phỏng TCP handshake hoặc phản hồi HTTP.`,
  );
}
