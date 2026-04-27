import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import { getAttempts } from '@src/specialExams/data/api';
import { AttemptsParams, Attempt } from '@src/specialExams/types';
import { DataList } from '@src/types';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  camelCaseObject: jest.fn((obj) => obj),
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@src/data/api', () => ({
  getApiBaseUrl: jest.fn(),
}));

const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;
const mockGetApiBaseUrl = getApiBaseUrl as jest.MockedFunction<typeof getApiBaseUrl>;

describe('specialExams api', () => {
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

  describe('getAttempts', () => {
    const mockAttemptsData = {
      count: 2,
      num_pages: 1,
      results: [
        {
          username: 'student1',
          exam_name: 'Final Exam',
          time_limit: 180,
          type: 'proctored',
          started_at: '2023-01-01T10:00:00Z',
          completed_at: '2023-01-01T13:00:00Z',
          status: 'completed',
        },
        {
          username: 'student2',
          exam_name: 'Midterm Exam',
          time_limit: 120,
          type: 'timed',
          started_at: '2023-01-02T14:00:00Z',
          completed_at: '2023-01-02T16:00:00Z',
          status: 'completed',
        },
      ],
    };

    const mockCamelCaseData: DataList<Attempt> = {
      count: 2,
      numPages: 1,
      results: [
        {
          username: 'student1',
          examName: 'Final Exam',
          timeLimit: 180,
          type: 'proctored',
          startedAt: '2023-01-01T10:00:00Z',
          completedAt: '2023-01-01T13:00:00Z',
          status: 'completed',
        },
        {
          username: 'student2',
          examName: 'Midterm Exam',
          timeLimit: 120,
          type: 'timed',
          startedAt: '2023-01-02T14:00:00Z',
          completedAt: '2023-01-02T16:00:00Z',
          status: 'completed',
        },
      ],
    };

    const params: AttemptsParams = { page: 1, pageSize: 20, emailOrUsername: '' };

    beforeEach(() => {
      mockHttpClient.get.mockResolvedValue({ data: mockAttemptsData });
      mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
    });

    it('fetches attempts successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const result = await getAttempts(courseId, params);

      expect(mockGetApiBaseUrl).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/attempts?page=2&page_size=20'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockAttemptsData);
      expect(result).toBe(mockCamelCaseData);
    });

    it('handles search parameter correctly', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const paramsWithSearch: AttemptsParams = { page: 0, pageSize: 10, emailOrUsername: 'student1' };

      await getAttempts(courseId, paramsWithSearch);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/attempts?page=1&page_size=10&search=student1'
      );
    });

    it('handles different page and pageSize parameters', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const customParams: AttemptsParams = { page: 5, pageSize: 50, emailOrUsername: '' };

      await getAttempts(courseId, customParams);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/attempts?page=6&page_size=50'
      );
    });

    it('handles empty emailOrUsername parameter', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const paramsWithEmptySearch: AttemptsParams = { page: 2, pageSize: 25, emailOrUsername: '' };

      await getAttempts(courseId, paramsWithEmptySearch);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/attempts?page=3&page_size=25'
      );
    });

    it('handles API error', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const error = new Error('Network error');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(getAttempts(courseId, params)).rejects.toThrow('Network error');
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalled();
    });

    it('handles special characters in courseId and search', async () => {
      const courseId = 'course-v1:edX+Special%20Course+2023';
      const paramsWithSpecialChars: AttemptsParams = { page: 0, pageSize: 20, emailOrUsername: 'user@example.com' };

      await getAttempts(courseId, paramsWithSpecialChars);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Special%20Course+2023/special_exams/attempts?page=1&page_size=20&search=user%40example.com'
      );
    });
  });
});
