import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useEffect, useState } from 'react';
import { PropsWithPlayerProps } from '../types';
import userData from '../common/user-data';
import PodcastDetailHeader from '../component/PodcastDetailHeader';
import PodcastDetailContent from '../component/PodcastDetailContent';
import { PodcastData } from '@podpodium/common/lib/user-data-manager/v2';
import { Loading } from '../component/Loading';

export interface IPodcastPageProps {
  rss: string;
}

export default function Podcast(props: PropsWithPlayerProps<IPodcastPageProps>) {
  const { rss, player } = props;
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    userData
      ?.getPodcastData(rss)
      .then((res) => {
        if (res) {
          setPodcast(res);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rss]);

  if (loading) {
    return <Loading />;
  }

  if (!podcast) {
    return null;
  }

  return (
    <div>
      <PodcastDetailHeader podcast={podcast} />
      <PodcastDetailContent podcast={podcast} player={player} />
    </div>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<IPodcastPageProps>> {
  const { rss } = context.query;

  if (!rss) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      rss: rss as string,
    },
  };
}
