interface UnenrollModalProps {
  unenrollId: number | null,
  isOpen: boolean,
  onClose: () => void,
}

const UnenrollModal = ({ unenrollId, isOpen, onClose }: UnenrollModalProps) => {
  console.log(unenrollId, isOpen);

  if (!isOpen || unenrollId === null) {
    onClose();
    return null;
  }

  return <div>Unenroll Modal</div>;
};

export default UnenrollModal;
