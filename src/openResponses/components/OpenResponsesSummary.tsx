import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Icon, Stack } from '@openedx/paragon';
import { EditNote, ViewDay } from '@openedx/paragon/icons';
import { useOpenResponsesData } from '@src/openResponses/data/apiHook';
import messages from '@src/openResponses/messages';

const summaryOrder = [
  'totalResponses',
  'training',
  'peer',
  'self',
  'waiting',
  'staff',
  'finalGradeReceived',
];

const OpenResponsesSummary = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = {} } = useOpenResponsesData(courseId);
  const {
    totalUnits = 0,
    totalAssessments = 0,
  } = data;

  return (
    <>
      <h3 className="text-primary-700">{intl.formatMessage(messages.summaryTitle)}</h3>
      <Stack direction="horizontal" gap={3}>
        <div>
          <div className="x-small text-gray-500">
            <p className="mb-0">{intl.formatMessage(messages.totalUnits)}</p>
          </div>
          <div className="d-flex align-items-center lead">
            <Icon src={ViewDay} />
            <p className="ml-2 mb-0 text-primary-500">{totalUnits}</p>
          </div>
        </div>
        <div>
          <div className="x-small text-gray-500">
            <p className="mb-0">{intl.formatMessage(messages.totalAssessments)}</p>
          </div>
          <div className="d-flex align-items-center lead">
            <Icon src={EditNote} size="lg" />
            <p className="ml-2 mb-0 text-primary-500">{totalAssessments}</p>
          </div>
        </div>
      </Stack>
      <div className="mt-3 row w-md-75 w-lg-50 align-items-end">
        {
          summaryOrder.map((key) => (
            <div className="col" key={key}>
              <div className="x-small text-gray-500">
                <p className="mb-2">{intl.formatMessage(messages[key as keyof typeof messages])}</p>
              </div>
              <div className="lead text-primary-500">
                <p>
                  {data[key as keyof typeof data] ?? 0}
                </p>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default OpenResponsesSummary;
