import { api } from './api';

/**
 * Course Service - Handles all course-related API calls
 * @typedef {Object} Course
 * @property {number} idtest_courses - Course ID
 * @property {string} course_name - Name of the course
 * @property {number} difficulty - Difficulty rating
 * @property {number} hours_of_work - Hours of work per week
 * @property {number} utility - Utility rating
 * @property {string} professor - Professor name
 * @property {string} test_coursescol - Additional course info
 */

const courseService = {
  /**
   * Get all courses
   * @returns {Promise<Course[]>}
   */
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  /**
   * Get course by ID
   * @param {number} id - Course ID
   * @returns {Promise<Course>}
   */
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  /**
   * Create new course
   * @param {Omit<Course, 'idtest_courses'>} course - Course data without ID
   * @returns {Promise<Course>}
   */
  createCourse: async (course) => {
    const response = await api.post('/courses', course);
    return response.data;
  },

  /**
   * Update course
   * @param {number} id - Course ID
   * @param {Partial<Omit<Course, 'idtest_courses'>>} course - Course data to update
   * @returns {Promise<Course>}
   */
  updateCourse: async (id, course) => {
    const response = await api.put(`/courses/${id}`, course);
    return response.data;
  },

  /**
   * Delete course
   * @param {number} id - Course ID
   * @returns {Promise<void>}
   */
  deleteCourse: async (id) => {
    await api.delete(`/courses/${id}`);
  },

  /**
   * Get courses by university ID
   * @param {number} universityId - University ID
   * @returns {Promise<Course[]>}
   */
  getCoursesByUniversity: async (universityId) => {
    try {
      const response = await fetch(`/api/courses/university/${universityId}`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      return await response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  },

  /**
   * Get course by ID
   * @param {number} courseId - Course ID
   * @returns {Promise<Course>}
   */
  getCourse: async (courseId) => {
    const response = await fetch(`/api/course/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return await response.json();
  },

  /**
   * Get course reviews by course ID
   * @param {number} courseId - Course ID
   * @returns {Promise<Object[]>}
   */
  getCourseReviews: async (courseId) => {
    const response = await fetch(`/api/course/${courseId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch course reviews');
    return await response.json();
  },

  /**
   * Search courses
   * @param {Object} params - Search parameters
   * @param {number} [params.universityId] - University ID
   * @param {number} [params.courseId] - Course ID
   * @param {number} [params.professorId] - Professor ID
   * @returns {Promise<Course[]>}
   */
  searchCourses: async ({ universityId, courseId, professorId }) => {
    try {
      let url = '/api/search/courses';
      const params = new URLSearchParams();
      
      if (universityId) params.append('university_id', universityId);
      if (courseId) params.append('course_id', courseId);
      if (professorId) params.append('professor_id', professorId);
      
      const queryString = params.toString();
      if (queryString) {
        url += '?' + queryString;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch courses');
      return await response.json();
    } catch (error) {
      console.error('Failed to search courses:', error);
      return [];
    }
  }
};

export default courseService;
