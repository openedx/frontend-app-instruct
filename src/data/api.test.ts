import { getCourseInfo } from './api';
import { getAppConfig, getAuthenticatedHttpClient, camelCaseObject } from '@openedx/frontend-base';

jest.mock('@openedx/frontend-base');

const mockHttpClient = {
  get: jest.fn(),
  put: jest.fn(),
};

const mockGetAppConfig = getAppConfig as jest.MockedFunction<typeof getAppConfig>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;

describe('getCourseInfo', () => {
  const mockCourseData = { course_name: 'Test Course', tabs: [{ tab_id: 'course_info', title: 'Course Information', url: 'https://test-lms.com/courses/test-course-123/info' }] };
  const mockCamelCasedCourseData = { courseName: 'Test Course', tabs: [{ tabId: 'course_info', title: 'Course Information', url: 'https://test-lms.com/courses/test-course-123/info' }] };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAppConfig.mockReturnValue({ LMS_BASE_URL: 'https://test-lms.com' });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCasedCourseData);
    mockHttpClient.get.mockResolvedValue({ data: mockCourseData });
  });

  it('fetches course info successfully', async () => {
    const courseId = 'test-course-123';
    const result = await getCourseInfo(courseId);
    expect(mockGetAppConfig).toHaveBeenCalledWith('org.openedx.frontend.app.instructor');
    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
    expect(mockHttpClient.get).toHaveBeenCalledWith('https://test-lms.com/api/instructor/v2/courses/test-course-123');
    expect(result).toBe(mockCamelCasedCourseData);
  });

  it('throws error when API call fails', async () => {
    const error = new Error('Network error');
    mockHttpClient.get.mockRejectedValue(error);
    await expect(getCourseInfo('test-course')).rejects.toThrow('Network error');
  });
});
