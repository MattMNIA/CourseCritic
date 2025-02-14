import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaUniversity, FaUserGraduate } from 'react-icons/fa';

const Home = () => {
    const stats = {
        courses: 150,
        reviews: 450,
        universities: 1,
        students: 200
    };

    const quickActions = [
        {
            icon: <FaSearch className="mb-3" size={30} />,
            title: "Find Courses",
            description: "Search for courses by name, professor, or difficulty level",
            link: "/courses/search",
            buttonText: "Search Courses"
        },
        {
            icon: <FaStar className="mb-3" size={30} />,
            title: "Write a Review",
            description: "Share your experience and help other students",
            link: "/reviews/submit",
            buttonText: "Add Review"
        },
        {
            icon: <FaUniversity className="mb-3" size={30} />,
            title: "Browse Universities",
            description: "Explore courses from different universities",
            link: "/universities",
            buttonText: "View Universities"
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <div className="bg-primary text-white py-5 mb-5">
                <Container>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h1 className="display-4 fw-bold mb-3">Make Informed Course Decisions</h1>
                            <p className="lead mb-4">
                                Join thousands of students sharing their course experiences and finding the right classes for their academic journey.
                            </p>
                            <Link to="/auth/register">
                                <Button size="lg" variant="light" className="me-3">Get Started</Button>
                            </Link>
                            <Link to="/courses/search">
                                <Button size="lg" variant="outline-light">Browse Courses</Button>
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Quick Actions */}
            <Container className="mb-5">
                <h2 className="text-center mb-4">What would you like to do?</h2>
                <Row>
                    {quickActions.map((action, index) => (
                        <Col key={index} md={4} className="mb-4">
                            <Card className="h-100 text-center p-4 hover-shadow">
                                <Card.Body>
                                    {action.icon}
                                    <h3 className="h4 mb-3">{action.title}</h3>
                                    <p className="text-muted mb-4">{action.description}</p>
                                    <Link to={action.link}>
                                        <Button variant="primary">{action.buttonText}</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Statistics */}
            <div className="bg-light py-5">
                <Container>
                    <Row className="text-center">
                        <Col md={3} sm={6} className="mb-4">
                            <h2 className="display-4 text-primary fw-bold">{stats.courses}</h2>
                            <p className="text-muted mb-0">Courses Reviewed</p>
                        </Col>
                        <Col md={3} sm={6} className="mb-4">
                            <h2 className="display-4 text-primary fw-bold">{stats.reviews}</h2>
                            <p className="text-muted mb-0">Student Reviews</p>
                        </Col>
                        <Col md={3} sm={6} className="mb-4">
                            <h2 className="display-4 text-primary fw-bold">{stats.universities}</h2>
                            <p className="text-muted mb-0">Universities</p>
                        </Col>
                        <Col md={3} sm={6} className="mb-4">
                            <h2 className="display-4 text-primary fw-bold">{stats.students}</h2>
                            <p className="text-muted mb-0">Active Students</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Home;