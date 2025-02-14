import { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

const SearchCoursesPage = () => {
  const [searchParams, setSearchParams] = useState({
    university: '',
    keyword: '',
    professor: '',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <Container>
      <h1 className="mb-4">Find Courses</h1>
      <Card className="p-4 mb-4">
        <Form onSubmit={handleSearch}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>University</Form.Label>
                <Form.Select
                  value={searchParams.university}
                  onChange={(e) => setSearchParams({...searchParams, university: e.target.value})}
                >
                  <option value="">Select University</option>
                  <option value="iowa-state">Iowa State University</option>
                  {/* Add more universities */}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Course Name or Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. CS 101 or Introduction to Programming"
                  value={searchParams.keyword}
                  onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Professor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Professor name"
                  value={searchParams.professor}
                  onChange={(e) => setSearchParams({...searchParams, professor: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant="primary">Search Courses</Button>
        </Form>
      </Card>
      {/* Results section will go here */}
    </Container>
  );
};

export default SearchCoursesPage;
