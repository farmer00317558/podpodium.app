import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PlayCircle from '../icons/PlayCircle';
import PauseCircle from '../icons/PauseCircle';
import { fmtDuration } from '../../util/time';
import Playlist from '../icons/Playlist';
import Image from '../Image';
import Link from 'next/link';
import { useSwipeable } from 'react-swipeable';
import classNames from 'classnames';
import Heart from '../icons/Heart';
import HeartFill from '../icons/HeartFill';
import userData from '../../common/user-data';
import { useRecoilState } from 'recoil';
import { playlist } from '../../state';
import { EpisodeData, ListenedEpisodeItem, PodcastData } from '@podpodium/common/lib/user-data-manager/v2';

interface IProps {
  onPlayingChange: (playing: boolean, ep: EpisodeData) => void;
  onTogglePlaylist: () => void;
}

const rates = [0.5, 1.0, 1.5, 2.0, 2.5, 3];

export interface IPlayer {
  play: (ep: EpisodeData, podcast?: PodcastData) => void;
  pause: () => void;
}

function Player(props: IProps, ref: React.Ref<IPlayer>) {
  const { onPlayingChange, onTogglePlaylist } = props;
  const [items, setPlaylist] = useRecoilState(playlist);
  const currentEpisode: ListenedEpisodeItem | undefined = items[0];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOpen, open] = useState(false);
  const [rateIndex, setRateIndex] = useState(1);
  const [buffered, setBuffered] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const swipHandlers = useSwipeable({
    preventDefaultTouchmoveEvent: true,
    onSwipedUp: () => {
      open(true);
    },
    onSwipedDown: () => {
      open(false);
    },
  });

  const handleUpdatePosition = useCallback(
    async (episode: EpisodeData, position: number) => {
      const info = await userData?.listen(episode, position);
      setPlaylist((list) => {
        return list.map((i) => {
          if (i.id !== episode.id) {
            return i;
          }
          return {
            ...i,
            listenInfo: {
              ...info,
              duration: 0,
            },
          };
        });
      });
    },
    [setPlaylist],
  );

  // 调整播放位置
  const handleSeek = async (e: React.MouseEvent<HTMLDivElement>) => {
    const bcr = e.currentTarget.getBoundingClientRect();
    const targetProgress = (e.clientX - bcr.left) / bcr.width;
    const targetPosition = currentEpisode!.duration * targetProgress;

    if (audioRef.current) {
      audioRef.current.currentTime = targetPosition;
    }

    handleUpdatePosition(currentEpisode, targetPosition);
  };

  // 更新播放倍速
  const handleChangeRate = () => {
    const nextRateIndex = (rateIndex + 1) % rates.length;
    const nextRate = rates[nextRateIndex];

    setRateIndex(nextRateIndex);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const handleTogglePlaylist = () => {
    onTogglePlaylist();
  };

  const handleToggleFavorite = async () => {
    if (!currentEpisode || !userData) {
      return;
    }
    const res = await userData?.toggleFavorite(currentEpisode);
    setIsFavorite(res);
  };

  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      audio.currentTime = currentEpisode.listenInfo?.position || 0;
      audio.play();
    } else {
      audio.pause();
    }
  }, [currentEpisode]);

  useEffect(() => {
    if (!currentEpisode) {
      return;
    }
    userData?.isFavorite(currentEpisode.id).then(setIsFavorite);
  }, [currentEpisode]);

  useEffect(() => {
    const refreshBufferedTime = () => {
      if (!audioRef.current) {
        return;
      }
      const len = audioRef.current.buffered.length;
      if (len) {
        const buffered = audioRef.current.buffered.end(len - 1);
        setBuffered(buffered);
      }
    };
    const timer = setInterval(refreshBufferedTime, 50);
    return () => window.clearInterval(timer);
  }, []);

  // 创建 Audio 对象，并监听相关事件
  const initAudio = useCallback(
    (ep: EpisodeData): HTMLAudioElement => {
      const audio = new window.Audio(ep.url);

      // 添加到播放列表
      setPlaylist((list) => [ep, ...list.filter((i) => i.id !== ep.id)]);

      const handleTimeUpdate = () => {
        const e = audio.currentTime;
        const d = audio.duration || ep.duration;
        handleUpdatePosition(ep, e);
        if (e >= d) {
          audio.pause();
        }
      };

      const handlePlay = () => {
        setPlaying(true);
        onPlayingChange(true, ep);
      };

      const handlePause = () => {
        setPlaying(false);
        onPlayingChange(false, ep);
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('timeupdate', handleTimeUpdate);

      if (navigator.mediaSession && window.MediaMetadata) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: ep.title,
          album: ep.podcast.title,
          artwork: [{ src: ep.artwork, sizes: '150x150' }],
        });
      }

      return (audioRef.current = audio);
    },
    [handleUpdatePosition, onPlayingChange, setPlaylist],
  );

  useEffect(() => {
    if (currentEpisode && !audioRef.current) {
      initAudio(currentEpisode);
    }
  }, [initAudio, currentEpisode]);

  // useEffect(() => {
  //   if (!currentEpisode) {
  //     return;
  //   }
  //   userData.addListenInfo(currentEpisode.id, )
  // }, [currentEpisode]);

  useImperativeHandle(ref, () => ({
    play: (ep: EpisodeData) => {
      const preAudio = audioRef.current;
      if (ep.id !== currentEpisode?.id || !preAudio) {
        if (preAudio) {
          preAudio.pause();
        }
        initAudio(ep).play();
      } else {
        preAudio.currentTime = currentEpisode.listenInfo?.position || 0;
        preAudio.play();
      }
    },
    pause: () => {
      audioRef.current?.pause();
    },
  }));

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleTogglePlay]);

  if (!currentEpisode) {
    return null;
  }

  const { duration, listenInfo } = currentEpisode;
  const position = listenInfo?.position || 0;
  const progress = (duration ? position / duration : 0) * 100;
  const bufferedProgress = (duration ? buffered / duration : 0) * 100;

  const progressBar = (
    <div>
      <div className="bg-gray-200 overflow-hidden cursor-pointer relative h-1" onClick={handleSeek}>
        <div
          role="progressbar"
          className="bg-blue-400 h-full absolute w-full z-30"
          style={{ width: `${progress}%` }}
        />
        <div
          role="progressbar"
          className="bg-blue-100 h-full absolute w-full"
          style={{ width: `${bufferedProgress}%` }}
        />
      </div>
    </div>
  );

  const avatarClassName = classNames({
    'flex-none': true,
    'w-11 h-11': !isOpen,
    'w-24 h-24': isOpen,
  });
  const avatar = currentEpisode.podcast && (
    <div className={avatarClassName}>
      <Link href={`/podcast?rss=${currentEpisode.podcast.url}`} passHref>
        <a className="">
          <Image
            width={44}
            height={44}
            alt={currentEpisode.podcast.title}
            src={currentEpisode.podcast.image}
            className={`rounded-lg bg-gray-100 ${avatarClassName}`}
          />
        </a>
      </Link>
    </div>
  );

  const episodeInfo = (
    <Link passHref href={`/episode?rss=${currentEpisode.podcast.url}&id=${currentEpisode.id}`}>
      <div className="w-full space-y-0.5">
        <h2 className="text-black text-base font-medium truncate">{currentEpisode.title}</h2>
        <p className="text-gray-500 text-sm ">剩余 {fmtDuration(duration - position)}</p>
      </div>
    </Link>
  );

  const speedClassName = classNames({
    'mr-3 md:block md:mr-8 focus:outline-none': true,
    'border border-gray-300 rounded-md text-sm font-medium py-1 px-2': true,
    hidden: !isOpen,
  });
  const likeClassName = classNames({
    'mr-3 md:block md:mr-8 focus:outline-none': true,
    hidden: !isOpen,
  });
  const controlClassName = classNames({
    'flex items-center': true,
    'justify-between w-full px-3': isOpen,
    'justify-center': !isOpen,
  });
  const control = (
    <div className={controlClassName}>
      {/* play speed */}
      <button type="button" onClick={handleChangeRate} className={speedClassName}>
        {rates[rateIndex].toFixed(1)}x
      </button>

      {/* like */}
      <button type="button" onClick={handleToggleFavorite} className={likeClassName}>
        {isFavorite ? <HeartFill className="h-8 w-8 text-red-500" /> : <Heart className="h-8 w-8" />}
      </button>

      {/* play */}
      <button type="button" onClick={handleTogglePlay} className="focus:outline-none">
        {!playing ? <PlayCircle className="h-8 w-8" /> : <PauseCircle className="h-8 w-8" />}
      </button>

      {/* playlist */}
      <button type="button" onClick={handleTogglePlaylist} className="ml-3 md:ml-8 focus:outline-none">
        <Playlist className="h-8 w-8" />
      </button>
    </div>
  );

  const simple = (
    <>
      {progressBar}
      <div className="flex flex-1 items-center px-3.5">
        <div className="flex overflow-hidden h-11 items-center flex-1">
          <div className="pr-3.5">{avatar}</div>
          <div className="overflow-hidden">{episodeInfo}</div>
        </div>
        {control}
      </div>
    </>
  );

  const detailed = (
    <>
      {progressBar}
      <div className="flex flex-1 items-center px-3.5">
        <div className="pr-3.5">{avatar}</div>
        <div className="flex flex-col space-y-3 overflow-hidden items-center flex-1">
          {episodeInfo}
          {control}
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`bg-white flex flex-col shadow-md ${isOpen ? 'h-36' : 'h-20'} pt-2 z-30 overflow-hidden`}
      style={{ touchAction: 'pan-y' }}
      {...swipHandlers}
    >
      {isOpen ? detailed : simple}
    </div>
  );
}

export default React.forwardRef(Player);
