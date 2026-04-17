import { getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getTeamMembers, getRoles, addTeamMember, removeTeamMember } from '@src/courseTeam/data/api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('../../data/api', () => ({
  getApiBaseUrl: jest.fn().mockReturnValue(''),
}));

const httpClientMock = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
};

beforeEach(() => {
  (getAuthenticatedHttpClient as jest.Mock).mockReturnValue(httpClientMock);
});

describe('courseTeam API', () => {
  describe('getTeamMembers', () => {
    it('should call the correct endpoint to get team members', async () => {
      const courseId = 'course-v1:edX+DemoX+Demo_Course';
      const params = { page: 0, pageSize: 10 };
      httpClientMock.get.mockResolvedValue({ data: { results: [], count: 0 } });

      await getTeamMembers(courseId, params);

      const expectedUrl = `/api/instructor/v2/courses/${courseId}/team?page=1&page_size=10`;
      expect(httpClientMock.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should include email_or_username in query params if provided', async () => {
      const courseId = 'course-v1:edX+DemoX+Demo_Course';
      const params = { page: 0, pageSize: 10, emailOrUsername: 'test@example.com' };
      httpClientMock.get.mockResolvedValue({ data: { results: [], count: 0 } });

      await getTeamMembers(courseId, params);

      const expectedUrl = `/api/instructor/v2/courses/${courseId}/team?page=1&page_size=10&email_or_username=test%40example.com`;
      expect(httpClientMock.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should include role in query params if provided', async () => {
      const courseId = 'course-v1:edX+DemoX+Demo_Course';
      const params = { page: 0, pageSize: 10, role: 'instructor' };
      httpClientMock.get.mockResolvedValue({ data: { results: [], count: 0 } });

      await getTeamMembers(courseId, params);

      const expectedUrl = `/api/instructor/v2/courses/${courseId}/team?page=1&page_size=10&role=instructor`;
      expect(httpClientMock.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should handle errors when API call fails', async () => {
      const courseId = 'course-v1:edX+DemoX+Demo_Course';
      const params = { page: 0, pageSize: 10 };
      const error = new Error('API error');
      httpClientMock.get.mockRejectedValue(error);

      await expect(getTeamMembers(courseId, params)).rejects.toThrow('API error');
    });
  });

  describe('getRoles', () => {
    it('should call the correct endpoint to get roles', async () => {
      const courseId = 'course-v1:edX+DemoX+Demo_Course';
      httpClientMock.get.mockResolvedValue({ data: { roles: [] } });

      await getRoles(courseId);

      const expectedUrl = `/api/instructor/v2/courses/${courseId}/team/roles`;
      expect(httpClientMock.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should return the roles from the response', async () => {
      const courseId = 'course-v1:edX+DemoX+Demo_Course';
      const snakeCaseData = { results: [{ role: 'instructor', display_name: 'Instructor' }, { role: 'staff', display_name: 'Staff' }] };
      const data = { results: [{ role: 'instructor', displayName: 'Instructor' }, { role: 'staff', displayName: 'Staff' }] };
      httpClientMock.get.mockResolvedValue({ data: snakeCaseData });

      const result = await getRoles(courseId);

      expect(result).toEqual(data);
    });
  });

  describe('addTeamMember', () => {
    it('should call the correct endpoint to add a team member', async () => {
      const courseId = 'course-v1:edX+DemoX+Demo_Course';
      const identifiers = ['testuser'];
      const role = 'instructor';
      httpClientMock.post.mockResolvedValue({ data: {
        identifiers,
        role,
      } });

      await addTeamMember(courseId, identifiers, role);

      const expectedUrl = `/api/instructor/v2/courses/${courseId}/team`;
      expect(httpClientMock.post).toHaveBeenCalledWith(expectedUrl, { identifiers, role });
    });
  });

  describe('removeTeamMember', () => {
    it('should call the correct endpoint to remove a team member', async () => {
      const courseId = 'course-v1:edX+DemoX+Demo_Course';
      const identifier = 'testuser';
      const roles = ['instructor'];
      httpClientMock.delete.mockResolvedValue({ data: {
        identifier,
        roles,
      } });

      await removeTeamMember(courseId, identifier, roles);

      const expectedUrl = `/api/instructor/v2/courses/${courseId}/team/${identifier}`;
      expect(httpClientMock.delete).toHaveBeenCalledWith(expectedUrl, { data: { roles } });
    });
  });
});
