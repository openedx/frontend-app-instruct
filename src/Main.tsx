import { CurrentAppProvider } from '@openedx/frontend-base';
import { Outlet } from 'react-router-dom';
import { AlertProvider } from './providers/AlertProvider';
import { appId } from './constants';
import PageWrapper from './pageWrapper/PageWrapper';

import './style.scss';

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <AlertProvider>
      <main className="d-flex flex-column flex-grow-1">
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </main>
    </AlertProvider>
  </CurrentAppProvider>
);

export default Main;
