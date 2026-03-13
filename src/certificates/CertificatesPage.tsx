import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Tabs, Tab, Spinner } from '@openedx/paragon';
import messages from './messages';
import IssuedCertificates from './components/IssuedCertificates';
import CertificateGenerationHistory from './components/CertificateGenerationHistory';
import { useCertificateConfig } from './data/apiHook';
import PageNotFound from '@src/components/PageNotFound';

const CertificatesPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState('issued');
  const { data: config, isLoading, error } = useCertificateConfig(courseId);

  // Check if we got a 404 or if certificates are not enabled
  const is404 = (error as any)?.response?.status === 404;
  const certificatesNotEnabled = !isLoading && config && !config.enabled;

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (is404 || certificatesNotEnabled) {
    return <PageNotFound />;
  }

  return (
    <div className="mt-4.5 mb-4 mx-4">
      <h3>{intl.formatMessage(messages.certificatesTitle)}</h3>

      <Tabs
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key as string)}
        className="mb-3"
      >
        <Tab
          eventKey="issued"
          title={intl.formatMessage(messages.issuedCertificatesTab)}
        >
          <IssuedCertificates />
        </Tab>
        <Tab
          eventKey="history"
          title={intl.formatMessage(messages.generationHistoryTab)}
        >
          <CertificateGenerationHistory />
        </Tab>
      </Tabs>
    </div>
  );
};

export default CertificatesPage;
