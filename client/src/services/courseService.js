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
      const response = await api.get(`/courses/university/${universityId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch university courses:', error);
      throw error;
    }
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
      let url = '/search/courses';
      const params = new URLSearchParams();
      
      if (universityId) params.append('university_id', universityId);
      if (courseId) params.append('course_id', courseId);
      if (professorId) params.append('professor_id', professorId);
      
      // Only add the query string if we have parameters
      const queryString = params.toString();
      if (queryString) {
        url += '?' + queryString;
      }
      console.log('Searching courses at URL:', url);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to search courses:', error);
      throw error;
    }
  }
};

export default courseService;
