import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request to user authentication
apiClient.interceptors.request.use((config) => {
  // Get current user session from sessionStorage
  const session = sessionStorage.getItem('app_session');
  
  if (session) {
    const userSession = JSON.parse(session);
    
    if (userSession.userId) {
      config.headers['X-User-ID'] = userSession.userId;
      if (config.url.includes('/records')) {
        config.params = {
          ...config.params,
          userId: userSession.userId
        };
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response handler for error handling
apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
