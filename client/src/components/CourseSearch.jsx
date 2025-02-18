import { useState, useEffect } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AutocompleteSearch from './AutocompleteSearch';
import courseService from '../services/courseService';
import { useUniversity } from '../contexts/UniversityContext';

const CourseSearch = ({ onSelect, error }) => {
  const navigate = useNavigate();
  const { currentUniversity } = useUniversity();

  const fetchCourses = async () => {
    if (!currentUniversity?.id) return [];
    return courseService.searchCourses({ universityId: currentUniversity.id });
  };

  const filterCourses = (courses, searchTerm) => {
    return courses.filter(course => 
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderCourse = (course) => (
    <ListGroup.Item
      key={course.id}
      action
      onClick={() => handleCourseClick(course)}
      className="d-flex justify-content-between align-items-center"
    >
      <div className="fw-bold">{course.course_code}</div>
      <small>{course.course_name}</small>
    </ListGroup.Item>
  );

  const getDisplayValue = (course) => `${course.course_code} - ${course.course_name}`;

  const handleCourseClick = (course) => {
    if (onSelect) {
      onSelect(course);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  return (
    <AutocompleteSearch
      key={currentUniversity?.id || 'no-university'}
      onSelect={onSelect}
      error={error}
      placeholder={currentUniversity ? "Search for a course..." : "Select a university first"}
      fetchItems={fetchCourses}
      filterItems={filterCourses}
      renderItem={renderCourse}
      getDisplayValue={getDisplayValue}
      label="Course"
      disabled={!currentUniversity}
    />
  );
};

export default CourseSearch;
