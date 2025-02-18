import { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import AutocompleteSearch from './AutocompleteSearch';
import userService from '../services/userService';
import professorService from '../services/professorService';
import { useUniversity } from '../contexts/UniversityContext';

const ProfessorSearch = ({ onSelect, error }) => {
  const { currentUniversity } = useUniversity();
  const [showModal, setShowModal] = useState(false);
  const [newProfessor, setNewProfessor] = useState({
    firstName: '',
    middleName: '',
    lastName: ''
  });
  const [modalError, setModalError] = useState({});

  const handleCreateProfessor = async () => {
    try {
      setModalError({});
      
      // Validate fields
      const errors = {};
      if (!newProfessor.firstName.trim()) errors.firstName = 'First name is required';
      if (!newProfessor.lastName.trim()) errors.lastName = 'Last name is required';
      
      if (Object.keys(errors).length > 0) {
        setModalError(errors);
        return;
      }
      
      if(newProfessor.middleName.trim().length === 1){
        newProfessor.middleName = newProfessor.middleName.trim() + '.';
      }

      // Combine names, including middle name if provided
      const fullName = [
        newProfessor.firstName.trim(),
        ", ",
        newProfessor.middleName.trim(),
        " ",
        newProfessor.lastName.trim()
      ].filter(Boolean).join(' ');

      const user = userService.getCurrentUser();
      const professor = await professorService.createProfessor(
        fullName,
        user.university_id
      );
      
      onSelect(professor);
      setShowModal(false);
      setNewProfessor({ firstName: '', middleName: '', lastName: '' });
    } catch (error) {
      setModalError({ submit: error.response?.data?.error || 'Failed to create professor' });
    }
  };

  const fetchProfessors = async () => {
    if (!currentUniversity?.id) return [];
    return professorService.getProfessorsByUniversity(currentUniversity.id);
  };

  const filterProfessors = (professors, searchTerm) => {
    return professors.filter(professor => 
      professor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderProfessor = (professor) => (
    <div className="fw-bold">{professor.name}</div>
  );

  const getDisplayValue = (professor) => professor.name;

  return (
    <>
      <div className="d-flex gap-2">
        <div className="flex-grow-1">
          <AutocompleteSearch
            onSelect={onSelect}
            error={error}
            placeholder={currentUniversity 
              ? "Search by 'Last, First Middle' format..." 
              : "Select a university first"}
            fetchItems={fetchProfessors}
            filterItems={filterProfessors}
            renderItem={renderProfessor}
            getDisplayValue={getDisplayValue}
            label="Professor"
            disabled={!currentUniversity}
          />
        </div>
        <Button 
          variant="outline-secondary"
          onClick={() => setShowModal(true)}
          className="flex-shrink-0"
          disabled={!currentUniversity}
        >
          Add New
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Professor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProfessor.firstName}
                    onChange={(e) => setNewProfessor({
                      ...newProfessor,
                      firstName: e.target.value
                    })}
                    isInvalid={!!modalError.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {modalError.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProfessor.lastName}
                    onChange={(e) => setNewProfessor({
                      ...newProfessor,
                      lastName: e.target.value
                    })}
                    isInvalid={!!modalError.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {modalError.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Middle Name (Optional)</Form.Label>
              <Form.Control
                type="text"
                value={newProfessor.middleName}
                onChange={(e) => setNewProfessor({
                  ...newProfessor,
                  middleName: e.target.value
                })}
              />
            </Form.Group>
            {modalError.submit && (
              <Alert variant="danger">{modalError.submit}</Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateProfessor}>
            Add Professor
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfessorSearch;
