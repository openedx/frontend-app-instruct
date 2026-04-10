import { lazy, Suspense } from 'react';
import { CurrentAppProvider } from '@openedx/frontend-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { AlertProvider } from './providers/AlertProvider';
import { appId } from './constants';
import PageWrapper from './pageWrapper/PageWrapper';

import './app.scss';

/*
 * Use a dynamic import guarded by process.env.NODE_ENV so the consumer's
 * webpack dead-code-eliminates this in production builds.  webpackIgnore
 * tells webpack not to resolve the module at build time in dev mode, and
 * the .catch() gracefully handles the case where it is not installed.
 */
const loadDevtools = () => import(/* webpackIgnore: true */ '@tanstack/react-query-devtools')
  .then((m) => ({ default: m.ReactQueryDevtools }))
  .catch(() => ({ default: () => null }));

const ReactQueryDevtools = process.env.NODE_ENV === 'development'
  ? lazy(loadDevtools)
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
          {ReactQueryDevtools && (
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
