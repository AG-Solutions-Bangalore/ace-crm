// utils/cache.js
const createCache = () => {
    let cache = new Map();
    
    return {
      // Set item in cache
      set: (key, value) => {
        cache.set(key, value);
        return value;
      },
      
      // Get item from cache
      get: (key) => {
        return cache.get(key);
      },
      
      // Clear ALL cache
      clear: () => {
        cache.clear();
      },
      
      // Clear specific item
      delete: (key) => {
        return cache.delete(key);
      },
      
      // Check if key exists
      has: (key) => {
        return cache.has(key);
      },
      
      // Get all cache keys
      keys: () => {
        return Array.from(cache.keys());
      }
    };
  };
  
  // Create and export singleton instance
  export const cache = createCache();