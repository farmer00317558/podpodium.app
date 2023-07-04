import { KeyboardEvent } from 'react';

interface IProps {
  onSearch?: (search: string) => void;
}

export default function SearchInput(props: IProps) {
  const { onSearch } = props;
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key.toLowerCase() == 'enter') {
      const search = e.currentTarget.value;
      onSearch?.(search);
    }
  };
  return (
    <input
      onKeyDown={handleKeyDown}
      className="w-full h-8 text-sm rounded-full focus:outline-none px-3 bg-gray-100"
      placeholder="搜索..."
    />
  );
}
