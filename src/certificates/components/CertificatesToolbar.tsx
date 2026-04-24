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
    <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 mx-4 mt-3 gap-3">
      <div className="d-flex align-items-center gap-3 flex-shrink-1" style={{ minWidth: 0 }}>
        <SearchField
          onSubmit={onSearchChange}
          onChange={onSearchChange}
          placeholder={intl.formatMessage(messages.searchPlaceholder)}
          value={search}
          className="flex-shrink-1"
          style={{ minWidth: '320px', maxWidth: '400px' }}
        />
        <FilterDropdown
          value={filter}
          onChange={onFilterChange}
          className="flex-shrink-0"
        />
      </div>
      <Button
        variant="outline-primary"
        iconBefore={SpinnerIcon}
        onClick={onRegenerateCertificates}
        className="text-nowrap flex-shrink-0"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default CertificatesToolbar;
