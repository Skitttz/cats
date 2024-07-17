import { API_URL } from './index';

export function STATS_GET(id) {
  return {
    url: `${API_URL}/api/stats`,
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + window.localStorage.getItem('token'),
      },
    },
  };
}
