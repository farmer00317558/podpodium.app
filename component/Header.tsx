import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SearchInput from './SearchInput';

interface IProps {}

export default function Header(props: IProps) {
  const router = useRouter();

  const handleSearch = (keyword: string) => {
    if (keyword.startsWith('http')) {
      router.push(`/podcast?rss=${keyword}`);
      return;
    }
    router.push(`/search/${keyword}`);
  };

  return (
    <div className="shadow-md z-20 px-4 py-2 bg-white flex items-center">
      <div className="md:flex-1 mr-2 md:flex">
        <Link href="/">
          <a>
            <div className="cursor-pointer font-semibold text-lg flex items-center justify-center">
              <Image height={28} width={28} src="/logo.png" alt="LJT" />
              <span className="ml-2 hidden md:inline">PodPodium</span>
            </div>
          </a>
        </Link>
      </div>
      <div className="flex-1 w-full md:w-auto">
        <div className="w-full">
          <SearchInput onSearch={handleSearch} />
        </div>
      </div>
      <div className="hidden md:flex flex-1 text-sm justify-end items-center space-x-4 font-medium">
        <Link href="/app">
          <a>
            <div className="hover:text-blue-400 font-bold text-blue-500 cursor-pointer">APP</div>
          </a>
        </Link>
        <Link href="/donate">
          <a>
            <div className="hover:text-blue-400 cursor-pointer">支持我 🌟</div>
          </a>
        </Link>
        <Link href="/feed">
          <a>
            <div className="hover:text-blue-500 cursor-pointer">我的订阅</div>
          </a>
        </Link>
        <Link href="/history">
          <a>
            <div className="hover:text-blue-500 cursor-pointer">收听记录</div>
          </a>
        </Link>
      </div>
    </div>
  );
}
