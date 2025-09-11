export async function fetcher(url, { method = 'GET', body, headers } = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.message ||
        `🙀 Ops! O servidor miou com o erro ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('NetworkError')) {
      throw new Error(
        '😿 Não conseguimos alcançar o servidor... parece que a rede fugiu atrás de um novelo de lã. Tente novamente mais tarde! 🧶',
      );
    }

    throw new Error(
      err.message ||
        '🐱 Algo deu errado, mas não se preocupe, já estamos caçando o bug!',
    );
  }
}
