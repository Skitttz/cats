import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { PHOTOS_GET } from '../../Api/index';
import useFetch from '../../Hooks/useFetch';

function getPhotosPerPage() {
  return window.innerWidth <= 640 ? 4 : 3;
}

function useFeedPhotos(user = 0) {
  const { request } = useFetch();
  const [total] = React.useState(getPhotosPerPage);

  const query = useInfiniteQuery({
    queryKey: ['photos', user, total],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { url, options } = PHOTOS_GET({ page: pageParam, total, user });
      const { response, json } = await request(url, options);

      if (!response?.ok) {
        throw new Error(json?.message || 'Não foi possível carregar as fotos.');
      }

      return json;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < total ? undefined : allPages.length + 1,
  });

  const photos = React.useMemo(
    () => query.data?.pages.flat() ?? [],
    [query.data],
  );

  return {
    photos,
    error: query.error,
    isLoading: query.isLoading,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export { useFeedPhotos };
