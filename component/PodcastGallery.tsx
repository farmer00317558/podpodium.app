import Link from 'next/link';
import { PodcastData } from '@podpodium/common/lib/user-data-manager/v2';

interface IProps {
  podcasts: PodcastData[];
}

export default function PodcastGallery(props: IProps) {
  const { podcasts } = props;
  const rows = Math.ceil(podcasts.length / 4);
  return (
    <div className="grid grid-cols-4 gap-4" style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
      {podcasts.map((i) => (
        <Link key={i.id} passHref href={`/podcast?rss=${i.url}`}>
          <div
            className="h-full w-full rounded-xl overflow-hidden bg-cover bg-center shadow-sm cursor-pointer"
            style={{ backgroundImage: `url(${i.image})`, paddingBottom: '100%' }}
          ></div>
        </Link>
      ))}
    </div>
  );
}
