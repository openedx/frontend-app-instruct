import { render } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';

export const renderWithIntl = (component) => {
  return render(<IntlProvider locale="en" messages={{}}>{ component }</IntlProvider>);
};

export const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </IntlProvider>
    </QueryClientProvider>
  );
};
