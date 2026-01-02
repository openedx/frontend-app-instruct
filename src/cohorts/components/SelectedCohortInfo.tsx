import { useIntl } from '@openedx/frontend-base';
import { useParams } from 'react-router-dom';
import CohortCard from './CohortCard';
import messages from '../messages';
import dataDownloadsMessages from '../../dataDownloads/messages';

const SelectedCohortInfo = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();

  return (
    <>
      <CohortCard />
      <p className="mt-3">
        {intl.formatMessage(messages.cohortDisclaimer)} <a href={`/instructor/${courseId}/data_downloads`}>{intl.formatMessage(dataDownloadsMessages.pageTitle)}</a> {intl.formatMessage(messages.page)}
      </p>
    </>
  );
};

export default SelectedCohortInfo;
