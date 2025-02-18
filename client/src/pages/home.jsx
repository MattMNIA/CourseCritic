import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaEdit, FaUniversity } from 'react-icons/fa';
import { useUniversity } from '../contexts/UniversityContext';

const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUniversity } = useUniversity();

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
                    {!currentUniversity ? (
                        <Col xs={12} md={4}>
                            <Card as={Link} to="/select-university" className="h-100 text-decoration-none hover-shadow">
                                <Card.Body className="text-center py-5">
                                    <FaUniversity className="display-1 mb-4 text-primary" />
                                    <Card.Title>Select Your University</Card.Title>
                                    <Card.Text className="text-muted">
                                        Choose your university to start exploring courses and reviews
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ) : (
                        <>
                            <Col xs={12} md={6}>
                                <Card as={Link} to="/courses/search" className="h-100 text-decoration-none hover-shadow">
                                    <Card.Body className="text-center py-5">
                                        <FaSearch className="display-1 mb-4 text-primary" />
                                        <Card.Title>Find Courses</Card.Title>
                                        <Card.Text className="text-muted">
                                            Search and explore course reviews from your peers
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={12} md={6}>
                                <Card as={Link} to="/reviews/submit" className="h-100 text-decoration-none hover-shadow">
                                    <Card.Body className="text-center py-5">
                                        <FaEdit className="display-1 mb-4 text-primary" />
                                        <Card.Title>Write a Review</Card.Title>
                                        <Card.Text className="text-muted">
                                            Share your experience with a course
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default Home;