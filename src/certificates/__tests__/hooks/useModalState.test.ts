import { renderHook, act } from '@testing-library/react';
import { useModalState } from '../../hooks/useModalState';

describe('useModalState', () => {
  it('initializes with all modals closed', () => {
    const { result } = renderHook(() => useModalState());
    const [modalState] = result.current;

    expect(modalState.grantExceptions).toBe(false);
    expect(modalState.invalidateCertificate).toBe(false);
    expect(modalState.removeInvalidation).toBe(false);
    expect(modalState.disableCertificates).toBe(false);
  });

  it('opens and closes grantExceptions modal', () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current[1].openGrantExceptions();
    });
    expect(result.current[0].grantExceptions).toBe(true);

    act(() => {
      result.current[1].closeGrantExceptions();
    });
    expect(result.current[0].grantExceptions).toBe(false);
  });

  it('opens and closes invalidateCertificate modal', () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current[1].openInvalidateCertificate();
    });
    expect(result.current[0].invalidateCertificate).toBe(true);

    act(() => {
      result.current[1].closeInvalidateCertificate();
    });
    expect(result.current[0].invalidateCertificate).toBe(false);
  });

  it('opens and closes removeInvalidation modal', () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current[1].openRemoveInvalidation();
    });
    expect(result.current[0].removeInvalidation).toBe(true);

    act(() => {
      result.current[1].closeRemoveInvalidation();
    });
    expect(result.current[0].removeInvalidation).toBe(false);
  });

  it('opens and closes disableCertificates modal', () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current[1].openDisableCertificates();
    });
    expect(result.current[0].disableCertificates).toBe(true);

    act(() => {
      result.current[1].closeDisableCertificates();
    });
    expect(result.current[0].disableCertificates).toBe(false);
  });

  it('allows multiple modals open simultaneously', () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current[1].openGrantExceptions();
      result.current[1].openInvalidateCertificate();
    });

    expect(result.current[0].grantExceptions).toBe(true);
    expect(result.current[0].invalidateCertificate).toBe(true);
    expect(result.current[0].removeInvalidation).toBe(false);
    expect(result.current[0].disableCertificates).toBe(false);
  });

  it('maintains independent state for each modal', () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current[1].openGrantExceptions();
    });
    expect(result.current[0].grantExceptions).toBe(true);
    expect(result.current[0].invalidateCertificate).toBe(false);

    act(() => {
      result.current[1].closeGrantExceptions();
      result.current[1].openRemoveInvalidation();
    });
    expect(result.current[0].grantExceptions).toBe(false);
    expect(result.current[0].removeInvalidation).toBe(true);
  });

  it('can toggle modals multiple times', () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current[1].openGrantExceptions();
    });
    expect(result.current[0].grantExceptions).toBe(true);

    act(() => {
      result.current[1].closeGrantExceptions();
    });
    expect(result.current[0].grantExceptions).toBe(false);

    act(() => {
      result.current[1].openGrantExceptions();
    });
    expect(result.current[0].grantExceptions).toBe(true);
  });

  it('returns stable action references', () => {
    const { result, rerender } = renderHook(() => useModalState());
    const initialActions = result.current[1];

    rerender();

    expect(result.current[1]).toBe(initialActions);
  });
});
