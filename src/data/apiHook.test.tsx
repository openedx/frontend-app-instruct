import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePendingTasks } from './apiHook';
import { fetchPendingTasks } from './api';

jest.mock('./api', () => ({
  fetchPendingTasks: jest.fn(),
}));

const mockFetchPendingTasks = fetchPendingTasks as jest.MockedFunction<typeof fetchPendingTasks>;

describe('base api hooks', () => {
  it('should successfully fetch pending tasks when mutate is called', async () => {
    const mockTasks = [
      { taskType: 'grade_course', taskId: '12345', taskState: 'SUCCESS' },
    ];
    const mockCourseId = 'course-v1:Example+Course+2025';

    mockFetchPendingTasks.mockResolvedValue(mockTasks);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePendingTasks(mockCourseId), { wrapper });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockFetchPendingTasks).toHaveBeenCalledWith('course-v1:Example+Course+2025');
    expect(result.current.data).toEqual(mockTasks);
  });
});
