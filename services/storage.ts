const memoryStorage = class MemoryStorage implements Storage {
  private __data: Record<string, any> = {};

  get length(): number {
    return Object.keys(this.__data).length;
  }

  clear(): void {
    this.__data = {};
  }

  getItem(key: string): string | null {
    return this.__data[key];
  }

  key(index: number): string | null {
    return Object.keys(this.__data)[index];
  }

  removeItem(key: string): void {
    if (Object.hasOwn(this.__data, key)) {
      delete this.__data[key];
    }
  }

  setItem(key: string, value: string): void {
    this.__data[key] = value;
  }
};

const localStorage = (
  typeof window === 'undefined' ? memoryStorage : window.localStorage
) as Storage;

const sessionStorage = (
  typeof window === 'undefined' ? memoryStorage : window.sessionStorage
) as Storage;

class AppStorage {
  constructor(private readonly _storage: Storage) {}

  get<T>(name: string): T {
    const res = this?._storage?.getItem ? this._storage.getItem(name) : null;
    return res ? JSON.parse(res) : null;
  }

  set<T = any>(name: string, value: T) {
    return this._storage.setItem(name, JSON.stringify(value));
  }

  remove(name: string): void {
    return this._storage.removeItem(name);
  }

  clear() {
    return this._storage.clear();
  }

  public of<T>(name: string) {
    return new AppStorageItem<T>(name, this);
  }
}

export const AppLocalStorage = new AppStorage(localStorage);

export const AppSessionStorage = new AppStorage(sessionStorage);

export class AppStorageItem<T> {
  constructor(private _name: string, private _storage: AppStorage) {}

  private _value?: T;

  protected get value(): T | undefined {
    return this._value;
  }

  protected set value(value: T | undefined) {
    this._value = value;
  }

  get<R extends T | undefined>(defaultValue?: R) {
    return ((this.value || (this.value = this._storage.get(this._name))) ??
      defaultValue) as R extends undefined ? T | undefined : T;
  }

  set(value: T) {
    return this._storage.set(this._name, (this.value = value));
  }

  remove(): undefined {
    this._storage.remove(this._name);
    return (this.value = undefined);
  }

  reset(value: T | undefined | null) {
    return value ? this.set(value as T) : this.remove();
  }
}
