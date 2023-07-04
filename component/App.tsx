import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Player, { IPlayer } from './Player';
import { PlayerProps } from '../types';

import Header from './Header';
import Playlist from './Playlist';
import type { AppProps } from 'next/app';
import Nav from './Nav';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { EpisodeData, PodcastData } from '@podpodium/common/lib/user-data-manager/v2';

export function App({ Component, pageProps }: AppProps) {
  const playerRef = useRef<IPlayer>(null);
  const router = useRouter();
  const [currentEp, setEp] = useState<EpisodeData | null>(null);
  const [playing, setPlaying] = useState(false);
  const [isPlaylistShow, showPlaylist] = useState(false);

  useEffect(() => {
    const checkOpenPlaylist = () => {
      const hash = window.location.hash;
      showPlaylist(hash === '#playlist');
    };
    checkOpenPlaylist();

    const handleHashChange = () => {
      checkOpenPlaylist();
    };

    window.addEventListener('hashchange', handleHashChange);
    router.events.on('routeChangeComplete', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      router.events.off('routeChangeComplete', handleHashChange);
    };
  }, [router.events]);

  const handleTogglePlaylist = () => {
    const hash = window.location.hash;
    window.location.hash = hash === '#playlist' ? '' : 'playlist';
  };

  const handlePlayingChange = useCallback(async (playing: boolean, ep: EpisodeData) => {
    setEp(ep);
    setPlaying(playing);
  }, []);

  const handlePlay = useCallback((e: EpisodeData, p?: PodcastData) => {
    setEp(e);
    playerRef.current?.play(e, p);
  }, []);

  const playerProps: PlayerProps = useMemo(
    () => ({
      playing,
      onPlay: handlePlay,
      episodeId: currentEp?.id || '',
    }),
    [handlePlay, currentEp, playing],
  );

  const sidebarClassNames = classNames(
    'w-full md:w-96 absolute bg-white right-0 h-full overflow-y-auto shadow-xl z-10 border-l border-gray-100 transform-gpu gransition-all duration-500',
    {
      'translate-x-full': !isPlaylistShow,
      'md:translate-x-96': !isPlaylistShow,
      'translate-x-0': !isPlaylistShow,
    },
  );

  return (
    <div className="h-full flex flex-col">
      {/* header */}
      <Header />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden relative">
          {/* main */}
          <div className="overflow-y-auto flex-1 relative">
            <div className="mx-auto mt-8 mb-8 px-4 md:px-0 md:max-w-2xl overflow-hidden">
              <Component {...pageProps} player={playerProps} />
            </div>
          </div>
          {/* side */}
          <div className={sidebarClassNames}>
            <Playlist player={playerProps} />
          </div>
        </div>
        <Player
          ref={playerRef}
          onPlayingChange={handlePlayingChange}
          onTogglePlaylist={handleTogglePlaylist}
        />
      </div>
      <Nav />
    </div>
  );
}
