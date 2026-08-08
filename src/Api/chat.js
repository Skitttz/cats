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

function DM_ROOMS_GET() {
  return {
    url: `${API_URL}/api/dm_rooms`,
    options: {
      method: 'GET',
      headers: getAuthHeaders(),
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

function MESSAGE_REACTION_POST(messageId, emoji) {
  return {
    url: `${API_URL}/api/msg_reaction/${messageId}`,
    options: {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ emoji }),
    },
  };
}

function CHAT_IMAGE_POST(roomId, file) {
  const body = new FormData();
  body.append('img', file);

  return {
    url: `${API_URL}/api/chat_image/${roomId}`,
    options: {
      method: 'POST',
      headers: getAuthHeaders(),
      body,
    },
  };
}

export {
  CHAT_IMAGE_POST,
  DM_ROOM_POST,
  DM_ROOMS_GET,
  MESSAGE_REACTION_POST,
  ROOM_MESSAGE_GET,
};
