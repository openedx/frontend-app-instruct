import { getCourseInfo } from './api';
import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { fetchPendingTasks } from './api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  camelCaseObject: jest.fn((obj) => obj),
  getAppConfig: jest.fn(),
  getAuthenticatedHttpClient: jest.fn(),
}));

const mockGetAppConfig = getAppConfig as jest.MockedFunction<typeof getAppConfig>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;

describe('base api', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getCourseInfo', () => {
    const mockHttpClient = {
      get: jest.fn(),
    };
    const mockCourseData = { course_name: 'Test Course' };
    const mockCamelCaseData = { courseName: 'Test Course' };

    beforeEach(() => {
      mockGetAppConfig.mockReturnValue({ LMS_BASE_URL: 'https://test-lms.com' });
      mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
      mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
      mockHttpClient.get.mockResolvedValue({ data: mockCourseData });
    });

    it('fetches course info successfully', async () => {
      const courseId = 'test-course-123';
      const result = await getCourseInfo(courseId);
      expect(mockGetAppConfig).toHaveBeenCalledWith('org.openedx.frontend.app.instructor');
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith('https://test-lms.com/api/instructor/v2/courses/test-course-123');
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockCourseData);
      expect(result).toBe(mockCamelCaseData);
    });

    it('throws error when API call fails', async () => {
      const error = new Error('Network error');
      mockHttpClient.get.mockRejectedValue(error);
      await expect(getCourseInfo('test-course')).rejects.toThrow('Network error');
    });
  });

  describe('fetchPendingTasks', () => {
    const mockHttpClient = {
      post: jest.fn(),
    };

    beforeEach(() => {
      mockCamelCaseObject.mockImplementation((obj) => obj);
      mockGetAppConfig.mockReturnValue({ LMS_BASE_URL: 'https://example.com' });
      mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    });

    it('should fetch pending tasks successfully', async () => {
      const mockCourseId = 'course-v1:Example+Course+2025';
      const mockTasks = [
        {
          task_type: 'grade_course',
          task_id: '12345',
          task_state: 'SUCCESS',
          requester: 'instructor@example.com',
        },
      ];

      mockHttpClient.post.mockResolvedValue({
        data: { tasks: mockTasks },
      });

      const result = await fetchPendingTasks(mockCourseId);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://example.com/courses/course-v1:Example+Course+2025/instructor/api/list_instructor_tasks'
      );
      expect(result).toEqual(mockTasks);
    });
  });
});
