import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, ProgressBar, Alert, Row, Col } from 'react-bootstrap';
import { FaStar, FaArrowLeft, FaArrowRight, FaBook } from 'react-icons/fa';
import CourseSearch from '../../components/CourseSearch';
import ProfessorSearch from '../../components/ProfessorSearch';
import reviewService from '../../services/reviewService';
import userService from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import { useUniversity } from '../../contexts/UniversityContext';

const SubmitReviewPage = () => {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    difficulty: 3,
    hoursPerWeek: 3,
    usefulness: 3,
    professorId: '', // Changed from professor to professorId
    courseComments: '', // Specific course-related comments
    comments: ''  // General review comments
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { currentUniversity } = useUniversity();

  const totalSteps = 7;  // Increased from 5 to 7
  const progress = (step / totalSteps) * 100;

  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.courseId) newErrors.courseId = 'Please select a course';
        break;
      case 2:
        if (!formData.difficulty) newErrors.difficulty = 'Please rate the difficulty';
        break;
      case 3:
        if (formData.hoursPerWeek < 1) newErrors.hoursPerWeek = 'Please enter valid hours';
        break;
      case 4:
        if (!formData.usefulness) newErrors.usefulness = 'Please rate the usefulness';
        break;
      case 5:
        if (!formData.professorId) newErrors.professor = 'Please enter the professor name';
        break;
      case 6:
        // Course-specific comments are optional
        break;
      case 7:
        // General comments are optional
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        const currentUser = userService.getCurrentUser();
        if (!currentUser) {
          setErrors({ submit: 'You must be logged in to submit a review' });
          return;
        }

        const reviewData = {
          courseId: formData.courseId, // Now this is just the ID
          userId: currentUser.id,
          professorId: formData.professorId,
          difficulty: formData.difficulty,
          hoursPerWeek: formData.hoursPerWeek,
          usefulness: formData.usefulness,
          courseComments: formData.courseComments,
          comments: formData.comments
        };

        await reviewService.submitReview(reviewData);
        setShowSuccess(true);
        setFormData({
          courseId: '',
          difficulty: 3,
          hoursPerWeek: 3,
          usefulness: 3,
          professorId: '',
          courseComments: '',
          comments: ''
        });
        setStep(1);
      } catch (error) {
        setErrors({ 
          submit: error.response?.data?.error || 'Failed to submit review' 
        });
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Form.Group className="mb-4">
            <Form.Label>Search for Course</Form.Label>
            <CourseSearch
              onSelect={(course) => setFormData({...formData, courseId: course?.id || ''})}
              error={errors.courseId}
            />
            <Form.Text className="text-muted">
              Search for the course you'd like to review
            </Form.Text>
          </Form.Group>
        );

      case 2:
        return (
          <Form.Group className="mb-4">
            <Form.Label>Course Difficulty</Form.Label>
            <div className="d-flex justify-content-between mb-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div
                  key={rating}
                  onClick={() => setFormData({...formData, difficulty: rating})}
                  className="text-center"
                  style={{ cursor: 'pointer' }}
                >
                  <FaBook
                    size={32}
                    color={rating <= formData.difficulty ? '#dc3545' : '#e4e5e9'}
                  />
                  <div className="mt-1 small">
                    {rating === 1 && 'Very Easy'}
                    {rating === 2 && 'Easy'}
                    {rating === 3 && 'Moderate'}
                    {rating === 4 && 'Hard'}
                    {rating === 5 && 'Very Hard'}
                  </div>
                </div>
              ))}
            </div>
            <Form.Text className="text-muted">
              Rate how difficult you found this course
            </Form.Text>
          </Form.Group>
        );

      case 3:
        return (
          <Form.Group className="mb-4">
            <Form.Label>Hours per Week</Form.Label>
            <Form.Range
              min="1"
              max="20"
              value={formData.hoursPerWeek}
              onChange={(e) => setFormData({...formData, hoursPerWeek: parseInt(e.target.value)})}
            />
            <div className="text-center mb-2">{formData.hoursPerWeek} hours</div>
            <Form.Text className="text-muted">
              Estimate the average number of hours spent per week on this course
            </Form.Text>
          </Form.Group>
        );

      case 4:
        return (
          <Form.Group className="mb-4">
            <Form.Label>Course Usefulness</Form.Label>
            <div className="d-flex justify-content-between mb-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div
                  key={rating}
                  onClick={() => setFormData({...formData, usefulness: rating})}
                  className="text-center"
                  style={{ cursor: 'pointer' }}
                >
                  <FaStar
                    size={32}
                    color={rating <= formData.usefulness ? '#ffc107' : '#e4e5e9'}
                  />
                  <div className="mt-1">{rating}</div>
                </div>
              ))}
            </div>
            <Form.Text className="text-muted">
              Rate how useful you found this course (1 = Not Useful, 5 = Very Useful)
            </Form.Text>
          </Form.Group>
        );

      case 5:
        return (
          <Form.Group className="mb-4">
            <Form.Label>Professor Name</Form.Label>
            <ProfessorSearch
              onSelect={(professor) => setFormData({
                ...formData, 
                professorId: professor ? professor.id : ''
              })}
              error={errors.professor}
            />
            <Form.Text className="text-muted">
              Who taught this course when you took it?
            </Form.Text>
          </Form.Group>
        );

      case 6:
        return (
          <Form.Group className="mb-4">
            <Form.Label>Course-Specific Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.courseComments}
              onChange={(e) => setFormData({...formData, courseComments: e.target.value})}
              placeholder="What should students know about this specific course?"
            />
            <Form.Text className="text-muted">
              Share specific details about assignments, exams, or course structure
            </Form.Text>
          </Form.Group>
        );

      case 7:
        return (
          <Form.Group className="mb-4">
            <Form.Label>Additional Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
              placeholder="Share your overall experience with future students..."
            />
            <Form.Text className="text-muted">
              Any other advice or thoughts about the course?
            </Form.Text>
          </Form.Group>
        );
    }
  };

  if (showSuccess) {
    return (
      <Container className="py-5">
        <Alert variant="success">
          <Alert.Heading>Review Submitted Successfully!</Alert.Heading>
          <p>Thank you for sharing your experience.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-success" onClick={() => setShowSuccess(false)} className="me-2">
              Write Another Review
            </Button>
            <Button variant="success" href="/">
              Return to Home
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {!currentUniversity ? (
        <Alert variant="warning" className="mb-4">
          Please select a university from the dropdown menu in the navigation bar to submit a review.
        </Alert>
      ) : (
        <Alert variant="info" className="mb-4">
          <Alert.Heading as="h5">Writing review for {currentUniversity.name}</Alert.Heading>
        </Alert>
      )}
      
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Course Review</h2>
          <ProgressBar now={progress} className="mb-4" />
          
          <Form onSubmit={handleSubmit}>
            {renderStepContent()}

            <Row className="mt-4">
              <Col>
                {step > 1 && (
                  <Button variant="outline-primary" onClick={handleBack}>
                    <FaArrowLeft className="me-2" />
                    Back
                  </Button>
                )}
              </Col>
              <Col className="text-end">
                {step < totalSteps ? (
                  <Button variant="primary" onClick={handleNext}>
                    Next
                    <FaArrowRight className="ms-2" />
                  </Button>
                ) : (
                  <Button variant="success" type="submit">
                    Submit Review
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SubmitReviewPage;
