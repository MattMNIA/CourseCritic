import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const AccountSettingsPage = () => {
  const [formData, setFormData] = useState({
    email: 'user@example.com', // Placeholder
    university: 'Iowa State University',
    notifications: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement settings update
  };

  return (
    <Container>
      <h1 className="mb-4">Account Settings</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>University</Form.Label>
              <Form.Select
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
              >
                <option value="iowa-state">Iowa State University</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Receive email notifications"
                checked={formData.notifications}
                onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AccountSettingsPage;
