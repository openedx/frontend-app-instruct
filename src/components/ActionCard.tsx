import { Button, Card } from '@openedx/paragon';

interface ActionCardProps {
  title: string,
  description: string,
  buttonLabel: string,
  onButtonClick?: () => void,
  customAction?: React.ReactNode,
  isLoading?: boolean,
}

const ActionCard = ({
  title,
  description,
  buttonLabel,
  onButtonClick,
  customAction,
  isLoading = false
}: ActionCardProps) => {
  return (
    <Card className="action-card py-2" orientation="horizontal">
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
