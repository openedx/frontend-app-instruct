import { render } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastManagerProvider } from './providers/ToastManagerProvider';

export const renderWithIntl = (component) => {
  return render(<IntlProvider locale="en" messages={{}}>{ component }</IntlProvider>);
};

export const renderWithProviders = (component: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <ToastManagerProvider>
          <MemoryRouter>
            {component}
          </MemoryRouter>
        </ToastManagerProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
};
