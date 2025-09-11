import { getAuthHeaders } from '../Utils/auth';
import { API_URL } from './index';

export function USER_GET(token) {
  return {
    url: API_URL + '/api/user',
    options: {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  };
}

export async function USER_GET_INFO_NAME() {
  try {
    const userInfo = USER_GET(window.localStorage.getItem('token'));
    const response = await fetch(userInfo.url, userInfo.options);
    if (!response.ok) {
      throw new Error('[Error User]');
    }
    const { nome, id } = await response.json();
    return { nome, id };
  } catch (error) {
    return null;
  }
}

export function USER_POST(body) {
  return {
    url: API_URL + '/api/user',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

export function PASSWORD_LOST(body) {
  return {
    url: `${API_URL}/api/password/lost`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

export function PASSWORD_RESET(body) {
  return {
    url: `${API_URL}/api/password/reset`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

export function PHOTO_GET_USER(id) {
  return {
    url: `${API_URL}/api/photo/${id}`,
  };
}
