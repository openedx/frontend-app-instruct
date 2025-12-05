import { getCourseInfo, getCohortStatus, getCohorts, toggleCohorts } from './api';
import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '../constants';

jest.mock('@openedx/frontend-base');

const mockBaseUrl = 'https://cms.example.com';

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
    mockGetAppConfig.mockReturnValue({ CMS_BASE_URL: 'https://test-lms.com' });
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

describe('getCohortStatus', () => {
  const mockCohortStatusData = { is_cohorted: true };
  const mockCamelCaseCohortStatusData = { isCohorted: true };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAppConfig.mockReturnValue({ CMS_BASE_URL: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCaseCohortStatusData);
    mockHttpClient.get.mockResolvedValue({ data: mockCohortStatusData });
  });

  it('should fetch cohort status and return camelCased data', async () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';

    const result = await getCohortStatus(courseId);

    expect(getAppConfig).toHaveBeenCalledWith(appId);
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/cohorts/v1/settings/${courseId}`
    );
    expect(mockCamelCaseObject).toHaveBeenCalledWith(mockCohortStatusData);
    expect(result).toEqual(mockCamelCaseCohortStatusData);
  });
});

describe('getCohorts', () => {
  const mockData = [{ id: 1, name: 'Cohort 1' }];
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAppConfig.mockReturnValue({ CMS_BASE_URL: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockData);
    mockHttpClient.get.mockResolvedValue({ data: mockData });
  });

  it('should fetch cohorts and return camelCased data', async () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    mockHttpClient.get.mockResolvedValue({ data: mockData });

    const result = await getCohorts(courseId);

    expect(getAppConfig).toHaveBeenCalledWith(appId);
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/cohorts/v1/courses/${courseId}/cohorts/`
    );
    expect(camelCaseObject).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockData);
  });
});

describe('toggleCohorts', () => {
  const mockData = { is_cohorted: true };
  const mockCamelCasedData = { isCohorted: true };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAppConfig.mockReturnValue({ CMS_BASE_URL: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCasedData);
  });

  it('should toggle cohorts and return camelCased data', async () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    const isCohorted = true;
    mockHttpClient.put.mockResolvedValue({ data: mockData });

    const result = await toggleCohorts(courseId, isCohorted);

    expect(getAppConfig).toHaveBeenCalledWith(appId);
    expect(mockHttpClient.put).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/cohorts/v1/settings/${courseId}`,
      { is_cohorted: isCohorted }
    );
    expect(camelCaseObject).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockCamelCasedData);
  });
});
