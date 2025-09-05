import { CurrentAppProvider } from '@openedx/frontend-base';

import { appId } from './constants';

import './main.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

const queryClient = new QueryClient();

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <QueryClientProvider client={queryClient}>
      <main>
        <Outlet />
      </main>
    </QueryClientProvider>
  </CurrentAppProvider>
);

export default Main;
