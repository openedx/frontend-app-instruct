import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useTeamMembers, useRoles, useAddTeamMember, useRemoveTeamMember } from '@src/courseTeam/data/apiHook';
import * as api from '@src/courseTeam/data/api';
import { CourseTeamMember } from '@src/courseTeam/types';
import { DataList } from '@src/types';
import { TEAM_MEMBER_ACTION } from '../constants';

jest.mock('@src/courseTeam/data/api');

const mockGetTeamMembers = api.getTeamMembers as jest.MockedFunction<typeof api.getTeamMembers>;
const mockGetRoles = api.getRoles as jest.MockedFunction<typeof api.getRoles>;
const mockAddTeamMember = api.addTeamMember as jest.MockedFunction<typeof api.addTeamMember>;
const mockRemoveTeamMember = api.removeTeamMember as jest.MockedFunction<typeof api.removeTeamMember>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const WrappedComponent = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return WrappedComponent;
};

describe('apiHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useTeamMembers', () => {
    it('should fetch course team members successfully', async () => {
      const mockTeamMembers: DataList<CourseTeamMember> = {
        count: 2,
        numPages: 1,
        results: [
          { username: 'john.doe', fullName: 'John Doe', email: 'john@example.com', roles: [{ role: 'instructor', displayName: 'Admin' }] },
          { username: 'jane.smith', fullName: 'Jane Smith', email: 'jane@example.com', roles: [{ role: 'staff', displayName: 'Staff' }, { role: 'admin', displayName: 'Admin' }] },
        ],
      };

      mockGetTeamMembers.mockResolvedValue(mockTeamMembers);

      const { result } = renderHook(() => useTeamMembers('course-v1:org+course+run', {
        page: 0,
        pageSize: 25,
      }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTeamMembers);
      expect(mockGetTeamMembers).toHaveBeenCalledWith('course-v1:org+course+run', {
        page: 0,
        pageSize: 25,
      });
    });

    it('should handle error when fetching course team fails', async () => {
      const mockError = new Error('Failed to fetch course team');
      mockGetTeamMembers.mockRejectedValue(mockError);

      const { result } = renderHook(() => useTeamMembers('course-v1:org+course+run', {
        page: 0,
        pageSize: 25,
      }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });

    it('should be disabled when courseId is empty', () => {
      const { result } = renderHook(() => useTeamMembers('', {
        page: 0,
        pageSize: 25,
      }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockGetTeamMembers).not.toHaveBeenCalled();
    });
  });

  describe('useRoles', () => {
    it('should fetch course roles successfully', async () => {
      const mockRoles = { results: [{ role: 'instructor', displayName: 'Instructor' }, { role: 'staff', displayName: 'Staff' }, { role: 'beta_testers', displayName: 'Beta Testers' }] };

      mockGetRoles.mockResolvedValue(mockRoles);

      const { result } = renderHook(() => useRoles('course-v1:org+course+run'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockRoles);
      expect(mockGetRoles).toHaveBeenCalledWith('course-v1:org+course+run', false);
    });

    it('should handle error when fetching roles fails', async () => {
      const mockError = new Error('Failed to fetch roles');
      mockGetRoles.mockRejectedValue(mockError);

      const { result } = renderHook(() => useRoles('course-v1:org+course+run'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });

    it('should be disabled when courseId is empty', () => {
      const { result } = renderHook(() => useRoles(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockGetRoles).not.toHaveBeenCalled();
    });
  });

  describe('useAddTeamMember', () => {
    it('should call addTeamMember API with correct parameters', async () => {
      mockAddTeamMember.mockResolvedValue({ results: [] });
      const { result } = renderHook(() => useAddTeamMember('course-v1:org+course+run'), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ identifiers: ['user1', 'user2'], role: 'admin', action: TEAM_MEMBER_ACTION.ALLOW }, {
        onSuccess: jest.fn(),
        onError: jest.fn(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.addTeamMember).toHaveBeenCalledWith('course-v1:org+course+run', { identifiers: ['user1', 'user2'], role: 'admin', action: TEAM_MEMBER_ACTION.ALLOW });
    });
  });

  describe('useRemoveTeamMember', () => {
    it('should call removeTeamMember API with correct parameters', async () => {
      mockRemoveTeamMember.mockResolvedValue({ results: [] });

      const { result } = renderHook(() => useRemoveTeamMember('course-v1:org+course+run'), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ identifier: 'user1', roles: ['admin'] }, {
        onSuccess: jest.fn(),
        onError: jest.fn(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.removeTeamMember).toHaveBeenCalledWith('course-v1:org+course+run', 'user1', ['admin']);
    });
  });
});
