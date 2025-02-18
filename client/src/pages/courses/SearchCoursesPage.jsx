import { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import CourseSearch from '../../components/CourseSearch';
import ProfessorSearch from '../../components/ProfessorSearch';
import CourseCard from '../../components/CourseCard';
import courseService from '../../services/courseService';
import { useUniversity } from '../../contexts/UniversityContext';

const SearchCoursesPage = () => {
  const { currentUniversity } = useUniversity();
  const [searchParams, setSearchParams] = useState({
    courseId: '',
    professorId: ''
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!currentUniversity) {
      setError('Please select a university first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await courseService.searchCourses({
        ...searchParams,
        universityId: currentUniversity.id
      });
      setResults(searchResults);
    } catch (err) {
      setError('Failed to fetch courses. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchParams({
      courseId: '',
      professorId: ''
    });
    setResults([]);
  };

  if (!currentUniversity) {
    return (
      <Container>
        <Alert variant="warning">
          Please select a university from the navigation bar to search for courses.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Find Courses</h1>
      <Card className="p-4 mb-4">
        <Form onSubmit={handleSearch}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Course</Form.Label>
                <CourseSearch
                  onSelect={(course) => setSearchParams({
                    ...searchParams,
                    courseId: course?.id || ''
                  })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Professor</Form.Label>
                <ProfessorSearch
                  onSelect={(professor) => setSearchParams({
                    ...searchParams,
                    professorId: professor?.id || ''
                  })}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex gap-2">
            <Button type="submit" variant="primary" onClick={handleSearch}>
              Search Courses
            </Button>
            <Button variant="outline-secondary" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </Form>
      </Card>

      {/* Results section */}
      {isLoading ? (
        <div className="text-center mt-4">Loading...</div>
      ) : error ? (
        <Alert variant="danger" className="mt-4">{error}</Alert>
      ) : results.length > 0 ? (
        <div className="mt-4">
          <h2>Search Results ({results.length} courses found)</h2>
          <Row xs={1} md={2} lg={3} className="g-4 mt-2">
            {results.map(course => (
              <Col key={course.id}>
                <CourseCard course={course} />
              </Col>
            ))}
          </Row>
        </div>
      ) : searchParams.universityId && (
        <Alert variant="info" className="mt-4">
          No courses found matching your criteria
        </Alert>
      )}
    </Container>
  );
};

export default SearchCoursesPage;
