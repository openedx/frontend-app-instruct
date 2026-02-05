import { CurrentAppProvider, getAppConfig } from '@openedx/frontend-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AlertProvider } from './providers/AlertProvider';
import { appId } from './constants';

import './main.scss';

const queryClient = new QueryClient();

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        <main>
          <Outlet />
          { getAppConfig(appId).NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} /> }
        </main>
      </AlertProvider>
    </QueryClientProvider>
  </CurrentAppProvider>
);

export default Main;
