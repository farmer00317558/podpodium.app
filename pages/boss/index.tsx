import { PodcastData } from '@podpodium/common/lib/user-data-manager/v2';
import Link from 'next/link';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { clientApi, useApi } from '../../common/api';
import PodcastListItem from '../../component/PodcastListItem';
import { PropsWithUserProps } from '../../types';
import { podcastItemToPodcastData } from '../../util/data';
import { withSession } from '../../util/session';

interface IProps {}

interface IPodcastListQuery {
  auditStatus: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

interface IAuditStatusFilterProps {
  value: string;
  onChange: (status: string) => void;
}

function AuditStatusFilter(props: IAuditStatusFilterProps) {
  const { value, onChange } = props;
  const options = [
    { title: '未处理', value: '' },
    { title: '待人工', value: 'pending' },
    { title: '已挂起', value: 'suspend' },
    { title: '已屏蔽', value: 'forbid' },
    { title: '已公开', value: 'normal' },
  ];
  const handleAuditStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange(e.target.value);
    }
  };
  return (
    <div className="flex flex-row space-x-3">
      {options.map((i) => {
        return (
          <div key={i.value} className="flex items-center space-x-1">
            <label htmlFor={i.value || 'none'}>{i.title}</label>
            <input
              type="radio"
              name="auditStatus"
              onChange={handleAuditStatusChange}
              checked={value === i.value}
              value={i.value}
              id={i.value || 'none'}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function BossIndex(props: PropsWithUserProps<IProps>) {
  const [query, setQuery] = useState<IPodcastListQuery>({
    offset: 0,
    limit: 20,
    auditStatus: 'pending',
    status: 'ready',
  });
  const [podcastListState, requestPodcastList] = useApi(clientApi.admin.listPodcasts);
  const [auditState, audit] = useApi(clientApi.admin.auditPodcast);
  const podcasts: PodcastData[] = (podcastListState.data?.data || []).map((i: any) =>
    podcastItemToPodcastData(i),
  );

  const handleAudit = async (id: string, auditStatus: string) => {
    await audit(id, { auditStatus });
    requestPodcastList(query);
  };

  const debounceTimer = useRef<number>(0);
  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      setQuery((i) => ({
        ...i,
        search: e.target.value,
      }));
    }, 1000);
  };

  useEffect(() => {
    requestPodcastList(query);
  }, [query, requestPodcastList]);

  return (
    <div className="md:max-w-2xl mx-auto pb-4">
      {/* header */}
      <div className="text-xs p-2 mb-4 shadow-md sticky top-0 bg-white">
        <div className="flex flex-col items-center">
          <div className="mb-2 bg-yellow-200 w-full py-1 text-center text">
            总数：{podcastListState.data?.total ?? '--'}
          </div>
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between w-full items-center">
            <input
              type="text"
              placeholder="搜索"
              onChange={handleSearch}
              className="border-gray-300 border w-full md:w-1/3 py-1 px-2 focus:outline-none focus:border-blue-400"
            />
            <AuditStatusFilter
              value={query.auditStatus}
              onChange={(auditStatus) => setQuery((i) => ({ ...i, auditStatus }))}
            />
          </div>
        </div>
      </div>

      {/* content */}
      <div className="space-y-4 divide-y">
        {podcasts.map((i) => (
          <div key={i.id} className="space-y-3 pt-4 px-2">
            <div>
              <Link href={`/boss/podcast/${i.id}`}>
                <a>
                  <PodcastListItem podcast={i} />
                </a>
              </Link>
            </div>
            <div className="flex flex-row text-xs items-center justify-between w-full">
              <div className="flex space-x-2">
                <div>ID: {i.id}</div>
              </div>
              <div className="flex space-x-2">
                <button
                  disabled={auditState.loading}
                  onClick={() => handleAudit(i.id, 'forbid')}
                  className="block px-3 py-1 focus:outline-none bg-red-500 rounded-md text-white"
                >
                  屏蔽
                </button>
                <button
                  disabled={auditState.loading}
                  onClick={() => handleAudit(i.id, 'suspend')}
                  className="block px-3 py-1 focus:outline-none bg-blue-500 rounded-md text-white"
                >
                  挂起
                </button>
                <button
                  disabled={auditState.loading}
                  onClick={() => handleAudit(i.id, 'normal')}
                  className="block px-3 py-1 focus:outline-none bg-green-500 rounded-md text-white"
                >
                  公开
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = withSession(async () => {
  return {
    props: {
      global: true,
    },
  };
});
