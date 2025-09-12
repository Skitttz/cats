import { getAuthHeaders } from '../Utils/auth';
import { API_URL } from './index';

export function STATS_GET(id) {
  return {
    url: `${API_URL}/api/stats`,
    options: {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  };
}
