import API from './index';

// User Authentication APIs
export const userAPI = {
  // Register new user
  register: async (name, email, password, role = 'user') => {
    try {
      const response = await API.post('/users/signup', { name, email, password, role });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await API.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Signup alias for register
  signup: async (userData) => {
    try {
      const response = await API.post('/users/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await API.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await API.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  // Admin: Get all users
  getAllUsers: async () => {
    try {
      const response = await API.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  // Admin: Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await API.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  // Admin: Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await API.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  // Admin: Delete user
  deleteUser: async (userId) => {
    try {
      const response = await API.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },
};

export default userAPI;