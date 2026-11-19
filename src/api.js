const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: 'include',
  });
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const result = response.status === 204 || !isJson ? null : await response.json();

  if (!response.ok) {
    throw new Error(result?.error || `Request failed (${response.status})`);
  }

  return result;
}

export default apiRequest;
