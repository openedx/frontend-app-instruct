import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '@src/grading/data/api';
import { useGradingConfiguration } from '@src/grading/data/apiHook';

const createWrapper = () => {
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

describe('useGradingConfiguration', () => {
  const wrapper = createWrapper();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns data when getGradingConfiguration resolves', async () => {
    const mockData = { gradingPolicy: 'test_policy' };
    jest.spyOn(api, 'getGradingConfiguration').mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useGradingConfiguration('course-v1:abc123'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('returns error when getGradingConfiguration rejects', async () => {
    jest.spyOn(api, 'getGradingConfiguration').mockRejectedValueOnce(new Error('Network error'));
    const { result } = renderHook(() => useGradingConfiguration('course-v1:abc123'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result?.current?.error?.message).toBe('Network error');
  });

  it('does not run query if courseId is falsy', () => {
    const spy = jest.spyOn(api, 'getGradingConfiguration');
    renderHook(() => useGradingConfiguration(''), { wrapper });
    expect(spy).not.toHaveBeenCalled();
  });
});
