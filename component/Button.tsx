import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';

interface IProps extends HTMLAttributes<HTMLAnchorElement> {
  icon?: React.FC<HTMLAttributes<SVGSVGElement>>;
  activeIcon?: React.FC<HTMLAttributes<SVGSVGElement>>;
  active?: boolean;
  download?: string | boolean;
  href?: string;
  target?: string;
}
export default function Button(props: IProps) {
  const { children, href = '#', icon: Icon, activeIcon: ActiveIcon, active = false, ...btnProps } = props;
  const ai = ActiveIcon && <ActiveIcon className="w-4 h-4 mr-1" />;
  const di = Icon && <Icon className="w-4 h-4 mr-1" />;

  const cl = classNames(
    'rounded-full border cursor-pointer',
    'focus:outline-none inline-flex items-center px-3 py-1 text-xs',
    {
      'hover:border-blue-500 focus:border-blue-600': !active,
      'border-blue-500 border-blue-600 text-blue-600': active,
    },
  );

  return (
    <a rel="noreferrer noopener" href={href} {...btnProps} className={cl}>
      {active ? ai : di}
      {children}
    </a>
  );
}
