import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCourseInfo } from '@src/data/apiHook';
import { isForbiddenError, isUnauthorizedError } from '@src/data/utils';
import { useAccessError } from '@src/providers/AccessErrorProvider';

/**
 * Observes the courseInfo query and syncs 401/403 errors with the AccessErrorProvider.
 * This component must be rendered inside AccessErrorProvider.
 * By keeping this logic here (instead of inside useCourseInfo), the hook stays
 * decoupled from the provider and can be used in slots or other contexts
 * that live outside the provider tree.
 */
const AccessErrorObserver = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { isLoading, error } = useCourseInfo(courseId);
  const { setErrorType, setLoading } = useAccessError();

  useEffect(() => {
    setLoading(isLoading);
    if (error && isForbiddenError(error)) {
      setErrorType('forbidden');
    } else if (error && isUnauthorizedError(error)) {
      setErrorType('unauthorized');
    } else if (error) {
      setErrorType('generic');
    } else {
      setErrorType(null);
    }
  }, [isLoading, error, setErrorType, setLoading]);

  return null;
};

export default AccessErrorObserver;
