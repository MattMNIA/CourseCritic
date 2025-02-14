import { courseService } from '../services/courseService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCoursePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const courseData = {
        course_name: formData.get('courseName'),
        difficulty: parseInt(formData.get('difficulty')),
        hours_of_work: parseInt(formData.get('hoursOfWork')),
        utility: parseInt(formData.get('utility')),
        professor: formData.get('professor'),
        test_coursescol: formData.get('coursecol'),
      };

      await courseService.createCourse(courseData);
      navigate('/courses');
    } catch (err) {
      setError('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Course</h2>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Course Name:</label>
        <input name="courseName" required />
      </div>
      {/* Add other form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Course'}
      </button>
    </form>
  );
};

export default CreateCoursePage;
