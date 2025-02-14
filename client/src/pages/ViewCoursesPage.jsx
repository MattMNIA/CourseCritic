import React, { useEffect, useState } from 'react';
import { courseService } from '../services/courseService';

const ViewCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (err) {
        setError('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await courseService.deleteCourse(id);
      setCourses(courses.filter(course => course.idtest_courses !== id));
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="courses-container">
      {courses.map(course => (
        <div key={course.idtest_courses} className="course-card">
          <h3>{course.course_name}</h3>
          <p>Professor: {course.professor}</p>
          <p>Difficulty: {course.difficulty}/10</p>
          <p>Hours of Work: {course.hours_of_work}</p>
          <p>Utility: {course.utility}/10</p>
          <button 
            onClick={() => handleDelete(course.idtest_courses)}
            className="delete-btn"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ViewCoursesPage;
