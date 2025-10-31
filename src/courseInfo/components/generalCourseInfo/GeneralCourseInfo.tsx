import { Card } from '@openedx/paragon';
import { StatusBadge } from './StatusBadge';
import { useCourseInfo } from '../../../data/apiHook';
import { useParams } from 'react-router';
import { FormattedDate, useIntl } from '@openedx/frontend-base';
import { FC, useCallback } from 'react';
import messages from './messages';

const GeneralCourseInfo: FC = () => {
  const intl = useIntl();
  const { courseId } = useParams();
  const { data: courseInfo, isLoading } = useCourseInfo(courseId ?? '');
  const NOT_SET_FALLBACK = intl.formatMessage(messages.courseInfoNotSetFallback);

  const getCourseStatus = useCallback((courseInfo) => {
    if (!courseInfo || (courseInfo.hasStarted === undefined && courseInfo.hasEnded === undefined)) return NOT_SET_FALLBACK;
    if (!courseInfo.hasStarted) return 'Upcoming';
    if (courseInfo.hasStarted && !courseInfo.hasEnded) return 'Active';
    if (courseInfo.hasStarted && courseInfo.hasEnded) return 'Archived';
    return NOT_SET_FALLBACK;
  }, [NOT_SET_FALLBACK]);

  const renderDate = (date: string | null) => {
    if (!date) return NOT_SET_FALLBACK;
    /// Added UTC timezone because it was showing the date with 1 day offset TODO: validate if it is correct
    return <FormattedDate value={date} year="numeric" month="short" day="2-digit" timeZone="UTC" />;
  };

  if (isLoading && !courseInfo) return <>Loading...</>;
  return (
    <Card className="general-course-info">
      <Card.Section>
        <div className="x-small mb-1.5">
          <span className="mr-2">{courseInfo.org ?? NOT_SET_FALLBACK}</span>/
          <span className="mx-2">{courseInfo.courseId ?? NOT_SET_FALLBACK}</span>/
          <span className="ml-2">{courseInfo.run ?? NOT_SET_FALLBACK}</span>
        </div>
        <h3 className="text-primary-700 mb-3">{courseInfo.displayName ?? NOT_SET_FALLBACK}</h3>
        <div className="d-flex align-items-center">
          <div className="mr-4">
            <StatusBadge status={getCourseStatus(courseInfo)} />
          </div>
          <div className="x-small text-body">
            <p className="mb-0">
              {renderDate(courseInfo.start)}
              {' – '}
              {renderDate(courseInfo.end)}
            </p>
          </div>
        </div>
      </Card.Section>
    </Card>
  );
};

export { GeneralCourseInfo };
