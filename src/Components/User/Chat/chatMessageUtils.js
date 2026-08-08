import { formatDateMessage } from '../../../Utils/format-date-message';

const normalizeReactions = (reactions) =>
  Array.isArray(reactions)
    ? reactions
        .filter(
          (reaction) =>
            typeof reaction?.emoji === 'string' && Number(reaction?.count) > 0,
        )
        .map((reaction) => {
          const rawUserIds = reaction.user_ids || reaction.userIds;
          const userIds = Array.isArray(rawUserIds)
            ? rawUserIds.map(Number).filter((id) => Number.isSafeInteger(id))
            : [];

          return {
            emoji: reaction.emoji,
            count: Number(reaction.count),
            reactedByMe: Boolean(
              reaction.reacted_by_me ?? reaction.reactedByMe,
            ),
            userIds,
          };
        })
    : [];

// Reconcilia o estado vindo do servidor, derivando reactedByMe dos userIds.
const reconcileReactions = (reactions, currentUserId) =>
  normalizeReactions(reactions).map((reaction) => ({
    ...reaction,
    reactedByMe: reaction.userIds.includes(Number(currentUserId)),
  }));

// Toggle otimista: um emoji por usuário; repetir o mesmo remove.
const toggleReaction = (reactions, emoji, userId) => {
  const numericUserId = Number(userId);
  const list = normalizeReactions(reactions);
  const reactedWithSame = list.some(
    (reaction) =>
      reaction.emoji === emoji && reaction.userIds.includes(numericUserId),
  );

  const withoutMine = list
    .map((reaction) => {
      if (!reaction.userIds.includes(numericUserId)) return reaction;

      return {
        ...reaction,
        count: reaction.count - 1,
        reactedByMe: false,
        userIds: reaction.userIds.filter((id) => id !== numericUserId),
      };
    })
    .filter((reaction) => reaction.count > 0);

  if (reactedWithSame) return withoutMine;

  const existing = withoutMine.find((reaction) => reaction.emoji === emoji);
  if (existing) {
    existing.count += 1;
    existing.reactedByMe = true;
    existing.userIds = [...existing.userIds, numericUserId];
    return withoutMine;
  }

  return [
    ...withoutMine,
    { emoji, count: 1, reactedByMe: true, userIds: [numericUserId] },
  ];
};

const toChatMessage = (message) => ({
  id: message.id,
  clientId: message.client_id,
  sender: message.sender,
  message: message.msg,
  userId: message.user_id,
  type: message.type === 'image' ? 'image' : 'text',
  imageUrl: typeof message.image_url === 'string' ? message.image_url : '',
  status: 'sent',
  reactions: normalizeReactions(message.reactions),
  date: formatDateMessage(
    new Date(String(message.timestamp).replace(' ', 'T')),
  ),
});

const createPendingMessage = ({
  clientId,
  sender,
  message,
  userId,
  type = 'text',
  imageUrl = '',
}) => ({
  id: `pending:${clientId}`,
  clientId,
  sender,
  message,
  userId,
  type,
  imageUrl,
  status: 'pending',
  reactions: [],
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

export {
  createPendingMessage,
  mergeChatMessages,
  normalizeReactions,
  reconcileReactions,
  toChatMessage,
  toggleReaction,
};
