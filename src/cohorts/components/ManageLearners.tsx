import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl } from '@openedx/paragon';
import { useCohortContext } from '../../cohorts/components/CohortContext';
import { useAddLearnersToCohort } from '../../cohorts/data/apiHook';
import messages from '../../cohorts/messages';

const ManageLearners = () => {
  const { courseId = '' } = useParams();
  const intl = useIntl();
  const { selectedCohort } = useCohortContext();
  const { mutate: addLearnersToCohort } = useAddLearnersToCohort(courseId, selectedCohort?.id ? Number(selectedCohort.id) : 0);
  const [users, setUsers] = useState('');

  const handleAddLearners = () => {
    addLearnersToCohort(users.split(','), {
      onSuccess: () => {
        // Handle success (e.g., show a success message)
      },
      onError: (error) => {
        console.error(error);
      }
    });
  };

  return (
    <div className="mx-4 my-3.5">
      <h3 className="text-primary-700">{intl.formatMessage(messages.addLearnersTitle)}</h3>
      <p className="x-small mb-2.5">{intl.formatMessage(messages.addLearnersSubtitle)}</p>
      <p className="mb-2 text-primary-500">{intl.formatMessage(messages.addLearnersInstructions)}</p>
      <FormControl
        as="textarea"
        className="mb-2"
        rows={4}
        placeholder={intl.formatMessage(messages.learnersExample)}
        onChange={(e) => setUsers(e.target.value)}
      />
      <p className="x-small mb-2.5">{intl.formatMessage(messages.addLearnersFootnote)}</p>
      <Button variant="primary" className="mt-2" onClick={handleAddLearners}>+ {intl.formatMessage(messages.addLearnersLabel)}</Button>
    </div>
  );
};

export default ManageLearners;
