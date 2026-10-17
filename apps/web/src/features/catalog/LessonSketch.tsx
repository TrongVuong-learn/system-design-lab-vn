export function LessonSketch({ kind }: { kind: string }) {
  const foundation = (
    {
      concurrency: [
        'Hai luồng cùng đọc 30',
        'A ghi 31 · B ghi 31',
        'Mất một lượt cộng khi đọc–ghi xen kẽ',
      ],
      'cpu-io': [
        'Một CPU, hai việc chờ dữ liệu',
        '10\u00a0ms → 6\u00a0ms',
        '1 → 2 worker, cùng một CPU',
      ],
      tls: ['Lịch đi qua kênh TLS', 'Giữ kín · Phát hiện sửa', 'Kiểm tra đúng danh tính máy chủ'],
      'search-tree': [
        'Cùng bảy mã, hai hình dạng',
        '8 → 12 → 14',
        'Tra mã 14: 3 nút hoặc 7 nút tùy cây',
      ],
      'hash-table': [
        'Hai mã khác, cùng một ngăn',
        '2 → ngăn 2 ← 6',
        'Chọn ngăn rồi vẫn cần so khóa đầy đủ',
      ],
      'library-search': [
        'Tìm mã sách cuối danh mục',
        '8 mục hoặc 4 mục?',
        'So từng mục với chia đôi trên mảng đã sắp',
      ],
      metrics: [
        'Cùng 20 lượt, hai cách nhìn',
        '550 ms · 1.900 ms',
        'Median và p95 khi hai việc cuối chậm',
      ],
      routing: [
        'Tới đúng máy, đúng dịch vụ',
        'IP → router → TCP port',
        'Đường IP khác dịch vụ tại đích',
      ],
      dns: ['Tên dễ nhớ → địa chỉ IP', 'Tên → DNS → IP', 'Cache có thời hạn sử dụng'],
      transport: ['Mảnh số 2 bị mất', '1 → ? → 3', 'TCP giữ thứ tự luồng byte'],
      http: ['Yêu cầu → phản hồi', 'GET · 200 / 404 / 503', 'Mã trạng thái và nội dung'],
      network: ['Ba phần của thời gian chờ', 'RTT + xử lý + truyền', 'Mbps khác mili giây'],
      capacity: ['Một ảnh, nhiều lượt xem', 'Lượt × kB', 'Dữ liệu truyền khác dữ liệu lưu'],
    } as Record<string, string[]>
  )[kind];
  if (foundation)
    return (
      <div className="sketch foundation-sketch">
        <span className="sketch-caption">{foundation[0]}</span>
        <strong>{foundation[1]}</strong>
        <p>{foundation[2]}</p>
      </div>
    );
  if (kind === 'cache') {
    return (
      <div className="sketch cache-sketch">
        <span className="sketch-caption">Hai nơi giữ lịch</span>
        <div>
          <span>
            Nguồn chính<strong>205</strong>
          </span>
          <span className="old-copy">
            Bản ghi gần<strong>201</strong>
          </span>
        </div>
        <p>Bản ghi chưa được cập nhật</p>
      </div>
    );
  }
  if (kind === 'queue') {
    return (
      <div className="sketch queue-sketch">
        <span className="sketch-caption">6 việc đến, 2 việc xong</span>
        <div className="job-strip">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={i < 2 ? 'job-done' : ''}>
              {i < 2 ? '✓' : ''}
            </span>
          ))}
        </div>
        <p>Còn 4 việc đang chờ</p>
      </div>
    );
  }
  if (kind === 'replica') {
    return (
      <div className="sketch replica-sketch">
        <span className="sketch-caption">Thay đổi đang trên đường</span>
        <div>
          <strong>205</strong>
          <span className="replica-path">3 giây</span>
          <strong className="old-copy">201</strong>
        </div>
        <p>Nguồn chính và bản sao</p>
      </div>
    );
  }
  if (kind === 'balance') {
    return (
      <div className="sketch balance-sketch">
        <span className="sketch-caption">Nhiều máy, một nơi lưu</span>
        <svg viewBox="0 0 200 70" aria-hidden="true">
          <path d="M40 14H96V35H146M40 35H146M40 56H96V35" />
          <rect x="14" y="4" width="30" height="20" rx="3" />
          <rect x="14" y="25" width="30" height="20" rx="3" />
          <rect x="14" y="46" width="30" height="20" rx="3" />
          <rect x="146" y="20" width="40" height="30" rx="3" />
        </svg>
        <p>Nguồn chỉ đọc 4 lượt / giây</p>
      </div>
    );
  }
  if (kind === 'design') {
    return (
      <div className="sketch design-sketch">
        <span className="sketch-caption">Một ngân sách hữu hạn</span>
        <div className="budget-dots">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <p>6 điểm để chọn thiết kế</p>
      </div>
    );
  }
  return (
    <div className="sketch request-sketch">
      <span className="sketch-caption">Một yêu cầu, ba chặng</span>
      <div className="request-stops">
        <span>
          20<small>ms</small>
        </span>
        <b>+</b>
        <span>
          80<small>ms</small>
        </span>
        <b>+</b>
        <span>
          20<small>ms</small>
        </span>
      </div>
      <p>Tổng thời gian: 120 ms</p>
    </div>
  );
}
