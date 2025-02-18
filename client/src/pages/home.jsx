import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaUniversity } from 'react-icons/fa';

const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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

    const renderStats = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-5 text-muted">
                    <p>Unable to load statistics</p>
                </div>
            );
        }

        const statItems = {
            'Courses Reviewed': stats?.totalCourses || 0,
            'Student Reviews': stats?.totalReviews || 0,
            'Universities': stats?.totalUniversities || 0,
            'Active Students': stats?.activeUsers || 0
        };

        return (
            <Row className="text-center g-4">
                {Object.entries(statItems).map(([label, value]) => (
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
        );
    };

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
        </div>
    );
};

export default Home;