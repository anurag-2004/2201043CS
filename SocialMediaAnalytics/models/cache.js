const { CACHE_TTL } = require("../config/env");
const logger = require("../utils/logger");

class Cache {
  constructor(ttl = CACHE_TTL) {
    this.cache = {
      users: null,
      userPosts: {},
      postComments: {},
    };

    this.lastUpdated = {
      users: null,
      userPosts: {},
      postComments: {},
    };

    this.ttl = ttl;
    logger.info(`Cache initialized with TTL: ${ttl}ms`);
  }

  set(type, id, data) {
    try {
      if (type === "users") {
        this.cache.users = data;
        this.lastUpdated.users = Date.now();
      } else if (type === "userPosts") {
        this.cache.userPosts[id] = data;
        this.lastUpdated.userPosts[id] = Date.now();
      } else if (type === "postComments") {
        this.cache.postComments[id] = data;
        this.lastUpdated.postComments[id] = Date.now();
      }
      logger.debug(`Cache updated: ${type}${id ? " for ID " + id : ""}`);
    } catch (error) {
      logger.error(`Cache set error for ${type}:`, error);
    }
  }

  get(type, id) {
    try {
      let data, timestamp;

      if (type === "users") {
        data = this.cache.users;
        timestamp = this.lastUpdated.users;
      } else if (type === "userPosts" && id) {
        data = this.cache.userPosts[id];
        timestamp = this.lastUpdated.userPosts[id];
      } else if (type === "postComments" && id) {
        data = this.cache.postComments[id];
        timestamp = this.lastUpdated.postComments[id];
      }

      if (data && timestamp && Date.now() - timestamp <= this.ttl) {
        logger.debug(`Cache hit: ${type}${id ? " for ID " + id : ""}`);
        return data;
      }

      logger.debug(`Cache miss: ${type}${id ? " for ID " + id : ""}`);
      return null;
    } catch (error) {
      logger.error(`Cache get error for ${type}:`, error);
      return null;
    }
  }

  clear(type, id) {
    try {
      if (!type) {
        this.cache = {
          users: null,
          userPosts: {},
          postComments: {},
        };
        this.lastUpdated = {
          users: null,
          userPosts: {},
          postComments: {},
        };
        logger.info("Full cache cleared");
      } else if (type === "users") {
        this.cache.users = null;
        this.lastUpdated.users = null;
        logger.info("Users cache cleared");
      } else if (type === "userPosts") {
        if (id) {
          delete this.cache.userPosts[id];
          delete this.lastUpdated.userPosts[id];
          logger.info(`User posts cache cleared for user ${id}`);
        } else {
          this.cache.userPosts = {};
          this.lastUpdated.userPosts = {};
          logger.info("All user posts cache cleared");
        }
      } else if (type === "postComments") {
        if (id) {
          delete this.cache.postComments[id];
          delete this.lastUpdated.postComments[id];
          logger.info(`Post comments cache cleared for post ${id}`);
        } else {
          this.cache.postComments = {};
          this.lastUpdated.postComments = {};
          logger.info("All post comments cache cleared");
        }
      }
    } catch (error) {
      logger.error(`Cache clear error:`, error);
    }
  }
}

const cacheInstance = new Cache();

module.exports = cacheInstance;
