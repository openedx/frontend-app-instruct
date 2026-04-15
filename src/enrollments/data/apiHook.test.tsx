import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getEnrollments, getEnrollmentStatus, updateBetaTesters, updateEnrollments } from '@src/enrollments/data/api';
import { useEnrollments, useEnrollmentByUserId, useUpdateEnrollments, useUpdateBetaTesters } from '@src/enrollments/data/apiHook';
import { EnrollmentsParams } from '@src/enrollments/types';

jest.mock('@src/enrollments/data/api');

const mockGetEnrollments = getEnrollments as jest.MockedFunction<typeof getEnrollments>;
const mockGetEnrollmentStatus = getEnrollmentStatus as jest.MockedFunction<typeof getEnrollmentStatus>;
const mockPostUpdateEnrollments = updateEnrollments as jest.MockedFunction<typeof updateEnrollments>;
const mockPostUpdateBetaTesters = updateBetaTesters as jest.MockedFunction<typeof updateBetaTesters>;

const mockEnrollmentsData = {
  count: 2,
  numPages: 1,
  results: [
    {
      username: 'student1',
      fullName: 'Student One',
      email: 'student1@example.com',
      mode: 'verified',
      isBetaTester: false,
    },
    {
      username: 'student2',
      fullName: 'Student Two',
      email: 'student2@example.com',
      mode: 'audit',
      isBetaTester: true,
    },
  ],
};

const mockEnrollmentStatusData = {
  enrollmentStatus: 'enrolled',
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

describe('enrollments api hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useEnrollments', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const params: EnrollmentsParams = { page: 1, pageSize: 20, emailOrUsername: '', isBetaTester: '' };

    it('fetches enrollments successfully', async () => {
      mockGetEnrollments.mockResolvedValue(mockEnrollmentsData);

      const { result } = renderHook(() => useEnrollments(courseId, params), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetEnrollments).toHaveBeenCalledWith(courseId, params);
      expect(result.current.data).toBe(mockEnrollmentsData);
      expect(result.current.error).toBe(null);
    });

    it('handles API error', async () => {
      const mockError = new Error('Network error');
      mockGetEnrollments.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEnrollments(courseId, params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockGetEnrollments).toHaveBeenCalledWith(courseId, params);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(undefined);
    });

    it('handles different params parameters', async () => {
      const customParams: EnrollmentsParams = { page: 3, pageSize: 50, emailOrUsername: 'student', isBetaTester: '' };
      mockGetEnrollments.mockResolvedValue(mockEnrollmentsData);

      const { result } = renderHook(() => useEnrollments(courseId, customParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetEnrollments).toHaveBeenCalledWith(courseId, customParams);
      expect(result.current.data).toBe(mockEnrollmentsData);
    });

    it('handles empty results', async () => {
      const emptyResults = { count: 0, results: [], numPages: 0 };
      mockGetEnrollments.mockResolvedValue(emptyResults);

      const { result } = renderHook(() => useEnrollments(courseId, params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(emptyResults);
      expect(result.current.data?.count).toBe(0);
      expect(result.current.data?.results).toHaveLength(0);
      expect(result.current.data?.numPages).toBe(0);
    });

    it('handles HTTP error responses', async () => {
      const httpError = {
        response: {
          status: 404,
          data: { error: 'Course not found' },
        },
      };
      mockGetEnrollments.mockRejectedValue(httpError);

      const { result } = renderHook(() => useEnrollments(courseId, params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(httpError);
    });
  });

  describe('useEnrollmentByUserId', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const userIdentifier = 'student@example.com';

    it('fetches enrollment status successfully when enabled', async () => {
      mockGetEnrollmentStatus.mockResolvedValue(mockEnrollmentStatusData);

      const { result } = renderHook(() => useEnrollmentByUserId(courseId, userIdentifier), {
        wrapper: createWrapper(),
      });

      // Initially should not fetch because enabled is false
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe(undefined);

      // Manually trigger the query
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetEnrollmentStatus).toHaveBeenCalledWith(courseId, userIdentifier);
      expect(result.current.data).toBe(mockEnrollmentStatusData);
      expect(result.current.error).toBe(null);
    });

    it('is disabled by default', async () => {
      mockGetEnrollmentStatus.mockResolvedValue(mockEnrollmentStatusData);

      const { result } = renderHook(() => useEnrollmentByUserId(courseId, userIdentifier), {
        wrapper: createWrapper(),
      });

      // Should not automatically fetch
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe(undefined);
      expect(result.current.isFetched).toBe(false);

      // API should not have been called
      expect(mockGetEnrollmentStatus).not.toHaveBeenCalled();
    });

    it('handles API error when manually triggered', async () => {
      const mockError = new Error('User not found');
      mockGetEnrollmentStatus.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEnrollmentByUserId(courseId, userIdentifier), {
        wrapper: createWrapper(),
      });

      // Manually trigger the query
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockGetEnrollmentStatus).toHaveBeenCalledWith(courseId, userIdentifier);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(undefined);
    });

    it('uses correct query key', async () => {
      mockGetEnrollmentStatus.mockResolvedValue(mockEnrollmentStatusData);

      const { result } = renderHook(() => useEnrollmentByUserId(courseId, userIdentifier), {
        wrapper: createWrapper(),
      });

      // Manually trigger the query
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify the query was called with correct parameters
      expect(mockGetEnrollmentStatus).toHaveBeenCalledWith(courseId, userIdentifier);
      expect(result.current.data).toBe(mockEnrollmentStatusData);
    });

    it('handles different user identifiers', async () => {
      const username = 'student123';
      mockGetEnrollmentStatus.mockResolvedValue(mockEnrollmentStatusData);

      const { result } = renderHook(() => useEnrollmentByUserId(courseId, username), {
        wrapper: createWrapper(),
      });

      // Manually trigger the query
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetEnrollmentStatus).toHaveBeenCalledWith(courseId, username);
      expect(result.current.data).toBe(mockEnrollmentStatusData);
    });

    it('handles different enrollment statuses', async () => {
      const statuses = ['enrolled', 'unenrolled', 'pending'];

      for (const status of statuses) {
        const statusData = { enrollmentStatus: status };
        mockGetEnrollmentStatus.mockResolvedValue(statusData);

        const { result } = renderHook(() => useEnrollmentByUserId(courseId, userIdentifier), {
          wrapper: createWrapper(),
        });

        // Manually trigger the query
        result.current.refetch();

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data?.enrollmentStatus).toBe(status);

        // Clear mock for next iteration
        jest.clearAllMocks();
      }
    });

    it('handles HTTP error responses', async () => {
      const httpError = {
        response: {
          status: 404,
          data: { error: 'User not found in course' },
        },
      };
      mockGetEnrollmentStatus.mockRejectedValue(httpError);

      const { result } = renderHook(() => useEnrollmentByUserId(courseId, userIdentifier), {
        wrapper: createWrapper(),
      });

      // Manually trigger the query
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(httpError);
    });
  });

  describe('useUpdateEnrollments', () => {
    const courseId = 'course-v1:edX+Test+2023';

    it('calls updateEnrollments and succeeds', async () => {
      mockPostUpdateEnrollments.mockResolvedValue({ results: [{ identifier: 'student1', invalidIdentifier: false }] });

      const { result } = renderHook(() => useUpdateEnrollments(courseId), {
        wrapper: createWrapper(),
      });

      const params = { identifier: ['student1'], action: 'enroll' as const };
      result.current.mutate(params);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockPostUpdateEnrollments).toHaveBeenCalledWith(courseId, params);
    });

    it('handles mutation error', async () => {
      const error = new Error('Failed to update');
      mockPostUpdateEnrollments.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateEnrollments(courseId), {
        wrapper: createWrapper(),
      });

      const params = { identifier: ['student2'], action: 'unenroll' as const };
      result.current.mutate(params);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      expect(mockPostUpdateEnrollments).toHaveBeenCalledWith(courseId, params);
      expect(result.current.error).toBe(error);
    });
  });

  describe('useUpdateBetaTesters', () => {
    const courseId = 'course-v1:edX+Test+2023';

    it('calls updateEnrollments and succeeds', async () => {
      mockPostUpdateBetaTesters.mockResolvedValue({ results: [{ identifier: 'student1', userDoesNotExist: false }] });

      const { result } = renderHook(() => useUpdateBetaTesters(courseId), {
        wrapper: createWrapper(),
      });

      const params = { identifier: ['student1'], action: 'add' as const };
      result.current.mutate(params);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockPostUpdateBetaTesters).toHaveBeenCalledWith(courseId, params);
    });

    it('handles mutation error', async () => {
      const error = new Error('Failed to update');
      mockPostUpdateBetaTesters.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateBetaTesters(courseId), {
        wrapper: createWrapper(),
      });

      const params = { identifier: ['student2'], action: 'add' as const };
      result.current.mutate(params);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      expect(mockPostUpdateBetaTesters).toHaveBeenCalledWith(courseId, params);
      expect(result.current.error).toBe(error);
    });
  });
});
