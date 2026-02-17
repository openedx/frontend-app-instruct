import { getGeneratedReports, generateReportLink } from './api';
import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';

jest.mock('@openedx/frontend-base');
jest.mock('@src/data/api');

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockGetApiBaseUrl = getApiBaseUrl as jest.MockedFunction<typeof getApiBaseUrl>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;

describe('dataDownloads api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthenticatedHttpClient.mockReturnValue({
      get: mockGet,
      post: mockPost,
    } as any);
    mockGetApiBaseUrl.mockReturnValue('http://localhost:8000');
    mockCamelCaseObject.mockImplementation((data) => data);
  });

  it('should handle getGeneratedReports API call', async () => {
    const mockReportsData = { reports: ['report1', 'report2'] };
    mockGet.mockResolvedValue({ data: mockReportsData });
    const reportsResult = await getGeneratedReports('course-123');
    expect(mockGet).toHaveBeenCalledWith('http://localhost:8000/api/instructor/v2/courses/course-123/reports');
    expect(mockCamelCaseObject).toHaveBeenCalledWith(mockReportsData);
    expect(reportsResult).toEqual(mockReportsData);
  });

  it('should handle generateReportLink API calls', async () => {
    const mockGenerateData = { success: true };
    mockPost.mockResolvedValue({ data: mockGenerateData });
    const generateResult = await generateReportLink('course-456', 'type-a');
    expect(mockPost).toHaveBeenCalledWith('http://localhost:8000/api/instructor/v2/courses/course-456/reports/type-a/generate', {});
    expect(mockCamelCaseObject).toHaveBeenCalledWith(mockGenerateData);
    expect(generateResult).toEqual(mockGenerateData);
  });
});
