import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import AutocompleteSearch from './AutocompleteSearch';
import userService from '../services/userService';
import professorService from '../services/professorService';

const ProfessorSearch = ({ onSelect, error }) => {
  const [showModal, setShowModal] = useState(false);
  const [newProfessorName, setNewProfessorName] = useState('');
  const [modalError, setModalError] = useState('');

  const handleCreateProfessor = async () => {
    try {
      setModalError('');
      if (!newProfessorName.trim()) {
        setModalError('Professor name is required');
        return;
      }

      const user = userService.getCurrentUser();
      const professor = await professorService.createProfessor(
        newProfessorName.trim(),
        user.university_id
      );
      
      onSelect(professor);
      setShowModal(false);
      setNewProfessorName('');
    } catch (error) {
      setModalError(error.response?.data?.error || 'Failed to create professor');
    }
  };

  const fetchProfessors = async () => {
    const user = userService.getCurrentUser();
    if (user?.university_id) {
      return professorService.getProfessorsByUniversity(user.university_id);
    }
    return [];
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
            placeholder="Search for a professor..."
            fetchItems={fetchProfessors}
            filterItems={filterProfessors}
            renderItem={renderProfessor}
            getDisplayValue={getDisplayValue}
            label="Professor"
          />
        </div>
        <Button 
          variant="outline-secondary"
          onClick={() => setShowModal(true)}
          className="flex-shrink-0"
        >
          Add New
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Professor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Professor Name</Form.Label>
            <Form.Control
              type="text"
              value={newProfessorName}
              onChange={(e) => setNewProfessorName(e.target.value)}
              placeholder="Enter professor's name"
              isInvalid={!!modalError}
            />
            <Form.Control.Feedback type="invalid">
              {modalError}
            </Form.Control.Feedback>
          </Form.Group>
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
