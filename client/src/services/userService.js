import { api } from './api';

const USER_KEY = 'coursecritic_user';

const userService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    const user = response.data;
    userService.setCurrentUser(user);
    return user;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    const user = response.data;
    userService.setCurrentUser(user);
    return user;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${user.id}`;
    } else {
      localStorage.removeItem(USER_KEY);
      delete api.defaults.headers.common['Authorization'];
    }
  },

  logout: () => {
    userService.setCurrentUser(null);
    window.location.href = '/';
  },

  updateUniversity: async (universityId) => {
    try {
      const currentUser = userService.getCurrentUser();
      if (!currentUser) throw new Error('No user logged in');

      await api.put(`/users/${currentUser.id}/university`, { universityId });
      
      // Update local user data
      const updatedUser = { ...currentUser, university_id: universityId };
      userService.setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to update university:', error);
      throw error;
    }
  }
};

// Initialize API headers with existing user token if available
const currentUser = userService.getCurrentUser();
if (currentUser) {
  api.defaults.headers.common['Authorization'] = `Bearer ${currentUser.id}`;
}

export default userService;
