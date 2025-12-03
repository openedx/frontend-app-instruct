import { fetchPendingTasks } from './api';
import { getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';

jest.mock('@openedx/frontend-base', () => ({
  camelCaseObject: jest.fn((obj) => obj),
  getAppConfig: jest.fn(),
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('../constants', () => ({
  appId: 'frontend-app-instruct',
}));

const mockGetAppConfig = getAppConfig as jest.MockedFunction<typeof getAppConfig>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;

describe('fetchPendingTasks', () => {
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

    const mockHttpClient = {
      post: jest.fn().mockResolvedValue({
        data: { tasks: mockTasks },
      }),
    };

    mockGetAppConfig.mockReturnValue({ LMS_BASE_URL: 'https://example.com' });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);

    const result = await fetchPendingTasks(mockCourseId);

    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'https://example.com/courses/course-v1:Example+Course+2025/instructor/api/list_instructor_tasks'
    );
    expect(result).toEqual(mockTasks);
  });
});
