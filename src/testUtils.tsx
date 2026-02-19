import { render } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import { AlertProvider } from './providers/AlertProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const renderWithQueryClient = (ui: React.ReactElement) =>
  renderWithIntl(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );

export const renderWithIntl = (component) => {
  return render(<IntlProvider locale="en" messages={{}}>{ component }</IntlProvider>);
};

export const renderWithAlertAndIntl = (component) => {
  return render(
    <AlertProvider>
      <IntlProvider locale="en" messages={{}}>
        {component}
      </IntlProvider>
    </AlertProvider>
  );
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
