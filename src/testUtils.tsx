import { render } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';

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
