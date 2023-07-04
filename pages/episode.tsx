import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Link from 'next/link';
import { IoPlayCircleOutline } from 'react-icons/io5';
import PlayButton from '../component/PlayButton';
import { PropsWithPlayerProps } from '../types';
import { relative } from '../util/time';
import { EpisodeData } from '@podpodium/common/lib/user-data-manager/v2';
import userData from '../common/user-data';
import { useEffect, useState } from 'react';
import { Loading } from '../component/Loading';
import Button from '../component/Button';
import Download from '../component/icons/Download';
import { useRecoilState } from 'recoil';
import { playlist } from '../state';
import mixpanel from 'mixpanel-browser';

interface IProps {
  rss: string;
  id: string;
  src: string;
}

export default function Episode(props: PropsWithPlayerProps<IProps>) {
  const { rss, id, src, player } = props;
  const [episode, setEpisodeData] = useState<EpisodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [items] = useRecoilState(playlist);
  const currentEpisode = items[0];

  useEffect(() => {
    setLoading(true);
    userData
      ?.getEpisodeData(rss, id)
      .then((res) => {
        if (!res) {
          return;
        }
        setEpisodeData(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, rss]);

  if (loading) {
    return <Loading />;
  }

  if (!episode) {
    return null;
  }

  return (
    <div>
      {/* Float play button */}
      {currentEpisode?.id !== episode.id && src === 'app-share' && (
        <div
          className="fixed bottom-48 left-1/2 sm:hidden"
          onClick={() => {
            player.onPlay(episode);
          }}
        >
          <IoPlayCircleOutline
            size={48}
            className="text-blue-500 -translate-x-1/2 transform bg-white rounded-full shadow-lg"
          />
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        {episode.artwork && (
          <div
            className="h-32 w-32 mb-4 flex-shrink-0 bg-center bg-cover shadow-sm rounded-md"
            style={{ backgroundImage: `url(${episode.artwork})` }}
          />
        )}
        <div className="space-y-3 text-center">
          <h1 className="text-xl">{episode.title}</h1>
          <div className="text-sm text-gray-400">发布于：{relative(episode.pubTime)}</div>
          <div className="text-sm">
            <Link href={`/podcast?rss=${episode.podcast.url}`}>
              <a className=" text-blue-500 hover:text-blue-600 font-medium cursor-pointer">
                {episode.podcast.title}
              </a>
            </Link>
          </div>
          <div className="flex justify-center space-x-3">
            <Button target="_blank" href={episode.url}>
              <Download className="mr-2" />
              下载
            </Button>
            <PlayButton
              playing={player.playing && player.episodeId === episode.id}
              onClick={() => player.onPlay(episode)}
              duration={episode.duration}
            />
          </div>
        </div>
      </div>
      <div className="leading-8 show-notes" dangerouslySetInnerHTML={{ __html: episode.description }}></div>
    </div>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id, rss, src = '' } = context.query;

  if (!id || !rss) {
    return {
      notFound: true,
    };
  }

  return {
    props: { rss, id, src },
  };
};
