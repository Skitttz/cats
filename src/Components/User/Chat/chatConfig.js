const CHAT_SERVER_URL = import.meta.env.VITE_APP_URL;

const MAIN_CHAT_ROOM = Object.freeze({
  postId: 210,
  title: 'Chat Room',
});

const CHAT_PAGE_SIZE = 50;

export { CHAT_PAGE_SIZE, CHAT_SERVER_URL, MAIN_CHAT_ROOM };
