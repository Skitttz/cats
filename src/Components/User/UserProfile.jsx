import React from 'react';
import { useParams } from 'react-router';
import Feed from '../Feed/Feed';
import Head from '../Helper/Head';
import Error from '../Helper/Error';
import Loading from '../Helper/Loading';
import { useQuery } from '@tanstack/react-query';
import { USER_PROFILE_GET } from '../../Api';

const UserProfile = () => {
  const { publicId } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: ['profile', publicId],
    queryFn: async () => {
      const { url, options } = USER_PROFILE_GET(publicId);
      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.message || 'Não foi possível carregar o perfil.');
      }

      return json;
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <Error error={error.message} />;

  return (
    <section className="container mainSection">
      <Head title={data.display_name} />
      <h1 className="title">{data.display_name}</h1>
      <Feed user={data.public_id} />
    </section>
  );
};

export default UserProfile;
