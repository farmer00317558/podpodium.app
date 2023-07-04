import { PodcastItem } from '@podpodium/common';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { clientApi, useApi } from '../../../common/api';
import PodcastDetailContent from '../../../component/PodcastDetailContent';
import PodcastDetailHeader from '../../../component/PodcastDetailHeader';
import { PropsWithPlayerProps } from '../../../types';
import { episodeItemToEpisodeData, podcastItemToPodcastData } from '../../../util/data';

export default function AdminPodcastDetail(props: PropsWithPlayerProps<{}>) {
  const { player } = props;
  const router = useRouter();
  const { id } = router.query;
  const [podcastState, requestDetail] = useApi(clientApi.admin.getPodcastDetail);
  const [episodeListState, requestEpisodes] = useApi(clientApi.admin.listEpisodes);

  const podcast = podcastState.data;
  const episodes = episodeListState.data?.data || [];

  useEffect(() => {
    if (!id) {
      return;
    }
    const query = { limit: 20, offset: 0, podcastIds: [id as string] };
    requestDetail(id as string);
    requestEpisodes(query);
  }, [id, requestDetail, requestEpisodes]);

  if (!podcast) {
    return null;
  }

  const podcastData = podcastItemToPodcastData({ url: '', ...podcast });
  return (
    <div>
      <PodcastDetailHeader podcast={podcastData} />
      <PodcastDetailContent disableAutoLoading podcast={podcastData} player={player} />
    </div>
  );
}
