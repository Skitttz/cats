export function formatDateMessage(date = new Date()) {
  const now = new Date();

  const sameDate =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDate) {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    const dayMonth = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
    const hourMin = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dayMonth} ${hourMin}`;
  }
}
