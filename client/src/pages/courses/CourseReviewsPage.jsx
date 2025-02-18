import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Alert } from 'react-bootstrap';
import { FaStar, FaBook } from 'react-icons/fa';
import AdUnit from '../../components/AdUnit';
import AdPlaceholder from '../../components/AdPlaceholder';

const CourseReviewsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndReviews = async () => {
      try {
        console.log('Fetching data for course:', courseId);
        const [courseRes, reviewsRes] = await Promise.all([
          fetch(`/api/courses/${courseId}`), // Changed from /api/course to /api/courses
          fetch(`/api/course/${courseId}/reviews`)
        ]);

        console.log('Course response:', courseRes);
        console.log('Reviews response:', reviewsRes);

        if (!courseRes.ok || !reviewsRes.ok) {
          console.error('Course response:', await courseRes.text());
          console.error('Reviews response:', await reviewsRes.text());
          throw new Error('Failed to fetch data');
        }

        const [courseData, reviewsData] = await Promise.all([
          courseRes.json(),
          reviewsRes.json()
        ]);

        // Add debugging for the course data
        console.log('Raw course data:', courseData);
        console.log('Average hours:', courseData.average_hours);
        console.log('Type of average_hours:', typeof courseData.average_hours);

        setCourse(courseData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load course reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndReviews();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!course) return <Alert variant="warning">Course not found</Alert>;
  console.log(course)
  console.log(course.average_hours)
  return (
    <Container className="py-4">
      <Card className="mb-4">
        <Card.Body>
          <h2>{course.department} {course.number}</h2>
          <h3 className="text-muted">{course.name}</h3>
          
          <Row className="mt-4">
            <Col md={4}>
              <div className="text-center">
                <h4>Average Difficulty</h4>
                <div className="display-4">
                  {(course.average_difficulty != null) ? course.average_difficulty.toFixed(1) : 'N/A'}
                </div>
                <div className="mt-2">
                  <FaBook color="#dc3545" size={24} />
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <h4>Average Hours/Week</h4>
                <div className="display-4">
                  {(course.average_hours != null) ? course.average_hours.toFixed(1) : 'N/A'}
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <h4>Average Usefulness</h4>
                <div className="display-4">
                  {(course.average_usefulness != null) ? course.average_usefulness.toFixed(1) : 'N/A'}
                </div>
                <div className="mt-2">
                  <FaStar color="#ffc107" size={24} />
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* <AdPlaceholder /> Comment out ads temporarily */}

      <h3 className="mb-4">Reviews ({reviews.length})</h3>
      {console.log(reviews)}
      {reviews.map((review, index) => (
        <>
          <Card key={review.id} className="mb-3">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="mb-3">
                    <strong>Difficulty:</strong> {review.difficulty}/5
                  </div>
                  <div className="mb-3">
                    <strong>Hours/Week:</strong> {review.workload}
                  </div>
                  <div className="mb-3">
                    <strong>Usefulness:</strong> {review.usefulness}/5
                  </div>
                  <div className="text-muted">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </Col>
                <Col md={9}>
                  {review.course_comments && (
                    <div className="mb-3">
                      <h5>Course Comments:</h5>
                      <p>{review.course_comments}</p>
                    </div>
                  )}
                  {review.comments && (
                    <div>
                      <h5>Additional Comments:</h5>
                      <p>{review.comments}</p>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
          {index % 5 === 4 && <AdUnit slot="0987654321" />}
        </>
      ))}

      {reviews.length === 0 && (
        <Alert variant="info">
          No reviews yet. Be the first to review this course!
        </Alert>
      )}
    </Container>
  );
};

export default CourseReviewsPage;
