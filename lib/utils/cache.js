class Cache {
  constructor(ttl = 3600000) {
    this.cache = new Map();
    this.ttl = ttl;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    };
  }

  set(key, value, customTtl = null) {
    const ttl = customTtl || this.ttl;
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
    this.stats.sets++;
    return value;
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.value;
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key) {
    const result = this.cache.delete(key);
    if (result) this.stats.deletes++;
    return result;
  }

  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.stats.deletes += size;
  }

  size() {
    return this.cache.size;
  }

  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

module.exports = Cache;