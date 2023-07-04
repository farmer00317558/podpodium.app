import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import api from '../common/api';
import { Me } from '@podpodium/common';
import { isAdmin } from './user';

export function withSession<P extends { [key: string]: any }>(f: GetServerSideProps<P>) {
  return async function withSessionGetServerSideProps(
    context: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P & { user: Me }>> {
    try {
      const meRes = await api.users.me({
        headers: {
          Cookie: context.req.headers['cookie'] || '',
        },
      });
      const user = meRes.data;
      if (!isAdmin(user)) {
        return {
          redirect: {
            destination: '/',
            permanent: true,
          },
        };
      }
      const ret = await f(context);
      if ((ret as any).props) {
        return {
          props: {
            ...(ret as any).props,
            user,
          },
        };
      }
      return ret as GetServerSidePropsResult<P & { user: Me }>;
    } catch (e: any) {
      if (e.status === 401) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
      throw e;
    }
  };
}
