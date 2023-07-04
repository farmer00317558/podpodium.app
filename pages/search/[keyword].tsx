import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Link from 'next/link';
import { useMemo } from 'react';
import api, { clientApi, useApiResource } from '../../common/api';
import Empty from '../../component/Empty';
import { PropsWithPlayerProps } from '../../types';
import PodcastListItem from '../../component/PodcastListItem';
import { PodcastData } from '@podpodium/common/lib/user-data-manager/v2';
import { podcastItemToPodcastData } from '../../util/data';

interface IProps {
  search: string;
  podcasts: PodcastData[];
}

export default function Search(props: PropsWithPlayerProps<IProps>) {
  const { podcasts, search, player } = props;
  const remoteSearchParams = useMemo(() => ({ search, remote: true }), [search]);
  const [remoteSearchResultState] = useApiResource(clientApi.podcast.listPodcasts, remoteSearchParams);

  const isEmpty = !remoteSearchResultState.loading && podcasts.length === 0;

  return (
    <div className="space-y-6">
      {isEmpty && <Empty text="没有搜索到任何东西，换个词试试？" />}
      {podcasts.length > 0 && (
        <div className="space-y-4">
          {podcasts.map((i) => (
            <div key={i.id}>
              <Link href={`/podcast?rss=${i.url}`}>
                <a>
                  <PodcastListItem podcast={i} />
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<IProps>> {
  const { keyword } = context.query;

  if (!keyword) {
    return {
      notFound: true,
    };
  }

  const [searchPodcastRes] = await Promise.all([
    api.podcast.listPodcasts({
      search: keyword as string,
    }),
  ]);

  const podcasts = (searchPodcastRes.data.data || []).map((i: any) => podcastItemToPodcastData(i));

  return {
    props: { podcasts, search: keyword as string },
  };
}
