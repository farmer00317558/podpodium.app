import { EpisodeItem, PodcastItem, v2 } from '@podpodium/common';
import { EpisodeData, PodcastData } from '@podpodium/common/lib/user-data-manager/v2';
import { stripHtml } from 'string-strip-html';

export function descriptionToSummary(desc: string) {
  return stripHtml(desc).result;
}

export function podcastItemToPodcastData(podcast: PodcastItem): PodcastData {
  return {
    id: v2.podcastId({ url: podcast.url }),
    url: podcast.url,
    author: podcast.owner,
    image: podcast.imageHref,
    title: podcast.title,
    description: podcast.summary || '',
    summary: podcast.summary || '',
    lastSyncTime: 0,
    episodes: [],
  };
}

export function episodeItemToEpisodeData(episode: EpisodeItem): EpisodeData {
  const pid = v2.podcastId({ url: episode.podcast.url });
  const eid = v2.episodeIdFromPodcastId(episode.title, pid);
  return {
    id: eid,
    url: episode.enclosureURL,
    type: episode.enclosureType,
    length: episode.enclosureLength,
    title: episode.title,
    artwork: episode.imageHref,
    description: episode.summary,
    pubTime: episode.pubDateTimestamp * 1000,
    duration: episode.duration,
    podcast: {
      id: pid,
      url: episode.podcast.url,
      title: episode.podcast.title,
      image: episode.podcast.imageHref,
      author: episode.podcast.owner,
    },
  };
}
