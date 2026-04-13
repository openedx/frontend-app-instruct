import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable, FormControl, Icon } from '@openedx/paragon';
import { FilterList } from '@openedx/paragon/icons';
import UsernameFilter from '@src/components/UsernameFilter';
import { useRoles, useTeamMembers } from '@src/courseTeam/data/apiHook';
import messages from '@src/courseTeam/messages';
import { Role } from '@src/courseTeam/types';
import { DataTableFetchDataProps } from '@src/types';

const TEAM_MEMBERS_PAGE_SIZE = 25;

const RoleFilter = ({ column: { filterValue, setFilter } }: { column: { filterValue: string, setFilter: (value: string) => void } }) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data } = useRoles(courseId);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const roles = useMemo(() => {
    return [{ value: '', label: intl.formatMessage(messages.allRoles) }, ...(data?.results || []).map((role: Role) => ({ value: role.role, label: role.displayName }))];
  }, [data, intl]);

  return (
    <FormControl
      as="select"
      className="mb-0"
      disabled={!data}
      name="role"
      size="md"
      value={filterValue}
      onChange={handleSelectChange}
      leadingElement={<Icon src={FilterList} />}
    >
      {roles.map(role => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </FormControl>
  );
};

const MembersContent = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [filters, setFilters] = useState({ page: 0, emailOrUsername: '', role: '' });
  const { data: { results: teamMembers = [], numPages = 1, count = 0 } = {}, isLoading = false } = useTeamMembers(courseId, { ...filters, pageSize: TEAM_MEMBERS_PAGE_SIZE });

  const tableColumns = useMemo(() => [
    { accessor: 'username', Header: intl.formatMessage(messages.username), Filter: UsernameFilter },
    { accessor: 'email', Header: intl.formatMessage(messages.email), disableFilters: true },
    { accessor: 'role', Header: intl.formatMessage(messages.role), Filter: RoleFilter },
  ], [intl]);

  const additionalColumns = useMemo(() => [{
    id: 'actions',
    Header: intl.formatMessage(messages.actions),
    Cell: () => (
      <Button variant="link" size="inline">
        {intl.formatMessage(messages.edit)}
      </Button>
    )
  }], [intl]);

  const handleFetchData = (data: DataTableFetchDataProps) => {
    const usernameFilter = data.filters?.find((f) => f.id === 'username');
    const newEmailOrUsername = usernameFilter ? usernameFilter.value : '';
    const rolesFilter = data.filters?.find((f) => f.id === 'role');
    const newRole = rolesFilter ? rolesFilter.value : '';
    const filtersChanged = (newEmailOrUsername !== filters.emailOrUsername) || (newRole !== filters.role);

    if (filtersChanged) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        emailOrUsername: newEmailOrUsername,
        role: newRole,
        page: 0,
      }));
      return;
    }

    if (data.pageIndex !== filters.page) {
      setFilters((prevFilters) => ({ ...prevFilters, page: data.pageIndex }));
    }
  };

  const tableState = useMemo(() => ({
    pageIndex: filters.page,
    pageSize: TEAM_MEMBERS_PAGE_SIZE,
  }), [filters.page]);

  return (
    <DataTable
      additionalColumns={additionalColumns}
      columns={tableColumns}
      data={teamMembers}
      fetchData={handleFetchData}
      state={tableState}
      isFilterable
      isLoading={isLoading}
      isPaginated
      itemCount={count}
      manualFilters
      manualPagination
      numBreakoutFilters={2}
      pageSize={TEAM_MEMBERS_PAGE_SIZE}
      pageCount={numPages}
      RowStatusComponent={() => null}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noTeamMembers)} />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default MembersContent;
