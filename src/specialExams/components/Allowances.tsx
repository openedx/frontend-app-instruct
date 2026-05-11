import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { useToggle } from '@openedx/paragon';
import AddAllowanceModal from '@src/specialExams/components/AddAllowanceModal';
import AllowancesList from '@src/specialExams/components/AllowancesList';
import EditAllowanceModal from '@src/specialExams/components/EditAllowanceModal';
import DeleteAllowanceModal from '@src/specialExams/components/DeleteAllowanceModal';
import { useAttempts } from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';
import { Allowance } from '@src/specialExams/types';
import { useAlert } from '@src/providers/AlertProvider';

const Allowances = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { showModal } = useAlert();
  const [isAddModalOpen, openAddModal, closeAddModal] = useToggle(false);
  const [isEditModalOpen, openEditModal, closeEditModal] = useToggle(false);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [selectedAllowance, setSelectedAllowance] = useState<Allowance | null>(null);
  const [pendingAction, setPendingAction] = useState<'edit' | 'delete' | null>(null);

  const { refetch } = useAttempts(courseId, {
    page: 0,
    pageSize: 100,
    emailOrUsername: selectedAllowance?.user.username ?? '',
    ordering: '',
  }, false); // disabled by default — only runs on refetch

  // Handle the attempt check after selectedAllowance and pendingAction are set
  useEffect(() => {
    if (!selectedAllowance || !pendingAction) {
      return;
    }

    const checkAttempt = async () => {
      const { data } = await refetch();
      const hasAttempt = data?.results.some(
        (attempt) => attempt.examId === selectedAllowance.proctoredExam.id
      );

      if (hasAttempt) {
        showModal({
          message: intl.formatMessage(messages.cannotModifyAllowance, {
            action: pendingAction,
            username: selectedAllowance.user.username,
          }),
          variant: 'warning',
        });
        setSelectedAllowance(null);
        setPendingAction(null);
      } else if (pendingAction === 'edit') {
        openEditModal();
        setPendingAction(null);
      } else {
        openDeleteModal();
        setPendingAction(null);
      }
    };

    checkAttempt();
  }, [selectedAllowance, pendingAction, refetch, showModal, intl, openEditModal, openDeleteModal]);

  const handleEditAllowance = (allowance: Allowance) => {
    setSelectedAllowance(allowance);
    setPendingAction('edit');
  };

  const handleDeleteAllowance = (allowance: Allowance) => {
    setSelectedAllowance(allowance);
    setPendingAction('delete');
  };

  const handleCloseEditModal = () => {
    setSelectedAllowance(null);
    setPendingAction(null);
    closeEditModal();
  };

  const handleCloseDeleteModal = () => {
    setSelectedAllowance(null);
    setPendingAction(null);
    closeDeleteModal();
  };

  return (
    <>
      <AllowancesList onClickAdd={openAddModal} onEdit={handleEditAllowance} onDelete={handleDeleteAllowance} />
      <AddAllowanceModal isOpen={isAddModalOpen} onClose={closeAddModal} />
      {selectedAllowance && <EditAllowanceModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} allowance={selectedAllowance} />}
      {selectedAllowance && <DeleteAllowanceModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} allowance={selectedAllowance} />}
    </>
  );
};

export default Allowances;
