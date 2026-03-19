import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEnrollments, useEnrollmentByUserId } from './apiHook';
import { getEnrollments, getEnrollmentStatus, PaginationParams } from './api';

jest.mock('./api');

const mockGetEnrollments = getEnrollments as jest.MockedFunction<typeof getEnrollments>;
const mockGetEnrollmentStatus = getEnrollmentStatus as jest.MockedFunction<typeof getEnrollmentStatus>;

const mockEnrollmentsData = {
  count: 2,
  enrollments: [
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
    const pagination: PaginationParams = { page: 1, pageSize: 20 };

    it('fetches enrollments successfully', async () => {
      mockGetEnrollments.mockResolvedValue(mockEnrollmentsData);

      const { result } = renderHook(() => useEnrollments(courseId, pagination), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetEnrollments).toHaveBeenCalledWith(courseId, pagination);
      expect(result.current.data).toBe(mockEnrollmentsData);
      expect(result.current.error).toBe(null);
    });

    it('handles API error', async () => {
      const mockError = new Error('Network error');
      mockGetEnrollments.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEnrollments(courseId, pagination), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockGetEnrollments).toHaveBeenCalledWith(courseId, pagination);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(undefined);
    });

    it('handles different pagination parameters', async () => {
      const customPagination: PaginationParams = { page: 3, pageSize: 50 };
      mockGetEnrollments.mockResolvedValue(mockEnrollmentsData);

      const { result } = renderHook(() => useEnrollments(courseId, customPagination), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetEnrollments).toHaveBeenCalledWith(courseId, customPagination);
      expect(result.current.data).toBe(mockEnrollmentsData);
    });

    it('handles empty results', async () => {
      const emptyResults = { count: 0, enrollments: [] };
      mockGetEnrollments.mockResolvedValue(emptyResults);

      const { result } = renderHook(() => useEnrollments(courseId, pagination), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(emptyResults);
      expect(result.current.data?.count).toBe(0);
      expect(result.current.data?.enrollments).toHaveLength(0);
    });

    it('handles HTTP error responses', async () => {
      const httpError = {
        response: {
          status: 404,
          data: { error: 'Course not found' },
        },
      };
      mockGetEnrollments.mockRejectedValue(httpError);

      const { result } = renderHook(() => useEnrollments(courseId, pagination), {
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
});
