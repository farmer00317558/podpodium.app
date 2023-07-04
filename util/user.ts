import { Me } from '@podpodium/common';

export function isAdmin(me: Me) {
  return me.roles?.includes('admin');
}
