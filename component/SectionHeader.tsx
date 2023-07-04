import { PropsWithChildren } from 'react';

interface IProps {
  title: string;
}

export default function SectionHeader(props: PropsWithChildren<IProps>) {
  const { children, title } = props;
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="font-medium text-2xl">{title}</h2>
      {children}
    </div>
  );
}
