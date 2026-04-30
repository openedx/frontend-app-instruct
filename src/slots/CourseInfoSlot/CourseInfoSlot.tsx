import { useParams } from 'react-router-dom';
import { useCourseInfo } from '@src/data/apiHook';

const CourseInfoSlot = () => {
  const { courseId = '' } = useParams();
  const { data } = useCourseInfo(courseId);

  if (!data) {
    return null;
  }

  const { org = '', courseNumber = '', displayName = '' } = data;

  return (
    <div style={{ minWidth: 0, lineHeight: '1' }}>
      <span className="d-block small m-0">{org} {courseNumber}</span>
      <span className="d-block m-0 font-weight-bold course-title">{displayName}</span>
    </div>
  );
};

export default CourseInfoSlot;
