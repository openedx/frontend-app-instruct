import { CurrentAppProvider, getAppConfig } from '@openedx/frontend-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AlertProvider } from './providers/AlertProvider';
import { appId } from './constants';
import PageWrapper from './pageWrapper/PageWrapper';

import './app.scss';

const queryClient = new QueryClient();

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        <main className="d-flex flex-column flex-grow-1">
          <PageWrapper>
            <Outlet />
          </PageWrapper>
          { getAppConfig(appId).NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} /> }
        </main>
      </AlertProvider>
    </QueryClientProvider>
  </CurrentAppProvider>
);

export default Main;
