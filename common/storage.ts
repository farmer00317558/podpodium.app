import { randomElements } from '@podpodium/common';
import { IStorage } from '@podpodium/common/lib/user-data-manager/types';

function promisifyRequest<T>(request: IDBRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener('success', () => {
      resolve(request.result);
    });
    request.addEventListener('error', () => {
      console.error(request.error);
      reject(request.error);
    });
  });
}

export class Storage implements IStorage {
  private db: Promise<IDBDatabase | undefined>;
  private name: string;

  constructor(dbName: string) {
    const request = indexedDB.open(dbName, 3);
    this.name = dbName;

    this.db = new Promise((resolve) => {
      request.addEventListener('upgradeneeded', async (event) => {
        const db = request.result as IDBDatabase;
        if (!db.objectStoreNames.contains('objects')) {
          db.createObjectStore('objects');
        }
      });

      request.addEventListener('success', (e) => {
        resolve(request.result);
      });
    });
  }

  async store() {
    const db = await this.db;
    if (!db) {
      return;
    }
    const trans = db.transaction(['objects'], 'readwrite');
    return trans.objectStore('objects');
  }

  async getAllKeys(random?: number): Promise<string[]> {
    const store = await this.store();
    const req = store!.getAllKeys();
    return promisifyRequest<string[]>(req).then((keys) => {
      if (random && random > 0) {
        return randomElements(keys, random);
      }
      return keys;
    });
  }

  async multiGet<T>(keys: string[]): Promise<[string, T][]> {
    const data = await Promise.all(keys.map((i) => this.getObject<T>(i)));
    const ret: [string, T][] = [];
    data.forEach((i, idx) => {
      if (!i) {
        return;
      }
      ret.push([keys[idx], i]);
    });
    return ret;
  }

  async multiRemove(keys: string[]): Promise<boolean> {
    const store = await this.store();
    const req = store!.delete(keys);
    try {
      await promisifyRequest(req);
      return true;
    } catch {
      return false;
    }
  }

  async removeObject(key: string): Promise<boolean> {
    return this.multiRemove([key]);
  }

  async setObject<T>(key: string, value: T): Promise<boolean> {
    const existed = await this.getObject(key);
    const store = await this.store();
    let req;
    if (existed) {
      req = store!.put(value, key);
    } else {
      req = store!.add(value, key);
    }
    try {
      await promisifyRequest(req);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    const store = await this.store();
    const req = store!.get(key);
    return promisifyRequest(req);
  }

  async clear(): Promise<boolean> {
    const store = await this.store();
    return new Promise((resolve) => {
      const req = store!.clear();
      req?.addEventListener('success', () => {
        resolve(true);
      });
      req?.addEventListener('error', () => {
        resolve(false);
      });
    });
  }
}
