import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { PHOTO_GET_USER } from '../../Api/index';
import Error from '../Helper/Error';
import Head from '../Helper/Head';
import Loading from '../Helper/Loading';
import PhotoContent from './PhotoContent';

const fetchPhoto = async (id) => {
  const { url, options } = PHOTO_GET_USER(id);
  const response = await fetch(url, options);
  if (!response.ok) throw new Error('Erro ao buscar foto');
  const data = await response.json();
  return data;
};

const Photo = () => {
  const { id } = useParams();

  const { data, error, isLoading } = useQuery({
    enabled: Boolean(String(id)),
    queryKey: ['get-photo-feed', id],
    queryFn: () => fetchPhoto(id),
  });

  if (error) return <Error error={error.message} />;
  if (isLoading) return <Loading />;

  return (
    <section className="mainContainer container">
      <Head title={data.photo.title} />
      <PhotoContent data={data} single={true} />
    </section>
  );
};

export default Photo;
