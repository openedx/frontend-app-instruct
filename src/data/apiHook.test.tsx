import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCourseInfo } from './apiHook';
import { getCourseInfo } from './api';

jest.mock('./api');

const mockGetCourseInfo = getCourseInfo as jest.MockedFunction<typeof getCourseInfo>;

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

describe('useCourseInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches course info successfully', async () => {
    const mockCourseData = { courseName: 'Test Course' };
    mockGetCourseInfo.mockResolvedValue(mockCourseData);

    const { result } = renderHook(() => useCourseInfo('test-course-123'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetCourseInfo).toHaveBeenCalledWith('test-course-123');
    expect(result.current.data).toBe(mockCourseData);
    expect(result.current.error).toBe(null);
  });

  it('handles API error', async () => {
    const mockError = new Error('API Error');
    mockGetCourseInfo.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCourseInfo('test-course-456'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockGetCourseInfo).toHaveBeenCalledWith('test-course-456');
    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBe(undefined);
  });
});
