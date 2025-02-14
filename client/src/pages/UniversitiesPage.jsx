import { Container, Card, Row, Col } from 'react-bootstrap';

const UniversitiesPage = () => {
  const universities = [
    {
      id: 1,
      name: 'Iowa State University',
      location: 'Ames, Iowa',
      courseCount: 150,
      reviewCount: 450
    }
    // Add more universities as needed
  ];

  return (
    <Container>
      <h1 className="mb-4">Universities</h1>
      <Row>
        {universities.map(uni => (
          <Col key={uni.id} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{uni.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{uni.location}</Card.Subtitle>
                <Card.Text>
                  <div>Courses Available: {uni.courseCount}</div>
                  <div>Total Reviews: {uni.reviewCount}</div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UniversitiesPage;
