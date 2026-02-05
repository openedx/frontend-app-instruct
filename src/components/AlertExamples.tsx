/**
 * AlertExamples Component
 *
 * This component demonstrates how to use all alert types from the AlertProvider:
 * 1. Toast Alerts - Temporary notifications that appear and auto-dismiss
 * 2. Modal Alerts - Blocking dialogs that require user action (with/without titles)
 * 3. Inline Alerts - Persistent messages you control the rendering for
 * 4. Standard Alerts - Alerts rendered automatically via AlertOutlet
 *
 * Import this component anywhere you want to show example usage.
 */

import { Button, Card } from '@openedx/paragon';
import { useAlert, AlertOutlet } from '../providers/AlertProvider';

export const AlertExamples = () => {
  const {
    showToast,
    showModal,
    showInlineAlert,
    dismissInlineAlert,
    inlineAlerts,
    // PR #113 compatible API
    addAlert,
  } = useAlert();

  // Toast Alert Examples
  const handleSuccessToast = () => {
    showToast('Report generated successfully!', 'success');
  };

  const handleDangerToast = () => {
    showToast('Failed to generate report. Please try again.', 'error');
  };

  const handleWarningToast = () => {
    showToast('This action will take a few minutes to complete.', 'warning');
  };

  const handleDefaultToast = () => {
    showToast('Your report is being processed in the background.', 'info');
  };

  // Modal Alert Examples
  const handleDangerModal = () => {
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

  const handleDefaultModal = () => {
    showModal({
      title: 'Default Modal',
      message: 'This is a default modal with standard styling.',
      variant: 'default',
      confirmText: 'OK',
      onConfirm: () => {
        console.log('Default modal confirmed');
      },
    });
  };

  const handleMultipleModals = () => {
    showModal({
      title: 'First Modal',
      message: 'This is the first modal. Click Next to see the second one.',
      variant: 'default',
      confirmText: 'Next',
      cancelText: 'Cancel All',
      onConfirm: () => {
        console.log('First modal confirmed');
      },
    });
    showModal({
      title: 'Second Modal',
      message: 'This is the second modal. It appears after the first one is closed.',
      variant: 'warning',
      confirmText: 'Next',
      cancelText: 'Cancel',
      onConfirm: () => {
        console.log('Second modal confirmed');
      },
    });
    showModal({
      title: 'Third Modal',
      message: 'This is the third and final modal in the queue.',
      variant: 'success',
      confirmText: 'Finish',
      onConfirm: () => {
        console.log('Third modal confirmed');
        showToast('All modals completed!', 'success');
      },
    });
  };

  // Modal Alert Examples (Without Title)
  const handleDangerModalNoTitle = () => {
    showModal({
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

  const handleWarningModalNoTitle = () => {
    showModal({
      message: 'This report contains over 10,000 rows and may take several minutes to download. Do you want to continue?',
      variant: 'warning',
      confirmText: 'Continue',
      cancelText: 'Cancel',
      onConfirm: () => {
        showToast('Download started', 'info');
      },
    });
  };

  const handleSuccessModalNoTitle = () => {
    showModal({
      message: 'Your report has been generated successfully and is ready to download.',
      variant: 'success',
      confirmText: 'Download',
      onConfirm: () => {
        console.log('Downloading...');
      },
    });
  };

  const handleDefaultModalNoTitle = () => {
    showModal({
      message: 'This is a default modal without a title.',
      variant: 'default',
      confirmText: 'OK',
      onConfirm: () => {
        console.log('Default modal confirmed');
      },
    });
  };

  const handleShowInlineAlert = () => {
    showInlineAlert('Inline alerts can use any element as content.', 'info', true);
  };

  return (
    <div className="mt-4">
      <h2 className="mb-4">Alert System Examples</h2>

      {/* Toast Examples */}
      <Card className="mb-4">
        <Card.Header
          title="Toast Alerts"
          subtitle="Temporary notifications that appear in the corner and auto-dismiss"
        />
        <Card.Section>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="success" onClick={handleSuccessToast}>
              Success Toast
            </Button>
            <Button variant="warning" onClick={handleWarningToast}>
              Warning Toast
            </Button>
            <Button variant="danger" onClick={handleDangerToast}>
              Danger Toast
            </Button>
            <Button variant="info" onClick={handleDefaultToast}>
              Default Toast
            </Button>
          </div>
        </Card.Section>
      </Card>

      {/* Modal Examples */}
      <Card className="mb-4">
        <Card.Header
          title="Modal Alerts"
          subtitle="Blocking dialogs that require user action"
        />
        <Card.Section>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={handleDefaultModal}>
              Default Modal
            </Button>
            <Button variant="success" onClick={handleSuccessModal}>
              Success Modal
            </Button>
            <Button variant="warning" onClick={handleWarningModal}>
              Warning Modal
            </Button>
            <Button variant="danger" onClick={handleDangerModal}>
              Danger Modal
            </Button>
            <Button variant="primary" onClick={handleMultipleModals}>
              Multiple Modals (Queued)
            </Button>
          </div>
        </Card.Section>
      </Card>

      {/* Modal Examples Without Title */}
      <Card className="mb-4">
        <Card.Header
          title="Modal Alerts (No Title)"
          subtitle="Modals without headers - title is optional"
        />
        <Card.Section>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={handleDefaultModalNoTitle}>
              Default Modal
            </Button>
            <Button variant="success" onClick={handleSuccessModalNoTitle}>
              Success Modal
            </Button>
            <Button variant="warning" onClick={handleWarningModalNoTitle}>
              Warning Modal
            </Button>
            <Button variant="danger" onClick={handleDangerModalNoTitle}>
              Danger Modal
            </Button>
          </div>
        </Card.Section>
      </Card>

      <Card className="mb-4">
        <Card.Header
          title="Standard Alerts (with AlertOutlet)"
          subtitle="Drop-in replacement for AlertContext from PR #113 - uses AlertOutlet component"
        />
        <Card.Section>
          <div className="d-flex gap-2 flex-wrap mb-3">
            <Button
              variant="success"
              onClick={() => addAlert({ type: 'success', message: 'Cohort created successfully!' })}
            >
              Success Alert
            </Button>
            <Button
              variant="warning"
              onClick={() => addAlert({ type: 'warning', message: 'This action cannot be undone' })}
            >
              Warning Alert
            </Button>
            <Button
              variant="danger"
              onClick={() => addAlert({ type: 'error', message: 'Failed to delete cohort' })}
            >
              Danger Alert
            </Button>
            <Button
              variant="info"
              onClick={() => addAlert({ type: 'info', message: 'New features available' })}
            >
              Default Alert
            </Button>
          </div>

          {/* Alert Outlet - Place this where you want alerts to appear */}
          <AlertOutlet />
        </Card.Section>
      </Card>

      {/* Inline Alert Examples */}
      <Card className="mb-4">
        <Card.Header
          title="Inline Alerts"
          subtitle="Persistent messages displayed inline - you control the rendering"
        />
        <Card.Section>
          <div className="d-flex gap-2 flex-wrap mb-3">
            <Button variant="info" onClick={handleShowInlineAlert}>
              Inline Message
            </Button>
          </div>

          {/* Render inline alerts */}
          <div className="mt-3">
            {inlineAlerts.map(alert => (
              <div key={alert.id} className="d-flex align-items-center gap-2 mb-2">
                <span>{alert.message}</span>
                {alert.dismissible && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => dismissInlineAlert(alert.id)}
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card.Section>
      </Card>
    </div>
  );
};
