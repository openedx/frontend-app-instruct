import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Icon } from '@openedx/paragon';
import { EditNote, ViewDay } from '@openedx/paragon/icons';
import { useOpenResponsesData } from '../data/apiHook';
import messages from '../messages';

const OpenResponsesSummary = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = {} } = useOpenResponsesData(courseId);
  const {
    totalUnits = '0',
    totalAssessments = '0',
    totalResponses = '0',
    training = '0',
    peer = '0',
    self = '0',
    waiting = '0',
    staff = '0',
    finalGradeReceived = '0',
  } = data;

  return (
    <>
      <h3 className="text-primary-700">{intl.formatMessage(messages.summaryTitle)}</h3>
      <div className="container-mw-xl">
        <div className="row x-small">
          <div className="col-sm-3 col-md-2 col-xl-1">
            <p className="mb-2">{intl.formatMessage(messages.totalUnits)}</p>
          </div>
          <div className="col-sm-4 col-md-3 col-xl-2">
            <p className="mb-2">{intl.formatMessage(messages.totalAssessments)}</p>
          </div>
        </div>
        <div className="row lead">
          <div className="col-sm-3 col-md-2 col-xl-1 d-flex align-items-center">
            <Icon src={ViewDay} />
            <p className="ml-2 mb-0 text-primary-500">{totalUnits}</p>
          </div>
          <div className="col-sm-4 col-md-3 col-xl-2 d-flex align-items-center">
            <Icon src={EditNote} size="lg" />
            <p className="ml-2 mb-0 text-primary-500">{totalAssessments}</p>
          </div>
        </div>
      </div>
      <div className="container-mw-xl mt-3">
        <div className="row align-items-end x-small">
          <div className="col-sm-2 col-lg-1">
            <p className="mb-2">{intl.formatMessage(messages.totalResponses)}</p>
          </div>
          <div className="col-sm-2 col-lg-1">
            <p className="mb-2">{intl.formatMessage(messages.training)}</p>
          </div>
          <div className="col-sm-1">
            <p className="mb-2">{intl.formatMessage(messages.peer)}</p>
          </div>
          <div className="col-sm-1">
            <p className="mb-2">{intl.formatMessage(messages.self)}</p>
          </div>
          <div className="col-sm-2 col-lg-1">
            <p className="mb-2">{intl.formatMessage(messages.waiting)}</p>
          </div>
          <div className="col-sm-2 col-lg-1">
            <p className="mb-2">{intl.formatMessage(messages.staff)}</p>
          </div>
          <div className="col-sm-2 col-lg-1">
            <p className="mb-2">{intl.formatMessage(messages.finalGradeReceived)}</p>
          </div>
        </div>
        <div className="row lead text-primary-500">
          <div className="col-sm-2 col-lg-1">
            <p>{totalResponses}</p>
          </div>
          <div className="col-sm-2 col-lg-1">
            <p>{training}</p>
          </div>
          <div className="col-sm-1">
            <p>{peer}</p>
          </div>
          <div className="col-sm-1">
            <p>{self}</p>
          </div>
          <div className="col-sm-2 col-lg-1">
            <p>{waiting}</p>
          </div>
          <div className="col-sm-2 col-lg-1">
            <p>{staff}</p>
          </div>
          <div className="col-sm-2 col-lg-1">
            <p>{finalGradeReceived}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenResponsesSummary;
