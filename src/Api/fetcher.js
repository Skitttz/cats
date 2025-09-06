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

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData?.message || 'Erro na requisição';
    throw new Error(errorMessage);
  }

  return response.json();
}
