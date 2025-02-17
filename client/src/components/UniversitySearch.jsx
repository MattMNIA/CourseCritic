import { useState } from 'react';
import AutocompleteSearch from './AutocompleteSearch';

const UniversitySearch = ({ onSelect, error }) => {
  const fetchUniversities = async () => {
    // Use existing universities endpoint
    const response = await fetch('/api/universities');
    const data = await response.json();
    return data;
  };

  const filterUniversities = (universities, searchTerm) => {
    return universities.filter(university => 
      university.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderUniversity = (university) => (
    <>
      <div className="fw-bold">{university.name}</div>
      <small>{university.course_count} courses, {university.student_count} students</small>
    </>
  );

  const getDisplayValue = (university) => university.name;

  return (
    <AutocompleteSearch
      onSelect={onSelect}
      error={error}
      placeholder="Search for a university..."
      fetchItems={fetchUniversities}
      filterItems={filterUniversities}
      renderItem={renderUniversity}
      getDisplayValue={getDisplayValue}
      label="University"
    />
  );
};

export default UniversitySearch;
