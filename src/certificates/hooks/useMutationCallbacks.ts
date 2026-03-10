import { useAlert } from '@src/providers/AlertProvider';
import { ApiError, getErrorMessage } from '../utils/errorHandling';
import { ALERT_VARIANTS, MODAL_TITLES } from '../constants';

interface UseMutationCallbacksOptions {
  onSuccess?: () => void,
  successMessage?: string,
  errorMessage?: string,
}

export const useMutationCallbacks = () => {
  const { showToast, showModal } = useAlert();

  const createCallbacks = ({
    onSuccess,
    successMessage,
    errorMessage = 'An error occurred',
  }: UseMutationCallbacksOptions) => ({
    onSuccess: () => {
      if (successMessage) {
        showToast(successMessage);
      }
      onSuccess?.();
    },
    onError: (error: ApiError) => {
      showModal({
        title: MODAL_TITLES.ERROR,
        message: getErrorMessage(error, errorMessage),
        variant: ALERT_VARIANTS.DANGER,
      });
    },
  });

  return { createCallbacks };
};
