import { useState, useCallback, useMemo } from 'react';

export interface ModalState {
  grantExceptions: boolean,
  invalidateCertificate: boolean,
  removeInvalidation: boolean,
  disableCertificates: boolean,
}

export interface ModalActions {
  openGrantExceptions: () => void,
  closeGrantExceptions: () => void,
  openInvalidateCertificate: () => void,
  closeInvalidateCertificate: () => void,
  openRemoveInvalidation: () => void,
  closeRemoveInvalidation: () => void,
  openDisableCertificates: () => void,
  closeDisableCertificates: () => void,
}

const initialState: ModalState = {
  grantExceptions: false,
  invalidateCertificate: false,
  removeInvalidation: false,
  disableCertificates: false,
};

export const useModalState = (): [ModalState, ModalActions] => {
  const [modals, setModals] = useState<ModalState>(initialState);

  const toggleModal = useCallback((modalName: keyof ModalState, isOpen: boolean) => {
    setModals((prev) => ({ ...prev, [modalName]: isOpen }));
  }, []);

  const actions = useMemo<ModalActions>(
    () => ({
      openGrantExceptions: () => toggleModal('grantExceptions', true),
      closeGrantExceptions: () => toggleModal('grantExceptions', false),
      openInvalidateCertificate: () => toggleModal('invalidateCertificate', true),
      closeInvalidateCertificate: () => toggleModal('invalidateCertificate', false),
      openRemoveInvalidation: () => toggleModal('removeInvalidation', true),
      closeRemoveInvalidation: () => toggleModal('removeInvalidation', false),
      openDisableCertificates: () => toggleModal('disableCertificates', true),
      closeDisableCertificates: () => toggleModal('disableCertificates', false),
    }),
    [toggleModal],
  );

  return [modals, actions];
};
