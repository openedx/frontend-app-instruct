import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { getEnrollments, getEnrollmentStatus, enrollLearners, unenrollLearners } from './api';
import { EnrollmentsParams, EnrollmentStatusResponse, EnrolledLearner } from '../types';
import { DataList } from '@src/types';

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
    delete: jest.fn(),
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
      num_pages: 1,
      results: [
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

    const mockCamelCaseData: DataList<EnrolledLearner> = {
      count: 2,
      numPages: 1,
      results: [
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

    const params: EnrollmentsParams = { page: 1, pageSize: 20, emailOrUsername: '', isBetaTester: '' };

    beforeEach(() => {
      mockHttpClient.get.mockResolvedValue({ data: mockEnrollmentsData });
      mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
    });

    it('fetches enrollments successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const result = await getEnrollments(courseId, params);

      expect(mockGetApiBaseUrl).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments?page=2&page_size=20'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockEnrollmentsData);
      expect(result).toBe(mockCamelCaseData);
    });

    it('handles different params parameters', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const customParams: EnrollmentsParams = { page: 3, pageSize: 50, emailOrUsername: 'student', isBetaTester: '' };

      await getEnrollments(courseId, customParams);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments?page=4&page_size=50&search=student'
      );
    });

    it('handles special characters in course ID', async () => {
      const courseId = 'course-v1:edX+Test+Course+2023';

      await getEnrollments(courseId, params);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+Course+2023/enrollments?page=2&page_size=20'
      );
    });

    it('throws error when API call fails', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const error = new Error('Network error');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(getEnrollments(courseId, params)).rejects.toThrow('Network error');
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

      await expect(getEnrollments(courseId, params)).rejects.toEqual(error);
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

  describe('enrollLearners', () => {
    beforeEach(() => {
      mockHttpClient.post.mockResolvedValue({});
    });

    it('enrolls multiple learners successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['student1@example.com', 'student2@example.com'];

      await enrollLearners(courseId, users);

      expect(mockGetApiBaseUrl).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/',
        { users }
      );
    });

    it('enrolls a single learner successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['student@example.com'];

      await enrollLearners(courseId, users);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/',
        { users }
      );
    });

    it('handles empty users array', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users: string[] = [];

      await enrollLearners(courseId, users);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/',
        { users }
      );
    });

    it('handles special characters in course ID', async () => {
      const courseId = 'course-v1:edX+Advanced+Course+2023';
      const users = ['student@example.com'];

      await enrollLearners(courseId, users);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Advanced+Course+2023/enrollments/',
        { users }
      );
    });

    it('handles special characters in user emails', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['test+user@example.com', 'user.with+dots@domain.co.uk'];

      await enrollLearners(courseId, users);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/',
        { users }
      );
    });

    it('throws error when API call fails', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['student@example.com'];
      const error = new Error('Enrollment failed');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(enrollLearners(courseId, users)).rejects.toThrow('Enrollment failed');
    });

    it('handles enrollment validation errors', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['invalid-email'];
      const error = {
        response: {
          status: 400,
          data: { error: 'Invalid email format' },
        },
      };
      mockHttpClient.post.mockRejectedValue(error);

      await expect(enrollLearners(courseId, users)).rejects.toEqual(error);
    });
  });

  describe('unenrollLearners', () => {
    beforeEach(() => {
      mockHttpClient.delete.mockResolvedValue({});
    });

    it('unenrolls multiple learners successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['student1@example.com', 'student2@example.com'];

      await unenrollLearners(courseId, users);

      expect(mockGetApiBaseUrl).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/',
        { data: { users } }
      );
    });

    it('unenrolls a single learner successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['student@example.com'];

      await unenrollLearners(courseId, users);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/',
        { data: { users } }
      );
    });

    it('handles empty users array', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users: string[] = [];

      await unenrollLearners(courseId, users);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/',
        { data: { users } }
      );
    });

    it('handles special characters in course ID', async () => {
      const courseId = 'course-v1:edX+Advanced+Course+2023';
      const users = ['student@example.com'];

      await unenrollLearners(courseId, users);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Advanced+Course+2023/enrollments/',
        { data: { users } }
      );
    });

    it('handles special characters in user emails', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['test+user@example.com', 'user.with+dots@domain.co.uk'];

      await unenrollLearners(courseId, users);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/enrollments/',
        { data: { users } }
      );
    });

    it('throws error when API call fails', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['student@example.com'];
      const error = new Error('Unenrollment failed');
      mockHttpClient.delete.mockRejectedValue(error);

      await expect(unenrollLearners(courseId, users)).rejects.toThrow('Unenrollment failed');
    });

    it('handles unenrollment authorization errors', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['student@example.com'];
      const error = {
        response: {
          status: 403,
          data: { error: 'Permission denied' },
        },
      };
      mockHttpClient.delete.mockRejectedValue(error);

      await expect(unenrollLearners(courseId, users)).rejects.toEqual(error);
    });

    it('handles unenrollment of non-enrolled users', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const users = ['notenrolled@example.com'];
      const error = {
        response: {
          status: 404,
          data: { error: 'User not enrolled in course' },
        },
      };
      mockHttpClient.delete.mockRejectedValue(error);

      await expect(unenrollLearners(courseId, users)).rejects.toEqual(error);
    });
  });
});
