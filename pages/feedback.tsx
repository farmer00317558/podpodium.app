import Head from 'next/head';

export default function Contact() {
  return (
    <>
      <Head>
        <title>联系作者</title>
      </Head>
      <div className="mx-auto mt-8 mb-8 px-4 md:px-0 md:max-w-2xl">
        <h1 className="text-3xl text-center">联系作者</h1>
        <div className="my-4 space-y-2 leading-loose text-justify">
          <p>嗨，你好，我是 PodPodium 开发者”，很高兴你能使用 PodPodium 听播客。</p>
          <p>
            PodPodium
            希望能倾听广大播客爱好者的声音，跟大家一起打造一款属于我们自己的，一款更注重用户隐私的播客应用。
          </p>
          <p>
            PodPodium
            是由我个人在业余时间开发的，有很多不足之处，做得不好的地方还望大家见谅，如果能收到你的反馈，我倍感荣幸。
          </p>
          <p>如果你有任何功能上的建议或者没有找到你想听的节目，可以通过下面的联系方式告诉我：</p>
          <p>微信：leobaba88</p>
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
