import { Tabs, Tab } from '@openedx/paragon';
import { REPORTS_TABS } from '../constants';
import { useIntl } from '@openedx/frontend-base';
import ActionCard from '@src/components/ActionCard';
import { useTriggerReportGeneration } from '../data/apiHook';
import { useParams } from 'react-router-dom';
import { messages } from '../messages';
import { useToastManager, ToastTypeEnum } from '@src/providers/ToastManagerProvider';

export const ReportGenerationTabs = () => {
  const { courseId = '' } = useParams();
  const intl = useIntl();
  const { mutate: triggerReportGeneration, isPending } = useTriggerReportGeneration(courseId);
  const { showToast } = useToastManager();

  const handleReportGeneration = (report) => {
    triggerReportGeneration(report.reportKey, {
      onSuccess: () => {
        const message = intl.formatMessage(messages.reportGenerationSuccessMessage, { reportName: report.reportName });
        showToast({
          message,
          type: ToastTypeEnum.SUCCESS,
        });
      },
      onError: (error) => {
        console.log('Error generating report:', error);
        showToast({
          message: intl.formatMessage(messages.reportGenerationErrorMessage),
          type: ToastTypeEnum.ERROR,
        });
      },
    });
  };

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
              onButtonClick={() => handleReportGeneration(report)}
              customAction={report.customAction ? <report.customAction /> : undefined}
              isLoading={isPending}
            />
          )) }
        </Tab>
      ))}
    </Tabs>
  );
};
