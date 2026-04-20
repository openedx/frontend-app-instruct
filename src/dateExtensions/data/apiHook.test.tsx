import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import * as api from '@src/dateExtensions/data/api';
import { useAddDateExtensionMutation } from '@src/dateExtensions/data/apiHook';

jest.mock('@src/dateExtensions/data/api');

const mockAddDateExtension = api.addDateExtension as jest.MockedFunction<typeof api.addDateExtension>;

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
  const courseId = 'course-v1:org+course+run';
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAddDateExtensionMutation', () => {
    it('should add date extension successfully', async () => {
      const dateExtensionData = {
        emailOrUsername: 'john.doe',
        blockId: 'block-v1:org+course+run+type@chapter+block@12345',
        dueDatetime: '2024-12-31T23:59:59Z',
        reason: 'Need more time to complete the assignment',
      };

      mockAddDateExtension.mockResolvedValue({});

      const { result } = renderHook(() => useAddDateExtensionMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ courseId, extensionData: dateExtensionData }, {
        onSuccess: jest.fn(),
        onError: jest.fn(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.addDateExtension).toHaveBeenCalledWith(courseId, dateExtensionData);
    });
  });
});
