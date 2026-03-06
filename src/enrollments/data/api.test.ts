import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { getEnrollments, getEnrollmentStatus, PaginationParams } from './api';
import { EnrollmentsResponse, EnrollmentStatusResponse } from '../types';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  camelCaseObject: jest.fn((obj) => obj),
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('../../data/api', () => ({
  getApiBaseUrl: jest.fn(),
}));

const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;
const mockGetApiBaseUrl = getApiBaseUrl as jest.MockedFunction<typeof getApiBaseUrl>;

describe('enrollments api', () => {
  const mockHttpClient = {
    get: jest.fn(),
  };

  beforeEach(() => {
    mockGetApiBaseUrl.mockReturnValue('https://test-lms.com');
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getEnrollments', () => {
    const mockEnrollmentsData = {
      count: 2,
      results: [
        {
          id: '1',
          username: 'student1',
          full_name: 'Student One',
          email: 'student1@example.com',
          track: 'verified',
          beta_tester: false,
        },
        {
          id: '2',
          username: 'student2',
          full_name: 'Student Two',
          email: 'student2@example.com',
          track: 'audit',
          beta_tester: true,
        },
      ],
    };

    const mockCamelCaseData: EnrollmentsResponse = {
      count: 2,
      results: [
        {
          id: '1',
          username: 'student1',
          fullName: 'Student One',
          email: 'student1@example.com',
          track: 'verified',
          betaTester: false,
        },
        {
          id: '2',
          username: 'student2',
          fullName: 'Student Two',
          email: 'student2@example.com',
          track: 'audit',
          betaTester: true,
        },
      ],
    };

    const pagination: PaginationParams = { page: 1, pageSize: 20 };

    beforeEach(() => {
      mockHttpClient.get.mockResolvedValue({ data: mockEnrollmentsData });
      mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
    });

    it('fetches enrollments successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const result = await getEnrollments(courseId, pagination);

      expect(mockGetApiBaseUrl).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/?page=1&page_size=20'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockEnrollmentsData);
      expect(result).toBe(mockCamelCaseData);
    });

    it('handles different pagination parameters', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const customPagination: PaginationParams = { page: 3, pageSize: 50 };

      await getEnrollments(courseId, customPagination);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/?page=3&page_size=50'
      );
    });

    it('handles special characters in course ID', async () => {
      const courseId = 'course-v1:edX+Test+Course+2023';

      await getEnrollments(courseId, pagination);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+Course+2023/enrollments/?page=1&page_size=20'
      );
    });

    it('throws error when API call fails', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const error = new Error('Network error');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(getEnrollments(courseId, pagination)).rejects.toThrow('Network error');
      expect(mockCamelCaseObject).not.toHaveBeenCalled();
    });

    it('throws error when HTTP client returns error status', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const error = {
        response: {
          status: 404,
          data: { error: 'Course not found' },
        },
      };
      mockHttpClient.get.mockRejectedValue(error);

      await expect(getEnrollments(courseId, pagination)).rejects.toEqual(error);
    });
  });

  describe('getEnrollmentStatus', () => {
    const mockEnrollmentStatusData = {
      status: 'enrolled',
    };

    const mockCamelCaseStatusData: EnrollmentStatusResponse = {
      status: 'enrolled',
    };

    beforeEach(() => {
      mockHttpClient.get.mockResolvedValue({ data: mockEnrollmentStatusData });
      mockCamelCaseObject.mockReturnValue(mockCamelCaseStatusData);
    });

    it('fetches enrollment status by email successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const userIdentifier = 'student@example.com';

      const result = await getEnrollmentStatus(courseId, userIdentifier);

      expect(mockGetApiBaseUrl).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/?email_or_username=student@example.com'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockEnrollmentStatusData);
      expect(result).toBe(mockCamelCaseStatusData);
    });

    it('fetches enrollment status by username successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const userIdentifier = 'student123';

      await getEnrollmentStatus(courseId, userIdentifier);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/?email_or_username=student123'
      );
    });

    it('handles special characters in user identifier', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const userIdentifier = 'test+user@example.com';

      await getEnrollmentStatus(courseId, userIdentifier);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/?email_or_username=test+user@example.com'
      );
    });

    it('handles special characters in course ID', async () => {
      const courseId = 'course-v1:edX+Advanced+Course+2023';
      const userIdentifier = 'student@example.com';

      await getEnrollmentStatus(courseId, userIdentifier);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Advanced+Course+2023/enrollments/?email_or_username=student@example.com'
      );
    });

    it('throws error when API call fails', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const userIdentifier = 'student@example.com';
      const error = new Error('Network error');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(getEnrollmentStatus(courseId, userIdentifier)).rejects.toThrow('Network error');
      expect(mockCamelCaseObject).not.toHaveBeenCalled();
    });

    it('throws error when user not found', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const userIdentifier = 'nonexistent@example.com';
      const error = {
        response: {
          status: 404,
          data: { error: 'User not found' },
        },
      };
      mockHttpClient.get.mockRejectedValue(error);

      await expect(getEnrollmentStatus(courseId, userIdentifier)).rejects.toEqual(error);
    });

    it('handles different enrollment statuses', async () => {
      const statuses = ['enrolled', 'unenrolled', 'pending'];

      for (const status of statuses) {
        const mockStatusData = { status };
        const mockCamelCaseStatus = { status };

        mockHttpClient.get.mockResolvedValue({ data: mockStatusData });
        mockCamelCaseObject.mockReturnValue(mockCamelCaseStatus);

        const result = await getEnrollmentStatus('course-v1:edX+Test+2023', 'test@example.com');

        expect(result.status).toBe(status);
        expect(mockCamelCaseObject).toHaveBeenCalledWith(mockStatusData);
      }
    });
  });
});
