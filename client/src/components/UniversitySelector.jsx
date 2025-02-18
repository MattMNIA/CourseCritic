import { useState, useEffect, useRef } from 'react';
import { NavDropdown, Form, ListGroup } from 'react-bootstrap';
import userService from '../services/userService';
import { useUniversity } from '../contexts/UniversityContext';

const UniversitySelector = () => {
  const { updateUniversity } = useUniversity();
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('/api/universities');
        const data = await response.json();
        setUniversities(data);

        // Check localStorage first
        const savedUniversity = localStorage.getItem('currentUniversity');
        if (savedUniversity) {
          const parsedUniversity = JSON.parse(savedUniversity);
          setSelectedUniversity(parsedUniversity);
          updateUniversity(parsedUniversity);
          return;
        }

        // Fall back to user's university if no localStorage
        const user = userService.getCurrentUser();
        if (user?.university_id) {
          const userUniversity = data.find(u => u.id === user.university_id);
          if (userUniversity) {
            setSelectedUniversity(userUniversity);
            updateUniversity(userUniversity);
          }
        }
      } catch (error) {
        console.error('Failed to fetch universities:', error); // Move this first to ensure context is updated
      }
    };

    fetchUniversities();
  }, [updateUniversity]); // Add updateUniversity to dependencies

  const filteredUniversities = universities.filter(university =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (university) => {
    console.log('Selected university:', university); // Add this log
    setSelectedUniversity(university);
    updateUniversity(university); // Make sure this is called
    setIsOpen(false);
    setSearchTerm('');
    userService.updateUniversity(university.id);
  };

  return (
    <div ref={dropdownRef} className="position-relative">
      <NavDropdown 
        title={
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ 
              maxWidth: '200px', 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              lineHeight: '1.5'
            }}>
              {selectedUniversity ? selectedUniversity.name : "Select University"}
            </span>
          </div>
        }
        id="university-selector"
        className="me-2 d-inline-flex align-items-center"
        style={{ whiteSpace: 'nowrap' }}
        show={isOpen}
        onToggle={(isOpen) => setIsOpen(isOpen)}
      >
        <div className="px-3 py-2" style={{ minWidth: '300px' }}>
          <Form.Control
            type="text"
            placeholder="Search universities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        </div>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {filteredUniversities.map(university => (
            <NavDropdown.Item
              key={university.id}
              onClick={() => handleSelect(university)}
              active={selectedUniversity?.id === university.id}
            >
              <div>{university.name}</div>
              <small className="text-muted">
                {university.course_count} courses • {university.student_count} students
              </small>
            </NavDropdown.Item>
          ))}
          {filteredUniversities.length === 0 && (
            <div className="text-muted px-3 py-2">
              No universities found
            </div>
          )}
        </div>
      </NavDropdown>
    </div>
  );
};

export default UniversitySelector;
