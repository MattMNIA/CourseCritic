import { useState, useEffect } from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';

const AutocompleteSearch = ({ 
  onSelect, 
  error,
  placeholder,
  fetchItems,
  filterItems,
  renderItem,
  getDisplayValue,
  label,
  disabled
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const fetchedItems = await fetchItems();
        setItems(fetchedItems);
      } catch (err) {
        console.error('Failed to load items:', err);
      }
    };

    loadItems();
  }, [fetchItems]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = filterItems(items, searchTerm);
      setFilteredItems(filtered);
      setShowDropdown(true);
    } else {
      setFilteredItems([]);
      setShowDropdown(false);
    }
  }, [searchTerm, items, filterItems]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setSearchTerm(getDisplayValue(item));
    onSelect(item);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSelectedItem(null);
    setSearchTerm('');
    onSelect(null);
  };

  return (
    <div className="position-relative">
      {selectedItem ? (
        <div className="d-flex align-items-center border rounded p-2">
          <div className="flex-grow-1">
            {renderItem(selectedItem)}
          </div>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={handleClear}
            className="ms-2"
          >
            Change {label}
          </Button>
        </div>
      ) : (
        <>
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            isInvalid={!!error}
            disabled={disabled}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          
          {showDropdown && (
            <ListGroup className="position-absolute w-100 mt-1 shadow-sm" style={{ zIndex: 1000 }}>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <ListGroup.Item 
                    key={item.id}
                    action
                    onClick={() => handleSelect(item)}
                    className="cursor-pointer"
                  >
                    {renderItem(item)}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item disabled>No {label.toLowerCase()} found</ListGroup.Item>
              )}
            </ListGroup>
          )}
        </>
      )}
    </div>
  );
};

export default AutocompleteSearch;
