import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

interface IDownloadLinkProps {
  url?: string;
  text: string;
}

function DownloadLink(props: IDownloadLinkProps) {
  const { url, text } = props;
  if (!url) {
    return (
      <div className="rounded-full bg-blue-300 leading-6 cursor-not-allowed text-white py-3 px-5">{text}</div>
    );
  }
  return (
    <Link href={url}>
      <a>
        <div className="rounded-full bg-blue-600 hover:bg-blue-500 text-center leading-6 text-white py-3 px-5">
          {text}
        </div>
      </a>
    </Link>
  );
}

export default function AppDownload() {
  const [isInWeiXin, setIsInWeiXin] = useState(false);

  useEffect(() => {
    setIsInWeiXin(navigator.userAgent.toLowerCase().indexOf('weixin') !== -1);
  }, []);

  return (
    <>
      <Head>
        <title>欢迎使用 PodPodium 听播客</title>
      </Head>
      {isInWeiXin && <div className="fixed top-1 right-4 text-red-500 font-bold">请在浏览器中打开 ⬆️</div>}
      <div className="flex flex-col justify-center items-center h-full w-full">
        <div className="w-64 flex flex-col place-items-center">
          <Image height={64} width={64} src="/logo.png" alt="LJT" />
          <div className="py-6 text-center leading-loose">
            <p>欢迎使用 PodPodium 听播客</p>
          </div>
          <div>
            <div>
              <a href="https://play.google.com/store/apps/details?id=com.lingjiangtai">
                <Image
                  width={646}
                  height={250}
                  objectFit="contain"
                  alt="下载应用，请到 Google Play"
                  src="/images/google-play-badge.png"
                />
              </a>
              <a href="https://apps.apple.com/app/id1614074989">
                <Image
                  width={109}
                  height={40}
                  layout="responsive"
                  alt=""
                  src="/images/apple-store-badge.svg"
                />
              </a>
            </div>
            <div className="space-y-5 mt-5">
              <div>
                <DownloadLink
                  url="https://public.lingjiangtai.com/apks/podpodium-2.2.2.apk"
                  text="下载 Android 安装包"
                />
              </div>
              <div className="text-center">
                <Link href="/contact">
                  <a className=" text-blue-500 text-xs">联系作者</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function getServerSideProps() {
  return {
    props: {
      global: true,
    },
  };
}
