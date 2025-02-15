import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/bootstrap-custom.css';
import './styles/globals.css';
import './styles/layout.css';
import Home from './pages/home';
import userService from './services/userService';

// Lazy load components
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const SearchCoursesPage = React.lazy(() => import('./pages/courses/SearchCoursesPage'));
const CourseDetailPage = React.lazy(() => import('./pages/courses/CourseDetailPage'));
const SubmitReviewPage = React.lazy(() => import('./pages/reviews/SubmitReviewPage'));
const UniversitiesPage = React.lazy(() => import('./pages/UniversitiesPage'));
const AccountSettingsPage = React.lazy(() => import('./pages/account/AccountSettingsPage'));
const ViewCoursesPage = React.lazy(() => import('./pages/admin/ViewCoursesPage'));
const CreateCoursePage = React.lazy(() => import('./pages/admin/CreateCoursePage'));
const EditCoursePage = React.lazy(() => import('./pages/admin/EditCoursePage'));

function App() {
    const [currentUser, setCurrentUser] = useState(userService.getCurrentUser());

    const handleLogout = () => {
        userService.logout();
        setCurrentUser(null);
    };

    useEffect(() => {
        // Force light mode
        document.documentElement.setAttribute('data-theme', 'light');
    }, []);

    return (
        <Router>
            <div className="App">
                <Navbar bg="light" expand="lg" className="border-bottom">
                    <Container fluid="lg" className="px-3">
                        <Navbar.Brand as={Link} to="/" className="text-primary fw-bold py-0">CourseCritic</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/" className="text-primary">Home</Nav.Link>
                                <Nav.Link as={Link} to="/courses/search" className="text-primary">Find Courses</Nav.Link>
                                <Nav.Link as={Link} to="/reviews/submit" className="text-primary">Write Review</Nav.Link>
                                <Nav.Link as={Link} to="/universities" className="text-primary">Universities</Nav.Link>
                            </Nav>
                            <Nav>
                                {currentUser ? (
                                    <>
                                        <Nav.Link as={Link} to="/account/settings" className="text-primary">
                                            My Account
                                        </Nav.Link>
                                        <Nav.Link 
                                            onClick={handleLogout} 
                                            className="btn btn-outline-primary ms-2"
                                        >
                                            Log Out
                                        </Nav.Link>
                                    </>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to="/auth/login" className="text-primary">
                                            Login
                                        </Nav.Link>
                                        <Nav.Link 
                                            as={Link} 
                                            to="/auth/register" 
                                            className="btn btn-primary ms-2 text-white"
                                        >
                                            Sign Up
                                        </Nav.Link>
                                    </>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <main className="container-lg px-3 py-3">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/courses/search" element={<SearchCoursesPage />} />
                            <Route path="/courses/:id" element={<CourseDetailPage />} />
                            <Route path="/reviews/submit" element={<SubmitReviewPage />} />
                            <Route path="/universities" element={<UniversitiesPage />} />
                            <Route path="/account/settings" element={<AccountSettingsPage />} />
                            <Route path="/auth/login" element={<LoginPage />} />
                            <Route path="/auth/register" element={<RegisterPage />} />
                            {/* Admin routes */}
                            <Route path="/admin/courses" element={<ViewCoursesPage />} />
                            <Route path="/admin/courses/create" element={<CreateCoursePage />} />
                            <Route path="/admin/courses/edit/:id" element={<EditCoursePage />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    );
}

export default App;