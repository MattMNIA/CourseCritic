import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const SubmitReviewPage = () => {
  const [formData, setFormData] = useState({
    courseId: '',
    difficulty: 5,
    hoursPerWeek: 3,
    utility: 5,
    comments: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement review submission
  };

  return (
    <Container>
      <h1 className="mb-4">Write a Review</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Course</Form.Label>
              <Form.Select
                value={formData.courseId}
                onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                required
              >
                <option value="">Choose a course...</option>
                {/* Add course options */}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Difficulty (1-10)</Form.Label>
              <Form.Range
                min="1"
                max="10"
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: parseInt(e.target.value)})}
              />
              <div className="text-center">{formData.difficulty}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hours per Week</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({...formData, hoursPerWeek: parseInt(e.target.value)})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Utility (1-10)</Form.Label>
              <Form.Range
                min="1"
                max="10"
                value={formData.utility}
                onChange={(e) => setFormData({...formData, utility: parseInt(e.target.value)})}
              />
              <div className="text-center">{formData.utility}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.comments}
                onChange={(e) => setFormData({...formData, comments: e.target.value})}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SubmitReviewPage;
