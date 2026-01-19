import { getGradingConfiguration } from './api';
import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  camelCaseObject: jest.fn((obj) => obj),
  getAppConfig: jest.fn(),
  getAuthenticatedHttpClient: jest.fn(),
}));

const mockGetAppConfig = getAppConfig as jest.MockedFunction<typeof getAppConfig>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;

describe('getGradingConfiguration', () => {
  const mockHttpClient = {
    get: jest.fn(),
  };
  const mockConfigData = { grading_policy: 'test_policy' };
  const mockCamelCaseData = { gradingPolicy: 'test_policy' };

  beforeEach(() => {
    mockGetAppConfig.mockReturnValue({ LMS_BASE_URL: 'https://test-lms.com' });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
    mockHttpClient.get.mockResolvedValue({ data: mockConfigData });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches grading configuration successfully', async () => {
    const courseId = 'test-course-123';
    const result = await getGradingConfiguration(courseId);
    expect(mockGetAppConfig).toHaveBeenCalled();
    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
    expect(mockHttpClient.get).toHaveBeenCalledWith('https://test-lms.com/api/instructor/v2/courses/test-course-123/grading-config');
    expect(mockCamelCaseObject).toHaveBeenCalledWith(mockConfigData);
    expect(result).toBe(mockCamelCaseData);
  });

  it('throws error when API call fails', async () => {
    const error = new Error('Network error');
    mockHttpClient.get.mockRejectedValue(error);
    await expect(getGradingConfiguration('test-course')).rejects.toThrow('Network error');
  });
});
