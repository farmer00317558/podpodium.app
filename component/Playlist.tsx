import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { PropsWithPlayerProps } from '../types';
import { playlist } from '../state';
import PlayListItem from './PlaylistItem';
import userData from '../common/user-data';

interface IProps {}

export default function Playlist(props: PropsWithPlayerProps<IProps>) {
  const { player } = props;
  const [items, setItems] = useRecoilState(playlist);
  const playlistLoadedRef = useRef(false);

  useEffect(() => {
    if (!playlistLoadedRef.current) {
      return;
    }
    userData?.setPlaylist(items);
  }, [items]);

  useEffect(() => {
    userData?.getPlaylist().then((items) => {
      setItems(items);
      playlistLoadedRef.current = true;
    });
  }, [setItems]);

  return (
    <div className="p-6">
      <h2 className="flex items-center justify-between font-medium text-lg mb-6">
        <div>播放列表</div>
      </h2>
      <div className="space-y-6">
        {(items || []).map((i) => {
          return (
            <PlayListItem
              key={i.id}
              episode={i}
              onPlay={player.onPlay}
              playing={player.episodeId === i.id && player.playing}
            />
          );
        })}
      </div>
    </div>
  );
}
