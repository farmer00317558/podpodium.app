import Link, { LinkProps } from 'next/link';

interface ILinkItemProps extends LinkProps {}

function LinkItem(props: React.PropsWithChildren<ILinkItemProps>) {
  const { children, ...linkProps } = props;
  return (
    <div>
      <Link {...linkProps}>
        <a>
          <div className="p-3">{children}</div>
        </a>
      </Link>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <div className="text-center">
        <h1 className="text-3xl">PodPodium</h1>
        <div className="text-sm text-gray-500 my-4">
          <p>一个更关注隐私的播客应用</p>
        </div>
      </div>

      <div className="border-dashed divide-y divide-dashed border">
        <LinkItem href="/subscribed">我订阅的节目</LinkItem>
        <LinkItem href="/favorite">我喜欢的单集 ️</LinkItem>
        <LinkItem href="/history">我的收听记录</LinkItem>
        <LinkItem href="/app">使用 APP</LinkItem>
        <LinkItem href="/donate">支持我 ❤ </LinkItem>
      </div>
    </div>
  );
}
