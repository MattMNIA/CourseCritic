import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaBook } from 'react-icons/fa';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/courses/${course.id}/reviews`);
  };

  // Ensure values are numbers
  const difficulty = typeof course.difficulty === 'string' ? parseFloat(course.difficulty) : course.difficulty;
  const workload = typeof course.workload === 'string' ? parseFloat(course.workload) : course.workload;
  const usefulness = typeof course.usefulness === 'string' ? parseFloat(course.usefulness) : course.usefulness;

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
            {difficulty ? `${difficulty.toFixed(1)}/5` : 'No ratings'}
          </div>
          <div>
            <FaClock className="me-1" />
            {workload ? `${workload.toFixed(1)}h/week` : 'N/A'}
          </div>
          <div>
            <FaStar className="me-1" />
            {usefulness ? `${usefulness.toFixed(1)}/5` : 'No ratings'}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
