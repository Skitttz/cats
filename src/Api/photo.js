import { API_URL } from './index';

export function PHOTO_POST(formData, token) {
  return {
    url: API_URL + '/api/photo',
    options: {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
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
      cache: 'no-store',
    },
  };
}

export function PHOTO_GET(id) {
  return {
    url: `${API_URL}/api/photo/${id}`,
    options: {
      method: 'GET',
      cache: 'no-store',
    },
  };
}

export function PHOTO_DELETE(id) {
  return {
    url: `${API_URL}/api/photo/${id}`,
    options: {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + window.localStorage.getItem('token'),
      },
    },
  };
}

export function LIKE_POST(id) {
  return {
    url: `${API_URL}/api/like/${id}`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem('token'),
      },
    },
  };
}

export function HAS_LIKE_GET(id) {
  return {
    url: `${API_URL}/api/check-like/${id}`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem('token'),
      },
    },
  };
}

export function PHOTO_LIKE_GET(id) {
  return {
    url: `${API_URL}/api/get_total_likes/${id}`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem('token'),
      },
    },
  };
}
