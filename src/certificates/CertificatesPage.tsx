import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Tab, Tabs } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import CertificatesPageHeader from './components/CertificatesPageHeader';
import IssuedCertificatesTab from './components/IssuedCertificatesTab';
import GenerationHistoryTable from './components/GenerationHistoryTable';
import GrantExceptionsModal from './components/GrantExceptionsModal';
import InvalidateCertificateModal from './components/InvalidateCertificateModal';
import RemoveInvalidationModal from './components/RemoveInvalidationModal';
import DisableCertificatesModal from './components/DisableCertificatesModal';
import { dummyCertificateData } from './data/dummyData';
import {
  useGrantBulkExceptions,
  useInstructorTasks,
  useInvalidateCertificate,
  useRemoveException,
  useRemoveInvalidation,
  useToggleCertificateGeneration,
} from './data/apiHook';
import { CertificateFilter } from './types';
import { useModalState } from './hooks/useModalState';
import { useMutationCallbacks } from './hooks/useMutationCallbacks';
import { filterCertificates } from './utils/filterUtils';
import { parseLearnersCount } from './utils/errorHandling';
import { CERTIFICATES_PAGE_SIZE, TAB_KEYS } from './constants';
import messages from './messages';

const CertificatesPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { createCallbacks } = useMutationCallbacks();

  const [filter, setFilter] = useState<CertificateFilter>(CertificateFilter.ALL_LEARNERS);
  const [search, setSearch] = useState('');
  const [certificatesPage, setCertificatesPage] = useState(0);
  const [tasksPage, setTasksPage] = useState(0);
  const [activeTab, setActiveTab] = useState(TAB_KEYS.ISSUED);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isCertificateGenerationEnabled, setIsCertificateGenerationEnabled] = useState(true);

  const [modals, modalActions] = useModalState();

  const {
    data: tasksData,
    isLoading: isLoadingTasks,
  } = useInstructorTasks(courseId, {
    page: tasksPage,
    pageSize: CERTIFICATES_PAGE_SIZE,
  });

  const { mutate: grantExceptions, isPending: isGrantingExceptions } = useGrantBulkExceptions(courseId);
  const { mutate: invalidateCert, isPending: isInvalidating } = useInvalidateCertificate(courseId);
  const { mutate: removeExcept } = useRemoveException(courseId);
  const { mutate: removeInval, isPending: isRemovingInvalidation } = useRemoveInvalidation(courseId);
  const { mutate: toggleGeneration, isPending: isTogglingGeneration } = useToggleCertificateGeneration(courseId);

  const filteredData = useMemo(
    () => filterCertificates(dummyCertificateData, filter, search),
    [filter, search],
  );

  const handleGrantExceptions = useCallback((learners: string, notes: string) => {
    const count = parseLearnersCount(learners);
    grantExceptions(
      { learners, notes },
      createCallbacks({
        onSuccess: () => modalActions.closeGrantExceptions(),
        successMessage: intl.formatMessage(messages.exceptionsGrantedToast, { count }),
        errorMessage: intl.formatMessage(messages.errorGrantException),
      }),
    );
  }, [grantExceptions, createCallbacks, modalActions, intl]);

  const handleInvalidateCertificate = useCallback((learners: string, notes: string) => {
    const count = parseLearnersCount(learners);
    invalidateCert(
      { learners, notes },
      createCallbacks({
        onSuccess: () => modalActions.closeInvalidateCertificate(),
        successMessage: intl.formatMessage(messages.certificatesInvalidatedToast, { count }),
        errorMessage: intl.formatMessage(messages.errorInvalidateCertificate),
      }),
    );
  }, [invalidateCert, createCallbacks, modalActions, intl]);

  const handleRemoveException = useCallback((username: string, email: string) => {
    removeExcept(
      { username },
      createCallbacks({
        successMessage: intl.formatMessage(messages.exceptionRemovedToast, { email }),
        errorMessage: intl.formatMessage(messages.errorRemoveException),
      }),
    );
  }, [removeExcept, createCallbacks, intl]);

  const handleRemoveInvalidationClick = useCallback((username: string, email: string) => {
    setSelectedUsername(username);
    setSelectedEmail(email);
    modalActions.openRemoveInvalidation();
  }, [modalActions]);

  const handleRemoveInvalidationConfirm = useCallback(() => {
    removeInval(
      { username: selectedUsername },
      createCallbacks({
        onSuccess: () => {
          modalActions.closeRemoveInvalidation();
          setSelectedUsername('');
          setSelectedEmail('');
        },
        successMessage: intl.formatMessage(messages.invalidationRemovedToast, { email: selectedEmail }),
        errorMessage: intl.formatMessage(messages.errorRemoveInvalidation),
      }),
    );
  }, [removeInval, selectedUsername, selectedEmail, createCallbacks, modalActions, intl]);

  const handleToggleCertificateGeneration = useCallback(() => {
    const newState = !isCertificateGenerationEnabled;
    toggleGeneration(newState, createCallbacks({
      onSuccess: () => {
        setIsCertificateGenerationEnabled(newState);
        modalActions.closeDisableCertificates();
      },
      successMessage: newState
        ? intl.formatMessage(messages.successEnableCertificates)
        : intl.formatMessage(messages.successDisableCertificates),
      errorMessage: intl.formatMessage(messages.errorToggleCertificateGeneration),
    }));
  }, [isCertificateGenerationEnabled, toggleGeneration, createCallbacks, modalActions, intl]);

  const handleRegenerateCertificates = useCallback(() => {
    // TODO: Implement when API is ready
  }, []);

  return (
    <Container className="mt-4.5 mb-4" fluid>
      <CertificatesPageHeader
        onGrantExceptions={modalActions.openGrantExceptions}
        onInvalidateCertificate={modalActions.openInvalidateCertificate}
        onDisableCertificates={modalActions.openDisableCertificates}
      />

      <Card variant="muted" className="pt-3 pt-md-4 pb-4 pb-md-6 certificates-card">
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key || TAB_KEYS.ISSUED)}
          className="mx-4"
          variant="button-group"
        >
          <Tab eventKey={TAB_KEYS.ISSUED} title={intl.formatMessage(messages.issuedCertificatesTab)}>
            <IssuedCertificatesTab
              data={filteredData}
              isLoading={false}
              itemCount={filteredData.length}
              pageCount={Math.ceil(filteredData.length / CERTIFICATES_PAGE_SIZE)}
              search={search}
              onSearchChange={setSearch}
              filter={filter}
              onFilterChange={setFilter}
              currentPage={certificatesPage}
              onPageChange={setCertificatesPage}
              onRemoveException={handleRemoveException}
              onRemoveInvalidation={handleRemoveInvalidationClick}
              onRegenerateCertificates={handleRegenerateCertificates}
            />
          </Tab>
          <Tab eventKey={TAB_KEYS.HISTORY} title={intl.formatMessage(messages.generationHistoryTab)}>
            <div className="d-flex flex-column mt-3 mt-md-4">
              <GenerationHistoryTable
                data={tasksData?.results || []}
                isLoading={isLoadingTasks}
                itemCount={tasksData?.count || 0}
                pageCount={tasksData?.numPages || 0}
                currentPage={tasksPage}
                onPageChange={setTasksPage}
              />
            </div>
          </Tab>
        </Tabs>
      </Card>

      <GrantExceptionsModal
        isOpen={modals.grantExceptions}
        onClose={modalActions.closeGrantExceptions}
        onSubmit={handleGrantExceptions}
        isSubmitting={isGrantingExceptions}
      />
      <InvalidateCertificateModal
        isOpen={modals.invalidateCertificate}
        onClose={modalActions.closeInvalidateCertificate}
        onSubmit={handleInvalidateCertificate}
        isSubmitting={isInvalidating}
      />
      <RemoveInvalidationModal
        isOpen={modals.removeInvalidation}
        email={selectedEmail}
        onClose={() => {
          modalActions.closeRemoveInvalidation();
          setSelectedUsername('');
          setSelectedEmail('');
        }}
        onConfirm={handleRemoveInvalidationConfirm}
        isSubmitting={isRemovingInvalidation}
      />
      <DisableCertificatesModal
        isOpen={modals.disableCertificates}
        isEnabled={isCertificateGenerationEnabled}
        onClose={modalActions.closeDisableCertificates}
        onConfirm={handleToggleCertificateGeneration}
        isSubmitting={isTogglingGeneration}
      />
    </Container>
  );
};

export default CertificatesPage;
