import { useIntl } from '@openedx/frontend-base';
import CohortCard from './CohortCard';
import messages from '../messages';
import dataDownloadsMessages from '../../dataDownloads/messages';

const SelectedCohortInfo = () => {
  const intl = useIntl();

  return (
    <>
      <CohortCard />
      <p className="mt-3">{intl.formatMessage(messages.cohortDisclaimer)} <a href="/">{intl.formatMessage(dataDownloadsMessages.pageTitle)}</a> {intl.formatMessage(messages.page)}</p>
    </>
  );
};

export default SelectedCohortInfo;
