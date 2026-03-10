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

const CertificatesToolbar = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  onRegenerateCertificates,
}: CertificatesToolbarProps) => {
  const intl = useIntl();

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
        {intl.formatMessage(messages.regenerateCertificatesButton)}
      </Button>
    </div>
  );
};

export default CertificatesToolbar;
