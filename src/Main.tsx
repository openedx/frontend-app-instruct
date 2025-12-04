import { CurrentAppProvider, getAppConfig } from '@openedx/frontend-base';

import { appId } from './constants';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastManagerProvider } from './providers/ToastManagerProvider';
import './main.scss';

const queryClient = new QueryClient();

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <QueryClientProvider client={queryClient}>
      <ToastManagerProvider>
        <main>
          <Outlet />
          { getAppConfig(appId).NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} /> }
        </main>
      </ToastManagerProvider>
    </QueryClientProvider>
  </CurrentAppProvider>
);

export default Main;
