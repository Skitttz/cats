import Cookies from 'js-cookie';

export function getAuthHeaders(extraHeaders = {}) {
  const token = Cookies.get('token');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}
