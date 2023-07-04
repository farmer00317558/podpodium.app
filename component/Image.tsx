import NextImage from 'next/image';
import { HTMLAttributes, ImgHTMLAttributes } from 'react';
interface IProps extends ImgHTMLAttributes<HTMLImageElement> {
  width: number;
  height: number;
}

export default function Image(props: IProps) {
  const { src, width, height, alt, className, ...imgProps } = props;
  if (!src) {
    return (
      <NextImage src="/no-image.jpeg" width={width} height={height} objectFit="cover" className={className} />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt || 'podium'} className={className} {...imgProps} />;
}
