import { v2 } from '@podpodium/common';
import { Storage } from './storage';

let userData: v2.UserDataManager | undefined = undefined;

if (typeof window !== 'undefined') {
  const userDataStorage = new Storage('user-data');
  const cacheDataStorage = new Storage('cache-data');
  (window as any).cs = cacheDataStorage;
  userData = new v2.UserDataManager(userDataStorage, cacheDataStorage);
}

export default userData;
