import { EpisodeData } from '@podpodium/common/lib/user-data-manager/v2';
import { format, parse, add, sub, isSameDay } from 'date-fns';
import { useState } from 'react';
import { clientApi } from '../common/api';
import { PropsWithPlayerProps } from '../types';
import { episodeItemToEpisodeData } from '../util/data';
import Empty from './Empty';
import EpisodeListItem from './EpisodeListItem';

interface IProps {
  initialDate: string;
  initialRecommend: EpisodeData[];
}

const fmtStr = 'yyyy-MM-dd';

export default function DailyRecommend(props: PropsWithPlayerProps<IProps>) {
  const { initialDate, initialRecommend, player } = props;
  const [date, setDate] = useState(initialDate);
  const [recommend, setRecommend] = useState(initialRecommend);

  const today = new Date();
  const currentDate = parse(date, fmtStr, new Date());
  const isToday = isSameDay(today, currentDate);

  const handleChangeDate = async (direction: -1 | 1) => {
    const nextDate = format(add(currentDate, { days: direction }), fmtStr);
    const res = await clientApi.daily.getDailyRecommend(nextDate);
    setRecommend((res.data || []).map((i) => episodeItemToEpisodeData(i)));
    setDate(nextDate);
  };

  return (
    <>
      <div className="space-y-8 mb-6">
        {recommend.length === 0 && <Empty text="台长这天比较懒，没有任何推荐" />}
        {recommend.map((i) => (
          <EpisodeListItem
            key={i.id}
            episode={i}
            onPlay={player.onPlay}
            playing={player.episodeId === i.id && player.playing}
          />
        ))}
      </div>
      <div className="flex">
        <div className="flex-1">
          <div
            onClick={() => handleChangeDate(-1)}
            className="text-blue-500 hover:text-blue-600 cursor-pointer inline-block"
          >
            前一天
          </div>
        </div>
        <div className="text-gray-300 flex-1 text-center">{date}</div>
        <div className="flex-1 text-right">
          {!isToday && (
            <div
              onClick={() => handleChangeDate(1)}
              className="text-blue-500 hover:text-blue-600 cursor-pointer inline-block"
            >
              后一天
            </div>
          )}
        </div>
      </div>
    </>
  );
}
