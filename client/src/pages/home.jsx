import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaUniversity } from 'react-icons/fa';

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
        <div className="home-page py-5">
            {/* Quick Actions */}
            <Container className="mb-5">
                <h2 className="text-center h1 fw-bold mb-5">What would you like to do?</h2>
                <Row className="g-4">
                    {quickActions.map((action, index) => (
                        <Col key={index} md={4}>
                            <Card className="action-card h-100 border-0 shadow-sm">
                                <Card.Body className="p-4 text-center">
                                    <div className="icon-wrapper mb-3">
                                        {React.cloneElement(action.icon, {
                                            size: 40,
                                            className: "text-primary"
                                        })}
                                    </div>
                                    <h3 className="h4 mb-3 fw-bold">{action.title}</h3>
                                    <p className="text-muted mb-4">{action.description}</p>
                                    <Link to={action.link}>
                                        <Button variant="primary" className="fw-semibold px-4">
                                            {action.buttonText}
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Statistics */}
            <div className="stats-section py-5 bg-light">
                <Container className="py-4">
                    <Row className="text-center g-4">
                        {Object.entries({
                            'Courses Reviewed': stats.courses,
                            'Student Reviews': stats.reviews,
                            'Universities': stats.universities,
                            'Active Students': stats.students
                        }).map(([label, value]) => (
                            <Col key={label} md={3} sm={6}>
                                <div className="stat-card p-4 bg-white rounded-3 shadow-sm h-100">
                                    <h2 className="display-4 text-primary fw-bold mb-2">
                                        {value}
                                    </h2>
                                    <p className="text-muted mb-0 fw-medium">{label}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Home;