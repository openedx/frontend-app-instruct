/**
 * AlertExamples Component
 *
 * This component demonstrates how to use all three types of alerts from the AlertProvider:
 * 1. Toast Alerts - Temporary notifications that appear and auto-dismiss
 * 2. Modal Alerts - Blocking dialogs that require user action
 * 3. Inline Alerts - Persistent messages displayed inline in the UI
 *
 * Import this component anywhere you want to show example usage.
 * Note: This component can be removed once the alert system is integrated into real features.
 */

import { Alert, Button, Card } from '@openedx/paragon';
import { CheckCircle, WarningFilled, InfoOutline, ErrorOutline } from '@openedx/paragon/icons';
import { useAlert } from '../providers/AlertProvider';

export const AlertExamples = () => {
  const {
    showToast,
    showModal,
    showInlineAlert,
    dismissInlineAlert,
    inlineAlerts,
    // PR #113 compatible API
    alerts,
    addAlert,
    removeAlert,
  } = useAlert();

  // Toast Alert Examples
  const handleSuccessToast = () => {
    showToast('Report generated successfully!', 'success');
  };

  const handleErrorToast = () => {
    showToast('Failed to generate report. Please try again.', 'error');
  };

  const handleWarningToast = () => {
    showToast('This action will take a few minutes to complete.', 'warning');
  };

  const handleInfoToast = () => {
    showToast('Your report is being processed in the background.', 'info');
  };

  // Modal Alert Examples
  const handleConfirmationModal = () => {
    showModal({
      title: 'Delete Report',
      message: 'Are you sure you want to delete this report? This action cannot be undone.',
      variant: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        console.log('Report deleted');
        showToast('Report deleted successfully', 'success');
      },
      onCancel: () => {
        console.log('Delete cancelled');
      },
    });
  };

  const handleWarningModal = () => {
    showModal({
      title: 'Large Report Warning',
      message: 'This report contains over 10,000 rows and may take several minutes to download. Do you want to continue?',
      variant: 'warning',
      confirmText: 'Continue',
      cancelText: 'Cancel',
      onConfirm: () => {
        showToast('Download started', 'info');
      },
    });
  };

  const handleSuccessModal = () => {
    showModal({
      title: 'Report Ready',
      message: 'Your report has been generated successfully and is ready to download.',
      variant: 'success',
      confirmText: 'Download',
      onConfirm: () => {
        console.log('Downloading...');
      },
    });
  };

  // Inline Alert Examples
  const handleShowInlineSuccess = () => {
    showInlineAlert('Your changes have been saved successfully.', 'success', true);
  };

  const handleShowInlineWarning = () => {
    showInlineAlert('This feature is currently in beta. Some functionality may be limited.', 'warning', true);
  };

  const handleShowInlineDanger = () => {
    showInlineAlert('There was an error processing your request. Please check your input and try again.', 'danger', true);
  };

  const handleShowInlineInfo = () => {
    showInlineAlert('Reports are typically generated within 5-10 minutes depending on the size of your course.', 'info', true);
  };

  return (
    <div className="mt-4">
      <h2 className="mb-4">Alert System Examples</h2>

      {/* Toast Examples */}
      <Card className="mb-4">
        <Card.Header>
          <h3>Toast Alerts</h3>
          <p className="small text-muted mb-0">
            Temporary notifications that appear in the corner and auto-dismiss
          </p>
        </Card.Header>
        <Card.Section>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="success" onClick={handleSuccessToast}>
              Success Toast
            </Button>
            <Button variant="danger" onClick={handleErrorToast}>
              Error Toast
            </Button>
            <Button variant="warning" onClick={handleWarningToast}>
              Warning Toast
            </Button>
            <Button variant="info" onClick={handleInfoToast}>
              Info Toast
            </Button>
          </div>
        </Card.Section>
      </Card>

      {/* Modal Examples */}
      <Card className="mb-4">
        <Card.Header>
          <h3>Modal Alerts</h3>
          <p className="small text-muted mb-0">
            Blocking dialogs that require user action
          </p>
        </Card.Header>
        <Card.Section>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="danger" onClick={handleConfirmationModal}>
              Danger Modal
            </Button>
            <Button variant="warning" onClick={handleWarningModal}>
              Warning Modal
            </Button>
            <Button variant="success" onClick={handleSuccessModal}>
              Success Modal
            </Button>
          </div>
        </Card.Section>
      </Card>

      {/* Inline Alert Examples */}
      <Card className="mb-4">
        <Card.Header>
          <h3>Inline Alerts</h3>
          <p className="small text-muted mb-0">
            Persistent messages displayed inline in the UI
          </p>
        </Card.Header>
        <Card.Section>
          <div className="d-flex gap-2 flex-wrap mb-3">
            <Button variant="success" onClick={handleShowInlineSuccess}>
              Success Inline
            </Button>
            <Button variant="warning" onClick={handleShowInlineWarning}>
              Warning Inline
            </Button>
            <Button variant="danger" onClick={handleShowInlineDanger}>
              Danger Inline
            </Button>
            <Button variant="info" onClick={handleShowInlineInfo}>
              Info Inline
            </Button>
          </div>

          {/* Render inline alerts */}
          <div className="mt-3">
            {inlineAlerts.map(alert => (
              <Alert
                key={alert.id}
                variant={alert.variant}
                dismissible={alert.dismissible}
                onClose={() => dismissInlineAlert(alert.id)}
                className="mb-2"
              >
                {alert.message}
              </Alert>
            ))}
          </div>
        </Card.Section>
      </Card>

      {/* PR #113 Compatible API Examples */}
      <Card className="mb-4">
        <Card.Header>
          <h3>PR #113 Compatible Alerts</h3>
          <p className="small text-muted mb-0">
            Drop-in replacement for AlertContext from PR #113 - matches cohorts pattern
          </p>
        </Card.Header>
        <Card.Section>
          <div className="d-flex gap-2 flex-wrap mb-3">
            <Button
              variant="success"
              onClick={() => addAlert({ type: 'success', message: 'Cohort created successfully!' })}
            >
              Add Success Alert
            </Button>
            <Button
              variant="danger"
              onClick={() => addAlert({ type: 'error', message: 'Failed to delete cohort' })}
            >
              Add Error Alert
            </Button>
            <Button
              variant="warning"
              onClick={() => addAlert({ type: 'warning', message: 'This action cannot be undone' })}
            >
              Add Warning Alert
            </Button>
            <Button
              variant="info"
              onClick={() => addAlert({ type: 'info', message: 'New features available' })}
            >
              Add Info Alert
            </Button>
          </div>

          {/* Render PR #113 compatible alerts - matches EnabledCohortsView pattern */}
          <div className="mt-3">
            {alerts.map(alert => (
              <Alert
                key={alert.id}
                className="mt-3"
                icon={
                  alert.type === 'success'
                    ? CheckCircle
                    : alert.type === 'warning'
                      ? WarningFilled
                      : alert.type === 'error' || alert.type === 'danger'
                        ? ErrorOutline
                        : InfoOutline
                }
                variant={alert.type === 'error' ? 'danger' : alert.type}
                dismissible
                onClose={() => removeAlert(alert.id)}
              >
                {alert.message}
                {alert.extraContent}
              </Alert>
            ))}

          </div>

          <div className="mt-3 p-3 bg-light border rounded">
            <strong>Code Example (matches PR #113):</strong>
            <pre className="mt-2 mb-0">
              <code>
                {`const { alerts, addAlert, removeAlert } = useAlert();

// Add an alert
addAlert({
  type: 'success',
  message: 'Cohort created successfully!'
});

// Render alerts
{alerts.map(alert => (
  <Alert
    key={alert.id}
    className="mt-3"
    icon={CheckCircle}
    variant={alert.type}
    dismissible
    onClose={() => removeAlert(alert.id)}
  >
    {alert.message}
  </Alert>
))}`}
              </code>
            </pre>
          </div>
        </Card.Section>
      </Card>
    </div>
  );
};
