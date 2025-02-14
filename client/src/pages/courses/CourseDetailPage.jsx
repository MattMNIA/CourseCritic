import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import courseService from '../../services/courseService';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(parseInt(id));
        setCourse(data);
      } catch (err) {
        console.error('Failed to fetch course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>{course.course_code}: {course.course_name}</h1>
          <h4 className="text-muted">{course.university_name}</h4>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <h3>Course Information</h3>
              <p><strong>Course Code:</strong> {course.course_code}</p>
              <p><strong>Course Name:</strong> {course.course_name}</p>
              <p><strong>University:</strong> {course.university_name}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetailPage;
