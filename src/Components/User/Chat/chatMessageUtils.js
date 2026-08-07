import { formatDateMessage } from '../../../Utils/format-date-message';

const toChatMessage = (message) => ({
  id: message.id,
  sender: message.sender,
  message: message.msg,
  userId: message.user_id,
  date: formatDateMessage(
    new Date(String(message.timestamp).replace(' ', 'T')),
  ),
});

const mergeChatMessages = (currentMessages, incomingMessages) => {
  const messagesById = new Map(
    currentMessages.map((message) => [message.id, message]),
  );

  incomingMessages.forEach((message) => {
    messagesById.set(message.id, message);
  });

  return [...messagesById.values()].sort((first, second) => first.id - second.id);
};

export { mergeChatMessages, toChatMessage };
