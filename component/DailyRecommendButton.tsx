import { useState } from 'react';
import { clientApi } from '../common/api';
import Button from './Button';

interface IProps {
  episodeId: string;
}

export default function DailyRecommendButton(props: IProps) {
  const { episodeId } = props;
  const [done, setDone] = useState(false);
  const handleReco = async () => {
    if (done) {
      return;
    }
    await clientApi.daily.addDailyRecommend({
      episodeId,
    });
    setDone(true);
  };
  return <Button onClick={handleReco}>{done ? '推荐成功' : '每日推荐'}</Button>;
}
