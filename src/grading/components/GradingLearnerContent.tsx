import { useIntl } from '@openedx/frontend-base';
import SpecifyProblem from '@src/components/SpecifyProblem';
import messages from '@src/grading/messages';
import { GradingToolsType } from '@src/grading/types';

interface GradingLearnerContentProps {
  toolType: GradingToolsType,
}

const GradingLearnerContent = ({ toolType }: GradingLearnerContentProps) => {
  const intl = useIntl();

  return (
    <>
      <p className="x-small text-primary mt-3">
        {
          toolType === 'single'
            ? intl.formatMessage(messages.descriptionSingleLearner)
            : intl.formatMessage(messages.descriptionAllLearners)
        }
      </p>
      <SpecifyProblem />
    </>
  );
};

export default GradingLearnerContent;
