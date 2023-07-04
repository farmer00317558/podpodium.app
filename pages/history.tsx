import { useEffect, useState } from 'react';
import AutoLoading from '../component/AutoLoading';
import Empty from '../component/Empty';
import EpisodeListItem, { EpisodeListItemHeader } from '../component/EpisodeListItem';
import SectionHeader from '../component/SectionHeader';
import { PropsWithPlayerProps } from '../types';
import userData from '../common/user-data';
import { ListenedEpisodeItem } from '@podpodium/common/lib/user-data-manager/v2';
import { relative } from '../util/time';

interface IProps {}

const pageSize = 20;

export default function History(props: PropsWithPlayerProps<IProps>) {
  const { player } = props;
  const [episodes, setEpisodes] = useState<ListenedEpisodeItem[]>([]);
  const [currentOffset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    setOffset((i) => (i += pageSize));
  };

  const handlePlay = (e: ListenedEpisodeItem) => {
    player.onPlay(e);
    setEpisodes((i) => [e, ...i.filter((n) => n.id !== e.id)]);
  };

  useEffect(() => {
    userData
      ?.loadHistory(currentOffset, pageSize)
      .then((res) => {
        setEpisodes((i) => i.concat(res || []));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentOffset]);

  if (episodes.length === 0) {
    return <Empty emoji="📜" text="你还没有收听过任何节目，赶快去听一听吧" />;
  }

  return (
    <div>
      <SectionHeader title="我的收听记录" />

      <div className="space-y-12">
        {episodes.map((i) => {
          return (
            <EpisodeListItem<ListenedEpisodeItem>
              header={
                <EpisodeListItemHeader>
                  上次收听于：{relative((i.listenInfo?.lastTouchTime ?? 0) * 1000)}
                </EpisodeListItemHeader>
              }
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
