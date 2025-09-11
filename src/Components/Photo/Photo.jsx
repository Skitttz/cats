import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { PHOTO_GET_USER } from '../../Api/index';
import useFetch from '../../Hooks/useFetch';
import Error from '../Helper/Error';
import Head from '../Helper/Head';
import Loading from '../Helper/Loading';
import PhotoContent from './PhotoContent';

const Photo = () => {
  const { id } = useParams();
  const { request } = useFetch();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['photo', id],
    queryFn: async () => {
      const { url, options } = PHOTO_GET_USER(id);
      const { json } = await request(url, options);
      return json;
    },
    enabled: !!id,
  });

  if (isError) return <Error error={error?.message || 'Erro ao buscar foto'} />;
  if (isLoading) return <Loading />;

  return (
    <section className="mainContainer container">
      <Head title={data?.photo?.title || 'Foto'} />
      {data && <PhotoContent data={data} single={true} />}
    </section>
  );
};

export default Photo;
