import { Tabs, Tab } from '@openedx/paragon';
import { REPORTS_TABS } from '../constants';
import { useIntl } from '@openedx/frontend-base';
import { ActionCard } from '../../components/ActionCard';
import { useTriggerReportGeneration } from '../data/apiHook';
import { useParams } from 'react-router-dom';

export const GenerateReportsTabs = () => {
  const { courseId = '' } = useParams();
  const intl = useIntl();
  const { mutate: triggerReportGeneration, isPending } = useTriggerReportGeneration(courseId);
  return (
    <Tabs
      className="generate-reports-tabs"
      variant="tabs"
    >
      {REPORTS_TABS.map((tab) => (
        <Tab key={tab.key} eventKey={tab.key} title={intl.formatMessage(tab.title)}>
          { tab.reports.map((report) => (
            <ActionCard
              key={report.reportKey}
              title={intl.formatMessage(report.reportName)}
              description={intl.formatMessage(report.reportDescription)}
              buttonLabel={intl.formatMessage(report.buttonText)}
              onButtonClick={() => triggerReportGeneration(report.reportKey)}
              customActions={report.customAction ? <report.customAction /> : undefined}
              isLoading={isPending}
            />
          )) }
        </Tab>
      ))}

    </Tabs>
  );
};
