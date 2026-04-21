import { camelCaseObject, getSiteConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import {
  getGradingConfiguration,
  postResetAttempts,
  postRescoreSubmission,
  deleteState,
  changeScore
} from '@src/grading/data/api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  camelCaseObject: jest.fn((obj) => obj),
  getSiteConfig: jest.fn(),
  getAuthenticatedHttpClient: jest.fn(),
}));

const mockGetSiteConfig = getSiteConfig as jest.MockedFunction<typeof getSiteConfig>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;

const mockHttpClient = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
};

describe('getGradingConfiguration', () => {
  const mockConfigData = { grading_policy: 'test_policy' };
  const mockCamelCaseData = { gradingPolicy: 'test_policy' };

  beforeEach(() => {
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: 'https://test-lms.com' });
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
    expect(mockGetSiteConfig).toHaveBeenCalled();
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

describe('postResetAttempts', () => {
  const mockResponseData = { status: 'success' };
  const mockCamelCaseData = { status: 'success' };

  beforeEach(() => {
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: 'https://test-lms.com' });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
    mockHttpClient.post.mockResolvedValue({ data: mockResponseData });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('resets attempts with learner parameter', async () => {
    const courseId = 'test-course-123';
    const params = { learner: 'testuser', problem: 'block-v1:test+problem' };

    const result = await postResetAttempts(courseId, params);

    const expectedUrl = 'https://test-lms.com/api/instructor/v2/courses/test-course-123/block-v1:test+problem/grading/attempts/reset';
    expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, expect.any(URLSearchParams));
    expect(mockCamelCaseObject).toHaveBeenCalledWith(mockResponseData);
    expect(result).toBe(mockCamelCaseData);
  });

  it('resets attempts without learner parameter', async () => {
    const courseId = 'test-course-123';
    const params = { problem: 'block-v1:test+problem' };

    const result = await postResetAttempts(courseId, params);

    const expectedUrl = 'https://test-lms.com/api/instructor/v2/courses/test-course-123/block-v1:test+problem/grading/attempts/reset';
    expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, expect.any(URLSearchParams));
    expect(result).toBe(mockCamelCaseData);
  });

  it('handles error in reset attempts', async () => {
    const error = new Error('Reset failed');
    mockHttpClient.post.mockRejectedValue(error);

    await expect(postResetAttempts('test-course', { problem: 'test' })).rejects.toThrow('Reset failed');
  });
});

describe('postRescoreSubmission', () => {
  const mockResponseData = { status: 'success' };
  const mockCamelCaseData = { status: 'success' };

  beforeEach(() => {
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: 'https://test-lms.com' });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
    mockHttpClient.post.mockResolvedValue({ data: mockResponseData });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('rescores submission with onlyIfHigher true', async () => {
    const courseId = 'test-course-123';
    const params = { learner: 'testuser', problem: 'block-v1:test+problem', onlyIfHigher: true };

    const result = await postRescoreSubmission(courseId, params);

    const expectedUrl = 'https://test-lms.com/api/instructor/v2/courses/test-course-123/block-v1:test+problem/grading/scores/rescore';
    expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, expect.any(URLSearchParams));
    expect(result).toBe(mockCamelCaseData);
  });

  it('rescores submission with onlyIfHigher false', async () => {
    const courseId = 'test-course-123';
    const params = { learner: 'testuser', problem: 'block-v1:test+problem', onlyIfHigher: false };

    const result = await postRescoreSubmission(courseId, params);

    expect(mockHttpClient.post).toHaveBeenCalledWith(expect.any(String), expect.any(URLSearchParams));
    expect(result).toBe(mockCamelCaseData);
  });

  it('handles error in rescore submission', async () => {
    const error = new Error('Rescore failed');
    mockHttpClient.post.mockRejectedValue(error);

    await expect(postRescoreSubmission('test-course', { problem: 'test', onlyIfHigher: false })).rejects.toThrow('Rescore failed');
  });
});

describe('deleteState', () => {
  const mockResponseData = { status: 'deleted' };
  const mockCamelCaseData = { status: 'deleted' };

  beforeEach(() => {
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: 'https://test-lms.com' });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
    mockHttpClient.delete.mockResolvedValue({ data: mockResponseData });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('deletes state with learner parameter', async () => {
    const courseId = 'test-course-123';
    const params = { learner: 'testuser', problem: 'block-v1:test+problem' };

    const result = await deleteState(courseId, params);

    const expectedUrl = 'https://test-lms.com/api/instructor/v2/courses/test-course-123/block-v1:test+problem/grading/state';
    expect(mockHttpClient.delete).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({
      data: expect.any(URLSearchParams),
    }));
    expect(result).toBe(mockCamelCaseData);
  });

  it('deletes state without learner parameter', async () => {
    const courseId = 'test-course-123';
    const params = { problem: 'block-v1:test+problem' };

    const result = await deleteState(courseId, params);

    expect(mockHttpClient.delete).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
    expect(result).toBe(mockCamelCaseData);
  });

  it('handles error in delete state', async () => {
    const error = new Error('Delete failed');
    mockHttpClient.delete.mockRejectedValue(error);

    await expect(deleteState('test-course', { problem: 'test' })).rejects.toThrow('Delete failed');
  });
});

describe('changeScore', () => {
  const mockResponseData = { status: 'updated' };
  const mockCamelCaseData = { status: 'updated' };

  beforeEach(() => {
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: 'https://test-lms.com' });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
    mockHttpClient.put.mockResolvedValue({ data: mockResponseData });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('changes score with learner parameter', async () => {
    const courseId = 'test-course-123';
    const params = { learner: 'testuser', problem: 'block-v1:test+problem', newScore: 85.5 };

    const result = await changeScore(courseId, params);

    const expectedUrl = 'https://test-lms.com/api/instructor/v2/courses/test-course-123/block-v1:test+problem/grading/scores';
    expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, expect.any(URLSearchParams));
    expect(result).toBe(mockCamelCaseData);
  });

  it('changes score without learner parameter', async () => {
    const courseId = 'test-course-123';
    const params = { problem: 'block-v1:test+problem', newScore: 90 };

    const result = await changeScore(courseId, params);

    expect(mockHttpClient.put).toHaveBeenCalledWith(expect.any(String), expect.any(URLSearchParams));
    expect(result).toBe(mockCamelCaseData);
  });

  it('handles negative scores', async () => {
    const courseId = 'test-course-123';
    const params = { problem: 'block-v1:test+problem', newScore: -5 };

    const result = await changeScore(courseId, params);

    expect(mockHttpClient.put).toHaveBeenCalledWith(expect.any(String), expect.any(URLSearchParams));
    expect(result).toBe(mockCamelCaseData);
  });

  it('handles error in change score', async () => {
    const error = new Error('Score change failed');
    mockHttpClient.put.mockRejectedValue(error);

    await expect(changeScore('test-course', { problem: 'test', newScore: 100 })).rejects.toThrow('Score change failed');
  });
});
