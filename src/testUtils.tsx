import { render } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';

export const renderWithIntl = (component) => {
  return render(<IntlProvider locale="en" messages={{}}>{ component }</IntlProvider>);
};

export const createQueryMock = (data: any = undefined, isLoading = false) => ({
  data,
  isLoading,
  error: null,
  isError: false,
  isSuccess: !isLoading && data !== undefined,
  status: isLoading ? 'loading' : data ? 'success' : 'idle',
  fetchStatus: isLoading ? 'fetching' : 'idle',
  refetch: jest.fn(),
} as any);

export const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
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
