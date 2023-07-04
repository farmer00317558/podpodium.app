import { HTMLAttributes } from 'react';
import { fmtDuration } from '../util/time';
import Button from './Button';
import PlayCircle from './icons/PlayCircle';
import PlayingIcon from './icons/Playing';

interface IProps extends HTMLAttributes<HTMLAnchorElement> {
  duration: number;
  playing: boolean;
}

export default function PlayButton(props: IProps) {
  const { duration, playing, ...btnProps } = props;
  return (
    <Button {...btnProps} active={playing}>
      {playing ? <PlayingIcon className="h-3 w-3 mr-2" /> : <PlayCircle className="h-3 w-3 mr-2" />}
      {playing ? '正在播放' : fmtDuration(duration)}
    </Button>
  );
}
