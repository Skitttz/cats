import { useEffect, useState } from 'react';
import { API_URL } from '../../../Api';
import { useUser } from '../../../UserContext';
import { getAuthHeaders } from '../../../Utils/auth';
import { fetchChatMedia, isPrivateChatMedia } from '../../../Utils/chatMedia';

export function ChatImage({ src, alt, ...props }) {
  const { data } = useUser();
  const [media, setMedia] = useState(null);
  const privateMedia = isPrivateChatMedia(src, API_URL);

  useEffect(() => {
    if (!privateMedia) return;
    const controller = new AbortController();
    let localURL;
    fetchChatMedia(src, {
      apiBase: API_URL,
      headers: getAuthHeaders(),
      signal: controller.signal,
    })
      .then((blob) => {
        if (controller.signal.aborted) return;
        localURL = URL.createObjectURL(blob);
        setMedia({ source: src, userId: data?.id, url: localURL });
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && !controller.signal.aborted) {
          setMedia({ source: src, userId: data?.id, error: error.message });
        }
      });
    return () => {
      controller.abort();
      if (localURL) URL.revokeObjectURL(localURL);
    };
  }, [src, privateMedia, data?.id]);

  const currentMedia = media?.source === src && media?.userId === data?.id ? media : null;
  if (privateMedia && currentMedia?.error) return <span role="status">{currentMedia.error}</span>;
  const imageURL = privateMedia ? currentMedia?.url : src;
  if (!imageURL) return <span role="status">Carregando foto…</span>;
  return <img {...props} src={imageURL} alt={alt} />;
}
