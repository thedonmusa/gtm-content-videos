const { RateLimitError } = require('../errors');

class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  async checkLimit(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const keyRequests = this.requests.get(key);
    const validRequests = keyRequests.filter((timestamp) => timestamp > windowStart);

    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = validRequests[0];
      const retryAfter = Math.ceil((oldestRequest + this.windowMs - now) / 1000);
      throw new RateLimitError(
        `Rate limit exceeded. Max ${this.maxRequests} requests per ${
          this.windowMs / 1000
        } seconds`,
        retryAfter
      );
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  reset(key = null) {
    if (key) {
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
  }

  getRemainingRequests(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(key)) {
      return this.maxRequests;
    }

    const keyRequests = this.requests.get(key);
    const validRequests = keyRequests.filter((timestamp) => timestamp > windowStart);
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter((timestamp) => timestamp > windowStart);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

module.exports = RateLimiter;