import EpisodeListItem from './EpisodeListItem';
import { PropsWithPlayerProps } from '../types';
import { EpisodeData } from '@podpodium/common/lib/user-data-manager/v2';

interface IProps {
  episodes: EpisodeData[];
}

export default function EpisodeList(props: PropsWithPlayerProps<IProps>) {
  const { episodes, player } = props;
  return (
    <div className="space-y-8">
      {episodes.map((i) => (
        <EpisodeListItem
          key={i.id}
          episode={i}
          onPlay={player.onPlay}
          playing={player.episodeId === i.id && player.playing}
        />
      ))}
    </div>
  );
}
