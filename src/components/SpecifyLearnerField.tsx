import { useState, ChangeEvent } from 'react';
import type { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { Avatar, Button, FormControl, FormGroup, FormLabel, useToggle } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { SpinnerIcon } from '@openedx/paragon/icons';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';
import { useCourseInfo, useLearner } from '@src/data/apiHook';
import { SelectedLearner } from '@src/types';
import messages from './messages';

interface SpecifyLearnerFieldProps {
  learner?: SelectedLearner,
  onClickSelect: (emailOrUsername: string) => void,
}

const SpecifyLearnerField = ({ learner, onClickSelect }: SpecifyLearnerFieldProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [identifier, setIdentifier] = useState('');
  const [showLearner, enableShowLearner, disableShowLearner] = useToggle(false);
  const { data = { email: '', fullName: '', username: '' }, refetch, error } = useLearner(courseId, identifier);
  const { data: courseInfo } = useCourseInfo(courseId);
  const permissions = courseInfo?.permissions || { admin: false, dataResearcher: false };
  const { inputValue, handleChange } = useDebouncedFilter({
    filterValue: identifier,
    setFilter: setIdentifier,
  });

  const selectedLearner = learner || data;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value);
  };

  const handleClickSelect = () => {
    if (inputValue) onClickSelect(inputValue);
    refetch();
    enableShowLearner();
  };

  return (
    <FormGroup className="mb-0" size="sm">
      <FormLabel className="text-primary-500 d-flex">{intl.formatMessage(messages.specifyLearner)}</FormLabel>
      <div className="d-flex align-items-center">
        <FormControl
          className={`mr-2 ${selectedLearner.username && showLearner ? 'd-none' : ''}`}
          name="emailOrUsername"
          placeholder={intl.formatMessage(messages.specifyLearnerPlaceholder)}
          size="md"
          autoResize
          value={inputValue}
          onChange={handleInputChange}
        />
        {selectedLearner.username && showLearner ? (
          <>
            <Avatar className="mr-2.5" size="sm" />
            <div className="d-flex flex-column mr-3 text-primary-500">
              <p className="mb-0">{selectedLearner.username}</p>
              {(permissions.admin || permissions.dataResearcher)
              && (
                <div className="d-flex x-small">
                  <p className="mr-3 mb-0">{selectedLearner.fullName}</p>
                  <p className="mb-0">{selectedLearner.email}</p>
                </div>
              )}
            </div>
            {!learner && <Button iconBefore={SpinnerIcon} onClick={disableShowLearner}>{intl.formatMessage(messages.change)}</Button>}
          </>
        ) : (
          <Button onClick={handleClickSelect} disabled={!inputValue}>{intl.formatMessage(messages.select)}</Button>
        )}
      </div>
      {error
      && typeof error === 'object'
      && (error as AxiosError).isAxiosError
      && (error as AxiosError).response?.status === 404 && (
        <p className="text-danger-500 mb-0 x-small mt-2">
          {intl.formatMessage(messages.learnerNotFound, { identifier })}
        </p>
      )}
    </FormGroup>
  );
};

export default SpecifyLearnerField;
