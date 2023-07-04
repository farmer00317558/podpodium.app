import React from 'react';
import { descriptionToSummary } from '../util/data';
import { PodcastData } from '@podpodium/common/lib/user-data-manager/v2';

interface IProps {
  podcast: PodcastData;
}

export default function PodcastListItem(props: IProps) {
  const { podcast } = props;
  return (
    <div className="flex space-x-4">
      <div
        className="h-12 w-12 flex-shrink-0 bg-center bg-cover shadow-sm rounded-md"
        style={{ backgroundImage: `url(${podcast.image || '/no-image.jpeg'})` }}
      />
      <div className="flex-1 overflow-hidden flex flex-col justify-between">
        <div className="hover:text-blue-500 cursor-pointer">{podcast.title}</div>
        <div className="truncate text-xs text-justify text-gray-400">
          {descriptionToSummary(podcast.summary || '')}
        </div>
      </div>
    </div>
  );
}
