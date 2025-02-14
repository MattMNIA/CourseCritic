import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import styles from '../../styles/ViewCoursesPage.module.css';

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
    <div className={styles.coursesContainer}>
      {courses.map(course => (
        <div key={course.idtest_courses} className={styles.courseCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.courseName}>{course.course_name}</h3>
            <p className={styles.professorName}>Prof. {course.professor}</p>
          </div>
          
          <div className={styles.cardBody}>
            <div className={styles.statGrid}>
              <div className={styles.stat}>
                <p className={styles.statLabel}>Difficulty</p>
                <p className={styles.statValue}>{course.difficulty}/10</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statLabel}>Hours/Week</p>
                <p className={styles.statValue}>{course.hours_of_work}</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statLabel}>Utility</p>
                <p className={styles.statValue}>{course.utility}/10</p>
              </div>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <Link 
              to={`/courses/edit/${course.idtest_courses}`}
              className={styles.editBtn}
            >
              Edit Course
            </Link>
            <button 
              onClick={() => handleDelete(course.idtest_courses)}
              className={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewCoursesPage;
