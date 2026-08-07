import { useCallback, useEffect, useRef, useState } from 'react';
import { ROOM_MESSAGE_GET } from '../../../Api/index';
import { CHAT_PAGE_SIZE } from './chatConfig';
import { mergeChatMessages, toChatMessage } from './chatMessageUtils';

const useChatMessages = ({ roomId, request, onInitialLoad }) => {
  const [messagesState, setMessagesState] = useState([]);
  const [hasMoreState, setHasMoreState] = useState(false);
  const [loadingOlderState, setLoadingOlderState] = useState(false);

  const messagesRef = useRef(messagesState);
  const roomIdRef = useRef(roomId);
  const loadingOlderRef = useRef(loadingOlderState);

  messagesRef.current = messagesState;
  roomIdRef.current = roomId;
  loadingOlderRef.current = loadingOlderState;

  const addMessage = useCallback((message) => {
    setMessagesState((currentMessages) =>
      mergeChatMessages(currentMessages, [toChatMessage(message)]),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    setMessagesState([]);
    setHasMoreState(false);
    setLoadingOlderState(false);
    loadingOlderRef.current = false;

    const loadHistory = async () => {
      const { url, options } = ROOM_MESSAGE_GET(roomId, {
        perPage: CHAT_PAGE_SIZE,
      });
      const { json, response } = await request(url, options);

      if (cancelled) return;

      if (response?.ok && Array.isArray(json)) {
        const history = json.map(toChatMessage);
        setMessagesState((currentMessages) =>
          mergeChatMessages(currentMessages, history),
        );
        setHasMoreState(json.length === CHAT_PAGE_SIZE);

        if (history.length > 0) {
          onInitialLoad();
        }
        return;
      }

      console.error('Erro ao carregar histórico:', response?.statusText);
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [onInitialLoad, request, roomId]);

  const loadOlderMessages = useCallback(async () => {
    const oldestMessage = messagesRef.current[0];
    if (!oldestMessage || loadingOlderRef.current) return;

    const requestedRoomId = roomIdRef.current;
    loadingOlderRef.current = true;
    setLoadingOlderState(true);

    try {
      const { url, options } = ROOM_MESSAGE_GET(requestedRoomId, {
        perPage: CHAT_PAGE_SIZE,
        beforeId: oldestMessage.id,
      });
      const { json, response } = await request(url, options);

      if (requestedRoomId !== roomIdRef.current) return;

      if (response?.ok && Array.isArray(json)) {
        setMessagesState((currentMessages) =>
          mergeChatMessages(currentMessages, json.map(toChatMessage)),
        );
        setHasMoreState(json.length === CHAT_PAGE_SIZE);
        return;
      }

      console.error(
        'Erro ao carregar mensagens antigas:',
        response?.statusText,
      );
    } finally {
      loadingOlderRef.current = false;
      setLoadingOlderState(false);
    }
  }, [request]);

  return {
    messagesState,
    hasMoreState,
    loadingOlderState,
    loadOlderMessages,
    addMessage,
  };
};

export { useChatMessages };
