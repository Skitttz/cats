import { getAuthHeaders } from '../Utils/auth';
import { API_URL } from './index';

export function ROOM_MESSAGE_GET(id, { perPage = 50, beforeId } = {}) {
  const params = new URLSearchParams({ per_page: String(perPage) });
  if (beforeId) {
    params.set('before_id', String(beforeId));
  }

  return {
    url: `${API_URL}/api/msg_room/${id}?${params.toString()}`,
    options: {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  };
}
