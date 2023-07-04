import { useCallback, useEffect, useState } from 'react';
import { Api } from '@podpodium/common';
import { AxiosResponse } from 'axios';

interface IUseApiReturn<T> {
  data: T | null;
  loading: boolean;
}

// type RequestFunction<A, T> = (...args: A) => IUseApiReturn<T>;
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
type FirstArgumentType<F extends Function> = F extends (args: infer A) => any ? A : never;
type PromiseType<T extends Promise<AxiosResponse<any>>> = T extends Promise<AxiosResponse<infer R>>
  ? R
  : never;

export function useApi<F extends (...args: any) => any>(
  api: F,
): [IUseApiReturn<PromiseType<ReturnType<F>>>, F] {
  const [ret, setRet] = useState<IUseApiReturn<PromiseType<ReturnType<F>>>>({
    data: null,
    loading: false,
  });

  const request = useCallback(
    (...args: ArgumentTypes<F>) => {
      setRet((o) => {
        return {
          ...o,
          loading: true,
        };
      });
      return api(...args)
        .then((res: AxiosResponse<ReturnType<F>>) => {
          setRet((o) => {
            return {
              ...o,
              data: res.data,
              loading: false,
            };
          });
          return res;
        })
        .catch(() => {
          setRet((o) => {
            return {
              data: null,
              loading: false,
            };
          });
        });
    },
    [api],
  );

  return [ret, request as F];
}

export function useApiResource<F extends (...args: any[]) => any>(
  api: F,
  params?: FirstArgumentType<F>,
): [IUseApiReturn<PromiseType<ReturnType<F>>>, F] {
  const [ret, request] = useApi(api);

  useEffect(() => {
    request(params);
  }, [params, request]);

  return [ret, request];
}

const api = new Api({
  baseURL: process.env.PODIUM_API_BASE_URL,
});

export default api;

export const clientApi = new Api({
  baseURL: '/api/v1',
});
