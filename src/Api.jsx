// export const API_URL = "http://catsapi.test/json";

export const API_URL =
  import.meta.env.VITE_BASE_API_URL || 'http://catsapi.test/json';

export function TOKEN_POST(body) {
  return {
    url: API_URL + '/jwt-auth/v1/token',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

export function TOKEN_VALIDATE_POST(token) {
  return {
    url: API_URL + '/jwt-auth/v1/token/validate',
    options: {
      method: 'POST',
      headers: {
        Authorization: 'Bearer' + token,
      },
    },
  };
}

export function USER_GET(token) {
  return {
    url: API_URL + '/api/user',
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer' + token,
      },
    },
  };
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

export function PHOTO_POST(formData, token) {
  return {
    url: API_URL + '/api/photo',
    options: {
      method: 'POST',
      headers: {
        Authorization: 'Bearer' + token,
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

export function PHOTO_GET_USER(id) {
  return {
    url: `${API_URL}/api/photo/${id}`,
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

export function COMMENT_POST(id, body) {
  return {
    url: `${API_URL}/api/comment/${id}`,
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
