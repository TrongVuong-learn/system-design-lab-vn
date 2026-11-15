import { Component, forwardRef, useEffect, type ReactNode } from 'react';
import { HashRouter, Link as RouterLink, Route, Routes, useLocation } from 'react-router';
import { Theme } from '@astryxdesign/core/theme';
import { LinkProvider } from '@astryxdesign/core/Link';
import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { themes, defaultThemeSlug } from '../astryx-themes';
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
import { GamesPage, GamePage } from '../features/games/GamesPage';
import { Icon } from '../ui/primitives';

/** Astryx renders links through this, so every href stays inside the hash router. */
const RouteLink = forwardRef<
  HTMLAnchorElement,
  { href?: string; to?: string } & Record<string, unknown>
>(function RouteLink({ href, to, ...rest }, ref) {
  const target = String(href ?? to ?? '/');
  if (/^(https?:|mailto:|#)/.test(target)) return <a ref={ref} href={target} {...rest} />;
  return <RouterLink ref={ref} to={target} {...rest} />;
});

class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="page">
        <VStack gap={3}>
          <Heading level={1}>Cần mở lại trang học.</Heading>
          <Text as="p">Trang gặp lỗi hiển thị. Bản lưu đã ghi thành công vẫn ở trên thiết bị.</Text>
          <HStack>
            <Button
              variant="primary"
              label="Mở lại Tiến độ"
              onClick={() => {
                window.location.hash = '/progress';
                window.location.reload();
              }}
            />
          </HStack>
        </VStack>
      </main>
    ) : (
      this.props.children
    );
  }
}

const navigation = [
  { to: '/', label: 'Học', icon: 'home' },
  { to: '/explore', label: 'Khám phá', icon: 'grid' },
  { to: '/games', label: 'Game', icon: 'play' },
  { to: '/progress', label: 'Tiến độ', icon: 'chart' },
];

function isCurrent(pathname: string, to: string) {
  return to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);
}

function Shell() {
  const { pathname } = useLocation();
  const learning = pathname.startsWith('/learn/') || pathname.startsWith('/review/');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
      <div className="site-header">
        <TopNav
          label="Điều hướng chính"
          heading={
            <TopNavHeading
              logo={<img src="/icon.svg" alt="" width={28} height={28} />}
              heading="System Design Lab"
              headingHref="/"
            />
          }
          centerContent={
            <span className="desktop-nav">
              {navigation.map((n) => (
                <TopNavItem
                  key={n.to}
                  label={n.label}
                  href={n.to}
                  isSelected={isCurrent(pathname, n.to)}
                />
              ))}
            </span>
          }
          endContent={<Badge variant="info" label="Bản thử nghiệm" />}
        />
      </div>
      <main id="main-content" tabIndex={-1} className={learning ? 'page page-learning' : 'page'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/levels/:level" element={<LevelPage />} />
          <Route path="/learn/:id" element={<LessonPage />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:id" element={<GamePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!learning && (
        <>
          <footer className="site-footer">
            <VStack gap={1}>
              <Text weight="semibold">System Design Lab</Text>
              <Text type="supporting">Hiểu bằng cách thử. Học từng bước nhỏ.</Text>
              <Text type="supporting">Tiếng Việt · Mobile-first · Local-first</Text>
            </VStack>
          </footer>
          <nav className="mobile-nav" aria-label="Điều hướng điện thoại">
            {navigation.map((n) => (
              <RouterLink
                key={n.to}
                to={n.to}
                aria-current={isCurrent(pathname, n.to) ? 'page' : undefined}
              >
                <Icon name={n.icon} />
                <span>{n.label}</span>
              </RouterLink>
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
      <Theme theme={themes[defaultThemeSlug]} mode="light">
        <ProgressProvider>
          <HashRouter>
            <LinkProvider component={RouteLink}>
              <Shell />
            </LinkProvider>
          </HashRouter>
        </ProgressProvider>
      </Theme>
    </ErrorBoundary>
  );
}
