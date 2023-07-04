import { useEffect, useState } from 'react';
import userData from '../common/user-data';
import Empty from '../component/Empty';
import PodcastGallery from '../component/PodcastGallery';
import SectionHeader from '../component/SectionHeader';
import { PodcastData } from '@podpodium/common/lib/user-data-manager/v2';

export default function Subscribed() {
  const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    userData
      ?.subscribedPodcasts()
      .then((res) => {
        setPodcasts(res.filter((i) => !!i));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (podcasts.length === 0 && !loading) {
    return <Empty emoji="📡" text="你还没有订阅任何节目，赶快在顶部搜索订阅吧" />;
  }
  return (
    <div>
      <SectionHeader title="我订阅的节目" />
      <PodcastGallery podcasts={podcasts} />
    </div>
  );
}
