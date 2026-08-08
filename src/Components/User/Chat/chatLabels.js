function buildConnectedLabel({ roomType, peerIsPresent, userCount }) {
  if (roomType === 'direct') {
    if (peerIsPresent) return 'Online nesta conversa';
    return 'Aguardando a outra pessoa';
  }

  if (userCount <= 1) return 'Só você está na sala';

  return `${userCount} pessoas na sala`;
}

function buildTypingLabel(names) {
  if (names.length === 0) return '';
  if (names.length === 1) return `${names[0]} está digitando…`;
  if (names.length === 2) return `${names[0]} e ${names[1]} estão digitando…`;

  return `${names[0]}, ${names[1]} e mais ${names.length - 2} estão digitando…`;
}

export { buildConnectedLabel, buildTypingLabel };
