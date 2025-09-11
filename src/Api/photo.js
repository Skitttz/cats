import { getAuthHeaders } from '../Utils/auth';
import { API_URL } from './index';

export function PHOTO_POST(formData) {
  return {
    url: API_URL + '/api/photo',
    options: {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    },
  };
}

export function PHOTO_DELETE(id) {
  return {
    url: `${API_URL}/api/photo/${id}`,
    options: {
      method: 'DELETE',
      headers: getAuthHeaders(),
    },
  };
}

export function LIKE_POST(id) {
  return {
    url: `${API_URL}/api/like/${id}`,
    options: {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    },
  };
}

export function HAS_LIKE_GET(id) {
  return {
    url: `${API_URL}/api/check-like/${id}`,
    options: {
      method: 'GET',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    },
  };
}

export function PHOTO_LIKE_GET(id) {
  return {
    url: `${API_URL}/api/get_total_likes/${id}`,
    options: {
      method: 'GET',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    },
  };
}

export function PHOTOS_GET({ page, total, user }) {
  page = page === undefined ? 0 : page;
  total = total === undefined ? 0 : total;
  user = user === undefined ? 0 : user;
  return {
    url: `${API_URL}/api/photo/?_total=${total}&_page=${page}&_user=${user}`,
    options: {
      method: 'GET',
    },
  };
}

export function PHOTO_GET(id) {
  return {
    url: `${API_URL}/api/photo/${id}`,
    options: {
      method: 'GET',
    },
  };
}
