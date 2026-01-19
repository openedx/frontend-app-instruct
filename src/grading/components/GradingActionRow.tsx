import { useIntl } from '@openedx/frontend-base';
import { useToggle, ActionRow, Button, IconButton, ModalPopup, Menu, MenuItem } from '@openedx/paragon';
import { TrendingUp, MoreVert, OpenInNew } from '@openedx/paragon/icons';
import { useState } from 'react';
import messages from '../messages';
import GradingConfigurationModal from './GradingConfigurationModal';

const GradingActionRow = () => {
  const intl = useIntl();
  const [configurationMenuTarget, setConfigurationMenuTarget] = useState<HTMLButtonElement | null>(null);
  const [isOpenMenu, openMenu, closeMenu] = useToggle(false);
  const [isOpenConfigModal, openConfigModal, closeConfigModal] = useToggle(false);

  const handleConfigurationMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setConfigurationMenuTarget(event?.currentTarget);
    openMenu();
  };
  return (
    <>
      <ActionRow>
        <Button iconBefore={TrendingUp} variant="outline-primary">{intl.formatMessage(messages.viewGradebook)}</Button>
        <IconButton
          alt={intl.formatMessage(messages.configurationAlt)}
          className="lead"
          iconAs={MoreVert}
          onClick={handleConfigurationMenuClick}
        />
      </ActionRow>
      <ModalPopup positionRef={configurationMenuTarget} onClose={closeMenu} isOpen={isOpenMenu}>
        <Menu>
          <MenuItem onClick={openConfigModal}>
            {intl.formatMessage(messages.viewGradingConfiguration)}
          </MenuItem>
          <MenuItem iconAfter={OpenInNew} onClick={() => {}}>
            {intl.formatMessage(messages.viewCourseGradingSettings)}
          </MenuItem>
        </Menu>
      </ModalPopup>
      <GradingConfigurationModal isOpen={isOpenConfigModal} onClose={closeConfigModal} />
    </>
  );
};

export default GradingActionRow;
