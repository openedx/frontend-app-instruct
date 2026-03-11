import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useIssuedCertificates,
  useInstructorTasks,
  useGrantBulkExceptions,
  useInvalidateCertificate,
  useRemoveException,
  useRemoveInvalidation,
  useToggleCertificateGeneration,
} from '../../data/apiHook';
import {
  getIssuedCertificates,
  getInstructorTasks,
  grantBulkExceptions,
  invalidateCertificate,
  removeException,
  removeInvalidation,
  toggleCertificateGeneration,
} from '../../data/api';
import { CertificateFilter, CertificateStatus, SpecialCase } from '../../types';

jest.mock('../../data/api');

const mockGetIssuedCertificates = getIssuedCertificates as jest.MockedFunction<typeof getIssuedCertificates>;
const mockGetInstructorTasks = getInstructorTasks as jest.MockedFunction<typeof getInstructorTasks>;
const mockGrantBulkExceptions = grantBulkExceptions as jest.MockedFunction<typeof grantBulkExceptions>;
const mockInvalidateCertificate = invalidateCertificate as jest.MockedFunction<typeof invalidateCertificate>;
const mockRemoveException = removeException as jest.MockedFunction<typeof removeException>;
const mockRemoveInvalidation = removeInvalidation as jest.MockedFunction<typeof removeInvalidation>;
const mockToggleCertificateGeneration = toggleCertificateGeneration as jest.MockedFunction<typeof toggleCertificateGeneration>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  }

  return Wrapper;
};

describe('certificates api hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useIssuedCertificates', () => {
    it('fetches issued certificates successfully', async () => {
      const mockData = {
        count: 2,
        results: [
          {
            username: 'user1',
            email: 'user1@example.com',
            enrollmentTrack: 'verified',
            certificateStatus: CertificateStatus.RECEIVED,
            specialCase: SpecialCase.NONE,
          },
        ],
        numPages: 1,
        next: null,
        previous: null,
      };

      mockGetIssuedCertificates.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useIssuedCertificates('course-v1:Test+Course+2024', {
          page: 0,
          pageSize: 25,
          filter: CertificateFilter.ALL_LEARNERS,
          search: '',
        }),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetIssuedCertificates).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        page: 0,
        pageSize: 25,
        filter: CertificateFilter.ALL_LEARNERS,
        search: '',
      });
      expect(result.current.data).toEqual(mockData);
    });

    it('handles API error', async () => {
      const mockError = new Error('API Error');
      mockGetIssuedCertificates.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useIssuedCertificates('course-v1:Test+Course+2024', {
          page: 0,
          pageSize: 25,
          filter: CertificateFilter.ALL_LEARNERS,
          search: '',
        }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });

    it('does not fetch when courseId is empty', () => {
      renderHook(
        () => useIssuedCertificates('', {
          page: 0,
          pageSize: 25,
          filter: CertificateFilter.ALL_LEARNERS,
          search: '',
        }),
        { wrapper: createWrapper() }
      );

      expect(mockGetIssuedCertificates).not.toHaveBeenCalled();
    });
  });

  describe('useInstructorTasks', () => {
    it('fetches instructor tasks successfully', async () => {
      const mockData = {
        count: 1,
        results: [
          {
            taskId: 'task1',
            taskName: 'Generate Certificates',
            taskState: 'SUCCESS',
            created: '2024-01-15T10:00:00Z',
            updated: '2024-01-15T10:05:00Z',
            taskOutput: 'Success',
          },
        ],
        numPages: 1,
        next: null,
        previous: null,
      };

      mockGetInstructorTasks.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useInstructorTasks('course-v1:Test+Course+2024', { page: 0, pageSize: 25 }),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetInstructorTasks).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        page: 0,
        pageSize: 25,
      });
      expect(result.current.data).toEqual(mockData);
    });

    it('handles API error', async () => {
      const mockError = new Error('Task fetch error');
      mockGetInstructorTasks.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useInstructorTasks('course-v1:Test+Course+2024', { page: 0, pageSize: 25 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('useGrantBulkExceptions', () => {
    it('grants bulk exceptions successfully', async () => {
      mockGrantBulkExceptions.mockResolvedValue(undefined);

      const { result } = renderHook(() => useGrantBulkExceptions('course-v1:Test+Course+2024'), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ learners: 'user1, user2', notes: 'Exception granted' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGrantBulkExceptions).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        learners: 'user1, user2',
        notes: 'Exception granted',
      });
    });

    it('handles error when granting exceptions', async () => {
      const mockError = new Error('Failed to grant exceptions');
      mockGrantBulkExceptions.mockRejectedValue(mockError);

      const { result } = renderHook(() => useGrantBulkExceptions('course-v1:Test+Course+2024'), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ learners: 'user1', notes: 'Test' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('useInvalidateCertificate', () => {
    it('invalidates certificate successfully', async () => {
      mockInvalidateCertificate.mockResolvedValue(undefined);

      const { result } = renderHook(() => useInvalidateCertificate('course-v1:Test+Course+2024'), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ learners: 'user1', notes: 'Certificate invalid' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockInvalidateCertificate).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        learners: 'user1',
        notes: 'Certificate invalid',
      });
    });

    it('handles error when invalidating certificate', async () => {
      const mockError = new Error('Failed to invalidate');
      mockInvalidateCertificate.mockRejectedValue(mockError);

      const { result } = renderHook(() => useInvalidateCertificate('course-v1:Test+Course+2024'), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ learners: 'user1', notes: '' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useRemoveException', () => {
    it('removes exception successfully', async () => {
      mockRemoveException.mockResolvedValue(undefined);

      const { result } = renderHook(() => useRemoveException('course-v1:Test+Course+2024'), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ username: 'user1' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockRemoveException).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        username: 'user1',
      });
    });

    it('handles error when removing exception', async () => {
      const mockError = new Error('Failed to remove exception');
      mockRemoveException.mockRejectedValue(mockError);

      const { result } = renderHook(() => useRemoveException('course-v1:Test+Course+2024'), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ username: 'user1' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useRemoveInvalidation', () => {
    it('removes invalidation successfully', async () => {
      mockRemoveInvalidation.mockResolvedValue(undefined);

      const { result } = renderHook(() => useRemoveInvalidation('course-v1:Test+Course+2024'), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ username: 'user1' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockRemoveInvalidation).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        username: 'user1',
      });
    });

    it('handles error when removing invalidation', async () => {
      const mockError = new Error('Failed to remove invalidation');
      mockRemoveInvalidation.mockRejectedValue(mockError);

      const { result } = renderHook(() => useRemoveInvalidation('course-v1:Test+Course+2024'), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ username: 'user1' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useToggleCertificateGeneration', () => {
    it('enables certificate generation successfully', async () => {
      mockToggleCertificateGeneration.mockResolvedValue(undefined);

      const { result } = renderHook(
        () => useToggleCertificateGeneration('course-v1:Test+Course+2024'),
        { wrapper: createWrapper() }
      );

      result.current.mutate(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockToggleCertificateGeneration).toHaveBeenCalledWith('course-v1:Test+Course+2024', true);
    });

    it('disables certificate generation successfully', async () => {
      mockToggleCertificateGeneration.mockResolvedValue(undefined);

      const { result } = renderHook(
        () => useToggleCertificateGeneration('course-v1:Test+Course+2024'),
        { wrapper: createWrapper() }
      );

      result.current.mutate(false);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockToggleCertificateGeneration).toHaveBeenCalledWith('course-v1:Test+Course+2024', false);
    });

    it('handles error when toggling certificate generation', async () => {
      const mockError = new Error('Failed to toggle');
      mockToggleCertificateGeneration.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useToggleCertificateGeneration('course-v1:Test+Course+2024'),
        { wrapper: createWrapper() }
      );

      result.current.mutate(true);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });
});
