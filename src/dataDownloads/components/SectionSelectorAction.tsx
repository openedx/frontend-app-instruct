import { Button, Card, Form, FormLabel, Icon, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import { messages } from '../messages';
import { useIntl } from '@openedx/frontend-base';

const SectionSelectorAction = () => {
  const intl = useIntl();
  return (
    <Card.Footer className="flex-2 justify-content-end">
      <Form.Group>
        <div className="d-flex flex-column">
          <div className="d-flex flex-row">
            <FormLabel className="mr-2">{intl.formatMessage(messages.sectionOrProblemLabel)}</FormLabel>
            <OverlayTrigger
              key="tooltip-top"
              placement="top"
              overlay={(
                <Tooltip id="tooltip-top">
                  {intl.formatMessage(messages.sectionOrProblemExampleTooltipText)}
                </Tooltip>
              )}
            >
              <Icon src={InfoOutline} />
            </OverlayTrigger>
          </div>
          <div className="d-flex flex-row">
            <Form.Control className="mr-2" />
            <Button onClick={() => {}}>{intl.formatMessage(messages.problemResponseReportsTabProblemResponseReportButtonText)}</Button>
          </div>
        </div>

      </Form.Group>

    </Card.Footer>
  );
};

export { SectionSelectorAction };
