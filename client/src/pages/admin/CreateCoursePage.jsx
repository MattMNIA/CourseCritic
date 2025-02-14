import { useState, useEffect } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import universityService from '../../services/universityService';

const CreateCoursePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [universities, setUniversities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await universityService.getAllUniversities();
        setUniversities(data);
      } catch (err) {
        setError('Failed to fetch universities');
      }
    };
    fetchUniversities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const courseData = {
        course_name: formData.get('courseName'),
        course_code: formData.get('courseCode'),
        university_name: formData.get('university')
      };

      await courseService.createCourse(courseData);
      navigate('/courses');
    } catch (err) {
      setError('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="p-4">
        <h2>Create New Course</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>University</Form.Label>
            <Form.Select name="university" required>
              <option value="">Select University</option>
              {universities.map(uni => (
                <option key={uni.id} value={uni.name}>
                  {uni.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Course Name</Form.Label>
            <Form.Control 
              name="courseName" 
              required 
              placeholder="e.g., Introduction to Computer Science"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Course Code</Form.Label>
            <Form.Control 
              name="courseCode" 
              required 
              placeholder="e.g., CS 101"
            />
          </Form.Group>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CreateCoursePage;
