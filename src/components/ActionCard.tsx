import { Button, Card } from '@openedx/paragon';

interface ActionCardProps {
  buttonLabel: string,
  customAction?: React.ReactNode,
  description: string,
  hasBorderBottom?: boolean,
  isLoading?: boolean,
  title: string,
  onButtonClick?: () => void,
}

const ActionCard = ({
  buttonLabel,
  customAction,
  description,
  hasBorderBottom = true,
  isLoading = false,
  title,
  onButtonClick,
}: ActionCardProps) => {
  return (
    <Card className={`bg-light-200 py-2 border-gray-500 rounded-0 shadow-none ${hasBorderBottom ? 'border-bottom' : ''}`} orientation="horizontal">
      <Card.Body className="flex-grow-1">
        <Card.Section>
          <h4 className="mb-2">{title}</h4>
          <p className="text-muted mb-0">{description}</p>
        </Card.Section>
      </Card.Body>
      <Card.Footer className="d-flex align-items-center justify-content-end">
        {customAction ?? (
          <Button
            onClick={onButtonClick}
            disabled={isLoading}
            variant="primary"
          >
            {buttonLabel}
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default ActionCard;
