import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGeneratedReports, useGenerateReportLink, queryKeys } from './apiHook';
import { generateReportLink, getGeneratedReports } from './api';
import { ReactNode } from 'react';

jest.mock('./api');

const mockGetGeneratedReports = getGeneratedReports as jest.MockedFunction<typeof getGeneratedReports>;
const mockGenerateReportLink = generateReportLink as jest.MockedFunction<typeof generateReportLink>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const WrapedComponent = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return WrapedComponent;
};

describe('dataDownloads apiHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('queryKeys', () => {
    it('should generate correct query keys', () => {
      expect(queryKeys.generatedReports('course-123')).toEqual(['generated-reports', 'course-123']);
      expect(queryKeys.generateReportLink('course-456')).toEqual(['report-link', 'course-456']);
    });
  });

  describe('useGeneratedReports', () => {
    it('should fetch generated reports successfully', async () => {
      const mockData = { reports: ['report1', 'report2'] };
      mockGetGeneratedReports.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useGeneratedReports('course-123'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetGeneratedReports).toHaveBeenCalledWith('course-123');
      expect(result.current.data).toEqual(mockData);
    });

    it('should handle fetch error', async () => {
      const apiError = new Error('API Error');
      mockGetGeneratedReports.mockRejectedValue(apiError);

      const { result } = renderHook(
        () => useGeneratedReports('course-123'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      }, { timeout: 10000 });

      expect(result.current.error).toEqual(apiError);
    }, 15000);
  });

  describe('useGenerateReportLink', () => {
    it('should generate report link successfully', async () => {
      const mockResponse = { downloadUrl: 'http://example.com/report' };
      mockGenerateReportLink.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useGenerateReportLink('course-123'),
        { wrapper: createWrapper() }
      );

      result.current.mutate({ reportType: 'report-type-a' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGenerateReportLink).toHaveBeenCalledWith('course-123', 'report-type-a', undefined);
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should generate report link with problem location', async () => {
      const mockResponse = { downloadUrl: 'http://example.com/report' };
      mockGenerateReportLink.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useGenerateReportLink('course-123'),
        { wrapper: createWrapper() }
      );

      result.current.mutate({ reportType: 'problem_responses', problemLocation: 'block-v1:test+course+run' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGenerateReportLink).toHaveBeenCalledWith('course-123', 'problem_responses', 'block-v1:test+course+run');
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle mutation error', async () => {
      mockGenerateReportLink.mockRejectedValue(new Error('Generation failed'));

      const { result } = renderHook(
        () => useGenerateReportLink('course-123'),
        { wrapper: createWrapper() }
      );

      result.current.mutate({ reportType: 'report-type-a' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(new Error('Generation failed'));
    });
  });
});
