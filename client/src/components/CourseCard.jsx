import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaBook } from 'react-icons/fa';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/courses/${course.id}/reviews`);
  };

  return (
    <Card 
      className="h-100 cursor-pointer hover-shadow"
      onClick={handleClick}
    >
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-top">
          <div>
            <h4>{course.course_code}</h4>
            <h6>{course.course_name}</h6>
          </div>
        </Card.Title>
        <div className="d-flex justify-content-between text-muted mt-3">
          <div>
            <FaBook className="me-1" />
            {course.difficulty ? `${course.difficulty}/5` : 'No ratings'}
          </div>
          <div>
            <FaClock className="me-1" />
            {course.workload ? `${course.workload}h/week` : 'N/A'}
          </div>
          <div>
            <FaStar className="me-1" />
            {course.usefulness ? `${course.usefulness}/5` : 'No ratings'}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
