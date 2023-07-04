import Link from 'next/link';
import PlayingIcon from './icons/Playing';
import PlayCircle from './icons/PlayCircle';
import { fmtDuration } from '../util/time';
import { useState } from 'react';
import { EpisodeData, PodcastData } from '@podpodium/common/lib/user-data-manager/v2';

interface Podcast {
  id: string;
  title: string;
  imageHref: string;
}
interface IProps {
  playing: boolean;
  podcast?: PodcastData;
  episode: EpisodeData;
  onPlay: (e: EpisodeData) => void;
}

export default function PlayListItem(props: IProps) {
  const { podcast, episode, playing, onPlay } = props;
  const defaultImage = podcast?.image || episode.artwork;
  const [removing] = useState(false);

  const image = (
    <div
      className="h-12 w-12 flex-shrink-0 bg-center bg-cover shadow-sm rounded-md"
      style={{ backgroundImage: `url(${defaultImage || '/no-image.jpeg'})` }}
    />
  );

  const handlePlay = () => {
    if (playing) {
      return;
    }
    onPlay(episode);
  };

  const handleRemove = () => {};

  return (
    <div key={episode.id}>
      <div>
        <div className="flex">
          <div className="h-full w-12 flex-shrink-0">
            {podcast ? <Link href={`/podcast?rss=${podcast.url}`}>{image}</Link> : image}
          </div>
          <div className="ml-4 items-center w-full flex">
            <div className="flex-1">
              <h2 className={'flex items-center text-sm text-justify'}>
                <div className="flex-1">
                  <Link href={`/episode?rss=${episode.podcast.url}&id=${episode.id}`}>
                    <a className="hover:text-blue-500">{episode.title}</a>
                  </Link>
                </div>
              </h2>
              <div className="mt-1 space-x-4 text-xs">
                <span className="text-gray-400">{fmtDuration(episode.duration)}</span>
                <a className="text-blue-500 hover:text-blue-600" href="#" onClick={handleRemove}>
                  {removing ? '正在移除' : '移除'}
                </a>
              </div>
            </div>
            <div className=" cursor-pointer hover:text-blue-500 ml-4" onClick={handlePlay}>
              {playing ? <PlayingIcon className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
