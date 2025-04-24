declare global {
  interface Map<K, V> {
    getKeyByValue(value: V): K | null;
    hasKey<T>(search: K): boolean;
    hasValue<T>(search: V): boolean;
  }
}

Map.prototype.getKeyByValue = function <K, V>(
  this: Map<K, V>,
  value: V
): K | null {
  for (let [key, val] of this.entries()) {
    if (val === value) {
      return key;
    }
  }
  return null;
};

Map.prototype.hasKey = function <K, V, T>(this: Map<K, V>, search: K): boolean {
  for (let key of this.keys()) {
    if (key === search) {
      return true;
    }
  }
  return false;
};

Map.prototype.hasValue = function <K, V, T>(
  this: Map<K, V>,
  search: V
): boolean {
  for (let value of this.values()) {
    if (value === search) {
      return true;
    }
  }
  return false;
};

export {};
