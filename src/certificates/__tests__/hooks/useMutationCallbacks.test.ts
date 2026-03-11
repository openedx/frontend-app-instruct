import { renderHook } from '@testing-library/react';
import { useMutationCallbacks } from '../../hooks/useMutationCallbacks';
import { useAlert } from '@src/providers/AlertProvider';
import { ALERT_VARIANTS, MODAL_TITLES } from '../../constants';
import type { ApiError } from '../../utils/errorHandling';

jest.mock('@src/providers/AlertProvider');

const mockUseAlert = useAlert as jest.MockedFunction<typeof useAlert>;

describe('useMutationCallbacks', () => {
  const mockShowToast = jest.fn();
  const mockShowModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAlert.mockReturnValue({
      showToast: mockShowToast,
      showModal: mockShowModal,
    } as unknown as ReturnType<typeof useAlert>);
  });

  describe('createCallbacks', () => {
    it('creates callbacks with success message', () => {
      const { result } = renderHook(() => useMutationCallbacks());
      const callbacks = result.current.createCallbacks({
        successMessage: 'Operation successful!',
      });

      callbacks.onSuccess();

      expect(mockShowToast).toHaveBeenCalledWith('Operation successful!');
      expect(mockShowToast).toHaveBeenCalledTimes(1);
    });

    it('does not show toast when no success message provided', () => {
      const { result } = renderHook(() => useMutationCallbacks());
      const callbacks = result.current.createCallbacks({});

      callbacks.onSuccess();

      expect(mockShowToast).not.toHaveBeenCalled();
    });

    it('calls custom onSuccess callback', () => {
      const customOnSuccess = jest.fn();
      const { result } = renderHook(() => useMutationCallbacks());
      const callbacks = result.current.createCallbacks({
        onSuccess: customOnSuccess,
        successMessage: 'Success!',
      });

      callbacks.onSuccess();

      expect(customOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockShowToast).toHaveBeenCalledWith('Success!');
    });

    it('shows modal on error with API error message', () => {
      const { result } = renderHook(() => useMutationCallbacks());
      const callbacks = result.current.createCallbacks({
        errorMessage: 'Operation failed',
      });

      const apiError: ApiError = {
        response: {
          data: {
            error: 'Specific API error',
          },
        },
      };

      callbacks.onError(apiError);

      expect(mockShowModal).toHaveBeenCalledWith({
        title: MODAL_TITLES.ERROR,
        message: 'Specific API error',
        variant: ALERT_VARIANTS.DANGER,
      });
    });

    it('uses fallback error message when API error has no details', () => {
      const { result } = renderHook(() => useMutationCallbacks());
      const callbacks = result.current.createCallbacks({
        errorMessage: 'Something went wrong',
      });

      const apiError: ApiError = {};

      callbacks.onError(apiError);

      expect(mockShowModal).toHaveBeenCalledWith({
        title: MODAL_TITLES.ERROR,
        message: 'Something went wrong',
        variant: ALERT_VARIANTS.DANGER,
      });
    });

    it('uses default error message when none provided', () => {
      const { result } = renderHook(() => useMutationCallbacks());
      const callbacks = result.current.createCallbacks({});

      const apiError: ApiError = {};

      callbacks.onError(apiError);

      expect(mockShowModal).toHaveBeenCalledWith({
        title: MODAL_TITLES.ERROR,
        message: 'An error occurred',
        variant: ALERT_VARIANTS.DANGER,
      });
    });

    it('calls both success message and custom callback', () => {
      const customOnSuccess = jest.fn();
      const { result } = renderHook(() => useMutationCallbacks());
      const callbacks = result.current.createCallbacks({
        onSuccess: customOnSuccess,
        successMessage: 'Done!',
      });

      callbacks.onSuccess();

      expect(mockShowToast).toHaveBeenCalledWith('Done!');
      expect(customOnSuccess).toHaveBeenCalled();
    });

    it('handles error with generic message property', () => {
      const { result } = renderHook(() => useMutationCallbacks());
      const callbacks = result.current.createCallbacks({
        errorMessage: 'Fallback error',
      });

      const apiError: ApiError = {
        message: 'Generic error message',
      };

      callbacks.onError(apiError);

      expect(mockShowModal).toHaveBeenCalledWith({
        title: MODAL_TITLES.ERROR,
        message: 'Generic error message',
        variant: ALERT_VARIANTS.DANGER,
      });
    });

    it('creates independent callback sets', () => {
      const { result } = renderHook(() => useMutationCallbacks());

      const callbacks1 = result.current.createCallbacks({ successMessage: 'Success 1' });
      const callbacks2 = result.current.createCallbacks({ successMessage: 'Success 2' });

      callbacks1.onSuccess();
      expect(mockShowToast).toHaveBeenCalledWith('Success 1');

      mockShowToast.mockClear();

      callbacks2.onSuccess();
      expect(mockShowToast).toHaveBeenCalledWith('Success 2');
    });
  });
});
