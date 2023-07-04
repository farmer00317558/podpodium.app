import Head from 'next/head';

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>用户协议</title>
      </Head>
      <div className="mx-auto mt-8 mb-8 px-4 md:px-0 md:max-w-2xl">
        <h1 className="text-3xl text-center">PodPodium 用户协议</h1>
        <div className="my-4 space-y-2 leading-loose text-justify">
          <p>
            PodPodium
            是一个播客收听平台，所有的内容均来源于网络公开的内容，内容的所有权归播客创作者所有。对于播客的内容，平台不承担任何法律责任。
          </p>
          <p>
            如果平台上有任何触犯您的合法权益的内容，请及时通知我（
            <a href="https://twitter.com/Farmer00317558">Farmer00317558</a>），我会尽快确认并处理。
          </p>
          <p>
            PodPodium 是一个纯客户端的工具，用户可以通过指定任意的 RSS
            地址来展示播客列表。用户在使用本工具时，请遵守相关的法律法规。因此造成的任何风险，本平台不承担任何责任。
          </p>
        </div>
        <div className="text-right">
          <p>生效时间：2021-11-07</p>
          <p>更新时间：2021-11-07</p>
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
