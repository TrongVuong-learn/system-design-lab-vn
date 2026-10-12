export function LessonSketch({ kind }: { kind: string }) {
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
