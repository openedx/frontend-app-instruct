import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCourseInfo, isForbiddenError, isUnauthorizedError } from '@src/data/apiHook';
import { useForbiddenError } from '@src/providers/ForbiddenErrorProvider';

/**
 * Observes the courseInfo query and syncs 401/403 errors with the ForbiddenErrorProvider.
 * This component must be rendered inside ForbiddenErrorProvider.
 * By keeping this logic here (instead of inside useCourseInfo), the hook stays
 * decoupled from the provider and can be used in slots or other contexts
 * that live outside the provider tree.
 */
const ForbiddenErrorObserver = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { isLoading, error } = useCourseInfo(courseId);
  const { setErrorType, setLoading } = useForbiddenError();

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

export default ForbiddenErrorObserver;
