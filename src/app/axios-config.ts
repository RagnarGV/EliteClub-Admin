import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'YOUR_API_BASE_URL', // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the CSRF token
apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = localStorage.getItem('token');
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
