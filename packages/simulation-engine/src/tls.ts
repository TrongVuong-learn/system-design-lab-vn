import type { Observation } from './observations';
export const TLS_MODEL_VERSION = 1;
export type TlsConfig = {
  secure: boolean;
  certificate: 'valid' | 'wrong-name' | 'expired' | 'untrusted';
  attack: 'none' | 'listen' | 'tamper';
};
export function normalizeTls(input: Record<string, unknown>): TlsConfig {
  return {
    secure: input['secure'] !== false,
    certificate: ['wrong-name', 'expired', 'untrusted'].includes(String(input['certificate']))
      ? (input['certificate'] as TlsConfig['certificate'])
      : 'valid',
    attack: ['listen', 'tamper'].includes(String(input['attack']))
      ? (input['attack'] as TlsConfig['attack'])
      : 'none',
  };
}
export function simulateTls(input: Record<string, unknown>, run = true) {
  const config = normalizeTls(input);
  const blocked = config.secure && config.certificate !== 'valid';
  const rejected = config.secure && config.attack === 'tamper' && !blocked;
  const sent = run && !blocked;
  const outcome = !run
    ? 'Chưa gửi'
    : blocked
      ? 'Dừng ở kiểm tra chứng chỉ'
      : rejected
        ? 'Phát hiện sửa dữ liệu; từ chối bản ghi'
        : 'Đã nhận lịch';
  const observer = !sent
    ? 'Chưa có nội dung HTTP được gửi'
    : config.secure
      ? 'Không đọc được nội dung lịch; vẫn thấy IP, kích thước và thời điểm trao đổi'
      : 'Đọc được: Phòng 201';
  const browser = !sent
    ? 'Chưa có lịch'
    : rejected
      ? 'Không nhận lịch đã bị sửa'
      : config.attack === 'tamper'
        ? 'Phòng 999 (đã bị sửa trên đường)'
        : 'Phòng 201';
  const certificateMessage = {
    valid: 'Tên lich.truong.example khớp; chuỗi tin cậy và thời hạn được giả định hợp lệ.',
    'wrong-name': 'Tên trong chứng chỉ là thu-vien.example, không khớp lich.truong.example.',
    expired: 'Tên đúng nhưng chứng chỉ đã hết hạn.',
    untrusted: 'Tên đúng nhưng chuỗi chứng chỉ không được tin cậy.',
  }[config.certificate];
  const trace = !run
    ? ['Chọn cấu hình rồi gửi lịch.']
    : config.secure
      ? [
          'Bắt đầu thiết lập TLS; chưa gửi yêu cầu HTTP.',
          certificateMessage,
          ...(blocked
            ? ['Dừng kết nối; không gửi HTTP, không tự chuyển sang HTTP thường.']
            : [
                'Xác thực và thiết lập khóa kênh hoàn tất theo giả định.',
                'Gửi yêu cầu HTTP và nhận lịch qua kênh TLS.',
                rejected
                  ? 'Bản ghi bị sửa không vượt qua kiểm tra toàn vẹn; không trả lịch giả.'
                  : 'Trình duyệt kiểm tra và đọc nội dung tại đầu cuối.',
              ]),
        ]
      : [
          'Gửi HTTP không có TLS; chứng chỉ không tham gia.',
          'Người trên đường truyền đọc được phòng 201.',
          config.attack === 'tamper'
            ? 'Người trên đường đổi phòng 201 thành 999; mô hình HTTP này không phát hiện.'
            : 'Trình duyệt nhận phòng 201.',
        ];
  return {
    config,
    outcome,
    observer,
    browser,
    sent,
    blocked: run && blocked,
    rejected: run && rejected,
    trace,
  };
}
export function observeTls(
  before: ReturnType<typeof simulateTls>,
  after: ReturnType<typeof simulateTls>,
): Observation {
  return {
    schemaVersion: 1,
    action: 'Gửi lịch theo cấu hình đã chọn',
    rows: [
      { label: 'Kết quả', before: before.outcome, after: after.outcome },
      { label: 'Trình duyệt nhận', before: before.browser, after: after.browser },
      {
        label: 'HTTP được gửi',
        before: before.sent ? 'Có' : 'Chưa',
        after: after.sent ? 'Có' : 'Chưa',
      },
    ],
    reason: after.blocked
      ? 'Kiểm tra danh tính thất bại nên dừng trước khi gửi HTTP.'
      : after.rejected
        ? 'TLS phát hiện bản ghi bị sửa; không dùng dữ liệu đã bị can thiệp.'
        : after.config.secure
          ? 'Kênh TLS che nội dung với người trên mạng; hai đầu cuối vẫn đọc được.'
          : 'HTTP thường trong mô hình không bảo vệ nội dung khỏi người kiểm soát đường truyền.',
  };
}
