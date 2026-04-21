import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '@src/grading/data/api';
import {
  useGradingConfiguration,
  useResetAttempts,
  useRescoreSubmission,
  useDeleteHistory,
  useChangeScore
} from '@src/grading/data/apiHook';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('useGradingConfiguration', () => {
  const wrapper = createWrapper();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns data when getGradingConfiguration resolves', async () => {
    const mockData = { gradingPolicy: 'test_policy' };
    jest.spyOn(api, 'getGradingConfiguration').mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useGradingConfiguration('course-v1:abc123'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('returns error when getGradingConfiguration rejects', async () => {
    jest.spyOn(api, 'getGradingConfiguration').mockRejectedValueOnce(new Error('Network error'));
    const { result } = renderHook(() => useGradingConfiguration('course-v1:abc123'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result?.current?.error?.message).toBe('Network error');
  });

  it('does not run query if courseId is falsy', () => {
    const spy = jest.spyOn(api, 'getGradingConfiguration');
    renderHook(() => useGradingConfiguration(''), { wrapper });
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('useResetAttempts', () => {
  const wrapper = createWrapper();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls postResetAttempts when mutate is triggered', async () => {
    const mockData = { status: 'success' };
    const spy = jest.spyOn(api, 'postResetAttempts').mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useResetAttempts('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem' };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(spy).toHaveBeenCalledWith('course-v1:abc123', params);
    expect(result.current.data).toEqual(mockData);
  });

  it('handles error when postResetAttempts rejects', async () => {
    const error = new Error('Reset failed');
    jest.spyOn(api, 'postResetAttempts').mockRejectedValueOnce(error);

    const { result } = renderHook(() => useResetAttempts('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem' };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});

describe('useRescoreSubmission', () => {
  const wrapper = createWrapper();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls postRescoreSubmission when mutate is triggered', async () => {
    const mockData = { status: 'success' };
    const spy = jest.spyOn(api, 'postRescoreSubmission').mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useRescoreSubmission('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem', onlyIfHigher: false };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(spy).toHaveBeenCalledWith('course-v1:abc123', params);
    expect(result.current.data).toEqual(mockData);
  });

  it('handles onlyIfHigher parameter correctly', async () => {
    const mockData = { status: 'success' };
    const spy = jest.spyOn(api, 'postRescoreSubmission').mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useRescoreSubmission('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem', onlyIfHigher: true };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(spy).toHaveBeenCalledWith('course-v1:abc123', params);
  });

  it('handles error when postRescoreSubmission rejects', async () => {
    const error = new Error('Rescore failed');
    jest.spyOn(api, 'postRescoreSubmission').mockRejectedValueOnce(error);

    const { result } = renderHook(() => useRescoreSubmission('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem', onlyIfHigher: false };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});

describe('useDeleteHistory', () => {
  const wrapper = createWrapper();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls deleteState when mutate is triggered', async () => {
    const mockData = { status: 'deleted' };
    const spy = jest.spyOn(api, 'deleteState').mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useDeleteHistory('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem' };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(spy).toHaveBeenCalledWith('course-v1:abc123', params);
    expect(result.current.data).toEqual(mockData);
  });

  it('handles error when deleteState rejects', async () => {
    const error = new Error('Delete failed');
    jest.spyOn(api, 'deleteState').mockRejectedValueOnce(error);

    const { result } = renderHook(() => useDeleteHistory('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem' };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});

describe('useChangeScore', () => {
  const wrapper = createWrapper();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls changeScore when mutate is triggered', async () => {
    const mockData = { status: 'updated' };
    const spy = jest.spyOn(api, 'changeScore').mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useChangeScore('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem', newScore: 85.5 };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(spy).toHaveBeenCalledWith('course-v1:abc123', params);
    expect(result.current.data).toEqual(mockData);
  });

  it('handles integer scores correctly', async () => {
    const mockData = { status: 'updated' };
    const spy = jest.spyOn(api, 'changeScore').mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useChangeScore('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem', newScore: 100 };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(spy).toHaveBeenCalledWith('course-v1:abc123', params);
  });

  it('handles negative scores correctly', async () => {
    const mockData = { status: 'updated' };
    const spy = jest.spyOn(api, 'changeScore').mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useChangeScore('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem', newScore: -5 };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(spy).toHaveBeenCalledWith('course-v1:abc123', params);
  });

  it('handles error when changeScore rejects', async () => {
    const error = new Error('Score change failed');
    jest.spyOn(api, 'changeScore').mockRejectedValueOnce(error);

    const { result } = renderHook(() => useChangeScore('course-v1:abc123'), { wrapper });

    const params = { learner: 'testuser', problem: 'block-v1:test+problem', newScore: 85.5 };
    result.current.mutate(params);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
