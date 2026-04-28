const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  
  // Clean up the URL if it contains /api-docs (common misconfiguration)
  if (url.includes('/api-docs')) {
    url = url.replace('/api-docs', '');
  }
  
  // Ensure it ends with /api/v1
  if (!url.includes('/api/v1')) {
    // Remove trailing slash if present
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    url = `${cleanUrl}/api/v1`;
  }
  
  // Final check to remove trailing slash from the combined URL
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const BASE_URL = getBaseUrl();

export const getAuthToken = () => localStorage.getItem('admin_token') || '';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if the response is JSON
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any) => fetchWithAuth(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
};

export default api;

