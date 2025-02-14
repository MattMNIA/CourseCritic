import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(parseInt(id));
        setCourse(data);
      } catch (err) {
        setError('Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course || !id) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updateData = {
        course_name: formData.get('courseName'),
        difficulty: parseInt(formData.get('difficulty')),
        hours_of_work: parseInt(formData.get('hoursOfWork')),
        utility: parseInt(formData.get('utility')),
        professor: formData.get('professor'),
        test_coursescol: formData.get('coursecol'),
      };

      await courseService.updateCourse(parseInt(id), updateData);
      navigate('/courses');
    } catch (err) {
      setError('Failed to update course');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Course</h2>
      <input
        name="courseName"
        defaultValue={course.course_name}
        required
      />
      {/* Add similar inputs for other fields */}
      <button type="submit">Update Course</button>
    </form>
  );
};

export default EditCoursePage;
