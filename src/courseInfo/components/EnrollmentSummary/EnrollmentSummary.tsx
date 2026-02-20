import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import { Col, Row, Skeleton, Stack } from '@openedx/paragon';
import { Verified } from '@openedx/paragon/icons';
import { EnrollmentCounter } from './';
import { useParams } from 'react-router-dom';
import { useCourseInfo } from '@src/data/apiHook';

const EnrollmentSummary = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const { data: courseInfo, isLoading } = useCourseInfo(courseId);
  const { enrollmentCounts, staffCount = 0, learnerCount = 0 } = courseInfo ?? {};

  return (
    <>
      <Row className="my-3">
        <Col xs={12}>
          <h3 className="h3 text-primary-700">{intl.formatMessage(messages.enrollmentSummaryTitle)}</h3>
        </Col>
      </Row>
      {
        isLoading ? (
          <>
            <Skeleton count={1} width="50%" className="mb-2" />
            <Skeleton count={1} width="50%" className="mb-2 lead" />
          </>
        ) : (
          <Stack direction="horizontal" gap={5}>
            <EnrollmentCounter
              label={intl.formatMessage(messages.allEnrollmentsLabel)}
              count={enrollmentCounts.total.toLocaleString()}
            />
            <div className="h-auto border-light-400 border-left align-self-stretch" />
            <EnrollmentCounter
              label={intl.formatMessage(messages.staffAndAdminsLabel)}
              count={staffCount.toLocaleString() ?? '0'}
            />
            <EnrollmentCounter
              label={intl.formatMessage(messages.learnersLabel)}
              count={learnerCount?.toLocaleString() ?? '0'}
            />
            <div className="h-auto border-light-400 border-left align-self-stretch" />
            {
              Object.entries(enrollmentCounts).map(([type, count]) => {
                if (type === 'total' || count === undefined) {
                  return null;
                }
                return (
                  <EnrollmentCounter
                    key={type}
                    label={intl.formatMessage(messages[`${type}` as keyof typeof messages] ?? { id: 'fallback', defaultMessage: type, description: `${type} label` })}
                    count={count?.toLocaleString() ?? '0'}
                    icon={type === 'verified' ? <Verified className="text-primary-400 mr-2" size="1.5rem" /> : undefined}
                  />
                );
              })
            }
          </Stack>
        )
      }
    </>
  );
};

export { EnrollmentSummary };
