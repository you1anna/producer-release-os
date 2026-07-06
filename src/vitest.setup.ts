import '@testing-library/jest-dom/vitest';

// Node >=22 ships an experimental `localStorage` global that is undefined unless
// `--localstorage-file` is passed, and it shadows jsdom's implementation. Give
// tests a real in-memory Storage instead.
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  key(index: number) {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    this.map.set(key, String(value));
  }
}

let usable = false;
try {
  usable =
    typeof window.localStorage?.setItem === 'function' &&
    typeof window.localStorage?.clear === 'function';
} catch {
  usable = false;
}
if (!usable) {
  const storage = new MemoryStorage();
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true });
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
}

beforeEach(() => {
  window.localStorage.clear();
});
