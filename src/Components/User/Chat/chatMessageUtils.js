import { formatDateMessage } from '../../../Utils/format-date-message';

const toChatMessage = (message) => ({
  id: message.id,
  clientId: message.client_id,
  sender: message.sender,
  message: message.msg,
  userId: message.user_id,
  status: 'sent',
  date: formatDateMessage(
    new Date(String(message.timestamp).replace(' ', 'T')),
  ),
});

const createPendingMessage = ({ clientId, sender, message, userId }) => ({
  id: `pending:${clientId}`,
  clientId,
  sender,
  message,
  userId,
  status: 'pending',
  date: formatDateMessage(new Date()),
});

const mergeChatMessages = (currentMessages, incomingMessages) => {
  const messagesById = new Map(
    currentMessages.map((message) => [message.id, message]),
  );

  incomingMessages.forEach((message) => {
    if (message.clientId) {
      messagesById.forEach((currentMessage, id) => {
        if (
          currentMessage.clientId === message.clientId &&
          currentMessage.id !== message.id
        ) {
          messagesById.delete(id);
        }
      });
    }
    messagesById.set(message.id, message);
  });

  return [...messagesById.values()].sort((first, second) => {
    const firstPending = String(first.id).startsWith('pending:');
    const secondPending = String(second.id).startsWith('pending:');

    if (firstPending !== secondPending) return firstPending ? 1 : -1;
    return Number(first.id) - Number(second.id);
  });
};

export { createPendingMessage, mergeChatMessages, toChatMessage };
