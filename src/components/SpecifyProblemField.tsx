import { useState } from 'react';
import { Button, Form, Icon, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';

interface SpecifyProblemFieldProps {
  onClick: (problemLocation: string, event: React.MouseEvent<HTMLButtonElement>) => void,
  problemResponsesError?: string,
  disabled?: boolean,
  fieldLabel: string,
  buttonLabel: string,
}

const SpecifyProblemField = ({
  onClick,
  problemResponsesError,
  disabled,
  fieldLabel,
  buttonLabel,
}: SpecifyProblemFieldProps) => {
  const intl = useIntl();
  const [problemLocation, setProblemLocation] = useState('');

  const { inputValue, handleChange } = useDebouncedFilter({
    filterValue: problemLocation,
    setFilter: setProblemLocation,
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick(inputValue, event);
  };

  return (
    <Form.Group className="mb-0" isInvalid={!!problemResponsesError} size="sm">
      <Form.Label className="d-flex align-content-end align-items-center gap-2 text-primary-500">
        {fieldLabel}
        <OverlayTrigger
          placement="top"
          overlay={(
            <Tooltip id="problem-location-tooltip" className="info-tooltip">
              {intl.formatMessage(messages.problemLocationTooltip)}
            </Tooltip>
          )}
        >
          <Icon src={InfoOutline} size="sm" aria-label={intl.formatMessage(messages.problemLocationInfoIconLabel)} />
        </OverlayTrigger>
      </Form.Label>
      <div className="d-flex align-items-center">
        <Form.Control
          type="text"
          placeholder={intl.formatMessage(messages.problemLocationPlaceholder)}
          value={problemLocation}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
          className="flex-grow-1"
          size="md"
        />
        {problemResponsesError && (
          <Form.Control.Feedback type="invalid">
            {problemResponsesError}
          </Form.Control.Feedback>
        )}
        <Button
          variant="primary"
          onClick={handleClick}
          disabled={disabled}
          className="text-nowrap"
        >
          {buttonLabel}
        </Button>
      </div>
    </Form.Group>
  );
};

export default SpecifyProblemField;
