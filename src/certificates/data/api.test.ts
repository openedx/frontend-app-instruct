import { getAuthenticatedHttpClient, camelCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import {
  getIssuedCertificates,
  getInstructorTasks,
  grantBulkExceptions,
  invalidateCertificate,
  removeException,
  removeInvalidation,
  toggleCertificateGeneration,
} from './api';
import type { CertificateFilter } from '../types';

jest.mock('@openedx/frontend-base');
jest.mock('@src/data/api');

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockDelete = jest.fn();
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;

(getAuthenticatedHttpClient as jest.Mock).mockReturnValue({
  get: mockGet,
  post: mockPost,
  delete: mockDelete,
});

(getApiBaseUrl as jest.Mock).mockReturnValue('http://localhost:18000');

describe('Certificate API', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock camelCaseObject to transform snake_case to camelCase
    mockCamelCaseObject.mockImplementation((data: any) => {
      if (!data) return data;
      if (Array.isArray(data)) {
        return data.map(item => mockCamelCaseObject(item));
      }
      if (typeof data === 'object') {
        const result: any = {};
        Object.keys(data).forEach(key => {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          result[camelKey] = mockCamelCaseObject(data[key]);
        });
        return result;
      }
      return data;
    });
  });

  describe('getIssuedCertificates', () => {
    it('fetches issued certificates with pagination and filters', async () => {
      const mockData = {
        count: 2,
        num_pages: 1,
        next: null,
        previous: null,
        results: [
          {
            username: 'user1',
            email: 'user1@example.com',
            enrollment_track: 'verified',
            certificate_status: 'downloadable',
            special_case: '',
          },
        ],
      };

      mockGet.mockResolvedValue({ data: mockData });

      const result = await getIssuedCertificates('course-v1:edX+Test+2024', {
        page: 0,
        pageSize: 25,
        filter: 'all' as CertificateFilter,
        search: 'user',
      });

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:18000/api/instructor/v2/courses/course-v1:edX+Test+2024/certificates/issued',
        {
          params: {
            page: 1,
            page_size: 25,
            filter: 'all',
            search: 'user',
          },
        }
      );

      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('numPages');
      expect(result).toHaveProperty('results');
    });

    it('handles API errors gracefully', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(
        getIssuedCertificates('course-v1:edX+Test+2024', {
          page: 0,
          pageSize: 25,
          filter: 'all' as CertificateFilter,
          search: '',
        })
      ).rejects.toThrow('Network error');
    });
  });

  describe('getInstructorTasks', () => {
    it('fetches instructor tasks with pagination', async () => {
      const mockData = {
        count: 5,
        num_pages: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            task_type: 'certificate_generation',
            status: 'SUCCESS',
            created: '2024-04-16T10:00:00Z',
            updated: '2024-04-16T10:05:00Z',
            task_output: 'Generated 100 certificates',
          },
        ],
      };

      mockGet.mockResolvedValue({ data: mockData });

      const result = await getInstructorTasks('course-v1:edX+Test+2024', {
        page: 0,
        pageSize: 25,
      });

      expect(mockGet).toHaveBeenCalledWith(
        'http://localhost:18000/api/instructor/v2/courses/course-v1:edX+Test+2024/instructor_tasks',
        {
          params: {
            page: 1,
            page_size: 25,
          },
        }
      );

      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('results');
    });

    it('handles API errors for instructor tasks', async () => {
      mockGet.mockRejectedValue(new Error('API error'));

      await expect(
        getInstructorTasks('course-v1:edX+Test+2024', {
          page: 0,
          pageSize: 25,
        })
      ).rejects.toThrow('API error');
    });
  });

  describe('grantBulkExceptions', () => {
    it('grants bulk certificate exceptions', async () => {
      mockPost.mockResolvedValue({ data: { success: ['user1', 'user2'], errors: [] } });

      await grantBulkExceptions('course-v1:edX+Test+2024', {
        learners: 'user1, user2',
        notes: 'Test exception',
      });

      expect(mockPost).toHaveBeenCalledWith(
        'http://localhost:18000/api/instructor/v2/courses/course-v1:edX+Test+2024/certificates/exceptions',
        {
          learners: 'user1, user2',
          notes: 'Test exception',
        }
      );
    });

    it('handles errors when granting exceptions', async () => {
      mockPost.mockRejectedValue(new Error('Permission denied'));

      await expect(
        grantBulkExceptions('course-v1:edX+Test+2024', {
          learners: 'user1',
          notes: 'Test',
        })
      ).rejects.toThrow('Permission denied');
    });
  });

  describe('invalidateCertificate', () => {
    it('invalidates certificates for learners', async () => {
      mockPost.mockResolvedValue({ data: { success: ['user1', 'user2'], errors: [] } });

      await invalidateCertificate('course-v1:edX+Test+2024', {
        learners: 'user1, user2',
        notes: 'Certificate invalidation',
      });

      expect(mockPost).toHaveBeenCalledWith(
        'http://localhost:18000/api/instructor/v2/courses/course-v1:edX+Test+2024/certificates/invalidations',
        {
          learners: 'user1, user2',
          notes: 'Certificate invalidation',
        }
      );
    });

    it('handles errors when invalidating certificates', async () => {
      mockPost.mockRejectedValue(new Error('Invalid request'));

      await expect(
        invalidateCertificate('course-v1:edX+Test+2024', {
          learners: 'user1',
          notes: 'Test',
        })
      ).rejects.toThrow('Invalid request');
    });
  });

  describe('removeException', () => {
    it('removes certificate exception for a user', async () => {
      mockDelete.mockResolvedValue({ data: {} });

      await removeException('course-v1:edX+Test+2024', {
        username: 'user1',
      });

      expect(mockDelete).toHaveBeenCalledWith(
        'http://localhost:18000/api/instructor/v2/courses/course-v1:edX+Test+2024/certificates/exceptions',
        {
          data: {
            username: 'user1',
          },
        }
      );
    });

    it('handles errors when removing exception', async () => {
      mockDelete.mockRejectedValue(new Error('User not found'));

      await expect(
        removeException('course-v1:edX+Test+2024', {
          username: 'user1',
        })
      ).rejects.toThrow('User not found');
    });
  });

  describe('removeInvalidation', () => {
    it('removes certificate invalidation for a user', async () => {
      mockDelete.mockResolvedValue({ data: {} });

      await removeInvalidation('course-v1:edX+Test+2024', {
        username: 'user1',
      });

      expect(mockDelete).toHaveBeenCalledWith(
        'http://localhost:18000/api/instructor/v2/courses/course-v1:edX+Test+2024/certificates/invalidations',
        {
          data: {
            username: 'user1',
          },
        }
      );
    });

    it('handles errors when removing invalidation', async () => {
      mockDelete.mockRejectedValue(new Error('Not found'));

      await expect(
        removeInvalidation('course-v1:edX+Test+2024', {
          username: 'user1',
        })
      ).rejects.toThrow('Not found');
    });
  });

  describe('toggleCertificateGeneration', () => {
    it('enables certificate generation', async () => {
      mockPost.mockResolvedValue({ data: {} });

      await toggleCertificateGeneration('course-v1:edX+Test+2024', true);

      expect(mockPost).toHaveBeenCalledWith(
        'http://localhost:18000/api/instructor/v2/courses/course-v1:edX+Test+2024/certificates/toggle_generation',
        {
          enabled: true,
        }
      );
    });

    it('disables certificate generation', async () => {
      mockPost.mockResolvedValue({ data: {} });

      await toggleCertificateGeneration('course-v1:edX+Test+2024', false);

      expect(mockPost).toHaveBeenCalledWith(
        'http://localhost:18000/api/instructor/v2/courses/course-v1:edX+Test+2024/certificates/toggle_generation',
        {
          enabled: false,
        }
      );
    });

    it('handles errors when toggling certificate generation', async () => {
      mockPost.mockRejectedValue(new Error('Server error'));

      await expect(
        toggleCertificateGeneration('course-v1:edX+Test+2024', true)
      ).rejects.toThrow('Server error');
    });
  });
});
