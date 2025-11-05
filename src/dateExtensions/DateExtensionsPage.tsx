import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import DateExtensionsList from './components/DateExtensionsList';
import { Button, Container } from '@openedx/paragon';
import { useDateExtensions } from './data/apiHook';
import { useParams } from 'react-router-dom';

const mockDateExtensions = [
  { id: 1, username: 'edByun', fullname: 'Ed Byun', email: 'ed.byun@example.com', graded_subsection: 'Three body diagrams', extended_due_date: '2026-07-15' },
];

const DateExtensionsPage = () => {
  const intl = useIntl();
  const { courseId } = useParams();
  const { data, isLoading } = useDateExtensions(courseId ?? '');

  return (
    <Container className="mt-4.5 mb-4 mx-4" fluid="xl">
      <h3>{intl.formatMessage(messages.dateExtensionsTitle)}</h3>
      <div className="d-flex align-items-center justify-content-between mb-3.5">
        <p>filters</p>
        <Button>+ {intl.formatMessage(messages.addIndividualExtension)}</Button>
      </div>
      <DateExtensionsList data={data ?? mockDateExtensions} isLoading={isLoading} />
    </Container>
  );
};

export default DateExtensionsPage;
