import Link from 'next/link';
import { PropsWithChildren, ReactNode } from 'react';
import { relative } from '../../util/time';
import AddToPlaylistButton from '../AddToPlaylistButton';
import PlayButton from '../PlayButton';
import { EpisodeData } from '@podpodium/common/lib/user-data-manager/v2';
import { descriptionToSummary } from '../../util/data';

interface Podcast {
  id: string;
  title: string;
  imageHref: string;
}

interface IProps<E> {
  lite?: boolean;
  episode: E;
  onPlay: (e: E) => void;
  playing: boolean;
  showSummary?: boolean;
  showAddToListButton?: boolean;
  header?: ReactNode;
}

export function EpisodeListItemHeader(props: PropsWithChildren<{}>) {
  return <div className="text-xs text-gray-400 mb-3">{props.children}</div>;
}

export default function EpisodeListItem<E extends EpisodeData = EpisodeData>(props: IProps<E>) {
  const {
    episode,
    lite = false,
    showSummary = true,
    showAddToListButton = true,
    playing,
    header = <EpisodeListItemHeader>{relative(episode.pubTime)}</EpisodeListItemHeader>,
    onPlay,
  } = props;

  if (!episode) {
    return null;
  }
  const summary = descriptionToSummary(episode.description);
  const imageSrc = episode.podcast?.image || episode.artwork;

  const image = (
    <div
      className="h-12 w-12 flex-shrink-0 bg-center bg-cover shadow-sm rounded-md"
      style={{ backgroundImage: `url(${imageSrc || '/no-image.jpeg'})` }}
    />
  );

  return (
    <div>
      {header}
      <div className="flex">
        {episode.podcast ? (
          <Link href={`/podcast?rss=${episode.podcast.url}`}>
            <a>{image}</a>
          </Link>
        ) : (
          image
        )}
        <div className="ml-4 space-y-2 w-full overflow-hidden">
          <h2 className={`font-medium flex items-center ${lite ? 'text-sm font-normal' : ''}`}>
            <div className="flex-1">
              <Link href={`/episode?rss=${episode.podcast.url}&id=${episode.id}`}>
                <a className="hover:text-blue-500">{episode.title}</a>
              </Link>
            </div>
          </h2>
          {showSummary && summary && (
            <div className="text-xs leading-normal text-justify max-h-9 overflow-hidden">{summary}</div>
          )}
          <div className="flex items-center space-x-4">
            {showAddToListButton && <AddToPlaylistButton added={false} ep={episode} />}
            <PlayButton playing={playing} duration={episode.duration} onClick={() => onPlay(episode)} />
          </div>
        </div>
      </div>
    </div>
  );
}
