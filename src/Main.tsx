import { lazy, Suspense } from 'react';
import { CurrentAppProvider, getAppConfig } from '@openedx/frontend-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { AlertProvider } from './providers/AlertProvider';
import { appId } from './constants';
import PageWrapper from './pageWrapper/PageWrapper';

import './app.scss';

// Use a dynamic import guarded by process.env.NODE_ENV so the consumer's
// webpack dead-code-eliminates this in production builds, meaning
// @tanstack/react-query-devtools does not need to be installed by consumers.
const ReactQueryDevtools = process.env.NODE_ENV === 'development'
  ? lazy(() => import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })))
  : null;

const queryClient = new QueryClient();

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        <main className="d-flex flex-column flex-grow-1">
          <PageWrapper>
            <Outlet />
          </PageWrapper>
          {ReactQueryDevtools && getAppConfig(appId).NODE_ENV === 'development' && (
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
          )}
        </main>
      </AlertProvider>
    </QueryClientProvider>
  </CurrentAppProvider>
);

export default Main;
