import Link from 'next/link';
import { useEffect, useState } from 'react';
import Empty from '../component/Empty';
import EpisodeList from '../component/EpisodeList';
import SectionHeader from '../component/SectionHeader';
import { PropsWithPlayerProps } from '../types';
import userData from '../common/user-data';
import { EpisodeData } from '@podpodium/common/lib/user-data-manager/v2';
import { Loading } from '../component/Loading';

interface IProps {}

export default function Feed(props: PropsWithPlayerProps<IProps>) {
  const { player } = props;
  const [currentFeeds, setFeeds] = useState<EpisodeData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    userData
      ?.feeds(200, { refreshAll: true })
      .then((res) => {
        setFeeds(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (currentFeeds.length === 0 && !loading) {
    return <Empty emoji="🎧" text="你还没有订阅任何节目，赶快在顶部搜索订阅吧" />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <SectionHeader title="最新单集">
        <Link href="/subscribed">
          <a className="text-sm rounded-md font-medium text-blue-500 hover:text-blue-600 focus:outline-none">
            我订阅的节目
          </a>
        </Link>
      </SectionHeader>
      <EpisodeList episodes={currentFeeds} player={player} />
    </div>
  );
}
