import { PodcastData } from '@podpodium/common/lib/user-data-manager/v2';
import React, { useEffect, useState } from 'react';
import userData from '../common/user-data';
import Button from './Button';
import Check from './icons/Check';
import Plus from './icons/Plus';
import Image from './Image';

interface IProps {
  podcast: PodcastData;
}

export default function PodcastDetailHeader(props: IProps) {
  const { podcast } = props;

  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleToggleSub = () => {
    userData?.toggleSubscribe(podcast).then(([i]) => setSubscribed(i));
  };

  useEffect(() => {
    userData?.isSubscribed(podcast.id).then(setSubscribed);
  }, [podcast.id]);

  return (
    <div className="flex mb-8">
      <div className="w-24 h-full">
        <Image
          className="object-cover rounded-lg shadow-sm"
          width={96}
          height={96}
          src={podcast.image}
          alt={podcast.title}
        />
      </div>
      <div className="ml-4 space-y-2">
        <h1 className="text-2xl">{podcast?.title}</h1>
        <div>{podcast.author}</div>
        <div>
          <Button active={subscribed} onClick={handleToggleSub} activeIcon={Check} icon={Plus}>
            {subscribed ? '已经订阅' : '订阅'}
          </Button>
        </div>
      </div>
    </div>
  );
}
