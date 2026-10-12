import { useState } from 'react';
import { Link } from 'react-router';
import { cacheStep, initialCache, type CacheCommand } from '@sdl/simulation-engine';
import { Icon } from '../../ui/primitives';

export function FeaturedExperiment() {
  const [state, setState] = useState(initialCache);
  const changed = state.source !== state.cached;
  function act(command: CacheCommand) {
    setState((s) => cacheStep(s, command));
  }
  return (
    <div className="featured-experiment">
      <div className="experiment-top">
        <span>Thử ngay trên bàn học</span>
        <span className="experiment-type">Cache</span>
      </div>
      <div className="schedule-pair">
        <div className="schedule-source">
          <span>Lịch chính</span>
          <small>Phòng sinh hoạt</small>
          <strong>{state.source}</strong>
          <span className="schedule-caption">Thông tin nguồn</span>
        </div>
        <div className={`schedule-copy ${changed ? 'is-stale' : ''}`}>
          <span>Bản ghi gần</span>
          <small>Phòng sinh hoạt</small>
          <strong>{state.cached}</strong>
          <span className="schedule-caption">
            {changed ? 'Chưa nhận thay đổi' : 'Đang giống nguồn'}
          </span>
        </div>
      </div>
      <div className="experiment-actions">
        <button onClick={() => act({ type: 'update', value: state.source === 201 ? 205 : 201 })}>
          Đổi phòng ở nguồn
        </button>
        <button onClick={() => act({ type: 'read' })}>Xem lịch</button>
        <button onClick={() => act({ type: 'refresh' })}>Lấy lịch mới</button>
      </div>
      <p className="experiment-result" role="status">
        {state.reads === 0 && state.source === 201
          ? 'Đổi lịch chính rồi bấm Xem lịch. Bạn sẽ thấy gì?'
          : state.message}
      </p>
      <Link className="experiment-link" to="/learn/cache">
        Học bài này từng bước <Icon name="arrow" size={17} />
      </Link>
    </div>
  );
}
