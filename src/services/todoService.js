import api from './api';

// User CRUD Operations
export const userService = {
  // Get all users
  getUsers: () => api.get('/users'),
  
  // Get single user
  getUser: (id) => api.get(`/users/${id}`),
  
  // Create user
  createUser: (data) => api.post('/users', data),
  
  // Update user
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  
  // Delete user
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Todo CRUD Operations
export const todoService = {
  // Get todos for user
  getUserTodos: (userId, params = {}) => api.get(`/todos/user/${userId}`, { params }),
  
  // Get single todo
  getTodo: (id) => api.get(`/todos/${id}`),
  
  // Create todo
  createTodo: (data) => api.post('/todos', data),
  
  // Update todo
  updateTodo: (id, data) => api.put(`/todos/${id}`, data),
  
  // Delete todo
  deleteTodo: (id) => api.delete(`/todos/${id}`),
  
  // Toggle todo completion
  toggleTodo: (id) => api.patch(`/todos/${id}/toggle`),
  
  // Get todo statistics
  getTodoStats: (userId) => api.get(`/todos/user/${userId}/stats`),
};