import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Tab, Tabs } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { useAlert } from '@src/providers/AlertProvider';
import { filterCertificates, parseLearnersCount } from '@src/utils/formatters';
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
import { CertificateFilter, CertificateStatus, SpecialCase } from './types';
import { CERTIFICATES_PAGE_SIZE, TAB_KEYS, MODAL_TITLES, ALERT_VARIANTS } from './constants';
import { getErrorMessage } from './utils/errorHandling';
import messages from './messages';

const CertificatesPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { showToast, showModal } = useAlert();

  const [filter, setFilter] = useState<CertificateFilter>(CertificateFilter.ALL_LEARNERS);
  const [search, setSearch] = useState('');
  const [certificatesPage, setCertificatesPage] = useState(0);
  const [tasksPage, setTasksPage] = useState(0);
  const [activeTab, setActiveTab] = useState(TAB_KEYS.ISSUED);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isCertificateGenerationEnabled, setIsCertificateGenerationEnabled] = useState(true);

  const [isGrantExceptionsOpen, setIsGrantExceptionsOpen] = useState(false);
  const [isInvalidateCertificateOpen, setIsInvalidateCertificateOpen] = useState(false);
  const [isRemoveInvalidationOpen, setIsRemoveInvalidationOpen] = useState(false);
  const [isDisableCertificatesOpen, setIsDisableCertificatesOpen] = useState(false);

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

  const matchesFilter = useCallback((item: typeof dummyCertificateData[0]) => {
    switch (filter) {
      case CertificateFilter.RECEIVED:
        return item.certificateStatus === CertificateStatus.RECEIVED;
      case CertificateFilter.NOT_RECEIVED:
        return item.certificateStatus === CertificateStatus.NOT_RECEIVED;
      case CertificateFilter.AUDIT_PASSING:
        return item.certificateStatus === CertificateStatus.AUDIT_PASSING;
      case CertificateFilter.AUDIT_NOT_PASSING:
        return item.certificateStatus === CertificateStatus.AUDIT_NOT_PASSING;
      case CertificateFilter.ERROR_STATE:
        return item.certificateStatus === CertificateStatus.ERROR_STATE;
      case CertificateFilter.GRANTED_EXCEPTIONS:
        return item.specialCase === SpecialCase.EXCEPTION;
      case CertificateFilter.INVALIDATED:
        return item.specialCase === SpecialCase.INVALIDATION;
      case CertificateFilter.ALL_LEARNERS:
      default:
        return true;
    }
  }, [filter]);

  const filteredData = useMemo(
    () => filterCertificates(dummyCertificateData, matchesFilter, search),
    [matchesFilter, search],
  );

  const handleGrantExceptions = useCallback((learners: string, notes: string) => {
    const count = parseLearnersCount(learners);
    grantExceptions(
      { learners, notes },
      {
        onSuccess: () => {
          setIsGrantExceptionsOpen(false);
          showToast(intl.formatMessage(messages.exceptionsGrantedToast, { count }));
        },
        onError: (error) => {
          showModal({
            title: MODAL_TITLES.ERROR,
            message: getErrorMessage(error, intl.formatMessage(messages.errorGrantException)),
            variant: ALERT_VARIANTS.DANGER,
          });
        },
      },
    );
  }, [grantExceptions, showToast, showModal, intl]);

  const handleInvalidateCertificate = useCallback((learners: string, notes: string) => {
    const count = parseLearnersCount(learners);
    invalidateCert(
      { learners, notes },
      {
        onSuccess: () => {
          setIsInvalidateCertificateOpen(false);
          showToast(intl.formatMessage(messages.certificatesInvalidatedToast, { count }));
        },
        onError: (error) => {
          showModal({
            title: MODAL_TITLES.ERROR,
            message: getErrorMessage(error, intl.formatMessage(messages.errorInvalidateCertificate)),
            variant: ALERT_VARIANTS.DANGER,
          });
        },
      },
    );
  }, [invalidateCert, showToast, showModal, intl]);

  const handleRemoveException = useCallback((username: string, email: string) => {
    removeExcept(
      { username },
      {
        onSuccess: () => {
          showToast(intl.formatMessage(messages.exceptionRemovedToast, { email }));
        },
        onError: (error) => {
          showModal({
            title: MODAL_TITLES.ERROR,
            message: getErrorMessage(error, intl.formatMessage(messages.errorRemoveException)),
            variant: ALERT_VARIANTS.DANGER,
          });
        },
      },
    );
  }, [removeExcept, showToast, showModal, intl]);

  const handleRemoveInvalidationClick = useCallback((username: string, email: string) => {
    setSelectedUsername(username);
    setSelectedEmail(email);
    setIsRemoveInvalidationOpen(true);
  }, []);

  const handleRemoveInvalidationConfirm = useCallback(() => {
    removeInval(
      { username: selectedUsername },
      {
        onSuccess: () => {
          setIsRemoveInvalidationOpen(false);
          setSelectedUsername('');
          setSelectedEmail('');
          showToast(intl.formatMessage(messages.invalidationRemovedToast, { email: selectedEmail }));
        },
        onError: (error) => {
          showModal({
            title: MODAL_TITLES.ERROR,
            message: getErrorMessage(error, intl.formatMessage(messages.errorRemoveInvalidation)),
            variant: ALERT_VARIANTS.DANGER,
          });
        },
      },
    );
  }, [removeInval, selectedUsername, selectedEmail, showToast, showModal, intl]);

  const handleToggleCertificateGeneration = useCallback(() => {
    const newState = !isCertificateGenerationEnabled;
    toggleGeneration(newState, {
      onSuccess: () => {
        setIsCertificateGenerationEnabled(newState);
        setIsDisableCertificatesOpen(false);
        showToast(
          newState
            ? intl.formatMessage(messages.successEnableCertificates)
            : intl.formatMessage(messages.successDisableCertificates),
        );
      },
      onError: (error) => {
        showModal({
          title: MODAL_TITLES.ERROR,
          message: getErrorMessage(error, intl.formatMessage(messages.errorToggleCertificateGeneration)),
          variant: ALERT_VARIANTS.DANGER,
        });
      },
    });
  }, [isCertificateGenerationEnabled, toggleGeneration, showToast, showModal, intl]);

  const handleRegenerateCertificates = useCallback(() => {
    // TODO: Implement when API is ready
  }, []);

  return (
    <Container className="mt-4.5 mb-4" fluid>
      <CertificatesPageHeader
        onGrantExceptions={() => setIsGrantExceptionsOpen(true)}
        onInvalidateCertificate={() => setIsInvalidateCertificateOpen(true)}
        onDisableCertificates={() => setIsDisableCertificatesOpen(true)}
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
        isOpen={isGrantExceptionsOpen}
        onClose={() => setIsGrantExceptionsOpen(false)}
        onSubmit={handleGrantExceptions}
        isSubmitting={isGrantingExceptions}
      />
      <InvalidateCertificateModal
        isOpen={isInvalidateCertificateOpen}
        onClose={() => setIsInvalidateCertificateOpen(false)}
        onSubmit={handleInvalidateCertificate}
        isSubmitting={isInvalidating}
      />
      <RemoveInvalidationModal
        isOpen={isRemoveInvalidationOpen}
        email={selectedEmail}
        onClose={() => {
          setIsRemoveInvalidationOpen(false);
          setSelectedUsername('');
          setSelectedEmail('');
        }}
        onConfirm={handleRemoveInvalidationConfirm}
        isSubmitting={isRemovingInvalidation}
      />
      <DisableCertificatesModal
        isOpen={isDisableCertificatesOpen}
        isEnabled={isCertificateGenerationEnabled}
        onClose={() => setIsDisableCertificatesOpen(false)}
        onConfirm={handleToggleCertificateGeneration}
        isSubmitting={isTogglingGeneration}
      />
    </Container>
  );
};

export default CertificatesPage;
