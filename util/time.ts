import { formatRelative } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function relative(timestamp: Date | number): string {
  return formatRelative(timestamp, new Date(), { locale: zhCN });
}

export function fmtDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  const par: string[] = [];
  if (min > 0) {
    par.push(`${min < 10 ? `0${min}` : min} 分钟`);
  }
  if (sec > 0 || min === 0) {
    par.push(`${sec < 10 ? `0${sec}` : sec} 秒`);
  }
  return par.join(' ');
}
