declare global {
  interface Array<T> {
    getUniqueItemsByKey<K extends keyof T>(key: K): T[];
  }
}

Array.prototype.getUniqueItemsByKey = function <T, K extends keyof T>(
  this: T[],
  key: K
): T[] {
  const map = new Map<T[K], T>();
  for (const item of this) {
    if (!map.has(item[key])) {
      map.set(item[key], item);
    }
  }
  return Array.from(map.values());
};

export {};
