import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const AccountSettingsPage = () => {
  const [formData, setFormData] = useState({
    university: 'Iowa State University',
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
              <Form.Label>University</Form.Label>
              <Form.Select
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
              >
                <option value="iowa-state">Iowa State University</option>
              </Form.Select>
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
