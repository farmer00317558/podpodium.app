import remarkGfm from 'remark-gfm';
import rehypeImgSize from 'rehype-img-size';
import mdx from '@next/mdx';

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeImgSize, { dir: 'public' }]],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: '@mdx-js/react',
  },
});

export default withMDX({
  swcMinify: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.PODIUM_API_BASE_URL}/:path*`,
      },
    ];
  },
});
