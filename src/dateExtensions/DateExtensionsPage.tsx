import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import DateExtensionsList from './components/DateExtensionsList';
import { Button } from '@openedx/paragon';
import { LearnerDateExtension } from './types';

// const successMessage = 'Successfully reset due date for student Phu Nguyen for A subsection with two units (block-v1:SchemaAximWGU+WGU101+1+type@sequential+block@3984030755104708a86592cf23fb1ae4) to 2025-08-21 00:00';

const DateExtensionsPage = () => {
  const intl = useIntl();

  const handleResetExtensions = (user: LearnerDateExtension) => {
    // Implementation for resetting extensions will go here
    console.log(user);
  };

  return (
    <div className="mt-4.5 mb-4 mx-4">
      <h3>{intl.formatMessage(messages.dateExtensionsTitle)}</h3>
      <div className="d-flex align-items-center justify-content-between mb-3.5">
        <p>filters</p>
        <Button>+ {intl.formatMessage(messages.addIndividualExtension)}</Button>
      </div>
      <DateExtensionsList onResetExtensions={handleResetExtensions} />
    </div>
  );
};

export default DateExtensionsPage;
