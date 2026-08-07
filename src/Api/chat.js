import { getAuthHeaders } from '../Utils/auth';
import { API_URL } from './index';

function DM_ROOM_POST(userId) {
  return {
    url: `${API_URL}/api/dm_room`,
    options: {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ user_id: userId }),
    },
  };
}

function ROOM_MESSAGE_GET(id, { perPage = 50, beforeId } = {}) {
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

export { DM_ROOM_POST, ROOM_MESSAGE_GET };
