import React from 'react';
import { requestResult, requireSuccess } from '../Api/request';

const useFetch = () => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const latestRequest = React.useRef(0);

  React.useEffect(() => () => {
    latestRequest.current += 1;
  }, []);

  const request = React.useCallback(async (url, options) => {
    const requestId = ++latestRequest.current;
    setError(null);
    setData(null);
    setLoading(true);
    const result = await requestResult(url, options);
    if (requestId === latestRequest.current) {
      setData(result.ok ? result.json : null);
      setError(
        result.error?.name === 'AbortError' ? null : result.error?.message || null,
      );
      setLoading(false);
    }
    return result;
  }, []);

  const requestOrThrow = React.useCallback(async (url, options) => {
    return requireSuccess(await request(url, options));
  }, [request]);

  return { data, loading, error, request, requestOrThrow };
};

export default useFetch;
