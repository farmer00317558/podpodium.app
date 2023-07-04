import { GetServerSidePropsResult } from 'next';
import api from '../common/api';
import Link from 'next/link';
import EpisodeList from '../component/EpisodeList';
import Reload from '../component/icons/Reload';
import PodcastGallery from '../component/PodcastGallery';
import SectionHeader from '../component/SectionHeader';
import { PropsWithPlayerProps } from '../types';
import { podcastItemToPodcastData } from '../util/data';
import { PodcastItem, usePromiseResult } from '@podpodium/common';
import userData from '../common/user-data';
import { useCallback, useEffect, useState } from 'react';
import { Loading } from '../component/Loading';

interface IProps {
  hotPodcasts: PodcastItem[];
}

export default function Home(props: PropsWithPlayerProps<IProps>) {
  const { hotPodcasts, player } = props;
  const [dataLoading, setDataLoading] = useState(false);

  const { loading, data, reload } = usePromiseResult(
    useCallback(async () => userData?.getRandomEpisodes(3) ?? [], []),
  );

  const episodes = data || [];
  const podcasts = hotPodcasts.map((i) => podcastItemToPodcastData(i));

  useEffect(() => {
    if (loading || episodes.length > 0 || !userData || hotPodcasts.length === 0) {
      return;
    }
    let c = 0;
    let s = 3;
    setDataLoading(true);
    hotPodcasts.slice(0, s * 2).forEach((i) => {
      userData?.getPodcastData(i.url).finally(() => {
        c += 1;
        if (c >= s) {
          setDataLoading(false);
          reload();
        }
      });
    });
  }, [episodes.length, hotPodcasts, loading, reload]);

  return (
    <div>
      <div className="mb-8">
        <SectionHeader title="随便听听" />
        {(loading && episodes.length === 0) || dataLoading ? (
          <Loading />
        ) : (
          <>
            <EpisodeList episodes={episodes} player={player} />
            <button
              className="text-blue-500 hover:text-blue-600 focus:outline-none cursor-pointer mt-5 flex items-center mx-auto"
              onClick={() => reload()}
            >
              <Reload className="mr-1" /> 换一换
            </button>
          </>
        )}
      </div>

      <div>
        <SectionHeader title="热门节目" />
        <PodcastGallery podcasts={podcasts} />
      </div>
      <div className="text-center text-xs leading-6 pt-8 text-gray-500">
        <div>{` PodPodium  \u00A9 ${new Date().getFullYear()}`}</div>
        <div className="space-x-4">
          <Link href="https://beian.miit.gov.cn">
            <a>京ICP备2021028127号</a>
          </Link>
          <Link href="/disclaimer">
            <a>用户协议</a>
          </Link>
          <Link href="/privacy">
            <a>隐私协议</a>
          </Link>
          <Link href="/donate">
            <a>支持我 🌟</a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (): Promise<GetServerSidePropsResult<IProps>> => {
  const [hotPodcastRes] = await Promise.all([api.podcast.getHotPodcasts(32)]);
  return {
    props: {
      hotPodcasts: hotPodcastRes.data || [],
    },
  };
};
