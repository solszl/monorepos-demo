class CacheManager {
  constructor() {
    this.cache = {};
  }

  cacheItem(seriesId, obj, plane = "axis") {
    const seriesCache = this.cache?.[seriesId] ?? {};
    const planeCache = seriesCache?.[plane] ?? new Map();
    const { key, value } = obj;
    planeCache.set(key, value);
    this.cache[seriesId] = seriesCache;
    this.cache[seriesId][plane] = planeCache;
  }

  /**
   *
   *
   * @param { string } seriesId
   * @param { number } key
   * @param { string } plane
   * @return {*}
   * @memberof CacheManager
   */
  getItem(seriesId, key, plane) {
    return this.cache?.[seriesId]?.[plane]?.get(key);
  }

  /**
   *
   *
   * @param { string } seriesId
   * @param { string } plane
   * @return {*}
   * @memberof CacheManager
   */
  purge(seriesId, plane) {
    if (!seriesId) {
      this.cache = {};
      return;
    }

    if (!plane) {
      delete this.cache?.[seriesId];
      return;
    }

    delete this.cache[seriesId][plane];
  }
}

export default CacheManager;
