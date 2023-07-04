import 'nprogress/nprogress.css';
import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import nprogress from 'nprogress';
import { RecoilRoot } from 'recoil';
import { App } from '../component/App';
import Head from 'next/head';
import Markdown, { components } from '../component/Markdown';
import { MDXProvider } from '@mdx-js/react';
import { globalFeedConfig } from '@podpodium/common';
import mixpanel from 'mixpanel-browser';

nprogress.configure({ showSpinner: false });

if (typeof window !== 'undefined') {
  const host = window.location.host;
  const schema = window.location.protocol;
  globalFeedConfig.url = (preUrl: string) => {
    return `${schema}//${host}/api/rss?rss=${preUrl}`;
  };
}

function MyApp(appProps: AppProps<{ global: boolean }>) {
  const router = useRouter();
  const { Component, pageProps, ...otherAppProps } = appProps;
  const isGlobal = !!pageProps.global;
  const isHelp = router.pathname.startsWith('/help');

  useEffect(() => {
    mixpanel.init('f183f16567b67fa340089ac70bb8edca', {
      debug: true,
      persistence: 'localStorage',
    });
  }, []);

  useEffect(() => {
    mixpanel.track_pageview();
  }, [router.pathname, router.query]);

  // 页面加载提示条
  useEffect(() => {
    const handleRCS = () => {
      nprogress.start();
    };
    const handleRCC = () => {
      nprogress.done();
    };
    router.events.on('routeChangeStart', handleRCS);
    router.events.on('routeChangeError', handleRCC);
    router.events.on('routeChangeComplete', handleRCC);
    return () => {
      router.events.off('routeChangeStart', handleRCS);
      router.events.off('routeChangeError', handleRCC);
      router.events.off('routeChangeComplete', handleRCC);
    };
  }, [router.events]);

  let content = null;
  if (isGlobal) {
    content = <Component {...pageProps} />;
  } else if (isHelp) {
    content = (
      <MDXProvider components={components}>
        <Markdown>
          <Component {...pageProps} />
        </Markdown>
      </MDXProvider>
    );
  } else {
    content = <App {...appProps} />;
  }

  return (
    <RecoilRoot>
      <Head>
        <title>PodPodium - 一个更自由、更关注用户隐私的播客平台</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      {content}
    </RecoilRoot>
  );
}

export default MyApp;
