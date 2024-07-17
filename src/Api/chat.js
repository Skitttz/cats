import { API_URL } from './index';

export function ROOM_MESSAGE_POST(id, body) {
  return {
    url: `${API_URL}/api/msg_room/${id}`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem('token'),
      },
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
