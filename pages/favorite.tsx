import { useEffect, useState } from 'react';
import AutoLoading from '../component/AutoLoading';
import Empty from '../component/Empty';
import EpisodeListItem, { EpisodeListItemHeader } from '../component/EpisodeListItem';
import SectionHeader from '../component/SectionHeader';
import { PropsWithPlayerProps } from '../types';
import { relative } from '../util/time';
import userData from '../common/user-data';
import { FavoriteEpisodeItem } from '@podpodium/common/lib/user-data-manager/v2';

interface IProps {}

const pageSize = 20;

export default function Favorite(props: PropsWithPlayerProps<IProps>) {
  const { player } = props;
  const [eps, setEps] = useState<FavoriteEpisodeItem[]>([]);
  const [currentOffset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    setOffset((i) => (i += pageSize));
  };

  const handlePlay = (e: FavoriteEpisodeItem) => {
    player.onPlay(e);
  };

  useEffect(() => {
    setLoading(true);
    userData
      ?.favoriteEpisodes(currentOffset, pageSize)
      .then((res) => {
        setEps((i) => i.concat(res || []));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentOffset]);

  if (eps.length === 0 && !loading) {
    return <Empty emoji="🥰" text="你还没有喜欢过任何节目，赶快去听一听吧" />;
  }

  return (
    <div>
      <SectionHeader title="我喜欢的单集" />

      <div className="space-y-12">
        {eps.map((i) => {
          return (
            <EpisodeListItem<FavoriteEpisodeItem>
              header={<EpisodeListItemHeader>在 {relative(i.pubTime)} 喜欢了此单集</EpisodeListItemHeader>}
              key={i.id}
              episode={i}
              onPlay={handlePlay}
              playing={player.episodeId === i.id && player.playing}
            />
          );
        })}
      </div>
      <AutoLoading loading={loading} onLoad={handleLoadMore} />
    </div>
  );
}
