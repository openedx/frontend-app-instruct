import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getAttempts } from '@src/specialExams/data/api';
import { useAttempts } from '@src/specialExams/data/apiHook';
import { AttemptsParams } from '@src/specialExams/types';

jest.mock('@src/specialExams/data/api');

const mockGetAttempts = getAttempts as jest.MockedFunction<typeof getAttempts>;

const mockAttemptsData = {
  count: 2,
  numPages: 1,
  results: [
    {
      username: 'student1',
      examName: 'Final Exam',
      timeLimit: 180,
      type: 'proctored',
      startedAt: '2023-01-01T10:00:00Z',
      completedAt: '2023-01-01T13:00:00Z',
      status: 'completed',
    },
    {
      username: 'student2',
      examName: 'Midterm Exam',
      timeLimit: 120,
      type: 'timed',
      startedAt: '2023-01-02T14:00:00Z',
      completedAt: '2023-01-02T16:00:00Z',
      status: 'completed',
    },
  ],
};

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

describe('specialExams api hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAttempts', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const params: AttemptsParams = { page: 1, pageSize: 20, emailOrUsername: '' };

    it('fetches attempts successfully', async () => {
      mockGetAttempts.mockResolvedValue(mockAttemptsData);

      const { result } = renderHook(() => useAttempts(courseId, params), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);
      expect(result.current.data).toBe(mockAttemptsData);
      expect(result.current.error).toBe(null);
    });

    it('handles API error', async () => {
      const mockError = new Error('Network error');
      mockGetAttempts.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAttempts(courseId, params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(undefined);
    });

    it('handles different params parameters', async () => {
      const customParams: AttemptsParams = { page: 3, pageSize: 50, emailOrUsername: 'student1' };
      mockGetAttempts.mockResolvedValue(mockAttemptsData);

      const { result } = renderHook(() => useAttempts(courseId, customParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, customParams);
      expect(result.current.data).toBe(mockAttemptsData);
    });

    it('is disabled when courseId is empty', () => {
      const { result } = renderHook(() => useAttempts('', params), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockGetAttempts).not.toHaveBeenCalled();
    });

    it('is enabled when courseId is provided', async () => {
      mockGetAttempts.mockResolvedValue(mockAttemptsData);

      const { result } = renderHook(() => useAttempts(courseId, params), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);
    });

    it('refetches data when params change', async () => {
      mockGetAttempts.mockResolvedValue(mockAttemptsData);

      const { result, rerender } = renderHook(
        ({ params: hookParams }) => useAttempts(courseId, hookParams),
        {
          wrapper: createWrapper(),
          initialProps: { params },
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledTimes(1);
      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);

      // Change params
      const newParams: AttemptsParams = { page: 2, pageSize: 10, emailOrUsername: 'student2' };
      rerender({ params: newParams });

      await waitFor(() => {
        expect(mockGetAttempts).toHaveBeenCalledTimes(2);
      });

      expect(mockGetAttempts).toHaveBeenLastCalledWith(courseId, newParams);
    });

    it('refetches data when courseId changes', async () => {
      mockGetAttempts.mockResolvedValue(mockAttemptsData);

      const { result, rerender } = renderHook(
        ({ courseId: hookCourseId }) => useAttempts(hookCourseId, params),
        {
          wrapper: createWrapper(),
          initialProps: { courseId },
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledTimes(1);
      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);

      // Change courseId
      const newCourseId = 'course-v1:edX+NewCourse+2023';
      rerender({ courseId: newCourseId });

      await waitFor(() => {
        expect(mockGetAttempts).toHaveBeenCalledTimes(2);
      });

      expect(mockGetAttempts).toHaveBeenLastCalledWith(newCourseId, params);
    });
  });
});
