import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import {
  Button,
  DataTable,
  Form,
  SearchField,
  Dropdown,
  ModalDialog,
} from '@openedx/paragon';
import { useIssuedCertificates, useRegenerateCertificatesMutation } from '../data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';
import messages from '../messages';
import { CertificateFilter } from '../types';
import { APIError } from '@src/types';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';

const CertificateSearchField = ({ filterValue, setFilter }: { filterValue: string, setFilter: (value: string) => void }) => {
  const intl = useIntl();
  const { inputValue, handleChange } = useDebouncedFilter({
    filterValue,
    setFilter,
    delay: 400,
  });

  return (
    <SearchField
      placeholder={intl.formatMessage(messages.searchPlaceholder)}
      onChange={handleChange}
      value={inputValue}
    />
  );
};

const IssuedCertificates = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CertificateFilter>('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const pageSize = 20;
  const { showToast, showModal, removeAlert } = useAlert();
  const { mutate: regenerateMutation, isPending: isRegenerating } = useRegenerateCertificatesMutation();

  const { data, isLoading, error } = useIssuedCertificates(
    courseId,
    { page: pageIndex, pageSize },
    search,
    filter
  );

  const filterOptions = [
    { value: 'all', label: intl.formatMessage(messages.allLearners) },
    { value: 'received', label: intl.formatMessage(messages.received) },
    { value: 'not_received', label: intl.formatMessage(messages.notReceived) },
    { value: 'audit_passing', label: intl.formatMessage(messages.auditPassing) },
    { value: 'audit_not_passing', label: intl.formatMessage(messages.auditNotPassing) },
    { value: 'error', label: intl.formatMessage(messages.errorState) },
    { value: 'granted_exceptions', label: intl.formatMessage(messages.grantedExceptions) },
    { value: 'invalidated', label: intl.formatMessage(messages.invalidated) },
  ];

  const columns = [
    {
      Header: intl.formatMessage(messages.username),
      accessor: 'username',
    },
    {
      Header: intl.formatMessage(messages.email),
      accessor: 'email',
    },
    {
      Header: intl.formatMessage(messages.enrollmentTrack),
      accessor: 'enrollmentTrack',
    },
    {
      Header: intl.formatMessage(messages.certificateStatus),
      accessor: 'certificateStatus',
    },
    {
      Header: intl.formatMessage(messages.specialCase),
      accessor: 'specialCase',
      Cell: ({ value }) => value || '—',
    },
    {
      Header: intl.formatMessage(messages.exceptionGranted),
      accessor: 'exceptionGranted',
      Cell: ({ value }) => value || '—',
    },
    {
      Header: intl.formatMessage(messages.exceptionNotes),
      accessor: 'exceptionNotes',
      Cell: ({ value }) => value || '—',
    },
    {
      Header: intl.formatMessage(messages.invalidatedBy),
      accessor: 'invalidatedBy',
      Cell: ({ value }) => value || '—',
    },
    {
      Header: intl.formatMessage(messages.invalidationDate),
      accessor: 'invalidationDate',
      Cell: ({ value }) => value || '—',
    },
  ];

  // Determine if regenerate button should be disabled
  const isRegenerateDisabled = filter === 'all' || filter === 'invalidated' || (data?.count || 0) === 0;

  // Get modal content based on filter
  const getModalContent = () => {
    const filterMessages = {
      received: intl.formatMessage(messages.regenerateAllLearnersMessage),
      not_received: intl.formatMessage(messages.regenerateNotReceivedMessage),
      audit_passing: intl.formatMessage(messages.regenerateAuditPassingMessage),
      audit_not_passing: intl.formatMessage(messages.regenerateAuditNotPassingMessage),
      error: intl.formatMessage(messages.regenerateErrorMessage),
      granted_exceptions: intl.formatMessage(messages.generateExceptionsMessage),
    };
    return filterMessages[filter] || intl.formatMessage(messages.regenerateAllLearnersMessage);
  };

  const handleOpenRegenerateModal = () => {
    if (isRegenerateDisabled) return;
    setIsRegenerateModalOpen(true);
  };

  const handleConfirmRegenerate = () => {
    if (!courseId) return;

    // Map filter to API parameters
    const params: any = {};

    if (filter === 'granted_exceptions') {
      params.studentSet = 'allowlisted';
    } else if (filter === 'received') {
      params.statuses = ['downloadable'];
    } else if (filter === 'not_received') {
      params.statuses = ['notpassing', 'unavailable'];
    } else if (filter === 'audit_passing') {
      params.statuses = ['audit_passing'];
    } else if (filter === 'audit_not_passing') {
      params.statuses = ['audit_notpassing'];
    } else if (filter === 'error') {
      params.statuses = ['error'];
    }

    regenerateMutation(
      { courseId, params },
      {
        onSuccess: () => {
          setIsRegenerateModalOpen(false);
          showToast(intl.formatMessage(messages.regenerateSuccess));
        },
        onError: (err: APIError | Error) => {
          setIsRegenerateModalOpen(false);
          const errorMessage = 'response' in err
            ? err.response?.data?.error || intl.formatMessage(messages.regenerateError)
            : err.message;
          showModal({
            confirmText: intl.formatMessage(messages.close),
            message: errorMessage,
            variant: 'danger',
            onConfirm: (id) => removeAlert(id),
          });
        },
      }
    );
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex gap-3">
          <CertificateSearchField filterValue={search} setFilter={setSearch} />
          <Form.Group>
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary">
                {filterOptions.find(opt => opt.value === filter)?.label}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {filterOptions.map(option => (
                  <Dropdown.Item
                    key={option.value}
                    onClick={() => setFilter(option.value as CertificateFilter)}
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenRegenerateModal}
          disabled={isRegenerateDisabled || isRegenerating}
        >
          {intl.formatMessage(messages.regenerateCertificates)}
        </Button>
      </div>

      <ModalDialog
        title={intl.formatMessage(
          filter === 'granted_exceptions'
            ? messages.generateCertificatesTitle
            : messages.regenerateCertificatesTitle
        )}
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        isOverflowVisible={false}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            {intl.formatMessage(
              filter === 'granted_exceptions'
                ? messages.generateCertificatesTitle
                : messages.regenerateCertificatesTitle
            )}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <p>{getModalContent()}</p>
          <p>
            {intl.formatMessage(messages.regenerateConfirmation, {
              action: filter === 'granted_exceptions' ? 'Generate' : 'Regenerate',
              number: data?.count || 0,
            })}
          </p>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button variant="tertiary" onClick={() => setIsRegenerateModalOpen(false)}>
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button variant="primary" onClick={handleConfirmRegenerate} disabled={isRegenerating}>
            {isRegenerating
              ? intl.formatMessage(messages.regenerating)
              : intl.formatMessage(
                  filter === 'granted_exceptions' ? messages.generate : messages.regenerate
                )}
          </Button>
        </ModalDialog.Footer>
      </ModalDialog>

      {error ? (
        <div className="alert alert-danger">Error loading certificates</div>
      ) : (
        <DataTable
          data={data?.results || []}
          columns={columns}
          itemCount={data?.count || 0}
          pageCount={Math.ceil((data?.count || 0) / pageSize)}
          isPaginated
          manualPagination
          isLoading={isLoading}
          state={{
            pageSize,
            pageIndex,
          }}
          fetchData={({ pageIndex: newPageIndex }: { pageIndex: number }) => setPageIndex(newPageIndex)}
        >
          <DataTable.Table />
          <DataTable.EmptyTable content="No certificates found" />
          {Math.ceil((data?.count || 0) / pageSize) > 1 && (
            <DataTable.TableFooter>
              <DataTable.RowStatus />
              <DataTable.TablePagination />
              <DataTable.TablePaginationMinimal />
            </DataTable.TableFooter>
          )}
        </DataTable>
      )}
    </div>
  );
};

export default IssuedCertificates;
