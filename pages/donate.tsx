import Image from 'next/image';
import Head from 'next/head';

export default function Donate() {
  return (
    <>
      <Head>
        <title>支持我</title>
      </Head>
      <div className="mx-auto mt-8 mb-8 px-4 md:px-0 md:max-w-2xl">
        <h1 className="text-3xl text-center">支持我</h1>
        <div className="my-4 space-y-2 leading-loose text-justify">
          <p>嗨，你好，我是 PodPodium 开发者，很高兴你能使用 PodPodium 听播客。</p>
          <p>
            PodPodium
            希望能倾听广大播客爱好者的声音，跟大家一起打造一款属于我们自己的，一款更注重用户隐私的播客应用。
          </p>
          <p>
            PodPodium
            是由我个人在业余时间开发的，有很多不足之处，做得不好的地方还望大家见谅，如果能收到你的反馈，我倍感荣幸。
          </p>
          <p>
            开发并维护一款软件，不仅占用大量的业余时间，同时也需要持续支付不低的各种服务器相关费用，如果你希望鼓励我继续把这款软件做得更好，可以通过下面的二维码进行打赏。
          </p>
          <p className="text-center">
            <Image src="/donate.png" width={256} height={256} alt="Donate" />
          </p>
          <p>如果想跟我成为朋友，可以加我微信：</p>
          <p>微信：leobaba88</p>
          <p>
            Twitter:{' '}
            <a
              className="text-blue-500"
              target="_blank"
              href="https://twitter.com/Farmer00317558"
              rel="noreferrer"
            >
              @Farmer00317558
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = () => {
  return {
    props: {
      global: true,
    },
  };
};
