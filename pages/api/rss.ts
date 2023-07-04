import https from 'https';
import http from 'http';
import zlib from 'zlib';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rss = req.query.rss as string;
  if (!rss) {
    res.status(404);
    return;
  }
  const gz = zlib.createGzip();
  const rssURI = new URL(rss);
  const request = rss.startsWith('https') ? https.get : http.get;
  request(rssURI, (rssRes) => {
    res.writeHead(rssRes.statusCode ?? 200, {
      'Content-Type': 'text/xml',
      'Content-Encoding': 'gzip',
    });
    rssRes.pipe(gz).pipe(res);
  });
}
