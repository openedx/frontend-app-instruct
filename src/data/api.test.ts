import { getCourseInfo } from './api';
import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';

jest.mock('@openedx/frontend-base');

const mockHttpClient = {
  get: jest.fn(),
  put: jest.fn(),
};

const mockGetAppConfig = getAppConfig as jest.MockedFunction<typeof getAppConfig>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;

describe('getCourseInfo', () => {
  const mockCourseData = { course_name: 'Test Course' };
  const mockCamelCaseData = { courseName: 'Test Course' };

  beforeEach(() => {
    jest.clearAllMocks();
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
