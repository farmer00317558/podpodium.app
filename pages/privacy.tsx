import Head from 'next/head';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>隐私协议</title>
      </Head>
      <div className="mx-auto mt-8 mb-8 px-4 md:px-0 md:max-w-2xl">
        <h1 className="text-3xl text-center">PodPodium 播客隐私协议</h1>
        <div className="my-4 space-y-2 leading-loose text-justify">
          <p>本文中所说的 PodPodium 产品，包括： PodPodium PC Web 端、移动 Web 端、Android APP、IOS APP。</p>
          <p> PodPodium 是一个把用户隐私放在第一位的播客平台，我们承诺：</p>
          <ul className="list-disc pl-8">
            <li>不使用 Cookie 相关技术来追踪用户的登录状态，所有的产品无需登录即可使用。</li>
            <li>
              用户在使用过程中所产生的播放列表、收听历史、订阅的节目、收藏的单集等数据均保存在用户手机或者电脑本地，
              PodPodium 不会保存到服务端。
            </li>
            <li>
              订阅的节目 ID，播放列表中的单集 ID 会发送到服务端以获取最新的更新以及单集的详细信息， PodPodium
              不会做任何的收集和保存逻辑。
            </li>
          </ul>
          <div className="text-right">
            <p>生效时间：2021-11-07</p>
            <p>更新时间：2021-11-07</p>
          </div>
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
