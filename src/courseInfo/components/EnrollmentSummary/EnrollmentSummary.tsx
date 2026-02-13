import { useIntl } from '@openedx/frontend-base';
import { FC } from 'react';
import messages from './messages';
import { Col, Container, Row, Stack } from '@openedx/paragon';
import { Verified } from '@openedx/paragon/icons';
import { EnrollmentCounter } from './';

import './index.scss';

interface EnrollmentSummaryProps {
  enrollmentCounts: {
    total: number,
    staffAndAdmins?: number,
    learners?: number,
    verified?: number,
    audit?: number,
  },
};

const EnrollmentSummary: FC<EnrollmentSummaryProps> = ({ enrollmentCounts }) => {
  const intl = useIntl();

  return (
    <Container>
      <Row className="my-3">
        <Col xs={12}>
          <h3 className="h3 text-primary-700">{intl.formatMessage(messages.enrollmentSummaryTitle)}</h3>
        </Col>
      </Row>
      <Stack direction="horizontal" gap={5}>
        <EnrollmentCounter
          label={intl.formatMessage(messages.allEnrollmentsLabel)}
          count={enrollmentCounts.total.toString()}
        />
        <div className="vertical-separator" />
        {enrollmentCounts?.staffAndAdmins && (
          <EnrollmentCounter
            label={intl.formatMessage(messages.staffAndAdminsLabel)}
            count={enrollmentCounts.staffAndAdmins?.toString() ?? '0'}
          />
        )}
        {enrollmentCounts?.learners && (
          <EnrollmentCounter
            label={intl.formatMessage(messages.learnersLabel)}
            count={enrollmentCounts.learners?.toString() ?? '0'}
          />
        )}
        {(enrollmentCounts?.learners ?? enrollmentCounts?.verified) && (
          <div className="vertical-separator" />
        )}
        {enrollmentCounts?.verified && (
          <EnrollmentCounter
            label={intl.formatMessage(messages.verifiedLabel)}
            count={enrollmentCounts.verified?.toString() ?? '0'}
            icon={<Verified className="text-primary-400 mr-2" size="1.5rem" />}
          />
        )}
        {enrollmentCounts?.audit && (
          <EnrollmentCounter
            label={intl.formatMessage(messages.auditLabel)}
            count={enrollmentCounts.audit?.toString() ?? '0'}
          />
        )}
      </Stack>
    </Container>
  );
};

export { EnrollmentSummary };
