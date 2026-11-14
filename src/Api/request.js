// Legacy forms receive a result; React Query opts into rejection explicitly.
export async function requestResult(url, options, fetchImpl = globalThis.fetch) {
  let response = null;
  try {
    response = await fetchImpl(url, options);
    const text = await response.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(
        'O servidor retornou uma resposta inválida. Tente novamente.',
      );
    }
    if (!response.ok) {
      const error = new Error(
        json?.message || `Falha na requisição (${response.status}).`,
      );
      error.status = response.status;
      return { ok: false, response, json: null, error };
    }
    return { ok: true, response, json, error: null };
  } catch (error) {
    return { ok: false, response, json: null, error };
  }
}

export function requireSuccess(result) {
  if (!result.ok) throw result.error;
  return result;
}
