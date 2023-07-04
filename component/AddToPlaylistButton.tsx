import { HTMLAttributes } from 'react';
import { useSetRecoilState } from 'recoil';
import { playlist } from '../state';
import Button from './Button';
import PlusSquare from './icons/PlusSquare';
import PlusSquareFill from './icons/PlusSquareFill';
import { EpisodeData } from '@podpodium/common/lib/user-data-manager/v2';

interface IProps extends HTMLAttributes<HTMLAnchorElement> {
  ep: EpisodeData;
  added: boolean;
}

export default function AddToPlaylistButton(props: IProps) {
  const { ep, added, ...btnProps } = props;
  const setPlaylist = useSetRecoilState(playlist);

  const handleAddToOrRemoveFromPlaylist = async () => {
    if (added) {
      // TODO remove from
    } else {
      setPlaylist((list) => {
        const nextList = list.filter((i) => i.id !== ep.id);
        nextList.splice(1, 0, ep);
        return nextList;
      });
    }
  };

  return (
    <Button active={added} {...btnProps} onClick={handleAddToOrRemoveFromPlaylist}>
      {added ? <PlusSquareFill className="h-3 w-3 mr-2" /> : <PlusSquare className="h-3 w-3 mr-2" />}
      {added ? '已添加到播放列表' : '添加到播放列表'}
    </Button>
  );
}
