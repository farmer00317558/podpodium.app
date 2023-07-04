import { atom } from 'recoil';
import { EpisodeData } from '@podpodium/common/lib/user-data-manager/v2';

export const playlist = atom<EpisodeData[]>({
  key: 'playlist',
  default: [],
});
