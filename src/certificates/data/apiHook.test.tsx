import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIssuedCertificates, useCertificateGenerationHistory, useRegenerateCertificatesMutation, useCertificateConfig } from './apiHook';
import { certificatesQueryKeys } from './queryKeys';
import { getIssuedCertificates, getCertificateGenerationHistory, regenerateCertificates, getCertificateConfig } from './api';
import { ReactNode } from 'react';

jest.mock('./api');

const mockGetIssuedCertificates = getIssuedCertificates as jest.MockedFunction<typeof getIssuedCertificates>;
const mockGetCertificateGenerationHistory = getCertificateGenerationHistory as jest.MockedFunction<typeof getCertificateGenerationHistory>;
const mockRegenerateCertificates = regenerateCertificates as jest.MockedFunction<typeof regenerateCertificates>;
const mockGetCertificateConfig = getCertificateConfig as jest.MockedFunction<typeof getCertificateConfig>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const WrappedComponent = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return WrappedComponent;
};

describe('certificates apiHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useIssuedCertificates', () => {
    it('should fetch issued certificates successfully', async () => {
      const mockData = { results: [], count: 0, next: null, previous: null, numPages: 0 };
      mockGetIssuedCertificates.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useIssuedCertificates('course-123', { page: 0, pageSize: 10 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetIssuedCertificates).toHaveBeenCalledWith('course-123', { page: 0, pageSize: 10 }, undefined, undefined);
      expect(result.current.data).toEqual(mockData);
    });

    it('should fetch with search parameter', async () => {
      const mockData = { results: [], count: 0, next: null, previous: null, numPages: 0 };
      mockGetIssuedCertificates.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useIssuedCertificates('course-123', { page: 0, pageSize: 10 }, 'john'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetIssuedCertificates).toHaveBeenCalledWith('course-123', { page: 0, pageSize: 10 }, 'john', undefined);
    });

    it('should fetch with filter parameter', async () => {
      const mockData = { results: [], count: 0, next: null, previous: null, numPages: 0 };
      mockGetIssuedCertificates.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useIssuedCertificates('course-123', { page: 0, pageSize: 10 }, undefined, 'received'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetIssuedCertificates).toHaveBeenCalledWith('course-123', { page: 0, pageSize: 10 }, undefined, 'received');
    });

    it('should handle fetch error', async () => {
      const apiError = new Error('API Error');
      mockGetIssuedCertificates.mockRejectedValue(apiError);

      const { result } = renderHook(
        () => useIssuedCertificates('course-123', { page: 0, pageSize: 10 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(apiError);
    });

    it('should use correct query key', async () => {
      const mockData = { results: [], count: 0, next: null, previous: null, numPages: 0 };
      mockGetIssuedCertificates.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useIssuedCertificates('course-123', { page: 1, pageSize: 20 }, 'test', 'received'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetIssuedCertificates).toHaveBeenCalledWith('course-123', { page: 1, pageSize: 20 }, 'test', 'received');
    });
  });

  describe('useCertificateGenerationHistory', () => {
    it('should fetch generation history successfully', async () => {
      const mockData = { results: [], count: 0, next: null, previous: null, numPages: 0 };
      mockGetCertificateGenerationHistory.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useCertificateGenerationHistory('course-456', { page: 0, pageSize: 20 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetCertificateGenerationHistory).toHaveBeenCalledWith('course-456', { page: 0, pageSize: 20 });
      expect(result.current.data).toEqual(mockData);
    });

    it('should handle fetch error', async () => {
      const apiError = new Error('History fetch failed');
      mockGetCertificateGenerationHistory.mockRejectedValue(apiError);

      const { result } = renderHook(
        () => useCertificateGenerationHistory('course-456', { page: 0, pageSize: 20 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(apiError);
    });
  });

  describe('useRegenerateCertificatesMutation', () => {
    it('should regenerate certificates successfully', async () => {
      const mockResponse = { success: true };
      mockRegenerateCertificates.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useRegenerateCertificatesMutation(),
        { wrapper: createWrapper() }
      );

      result.current.mutate({
        courseId: 'course-789',
        params: { statuses: ['downloadable'] },
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockRegenerateCertificates).toHaveBeenCalledWith('course-789', { statuses: ['downloadable'] });
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should regenerate with studentSet parameter', async () => {
      const mockResponse = { success: true };
      mockRegenerateCertificates.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useRegenerateCertificatesMutation(),
        { wrapper: createWrapper() }
      );

      result.current.mutate({
        courseId: 'course-789',
        params: { studentSet: 'allowlisted' },
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockRegenerateCertificates).toHaveBeenCalledWith('course-789', { studentSet: 'allowlisted' });
    });

    it('should handle mutation error', async () => {
      mockRegenerateCertificates.mockRejectedValue(new Error('Regeneration failed'));

      const { result } = renderHook(
        () => useRegenerateCertificatesMutation(),
        { wrapper: createWrapper() }
      );

      result.current.mutate({
        courseId: 'course-789',
        params: {},
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(new Error('Regeneration failed'));
    });

    it('should invalidate queries on success', async () => {
      const mockResponse = { success: true };
      mockRegenerateCertificates.mockResolvedValue(mockResponse);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const Wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(
        () => useRegenerateCertificatesMutation(),
        { wrapper: Wrapper }
      );

      result.current.mutate({
        courseId: 'course-789',
        params: {},
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: certificatesQueryKeys.lists() });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: certificatesQueryKeys.all });
    });
  });

  describe('useCertificateConfig', () => {
    it('should fetch certificate config successfully', async () => {
      const mockData = { enabled: true };
      mockGetCertificateConfig.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useCertificateConfig('course-999'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetCertificateConfig).toHaveBeenCalledWith('course-999');
      expect(result.current.data).toEqual(mockData);
    });

    it('should handle disabled certificates', async () => {
      const mockData = { enabled: false };
      mockGetCertificateConfig.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useCertificateConfig('course-999'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({ enabled: false });
    });

    it('should handle fetch error', async () => {
      const apiError = { response: { status: 404 } };
      mockGetCertificateConfig.mockRejectedValue(apiError);

      const { result } = renderHook(
        () => useCertificateConfig('course-999'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(apiError);
    });
  });
});
