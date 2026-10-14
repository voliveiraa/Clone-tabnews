import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

import { Content, DefaultLayout, Flash, Heading, Link } from '@/TabNewsUI';
import { getLoginUrl, useUser } from 'interface';

import classes from './index.module.css';

export default function Post() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const {
    data: { body: contents },
  } = useSWR(user ? `/api/v1/contents/${user.username}?strategy=new&per_page=1` : null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (router && !user && !isLoading) {
      router.push(getLoginUrl(router.asPath));
    }
  }, [user, router, isLoading]);

  return (
    <DefaultLayout
      metadata={{
        title: 'Publicar novo conteúdo',
        description:
          'Publicar novo conteúdo no MediaLake - artigos, tutoriais, indicações, curiosidades, ferramentas e outros assuntos relacionados a tecnologia.',
      }}>

      <Heading as="h1" className={classes.Heading}>
        Publicar novo conteúdo
      </Heading>
      <Content mode="edit" />
    </DefaultLayout>
  );
}
