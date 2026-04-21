import { Button, SearchField } from '@openedx/paragon';
import { SpinnerIcon } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import FilterDropdown from './FilterDropdown';
import { CertificateFilter } from '../types';
import messages from '../messages';

interface CertificatesToolbarProps {
  search: string,
  onSearchChange: (value: string) => void,
  filter: CertificateFilter,
  onFilterChange: (value: CertificateFilter) => void,
  onRegenerateCertificates: () => void,
}

const getFilterLabel = (filter: CertificateFilter, intl: any) => {
  const filterMessages: Record<CertificateFilter, any> = {
    [CertificateFilter.ALL_LEARNERS]: messages.filterAllLearners,
    [CertificateFilter.RECEIVED]: messages.filterReceived,
    [CertificateFilter.NOT_RECEIVED]: messages.filterNotReceived,
    [CertificateFilter.AUDIT_PASSING]: messages.filterAuditPassing,
    [CertificateFilter.AUDIT_NOT_PASSING]: messages.filterAuditNotPassing,
    [CertificateFilter.ERROR_STATE]: messages.filterErrorState,
    [CertificateFilter.GRANTED_EXCEPTIONS]: messages.filterGrantedExceptions,
    [CertificateFilter.INVALIDATED]: messages.filterInvalidated,
  };
  return intl.formatMessage(filterMessages[filter]);
};

const CertificatesToolbar = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  onRegenerateCertificates,
}: CertificatesToolbarProps) => {
  const intl = useIntl();

  const buttonText = filter === CertificateFilter.ALL_LEARNERS
    ? intl.formatMessage(messages.regenerateCertificatesButton)
    : intl.formatMessage(messages.regenerateCertificatesButtonWithFilter, {
      filter: getFilterLabel(filter, intl),
    });

  return (
    <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-between mb-4 mx-4 mt-3 gap-3">
      <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2">
        <SearchField
          onSubmit={onSearchChange}
          onChange={onSearchChange}
          placeholder={intl.formatMessage(messages.searchPlaceholder)}
          value={search}
          className="flex-grow-1 w-100 w-sm-auto"
          style={{ minWidth: 'min(400px, 100%)' }}
        />
        <FilterDropdown
          value={filter}
          onChange={onFilterChange}
          className="flex-shrink-0 w-100 w-sm-auto"
        />
      </div>
      <Button
        variant="outline-primary"
        iconBefore={SpinnerIcon}
        onClick={onRegenerateCertificates}
        className="text-nowrap"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default CertificatesToolbar;
