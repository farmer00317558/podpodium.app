import Link from 'next/link';
import { IoRadioOutline, IoPersonOutline, IoLibraryOutline } from 'react-icons/io5';
import { ReactNode } from 'react';

interface NavItemProps {
  icon: ReactNode;
  text: string;
  href: string;
}

function NavItem(props: NavItemProps) {
  const { icon, text, href } = props;
  return (
    <Link href={href}>
      <a className="block flex-1 py-3">
        <div className="flex flex-col items-center">
          {icon}
          <span className="mt-1 text-xs text-gray-500">{text}</span>
        </div>
      </a>
    </Link>
  );
}

export default function Nav() {
  return (
    <div className="flex md:hidden justify-center text-center border-t">
      <NavItem href="/" icon={<IoRadioOutline size={24} />} text="发现" />
      <NavItem href="/feed" icon={<IoLibraryOutline size={24} />} text="订阅" />
      <NavItem href="/profile" icon={<IoPersonOutline size={24} />} text="我的" />
    </div>
  );
}
