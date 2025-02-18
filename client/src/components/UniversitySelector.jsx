import { useState, useEffect, useRef, useCallback } from 'react';
import { NavDropdown, Form, ListGroup } from 'react-bootstrap';
import { debounce } from 'lodash';
import userService from '../services/userService';
import { useUniversity } from '../contexts/UniversityContext';

const UniversitySelector = () => {
  const { updateUniversity } = useUniversity();
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);

  const fetchUniversities = async (query, pageNum) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/universities/search?q=${query}&page=${pageNum}&limit=10`);
      const data = await response.json();
      
      if (pageNum === 1) {
        setUniversities(data.universities);
      } else {
        setUniversities(prev => [...prev, ...data.universities]);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to fetch universities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      setPage(1);
      fetchUniversities(query, 1);
    }, 300),
    []
  );

  useEffect(() => {
    // Initial load of universities or handle search
    if (isOpen) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, isOpen]);

  // Load saved university
  useEffect(() => {
    const loadSavedUniversity = async () => {
      const saved = localStorage.getItem('currentUniversity');
      if (saved) {
        setSelectedUniversity(JSON.parse(saved));
      }
    };
    loadSavedUniversity();
  }, []);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUniversities(searchTerm, nextPage);
    }
  };

  const handleSelect = (university) => {
    setSelectedUniversity(university);
    updateUniversity(university);
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
            gap: '4px',
            maxWidth: '150px'  // Reduced from 200px
          }}>
            <span style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              width: '100%'
            }}>
              {selectedUniversity ? selectedUniversity.name : "Select University"}
            </span>
          </div>
        }
        id="university-selector"
        className="me-2 d-inline-flex align-items-center"
        style={{ maxWidth: '180px' }}  // Reduced from 250px
        show={isOpen}
        onToggle={(isOpen) => {
          setIsOpen(isOpen);
          if (isOpen && universities.length === 0) {
            fetchUniversities('', 1);
          }
        }}
      >
        <div className="px-3 py-2" style={{ minWidth: '250px', maxWidth: '500px' }}>
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
          {universities.map(university => (
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
          {isLoading && (
            <div className="text-center py-2">Loading...</div>
          )}
          {hasMore && !isLoading && (
            <NavDropdown.Item onClick={handleLoadMore}>
              Load more...
            </NavDropdown.Item>
          )}
          {universities.length === 0 && !isLoading && (
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
