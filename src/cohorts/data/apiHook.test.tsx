import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '@src/cohorts/data/api';
import {
  useCohortStatus,
  useCohorts,
  useToggleCohorts,
  useCreateCohort,
  useContentGroupsData,
  usePatchCohort,
  useAddLearnersToCohort,
  useAddLearnersToCohortsBulk,
} from './apiHook';
import { CohortData, BasicCohortData } from '../types';

// Mock all API functions
jest.mock('@src/cohorts/data/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('cohorts/data/apiHook', () => {
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
    Wrapper.displayName = 'TestQueryClientProvider';
    return Wrapper;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset any prototype mocks
    jest.restoreAllMocks();
  });

  describe('useCohortStatus', () => {
    it('should fetch cohort status successfully', async () => {
      const mockStatus = { isCohorted: true };
      mockedApi.getCohortStatus.mockResolvedValue(mockStatus);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCohortStatus('test-course-id'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedApi.getCohortStatus).toHaveBeenCalledWith('test-course-id');
      expect(result.current.data).toEqual(mockStatus);
    });

    it('should not fetch when courseId is empty', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useCohortStatus(''), { wrapper });

      expect(mockedApi.getCohortStatus).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useCohorts', () => {
    it('should fetch cohorts successfully', async () => {
      const mockCohorts = [
        {
          id: 1,
          name: 'Test Cohort',
          assignmentType: 'manual',
          groupId: null,
          userPartitionId: null,
          userCount: 5,
        },
      ] as CohortData[];

      mockedApi.getCohorts.mockResolvedValue(mockCohorts);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCohorts('test-course-id'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedApi.getCohorts).toHaveBeenCalledWith('test-course-id');
      expect(result.current.data).toEqual(mockCohorts);
    });

    it('should not fetch when courseId is empty', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useCohorts(''), { wrapper });

      expect(mockedApi.getCohorts).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useContentGroupsData', () => {
    it('should fetch content groups successfully', async () => {
      const mockGroups = [{ id: 1, name: 'Test Group' }];
      mockedApi.getContentGroups.mockResolvedValue(mockGroups);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useContentGroupsData('test-course-id'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedApi.getContentGroups).toHaveBeenCalledWith('test-course-id');
      expect(result.current.data).toEqual(mockGroups);
    });
  });

  describe('useToggleCohorts', () => {
    it('should toggle cohorts and invalidate queries', async () => {
      const mockResponse = { isCohorted: true };
      mockedApi.toggleCohorts.mockResolvedValue(mockResponse);

      const mockInvalidateQueries = jest.fn();
      QueryClient.prototype.invalidateQueries = mockInvalidateQueries;

      const wrapper = createWrapper();
      const { result } = renderHook(() => useToggleCohorts('test-course-id'), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({ isCohorted: true });
      });

      expect(mockedApi.toggleCohorts).toHaveBeenCalledWith('test-course-id', true);
      expect(mockInvalidateQueries).toHaveBeenCalled();
    });
  });

  describe('useCreateCohort', () => {
    it('should create cohort and invalidate queries', async () => {
      const cohortData: BasicCohortData = {
        name: 'New Cohort',
        assignmentType: 'manual',
        groupId: null,
        userPartitionId: null,
      };

      const mockResponse = { ...cohortData, id: 1, userCount: 0 };
      mockedApi.createCohort.mockResolvedValue(mockResponse);

      const mockInvalidateQueries = jest.fn();
      QueryClient.prototype.invalidateQueries = mockInvalidateQueries;

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCreateCohort('test-course-id'), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(cohortData);
      });

      expect(mockedApi.createCohort).toHaveBeenCalledWith('test-course-id', cohortData);
      expect(mockInvalidateQueries).toHaveBeenCalled();
    });
  });

  describe('usePatchCohort', () => {
    it('should patch cohort and invalidate queries', async () => {
      const cohortInfo: CohortData = {
        id: 1,
        name: 'Updated Cohort',
        assignmentType: 'manual',
        groupId: null,
        userPartitionId: null,
        userCount: 10,
      };

      const mockResponse = cohortInfo;
      mockedApi.patchCohort.mockResolvedValue(mockResponse);

      const mockInvalidateQueries = jest.fn();
      QueryClient.prototype.invalidateQueries = mockInvalidateQueries;

      const wrapper = createWrapper();
      const { result } = renderHook(() => usePatchCohort('test-course-id'), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({ cohortId: 1, cohortInfo });
      });

      expect(mockedApi.patchCohort).toHaveBeenCalledWith('test-course-id', 1, cohortInfo);
      expect(mockInvalidateQueries).toHaveBeenCalled();
    });
  });

  describe('useAddLearnersToCohort', () => {
    it('should add learners to cohort and invalidate queries', async () => {
      const users = ['user1', 'user2'];
      const mockResponse = { addedUsers: users };
      mockedApi.addLearnersToCohort.mockResolvedValue(mockResponse);

      const mockInvalidateQueries = jest.fn();
      QueryClient.prototype.invalidateQueries = mockInvalidateQueries;

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAddLearnersToCohort('test-course-id', 1), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(users);
      });

      expect(mockedApi.addLearnersToCohort).toHaveBeenCalledWith('test-course-id', 1, users);
      expect(mockInvalidateQueries).toHaveBeenCalled();
    });
  });

  describe('useAddLearnersToCohortsBulk', () => {
    it('should add learners to cohorts in bulk and invalidate queries', async () => {
      const formData = new FormData();
      formData.append('file', 'test file content');

      const mockResponse = { processedUsers: 5 };
      mockedApi.addLearnersToCohortsBulk.mockResolvedValue(mockResponse);

      const mockInvalidateQueries = jest.fn();
      QueryClient.prototype.invalidateQueries = mockInvalidateQueries;

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAddLearnersToCohortsBulk('test-course-id'), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(formData);
      });

      expect(mockedApi.addLearnersToCohortsBulk).toHaveBeenCalledWith('test-course-id', formData);
      expect(mockInvalidateQueries).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle API errors in query hooks', async () => {
      const error = new Error('API Error');
      mockedApi.getCohortStatus.mockRejectedValue(error);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCohortStatus('test-course-id'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });

    it('should handle API errors in mutation hooks', async () => {
      const error = new Error('Mutation Error');
      mockedApi.toggleCohorts.mockRejectedValue(error);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useToggleCohorts('test-course-id'), { wrapper });

      let caughtError: Error | null = null;

      await act(async () => {
        try {
          await result.current.mutateAsync({ isCohorted: true });
        } catch (e) {
          caughtError = e as Error;
        }
      });

      expect(caughtError).toBe(error);
      expect(mockedApi.toggleCohorts).toHaveBeenCalledWith('test-course-id', true);
    });
  });
});
