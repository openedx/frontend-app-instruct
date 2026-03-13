import { getIssuedCertificates, getCertificateGenerationHistory, regenerateCertificates, getCertificateConfig } from './api';
import { camelCaseObject, getAuthenticatedHttpClient, snakeCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';

jest.mock('@openedx/frontend-base');
jest.mock('@src/data/api');

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockGetApiBaseUrl = getApiBaseUrl as jest.MockedFunction<typeof getApiBaseUrl>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;
const mockSnakeCaseObject = snakeCaseObject as jest.MockedFunction<typeof snakeCaseObject>;

describe('certificates api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthenticatedHttpClient.mockReturnValue({
      get: mockGet,
      post: mockPost,
    } as any);
    mockGetApiBaseUrl.mockReturnValue('http://localhost:8000');
    mockCamelCaseObject.mockImplementation((data) => data);
    mockSnakeCaseObject.mockImplementation((data) => data);
  });

  describe('getIssuedCertificates', () => {
    it('should fetch issued certificates with pagination', async () => {
      const mockData = { results: [], count: 0 };
      mockGet.mockResolvedValue({ data: mockData });

      const result = await getIssuedCertificates('course-123', { page: 0, pageSize: 10 });

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-123/certificates/issued?page=1&page_size=10'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockData);
    });

    it('should include search parameter when provided', async () => {
      const mockData = { results: [], count: 0 };
      mockGet.mockResolvedValue({ data: mockData });

      await getIssuedCertificates('course-123', { page: 0, pageSize: 10 }, 'john');

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-123/certificates/issued?page=1&page_size=10&search=john'
      );
    });

    it('should include filter parameter when provided and not "all"', async () => {
      const mockData = { results: [], count: 0 };
      mockGet.mockResolvedValue({ data: mockData });

      await getIssuedCertificates('course-123', { page: 0, pageSize: 10 }, undefined, 'received');

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-123/certificates/issued?page=1&page_size=10&filter=received'
      );
    });

    it('should not include filter parameter when filter is "all"', async () => {
      const mockData = { results: [], count: 0 };
      mockGet.mockResolvedValue({ data: mockData });

      await getIssuedCertificates('course-123', { page: 0, pageSize: 10 }, undefined, 'all');

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-123/certificates/issued?page=1&page_size=10'
      );
    });

    it('should include both search and filter parameters', async () => {
      const mockData = { results: [], count: 0 };
      mockGet.mockResolvedValue({ data: mockData });

      await getIssuedCertificates('course-123', { page: 0, pageSize: 10 }, 'john', 'received');

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-123/certificates/issued?page=1&page_size=10&search=john&filter=received'
      );
    });

    it('should convert page index to 1-based for API', async () => {
      const mockData = { results: [], count: 0 };
      mockGet.mockResolvedValue({ data: mockData });

      await getIssuedCertificates('course-123', { page: 2, pageSize: 20 });

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-123/certificates/issued?page=3&page_size=20'
      );
    });
  });

  describe('getCertificateGenerationHistory', () => {
    it('should fetch certificate generation history with pagination', async () => {
      const mockData = { results: [], count: 0 };
      mockGet.mockResolvedValue({ data: mockData });

      const result = await getCertificateGenerationHistory('course-456', { page: 0, pageSize: 20 });

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-456/certificates/generation_history?page=1&page_size=20'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockData);
    });

    it('should convert page index to 1-based for API', async () => {
      const mockData = { results: [], count: 0 };
      mockGet.mockResolvedValue({ data: mockData });

      await getCertificateGenerationHistory('course-456', { page: 3, pageSize: 20 });

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-456/certificates/generation_history?page=4&page_size=20'
      );
    });
  });

  describe('regenerateCertificates', () => {
    it('should post regenerate request with snake_case params', async () => {
      const mockData = { success: true };
      mockPost.mockResolvedValue({ data: mockData });
      mockSnakeCaseObject.mockReturnValue({ statuses: ['downloadable'] });

      const params = { statuses: ['downloadable'] };
      const result = await regenerateCertificates('course-789', params);

      expect(mockSnakeCaseObject).toHaveBeenCalledWith(params);
      expect(mockPost).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-789/certificates/regenerate',
        { statuses: ['downloadable'] }
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockData);
    });

    it('should handle studentSet parameter', async () => {
      const mockData = { success: true };
      mockPost.mockResolvedValue({ data: mockData });
      mockSnakeCaseObject.mockReturnValue({ student_set: 'allowlisted' });

      const params = { studentSet: 'allowlisted' as const };
      await regenerateCertificates('course-789', params);

      expect(mockSnakeCaseObject).toHaveBeenCalledWith(params);
      expect(mockPost).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-789/certificates/regenerate',
        { student_set: 'allowlisted' }
      );
    });

    it('should handle empty params', async () => {
      const mockData = { success: true };
      mockPost.mockResolvedValue({ data: mockData });
      mockSnakeCaseObject.mockReturnValue({});

      await regenerateCertificates('course-789', {});

      expect(mockSnakeCaseObject).toHaveBeenCalledWith({});
      expect(mockPost).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-789/certificates/regenerate',
        {}
      );
    });
  });

  describe('getCertificateConfig', () => {
    it('should fetch certificate config', async () => {
      const mockData = { enabled: true };
      mockGet.mockResolvedValue({ data: mockData });

      const result = await getCertificateConfig('course-999');

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:8000/api/instructor/v2/courses/course-999/certificates/config'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockData);
    });

    it('should handle disabled certificates', async () => {
      const mockData = { enabled: false };
      mockGet.mockResolvedValue({ data: mockData });

      const result = await getCertificateConfig('course-999');

      expect(result).toEqual({ enabled: false });
    });
  });
});
