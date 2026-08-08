const CHAT_SERVER_URL = import.meta.env.VITE_APP_URL;

const MAIN_CHAT_ROOM = Object.freeze({
  postId: 210,
  title: 'Sala Principal',
  type: 'main',
});

const CHAT_PAGE_SIZE = 50;

// Reações rápidas do chat; precisa bater com a whitelist do WordPress.
const QUICK_REACTIONS = Object.freeze([
  { emoji: '❤️', label: 'coração' },
  { emoji: '😂', label: 'risada' },
  { emoji: '😮', label: 'surpresa' },
  { emoji: '😢', label: 'tristeza' },
  { emoji: '👍', label: 'joinha' },
  { emoji: '🐱', label: 'gatinho' },
]);

export { CHAT_PAGE_SIZE, CHAT_SERVER_URL, MAIN_CHAT_ROOM, QUICK_REACTIONS };
