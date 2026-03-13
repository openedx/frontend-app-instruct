import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import {
  Button,
  DataTable,
  Form,
  Dropdown,
  ModalDialog,
} from '@openedx/paragon';
import { useIssuedCertificates, useRegenerateCertificatesMutation } from '../data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';
import messages from '../messages';
import { CertificateFilter } from '../types';
import { APIError } from '@src/types';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';
import { FormControl, Icon } from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';

const SearchFilter = ({ column: { filterValue, setFilter } }: { column: { filterValue: string, setFilter: (value: string) => void } }) => {
  const intl = useIntl();
  const { inputValue, handleChange } = useDebouncedFilter({
    filterValue,
    setFilter,
    delay: 400,
  });

  return (
    <FormControl
      className="mb-0"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
      placeholder={intl.formatMessage(messages.searchPlaceholder)}
      trailingElement={<Icon src={Search} />}
      value={inputValue}
    />
  );
};

const FilterDropdownFilter = ({ column: { filterValue, setFilter } }: { column: { filterValue: string, setFilter: (value: string) => void } }) => {
  const intl = useIntl();

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

  return (
    <Form.Group className="mb-0">
      <Dropdown>
        <Dropdown.Toggle variant="outline-primary">
          {filterOptions.find(opt => opt.value === (filterValue || 'all'))?.label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {filterOptions.map(option => (
            <Dropdown.Item
              key={option.value}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Form.Group>
  );
};

const IssuedCertificates = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [filters, setFilters] = useState<{ page: number, search: string, filter: CertificateFilter }>({
    page: 0,
    search: '',
    filter: 'all',
  });
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const pageSize = 10;
  const { showToast, showModal, removeAlert } = useAlert();
  const { mutate: regenerateMutation, isPending: isRegenerating } = useRegenerateCertificatesMutation();

  const { data, isLoading, error } = useIssuedCertificates(
    courseId,
    { page: filters.page, pageSize },
    filters.search,
    filters.filter
  );

  const columns = [
    {
      Header: intl.formatMessage(messages.username),
      accessor: 'username',
      Filter: SearchFilter,
    },
    {
      Header: intl.formatMessage(messages.email),
      accessor: 'email',
      Filter: FilterDropdownFilter,
    },
    {
      Header: intl.formatMessage(messages.enrollmentTrack),
      accessor: 'enrollmentTrack',
      disableFilters: true,
    },
    {
      Header: intl.formatMessage(messages.certificateStatus),
      accessor: 'certificateStatus',
      disableFilters: true,
    },
    {
      Header: intl.formatMessage(messages.specialCase),
      accessor: 'specialCase',
      Cell: ({ value }) => value || '—',
      disableFilters: true,
    },
    {
      Header: intl.formatMessage(messages.exceptionGranted),
      accessor: 'exceptionGranted',
      Cell: ({ value }) => value || '—',
      disableFilters: true,
    },
    {
      Header: intl.formatMessage(messages.exceptionNotes),
      accessor: 'exceptionNotes',
      Cell: ({ value }) => value || '—',
      disableFilters: true,
    },
    {
      Header: intl.formatMessage(messages.invalidatedBy),
      accessor: 'invalidatedBy',
      Cell: ({ value }) => value || '—',
      disableFilters: true,
    },
    {
      Header: intl.formatMessage(messages.invalidationDate),
      accessor: 'invalidationDate',
      Cell: ({ value }) => value || '—',
      disableFilters: true,
    },
  ];

  const handleFetchData = (data: { pageIndex: number, filters: { id: string, value: string }[] }) => {
    const searchFilter = data.filters.find((filter) => filter.id === 'username');
    const newSearch = searchFilter ? searchFilter.value : '';
    const filterFilter = data.filters.find((filter) => filter.id === 'email');
    const newFilter = filterFilter ? filterFilter.value as CertificateFilter : 'all';

    const filterChanged = newSearch !== filters.search || newFilter !== filters.filter;
    const pageChanged = data.pageIndex !== filters.page;

    // If filters changed, reset to page 0
    if (filterChanged) {
      setFilters({ page: 0, search: newSearch, filter: newFilter });
    } else if (pageChanged) {
      // If only page changed (filters didn't change), update page
      setFilters({ page: data.pageIndex, search: newSearch, filter: newFilter });
    }
  };

  // Determine if regenerate button should be disabled
  const isRegenerateDisabled = filters.filter === 'all' || filters.filter === 'invalidated' || (data?.count || 0) === 0;

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
    return filterMessages[filters.filter] || intl.formatMessage(messages.regenerateAllLearnersMessage);
  };

  const handleOpenRegenerateModal = () => {
    if (isRegenerateDisabled) return;
    setIsRegenerateModalOpen(true);
  };

  const handleConfirmRegenerate = () => {
    if (!courseId) return;

    // Map filter to API parameters
    const params: any = {};

    if (filters.filter === 'granted_exceptions') {
      params.studentSet = 'allowlisted';
    } else if (filters.filter === 'received') {
      params.statuses = ['downloadable'];
    } else if (filters.filter === 'not_received') {
      params.statuses = ['notpassing', 'unavailable'];
    } else if (filters.filter === 'audit_passing') {
      params.statuses = ['audit_passing'];
    } else if (filters.filter === 'audit_not_passing') {
      params.statuses = ['audit_notpassing'];
    } else if (filters.filter === 'error') {
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
      <ModalDialog
        title={intl.formatMessage(
          filters.filter === 'granted_exceptions'
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
              filters.filter === 'granted_exceptions'
                ? messages.generateCertificatesTitle
                : messages.regenerateCertificatesTitle
            )}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <p>{getModalContent()}</p>
          <p>
            {intl.formatMessage(messages.regenerateConfirmation, {
              action: filters.filter === 'granted_exceptions' ? 'Generate' : 'Regenerate',
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
                  filters.filter === 'granted_exceptions' ? messages.generate : messages.regenerate
                )}
          </Button>
        </ModalDialog.Footer>
      </ModalDialog>

      {error ? (
        <div className="alert alert-danger">Error loading certificates</div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.results || []}
          fetchData={handleFetchData}
          state={{
            pageIndex: filters.page,
            pageSize,
            filters: [
              {
                id: 'username',
                value: filters.search,
              },
              {
                id: 'email',
                value: filters.filter,
              }
            ]
          }}
          isFilterable
          numBreakoutFilters={2}
          isLoading={isLoading}
          isPaginated
          itemCount={data?.count || 0}
          manualFilters
          manualPagination
          pageSize={pageSize}
          pageCount={Math.ceil((data?.count || 0) / pageSize)}
          FilterStatusComponent={() => null}
        >
          <div className="d-flex justify-content-between align-items-start pt-1 mx-3 mb-3">
            <DataTable.TableControlBar />
            <Button
              className="mt-2.5"
              variant="primary"
              onClick={handleOpenRegenerateModal}
              disabled={isRegenerateDisabled || isRegenerating}
            >
              {intl.formatMessage(messages.regenerateCertificates)}
            </Button>
          </div>
          <DataTable.Table />
          <DataTable.EmptyTable content="No certificates found" />
          <DataTable.TableFooter />
        </DataTable>
      )}
    </div>
  );
};

export default IssuedCertificates;
