import React, { useState } from 'react';
import classNames from 'classnames';
import AutoLoading from './AutoLoading';
import EpisodeListItem from './EpisodeListItem';
import { PropsWithPlayerProps } from '../types';
import { PodcastData } from '@podpodium/common/lib/user-data-manager/v2';

enum TabKey {
  Episode = 'episode',
  ShowNotes = 'shownotes',
}

interface IProps {
  disableAutoLoading?: boolean;
  episodesLoading?: boolean;
  podcast: PodcastData;
  onLoadMore?: () => void;
}

export default function PodcastDetailContent(props: PropsWithPlayerProps<IProps>) {
  const {
    player,
    podcast,
    episodesLoading = false,
    disableAutoLoading = true,
    onLoadMore = () => null,
  } = props;
  const [curTab, setTab] = useState(TabKey.Episode);
  const tabClassName = 'float-left mr-5 cursor-pointer border-0';
  const activeTabClassName = 'text-blue-600 font-medium border-b-2 border-blue-600';
  return (
    <>
      <div className="mb-6">
        <div
          className={classNames({
            [tabClassName]: true,
            [activeTabClassName]: curTab === TabKey.Episode,
          })}
          onClick={() => setTab(TabKey.Episode)}
        >
          最新单集
        </div>
        <div
          className={classNames({
            [tabClassName]: true,
            [activeTabClassName]: curTab === TabKey.ShowNotes,
          })}
          onClick={() => setTab(TabKey.ShowNotes)}
        >
          节目介绍
        </div>
        <div className="clear-both"></div>
      </div>

      <div className={`space-y-8 ${curTab === TabKey.Episode ? '' : 'hidden'}`}>
        {podcast.episodes.map((e) => (
          <div key={e.id}>
            <EpisodeListItem
              episode={e}
              onPlay={(e) => player.onPlay(e)}
              playing={player.playing && e.id === player.episodeId}
            />
          </div>
        ))}
        {!disableAutoLoading && (
          <AutoLoading loading={episodesLoading && podcast.episodes.length !== 0} onLoad={onLoadMore} />
        )}
      </div>
      <div className={`${curTab === TabKey.ShowNotes ? '' : 'hidden'}`}>
        <div
          className="text-justify leading-8"
          dangerouslySetInnerHTML={{ __html: podcast.description }}
        ></div>
      </div>
    </>
  );
}
