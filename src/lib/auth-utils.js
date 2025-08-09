// Helper function to get authentication headers for API requests
export const getAuthHeaders = (additionalHeaders = {}) => {
  // Get the authentication token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const headers = {
    ...additionalHeaders
  };

  // Add authorization header if token exists
  const token = getCookie('better-auth.session_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Helper function to make authenticated API requests
export const authenticatedFetch = async (url, options = {}) => {
  const headers = getAuthHeaders(options.headers || {});
  
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers
  });
};
