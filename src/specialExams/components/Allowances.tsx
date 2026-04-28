import { useState } from 'react';
import { useToggle } from '@openedx/paragon';
import AddAllowanceModal from '@src/specialExams/components/AddAllowanceModal';
import AllowancesList from '@src/specialExams/components/AllowancesList';
import EditAllowanceModal from '@src/specialExams/components/EditAllowanceModal';
import DeleteAllowanceModal from '@src/specialExams/components/DeleteAllowanceModal';
import { Allowance } from '@src/specialExams/types';

const Allowances = () => {
  const [isAddModalOpen, openAddModal, closeAddModal] = useToggle(false);
  const [isEditModalOpen, openEditModal, closeEditModal] = useToggle(false);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [selectedAllowance, setSelectedAllowance] = useState<Allowance | null>(null);

  const handleEditAllowance = (allowance: Allowance) => {
    setSelectedAllowance(allowance);
    openEditModal();
  };

  const handleCloseEditModal = () => {
    setSelectedAllowance(null);
    closeEditModal();
  };

  const handleDeleteAllowance = (allowance: Allowance) => {
    setSelectedAllowance(allowance);
    openDeleteModal();
  };

  const handleCloseDeleteModal = () => {
    setSelectedAllowance(null);
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
