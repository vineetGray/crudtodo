// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     console.error('💥 API Error:', error.response?.data || error.message);
    
//     if (error.response?.status === 404) {
//       console.error('🔍 Resource not found');
//     } else if (error.response?.status === 500) {
//       console.error('🚨 Server error');
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';

// Use environment variable for API URL with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for production
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('💥 API Error:', error.response?.data || error.message);
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('🌐 Network error - check your internet connection or API server');
    }
    
    if (error.response?.status === 404) {
      console.error('🔍 Resource not found');
    } else if (error.response?.status === 500) {
      console.error('🚨 Server error');
    } else if (error.response?.status === 401) {
      console.error('🔐 Unauthorized access');
    }
    
    return Promise.reject(error);
  }
);

export default api;