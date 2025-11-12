import { CurrentAppProvider, getAppConfig } from '@openedx/frontend-base';

import { appId } from './constants';

import './main.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <QueryClientProvider client={queryClient}>
      <main>
        <Outlet />
        { getAppConfig(appId).NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} /> }
      </main>
    </QueryClientProvider>
  </CurrentAppProvider>
);

export default Main;
