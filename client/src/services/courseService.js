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
  }
};

export default courseService;
