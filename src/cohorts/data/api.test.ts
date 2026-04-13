import { getCohortStatus, getCohorts, toggleCohorts } from './api';
import { camelCaseObject, getSiteConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';

jest.mock('@openedx/frontend-base');

const mockBaseUrl = 'https://cms.example.com';

const mockHttpClient = {
  get: jest.fn(),
  put: jest.fn(),
};

const mockGetSiteConfig = getSiteConfig as jest.MockedFunction<typeof getSiteConfig>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;

describe('getCohortStatus', () => {
  const mockCohortStatusData = { is_cohorted: true };
  const mockCamelCaseCohortStatusData = { isCohorted: true };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCaseCohortStatusData);
    mockHttpClient.get.mockResolvedValue({ data: mockCohortStatusData });
  });

  it('should fetch cohort status and return camelCased data', async () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';

    const result = await getCohortStatus(courseId);

    expect(getSiteConfig).toHaveBeenCalled();
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
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockData);
    mockHttpClient.get.mockResolvedValue({ data: mockData });
  });

  it('should fetch cohorts and return camelCased data', async () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    mockHttpClient.get.mockResolvedValue({ data: mockData });

    const result = await getCohorts(courseId);

    expect(getSiteConfig).toHaveBeenCalled();
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/cohorts/v1/courses/${courseId}/cohorts/`, { params: { page_size: 100 } }
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
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCasedData);
  });

  it('should toggle cohorts and return camelCased data', async () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    const isCohorted = true;
    mockHttpClient.put.mockResolvedValue({ data: mockData });

    const result = await toggleCohorts(courseId, isCohorted);

    expect(getSiteConfig).toHaveBeenCalled();
    expect(mockHttpClient.put).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/cohorts/v1/settings/${courseId}`,
      { is_cohorted: isCohorted }
    );
    expect(camelCaseObject).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockCamelCasedData);
  });
});
