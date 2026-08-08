const MUTE_STORAGE_KEY = 'cats:dm-notifications';
const NOTIFICATION_BODY_MAX = 120;

function isDirectMessageMuted() {
  try {
    return globalThis.localStorage?.getItem(MUTE_STORAGE_KEY) === 'muted';
  } catch {
    return false;
  }
}

function setDirectMessageMuted(muted) {
  try {
    globalThis.localStorage?.setItem(MUTE_STORAGE_KEY, muted ? 'muted' : 'on');
  } catch {
    // Aba anonima ou storage bloqueado: a preferencia so nao persiste.
  }
}

function shouldNotifyDirectMessage({
  permission,
  visibility,
  message,
  currentUserId,
  muted,
}) {
  if (permission !== 'granted') return false;
  if (muted) return false;
  if (visibility !== 'hidden') return false;
  if (!currentUserId) return false;
  if (!message || !Number(message.room_id)) return false;

  return Number(message.user_id) !== Number(currentUserId);
}

function truncateBody(text) {
  if (text.length <= NOTIFICATION_BODY_MAX) return text;
  return `${text.slice(0, NOTIFICATION_BODY_MAX - 1).trimEnd()}…`;
}

function buildDirectMessageNotification(message) {
  const title = (message?.sender || '').trim() || 'Nova mensagem';
  const text =
    typeof message?.message === 'string' ? message.message.trim() : '';

  let body;
  if (message?.type === 'image') {
    body = text ? `📷 ${truncateBody(text)}` : 'enviou uma foto';
  } else {
    body = truncateBody(text);
  }

  return {
    title,
    options: {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      // Mensagens seguidas da mesma sala substituem em vez de empilhar.
      tag: `dm-${message.room_id}`,
      renotify: true,
    },
  };
}

export {
  buildDirectMessageNotification,
  isDirectMessageMuted,
  MUTE_STORAGE_KEY,
  setDirectMessageMuted,
  shouldNotifyDirectMessage,
};
