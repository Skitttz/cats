import { useMemo } from 'react';
import { MessageCircle, UserRound, UsersRound } from 'lucide-react';
import styles from './UserChatList.module.css';

const userInitial = (name = '') => name.trim().charAt(0).toUpperCase() || '?';

const UserChatList = ({
  users = [],
  conversations = [],
  unreadByRoom = {},
  currentUserId,
  activeRoomPostId,
  mainRoomPostId,
  onSelectUser,
  onSelectConversation,
  onSelectMainRoom,
  isLoading = false,
}) => {
  const uniqueUsers = useMemo(() => {
    const seen = new Set();
    return users
      .filter((user) => user && user.name && user.id !== currentUserId)
      .filter((user) => {
        const key = user.id || user.name;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
  }, [users, currentUserId]);
  const conversationByUserId = useMemo(
    () =>
      new Map(
        conversations
          .filter((conversation) => conversation?.userId)
          .map((conversation) => [String(conversation.userId), conversation]),
      ),
    [conversations],
  );
  const conversationUnread = (conversation) =>
    Math.max(
      conversation.unread || 0,
      unreadByRoom[conversation.postId] || 0,
    );
  const unreadCount = conversations.reduce(
    (total, conversation) => total + conversationUnread(conversation),
    0,
  );
  const isMainRoom = activeRoomPostId === mainRoomPostId;

  return (
    <aside
      className={`${styles.containerListUser} ${
        isLoading ? styles.loading : ''
      }`}
      aria-labelledby="conversations-title"
    >
      <div className={styles.containerTitulo}>
        <span className={styles.headerIcon} aria-hidden="true">
          <MessageCircle size={18} aria-hidden="true" />
        </span>
        <div className={styles.headerCopy}>
          <h2 id="conversations-title" className={styles.titleUserList}>
            Conversas
          </h2>
          <p>Grupos e mensagens diretas</p>
        </div>
        {unreadCount > 0 && (
          <span
            className={styles.userCount}
            aria-label={`${unreadCount} mensagens não lidas`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
      <ul className={styles.listNames}>
        <li className={styles.sectionLabel}>
          <h3>Grupos</h3>
          <span aria-label="1 grupo">1</span>
        </li>
        <li
          className={`${styles.userNames} ${
            isMainRoom ? styles.activeRoom : ''
          }`}
        >
          <button
            type="button"
            className={`${styles.userLink} ${styles.roomButton}`}
            onClick={onSelectMainRoom}
            title="Voltar para a Sala Principal"
            aria-current={isMainRoom ? 'page' : undefined}
          >
            <span className={`${styles.roomIcon} ${styles.groupIcon}`}>
              <UsersRound size={17} aria-hidden="true" />
            </span>
            <span className={styles.conversationContent}>
              <span className={styles.userName}>Sala Principal</span>
              <span className={styles.roomKind}>Grupo público</span>
            </span>
          </button>
        </li>

        <li className={styles.sectionLabel}>
          <h3>Mensagens diretas</h3>
          <span
            aria-label={`${conversations.length} conversas privadas`}
          >
            {conversations.length}
          </span>
        </li>
        {conversations.length === 0 && (
          <li className={styles.sectionEmpty}>Nenhuma conversa privada</li>
        )}
        {conversations.map((conversation) => (
          <li
            key={conversation.postId}
            className={`${styles.userNames} ${
              activeRoomPostId === conversation.postId
                ? styles.activeRoom
                : ''
            }`}
          >
            <button
              type="button"
              className={`${styles.userLink} ${styles.roomButton}`}
              onClick={() => onSelectConversation(conversation)}
              title={`Abrir conversa com ${conversation.title}`}
              aria-current={
                activeRoomPostId === conversation.postId ? 'page' : undefined
              }
            >
              <span className={`${styles.roomIcon} ${styles.directAvatar}`}>
                {userInitial(conversation.title)}
              </span>
              <span className={styles.conversationContent}>
                <span className={styles.userName}>{conversation.title}</span>
                {conversation.lastMessage ? (
                  <span className={styles.conversationPreview}>
                    {conversation.lastMessage.userId === currentUserId
                      ? 'Você: '
                      : ''}
                    {conversation.lastMessage.message}
                  </span>
                ) : (
                  <span className={styles.roomKind}>Conversa privada</span>
                )}
              </span>
              {conversationUnread(conversation) > 0 && (
                <span
                  className={styles.unreadBadge}
                  aria-label={`${conversationUnread(conversation)} mensagens não lidas`}
                >
                  {conversationUnread(conversation) > 99
                    ? '99+'
                    : conversationUnread(conversation)}
                </span>
              )}
            </button>
          </li>
        ))}

        <li className={styles.sectionLabel}>
          <h3>Online agora</h3>
          <span aria-label={`${uniqueUsers.length} pessoas online`}>
            {uniqueUsers.length}
          </span>
        </li>

        {uniqueUsers.length === 0 && !isLoading ? (
          <li className={styles.emptyMessage}>
            🐾 Só você está por aqui agora.
          </li>
        ) : (
          uniqueUsers.map((user, index) => {
            const existingConversation = conversationByUserId.get(
              String(user.id),
            );
            const conversationAction = existingConversation
              ? 'Abrir conversa'
              : 'Iniciar conversa';

            return (
              <li
                key={user.id || `user-${index}`}
                className={`${styles.userNames} ${
                  existingConversation?.postId === activeRoomPostId
                    ? styles.activeRoom
                    : ''
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <button
                  type="button"
                  className={`${styles.userLink} ${styles.roomButton}`}
                  title={`${conversationAction} com ${user.name}`}
                  aria-current={
                    existingConversation?.postId === activeRoomPostId
                      ? 'page'
                      : undefined
                  }
                  onClick={() =>
                    existingConversation
                      ? onSelectConversation(existingConversation)
                      : onSelectUser(user)
                  }
                >
                  <span
                    className={`${styles.roomIcon} ${styles.onlineAvatar}`}
                  >
                    <UserRound size={15} aria-hidden="true" />
                  </span>
                  <span className={styles.conversationContent}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.roomKind}>
                      <span className={styles.onlineText}>Online</span>
                      <span aria-hidden="true"> · </span>
                      {conversationAction}
                    </span>
                  </span>
                  <span
                    className={styles.onlineIndicator}
                    title="Online agora"
                    aria-hidden="true"
                  >
                    🟢
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>
      <div className={styles.listFooter}>
        <div className={styles.stats}>
          <span className={styles.onlineUsers}>
            <span className={styles.statusDot} aria-hidden="true" />
            {isMainRoom
              ? users.length <= 1
                ? 'Só você na sala principal'
                : `${users.length} pessoas na sala principal`
              : uniqueUsers.length > 0
                ? 'A outra pessoa está nesta conversa'
                : 'Só você nesta conversa'}
          </span>
        </div>
      </div>
    </aside>
  );
};

export { UserChatList };
