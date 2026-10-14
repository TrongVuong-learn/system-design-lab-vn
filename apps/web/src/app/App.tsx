import { Component, useEffect, type ReactNode } from 'react';
import { HashRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router';
import { ProgressProvider } from './progress';
import {
  HomePage,
  ExplorePage,
  LevelPage,
  ProgressPage,
  NotFound,
} from '../features/catalog/Pages';
import { ReviewPage } from '../features/review';
import { LessonPage } from '../features/lesson-player/LessonPage';
import { Icon } from '../ui/primitives';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="page-content">
        <h1>Cần mở lại trang học.</h1>
        <p>Trang gặp lỗi hiển thị. Bản lưu đã ghi thành công vẫn ở trên thiết bị.</p>
        <button
          className="button primary"
          onClick={() => {
            window.location.hash = '/progress';
            window.location.reload();
          }}
        >
          Mở lại Tiến độ
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
function Shell() {
  const { pathname } = useLocation();
  const learning = pathname.startsWith('/learn/') || pathname.startsWith('/review/');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const navigation = [
    { to: '/', label: 'Học', icon: 'home' },
    { to: '/explore', label: 'Khám phá', icon: 'grid' },
    { to: '/progress', label: 'Tiến độ', icon: 'chart' },
  ];
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Đến nội dung chính
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/">
            <img src="/icon.svg" alt="" />
            <span>
              System Design<span className="brand-lab"> Lab</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            {navigation.map((n) => (
              <NavLink end={n.to === '/'} to={n.to} key={n.to}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <span className="beta-badge">Bản thử nghiệm</span>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className={learning ? 'main lesson-main' : 'main'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/levels/:level" element={<LevelPage />} />
          <Route path="/learn/:id" element={<LessonPage />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!learning && (
        <>
          <footer className="site-footer">
            <div>
              <strong>System Design Lab</strong>
              <p>Hiểu bằng cách thử. Học từng bước nhỏ.</p>
            </div>
            <span>Tiếng Việt · Mobile-first · Local-first</span>
          </footer>
          <nav className="mobile-nav" aria-label="Điều hướng điện thoại">
            {navigation.map((n) => (
              <NavLink end={n.to === '/'} key={n.to} to={n.to}>
                <Icon name={n.icon} />
                <span>{n.label}</span>
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </>
  );
}
export function App() {
  return (
    <ErrorBoundary>
      <ProgressProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </ProgressProvider>
    </ErrorBoundary>
  );
}
