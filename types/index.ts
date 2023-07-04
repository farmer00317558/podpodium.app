import { EpisodeItem, Me, PodcastItem } from '@podpodium/common';
import { EpisodeData } from '@podpodium/common/lib/user-data-manager/v2';

export interface PlayerProps {
  playing: boolean;
  episodeId: string;
  onPlay: (episode: EpisodeData) => void;
}

export type PropsWithPlayerProps<T> = T & {
  player: PlayerProps;
};

export type PropsWithUserProps<T> = T & {
  user: Me;
};

export type PropsWithPlayerAndUserProps<T> = T & {
  player: PlayerProps;
  user: Me;
};
