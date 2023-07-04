import Head from 'next/head';
import Image from 'next/image';
import { HTMLAttributes, PropsWithChildren, ReactElement } from 'react';

function h1(props: HTMLAttributes<HTMLHeadElement>) {
  return (
    <>
      <Head>
        <title>{props.children}</title>
      </Head>
      <h1 {...props} className="text-3xl text-center mb-8">
        {props.children}
      </h1>
    </>
  );
}

const ul = (props: HTMLAttributes<HTMLUListElement>) => (
  <ul {...props} className="list-disc pl-8 leading-6" />
);
const ol = (props: HTMLAttributes<HTMLOListElement>) => (
  <ol {...props} className="list-decimal pl-8 leading-6" />
);
const p = (props: HTMLAttributes<HTMLParagraphElement>) => <p {...props} className="mb-4 leading-4" />;
const h2 = (props: HTMLAttributes<HTMLHeadElement>) => (
  <h2 {...props} className="text-2xl mb-4 mt-8 leading-4" />
);
const img = (props: any) => <Image alt={props.alt} {...props} />;

export const components = {
  ul,
  ol,
  p,
  h2,
  h1,
  img,
};

export default function Markdown(props: { children?: ReactElement }) {
  return <div className="mx-auto mt-8 mb-8 px-4 md:px-0 md:max-w-2xl">{props.children}</div>;
}
