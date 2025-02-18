import { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { UseAuth } from '../../contexts/AuthContext';
import AutocompleteSearch from '../../components/AutocompleteSearch';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = UseAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    university: null
  });

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities');
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch universities:', err);
      return [];
    }
  };

  const filterUniversities = (universities, searchTerm) => {
    return universities.filter(university => 
      university.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderUniversity = (university) => (
    <div>
      <div className="fw-bold">{university.name}</div>
      <small className="text-muted">
        {university.course_count} courses • {university.student_count} students
      </small>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (!formData.university) {
      setError('Please select a university');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        university: formData.university.id
      };

      console.log('Sending registration data:', { ...userData, password: '[REDACTED]' });
      
      const response = await userService.register(userData);
      console.log('Registration response:', response);
      
      login(response); // Use auth context login
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Create Account</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>University</Form.Label>
            <AutocompleteSearch
              onSelect={(university) => setFormData({ ...formData, university })}
              error={error && error.includes('university') ? error : null}
              placeholder="Search for your university..."
              fetchItems={fetchUniversities}
              filterItems={filterUniversities}
              renderItem={renderUniversity}
              getDisplayValue={(uni) => uni.name}
              label="University"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <div className="text-center mt-3">
            <Link to="/auth/login" className="text-secondary">Already have an account? Login</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default RegisterPage;
