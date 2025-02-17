import { useState, useEffect } from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';
import AutocompleteSearch from './AutocompleteSearch';
import userService from '../services/userService';
import courseService from '../services/courseService';

const CourseSearch = ({ onSelect, error }) => {
  const fetchCourses = async () => {
    const user = userService.getCurrentUser();
    if (user?.university_id) {
      return courseService.getCoursesByUniversity(user.university_id);
    }
    return [];
  };

  const filterCourses = (courses, searchTerm) => {
    return courses.filter(course => 
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderCourse = (course) => (
    <>
      <div className="fw-bold">{course.course_code}</div>
      <small>{course.course_name}</small>
    </>
  );

  const getDisplayValue = (course) => `${course.course_code} - ${course.course_name}`;

  return (
    <AutocompleteSearch
      onSelect={onSelect}
      error={error}
      placeholder="Search for a course..."
      fetchItems={fetchCourses}
      filterItems={filterCourses}
      renderItem={renderCourse}
      getDisplayValue={getDisplayValue}
      label="Course"
    />
  );
};

export default CourseSearch;
