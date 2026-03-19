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
    post: jest.fn(),
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
      enrollments: [
        {
          username: 'student1',
          full_name: 'Student One',
          email: 'student1@example.com',
          mode: 'verified',
          is_beta_tester: false,
        },
        {
          username: 'student2',
          full_name: 'Student Two',
          email: 'student2@example.com',
          mode: 'audit',
          is_beta_tester: true,
        },
      ],
    };

    const mockCamelCaseData: EnrollmentsResponse = {
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
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments?page=2&page_size=20'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockEnrollmentsData);
      expect(result).toBe(mockCamelCaseData);
    });

    it('handles different pagination parameters', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const customPagination: PaginationParams = { page: 3, pageSize: 50 };

      await getEnrollments(courseId, customPagination);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments?page=4&page_size=50'
      );
    });

    it('handles special characters in course ID', async () => {
      const courseId = 'course-v1:edX+Test+Course+2023';

      await getEnrollments(courseId, pagination);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+Course+2023/enrollments?page=2&page_size=20'
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
      enrollment_status: 'enrolled',
    };

    const mockCamelCaseStatusData: EnrollmentStatusResponse = {
      enrollmentStatus: 'enrolled',
    };

    beforeEach(() => {
      mockHttpClient.post.mockResolvedValue({ data: mockEnrollmentStatusData });
      mockCamelCaseObject.mockReturnValue(mockCamelCaseStatusData);
    });

    it('fetches enrollment status by email successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const userIdentifier = 'student@example.com';

      const result = await getEnrollmentStatus(courseId, userIdentifier);

      expect(mockGetApiBaseUrl).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://test-lms.com/courses/course-v1:edX+Test+2023/instructor/api/get_student_enrollment_status',
        { unique_student_identifier: userIdentifier }
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockEnrollmentStatusData);
      expect(result).toBe(mockCamelCaseStatusData);
    });

    it('fetches enrollment status by username successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const userIdentifier = 'student123';

      await getEnrollmentStatus(courseId, userIdentifier);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://test-lms.com/courses/course-v1:edX+Test+2023/instructor/api/get_student_enrollment_status',
        { unique_student_identifier: userIdentifier }
      );
    });

    it('handles special characters in user identifier', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const userIdentifier = 'test+user@example.com';

      await getEnrollmentStatus(courseId, userIdentifier);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://test-lms.com/courses/course-v1:edX+Test+2023/instructor/api/get_student_enrollment_status',
        { unique_student_identifier: userIdentifier }
      );
    });

    it('handles special characters in course ID', async () => {
      const courseId = 'course-v1:edX+Advanced+Course+2023';
      const userIdentifier = 'student@example.com';

      await getEnrollmentStatus(courseId, userIdentifier);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://test-lms.com/courses/course-v1:edX+Advanced+Course+2023/instructor/api/get_student_enrollment_status',
        { unique_student_identifier: userIdentifier }
      );
    });

    it('throws error when API call fails', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const userIdentifier = 'student@example.com';
      const error = new Error('Network error');
      mockHttpClient.post.mockRejectedValue(error);

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
      mockHttpClient.post.mockRejectedValue(error);

      await expect(getEnrollmentStatus(courseId, userIdentifier)).rejects.toEqual(error);
    });

    it('handles different enrollment statuses', async () => {
      const statuses = ['enrolled', 'unenrolled', 'pending'];

      for (const status of statuses) {
        const mockStatusData = { enrollment_status: status };
        const mockCamelCaseStatus = { enrollmentStatus: status };

        mockHttpClient.post.mockResolvedValue({ data: mockStatusData });
        mockCamelCaseObject.mockReturnValue(mockCamelCaseStatus);

        const result = await getEnrollmentStatus('course-v1:edX+Test+2023', 'test@example.com');

        expect(result.enrollmentStatus).toBe(status);
        expect(mockCamelCaseObject).toHaveBeenCalledWith(mockStatusData);
      }
    });
  });
});
