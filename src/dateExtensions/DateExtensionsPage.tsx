import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import DateExtensionsList from './components/DateExtensionsList';
import { Button } from '@openedx/paragon';

const DateExtensionsPage = () => {
  const intl = useIntl();
  return (
    <div>
      <h3>{intl.formatMessage(messages.dateExtensionsTitle)}</h3>
      <div className="d-flex align-items-center justify-content-between">
        <p>filters</p>
        <Button>+ {intl.formatMessage(messages.addIndividualExtension)}</Button>
      </div>
      <DateExtensionsList />
    </div>
  );
};

export default DateExtensionsPage;
