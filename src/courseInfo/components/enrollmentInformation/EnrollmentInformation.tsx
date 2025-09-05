import { useIntl } from '@openedx/frontend-base';
import messages from './messages';

const EnrollmentInformation = () => {
  const intl = useIntl();

  return (
    <div>
      <h2>{intl.formatMessage(messages.enrollmentSectionTitle)}</h2>
    </div>
  );
};

export default EnrollmentInformation;
