// Only the configured API may receive the JWT. Legacy public images and local
// optimistic blob URLs keep their ordinary image loading path.
export function isPrivateChatMedia(src, apiBase) {
  const base = new URL(apiBase);
  const url = new URL(src, base);
  const prefix = `${base.pathname.replace(/\/$/, '')}/api/chat_media/`;
  return url.origin === base.origin && url.pathname.startsWith(prefix);
}

export async function fetchChatMedia(src, { apiBase, headers, signal, fetchImpl = globalThis.fetch }) {
  if (!isPrivateChatMedia(src, apiBase)) throw new Error('Origem de mídia inválida.');
  const response = await fetchImpl(src, { headers, signal, cache: 'no-store', credentials: 'omit' });
  if (!response.ok) throw new Error('Não foi possível carregar esta foto.');
  const blob = await response.blob();
  if (!blob.type.startsWith('image/')) throw new Error('Formato de mídia inválido.');
  return blob;
}
