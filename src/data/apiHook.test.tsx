import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCourseInfo, usePendingTasks, useLearner } from './apiHook';
import { fetchPendingTasks, getCourseInfo, getLearner } from './api';

jest.mock('./api');

const mockGetCourseInfo = getCourseInfo as jest.MockedFunction<typeof getCourseInfo>;
const mockFetchPendingTasks = fetchPendingTasks as jest.MockedFunction<typeof fetchPendingTasks>;
const mockGetLearner = getLearner as jest.MockedFunction<typeof getLearner>;

const mockCourseData = {
  courseId: 'test-course-123',
  displayName: 'Test Course',
  courseNumber: '123',
  courseRun: '2024',
  enrollmentCounts: { total: 100, audit: 50 },
  start: null,
  end: null,
  tabs: [],
  totalEnrollment: 150,
  studioUrl: 'http://studio.example.com',
  pacing: 'self-paced',
  org: 'Test Org',
  numSections: 10,
  hasStarted: true,
  hasEnded: false,
  enrollmentEnd: null,
  enrollmentStart: null,
  gradeCutoffs: null,
  staffCount: 5,
  learnerCount: 145,
  permissions: {
    admin: true,
    dataResearcher: false,
  },
  gradebookUrl: 'http://example.com/gradebook',
  adminConsoleUrl: 'http://example.com/admin-console',
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
describe('api hooks', () => {
  describe('useCourseInfo', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('fetches course info successfully', async () => {
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

  describe('usePendingTasks', () => {
    it('should successfully fetch pending tasks when mutate is called', async () => {
      const mockTasks = [
        { taskType: 'grade_course', taskId: '12345', taskState: 'SUCCESS' },
      ];
      const mockCourseId = 'course-v1:Example+Course+2025';

      mockFetchPendingTasks.mockResolvedValue(mockTasks);

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => usePendingTasks(mockCourseId), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetchPendingTasks).toHaveBeenCalledWith('course-v1:Example+Course+2025');
      expect(result.current.data).toEqual(mockTasks);
    });
  });

  describe('useLearner', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('fetches learner info successfully', async () => {
      const mockLearner = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        progressUrl: '/progress/testuser',
        isEnrolled: true,
      };
      mockGetLearner.mockResolvedValue(mockLearner);

      const { result } = renderHook(() => useLearner('course-123', 'testuser'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetLearner).toHaveBeenCalledWith('course-123', 'testuser');
      expect(result.current.data).toEqual(mockLearner);
      expect(result.current.error).toBe(null);
    });

    it('handles API error', async () => {
      const mockError = new Error('API Error');
      mockGetLearner.mockRejectedValue(mockError);

      const { result } = renderHook(() => useLearner('course-456', 'failuser'), {
        wrapper: createWrapper(),
      });

      const refetchResult = await result.current.refetch();

      expect(mockGetLearner).toHaveBeenCalledWith('course-456', 'failuser');
      expect(refetchResult.error).toBe(mockError);
      expect(result.current.data).toBe(undefined);
    });
  });
});
