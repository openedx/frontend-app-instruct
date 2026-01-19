import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';
import SpecifyProblem from '../../components/SpecifyProblem';

const SingleLearnerContent = () => {
  const intl = useIntl();

  return (
    <>
      <p className="x-small text-primary mt-3">{intl.formatMessage(messages.descriptionSingleLearner)}</p>
      <SpecifyProblem />
    </>
  );
};

export default SingleLearnerContent;
