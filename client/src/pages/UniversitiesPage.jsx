import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { FaGraduationCap, FaBook, FaStar } from 'react-icons/fa';
import universityService from '../services/universityService';

const UniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await universityService.getAllUniversities();
        setUniversities(data);
      } catch (err) {
        setError('Failed to load universities');
        console.error('Error fetching universities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  const StatItem = ({ icon, value, label }) => (
    <div className="d-flex align-items-center mb-2">
      {icon}
      <div className="ms-2">
        <strong>{value}</strong> {label}
      </div>
    </div>
  );

  return (
    <Container>
      <h1 className="mb-4">Universities</h1>
      <Row>
        {universities.map(uni => (
          <Col key={uni.id} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm hover-shadow">
              <Card.Body>
                <Card.Title className="h4 mb-4">{uni.name}</Card.Title>
                
                <StatItem 
                  icon={<FaBook className="text-primary" />} 
                  value={uni.course_count}
                  label="courses available"
                />
                
                <StatItem 
                  icon={<FaStar className="text-warning" />} 
                  value={uni.review_count}
                  label="course reviews"
                />
                
                <StatItem 
                  icon={<FaGraduationCap className="text-success" />} 
                  value={uni.student_count}
                  label="students contributed"
                />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UniversitiesPage;
