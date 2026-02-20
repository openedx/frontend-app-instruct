import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable } from '@openedx/paragon';
import messages from '../messages';

const MembersContent = () => {
  const intl = useIntl();
  const tableColumns = [
    { accessor: 'username', Header: intl.formatMessage(messages.username) },
    { accessor: 'email', Header: intl.formatMessage(messages.email) },
    { accessor: 'role', Header: intl.formatMessage(messages.role) },
  ];

  const additionalColumns = [{
    id: 'actions',
    Header: intl.formatMessage(messages.actions),
    Cell: () => (
      <Button variant="link" size="inline">
        {intl.formatMessage(messages.edit)}
      </Button>
    )
  }];

  return (
    <div>
      <DataTable
        additionalColumns={additionalColumns}
        columns={tableColumns}
        data={[]}
        RowStatusComponent={() => null}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.EmptyTable content={intl.formatMessage(messages.noTeamMembers)} />
        <DataTable.TableFooter />
      </DataTable>
    </div>
  );
};

export default MembersContent;
