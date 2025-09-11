import { getAuthHeaders } from '../Utils/auth';
import { API_URL } from './index';

export function ROOM_MESSAGE_POST(id, body) {
  return {
    url: `${API_URL}/api/msg_room/${id}`,
    options: {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    },
  };
}

export function ROOM_MESSAGE_GET(id) {
  return {
    url: `${API_URL}/api/msg_room/${id}`,
    options: {
      method: 'GET',
    },
  };
}
