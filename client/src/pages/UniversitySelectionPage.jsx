import { useState, useEffect, useCallback } from 'react';
import { Container, Form, Card, Row, Col, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUniversity } from '../contexts/UniversityContext';
import { debounce } from 'lodash';

const UniversitySelectionPage = () => {
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { updateUniversity } = useUniversity();
  const navigate = useNavigate();
  const PER_PAGE = 24;

  const fetchUniversities = async (searchQuery = '', pageNum = 1) => {
    try {
      const response = await fetch(
        `/api/universities/search?q=${searchQuery}&page=${pageNum}&limit=${PER_PAGE}`
      );
      const data = await response.json();
      
      if (pageNum === 1) {
        setUniversities(data.universities);
      } else {
        setUniversities(prev => [...prev, ...data.universities]);
      }
      
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (error) {
      setError('Failed to load universities');
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      setPage(1);
      fetchUniversities(query, 1);
    }, 300),
    []
  );

  useEffect(() => {
    fetchUniversities(searchTerm, 1);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUniversities(searchTerm, nextPage);
  };

  const handleSelect = (university) => {
    updateUniversity(university);
    navigate('/');
  };

  if (loading && page === 1) return <Container className="py-5"><div>Loading...</div></Container>;
  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Select Your University</h1>
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <Form.Control
            type="search"
            placeholder="Search universities..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-4"
          />
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} className="g-4">
        {universities.map(university => (
          <Col key={university.id}>
            <Card 
              onClick={() => handleSelect(university)}
              className="h-100 cursor-pointer hover-shadow"
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <Card.Title>{university.name}</Card.Title>
                <Card.Text className="text-muted">
                  {university.course_count} courses • {university.student_count} students
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {hasMore && (
        <div className="text-center mt-4">
          <Button 
            variant="outline-primary" 
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
      {universities.length === 0 && (
        <Alert variant="info" className="text-center mt-4">
          No universities found matching your search
        </Alert>
      )}
    </Container>
  );
};

export default UniversitySelectionPage;
