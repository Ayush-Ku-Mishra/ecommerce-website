import axios from 'axios';
import toast from 'react-hot-toast';

// Setup axios interceptors to handle network errors
export function setupAxiosInterceptors() {
  // Add a response interceptor to catch network errors
  axios.interceptors.response.use(
    // For successful responses, just return the response
    (response) => response,
    
    // For error responses, handle network errors
    (error) => {
      // Check if it's a network error (no response from server)
      if (!error.response) {
        if (!navigator.onLine) {
          // User is offline - toast already shown by NetworkStatus component
          console.log('Request failed - user is offline');
        } else {
          // Network error but user appears online
          toast.error('Network error. Please check your connection or try again later.');
        }
      }
      
      // Continue with the error to let components handle it
      return Promise.reject(error);
    }
  );
}