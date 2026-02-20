import { renderHook, act } from '@testing-library/react';
import { useDebouncedFilter } from './useDebouncedFilter';

// Mock lodash debounce to call the function immediately for testing
jest.mock('lodash', () => ({
  debounce: (fn: any) => {
    fn.cancel = jest.fn();
    return fn;
  },
}));

describe('useDebouncedFilter', () => {
  let setFilter: jest.Mock;

  beforeEach(() => {
    setFilter = jest.fn();
  });

  it('should initialize inputValue with filterValue', () => {
    const { result } = renderHook(() =>
      useDebouncedFilter({ filterValue: 'test', setFilter }),
    );
    expect(result.current.inputValue).toBe('test');
  });

  it('should update inputValue and call setFilter on handleChange', () => {
    const { result } = renderHook(() =>
      useDebouncedFilter({ filterValue: '', setFilter }),
    );
    act(() => {
      result.current.handleChange('new value');
    });
    expect(result.current.inputValue).toBe('new value');
    expect(setFilter).toHaveBeenCalledWith('new value');
  });

  it('should update inputValue when filterValue prop changes', () => {
    const { result, rerender } = renderHook(
      ({ filterValue }) =>
        useDebouncedFilter({ filterValue, setFilter }),
      { initialProps: { filterValue: 'first' } }
    );
    expect(result.current.inputValue).toBe('first');
    rerender({ filterValue: 'second' });
    expect(result.current.inputValue).toBe('second');
  });

  it('should set inputValue to empty string if filterValue is undefined', () => {
    const { result } = renderHook(() =>
      useDebouncedFilter({ filterValue: undefined as any, setFilter }),
    );
    expect(result.current.inputValue).toBe('');
  });
});
