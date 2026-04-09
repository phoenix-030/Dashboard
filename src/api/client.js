import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include user authentication
apiClient.interceptors.request.use((config) => {
  // Get current user session from sessionStorage
  const session = sessionStorage.getItem('app_session');
  console.log('API Request - Session found:', !!session);
  
  if (session) {
    const userSession = JSON.parse(session);
    console.log('API Request - User session:', userSession);
    
    if (userSession.userId) {
      // Add user ID to headers or as a query parameter
      config.headers['X-User-ID'] = userSession.userId;
      // For JSON Server, we'll use query parameters to filter by user
      if (config.url.includes('/records')) {
        // Add userId as query parameter for filtering
        config.params = {
          ...config.params,
          userId: userSession.userId
        };
        console.log('API Request - Final URL:', config.baseURL + config.url, 'Params:', config.params);
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for debugging
apiClient.interceptors.response.use((response) => {
  console.log('API Response:', response.config.url, response.data);
  return response;
}, (error) => {
  console.error('API Error:', error.config?.url, error.response?.data || error.message);
  return Promise.reject(error);
});

export default apiClient;
