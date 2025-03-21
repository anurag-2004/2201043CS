const apiService = require("./apiService");
const cache = require("../models/cache");
const logger = require("../utils/logger");

const userService = {
  getUsers: async () => {
    try {
      const cachedUsers = cache.get("users");

      if (cachedUsers) {
        return cachedUsers;
      }

      const users = await apiService.getUsers();

      cache.set("users", null, users);

      return users;
    } catch (error) {
      logger.error("Error in userService.getUsers:", error);
      throw error;
    }
  },

  getUserPosts: async (userId) => {
    try {
      const cachedPosts = cache.get("userPosts", userId);

      if (cachedPosts) {
        return cachedPosts;
      }

      const posts = await apiService.getUserPosts(userId);

      cache.set("userPosts", userId, posts);

      return posts;
    } catch (error) {
      logger.error(
        `Error in userService.getUserPosts for user ${userId}:`,
        error
      );
      throw error;
    }
  },

  getTopUsers: async (limit = 5) => {
    try {
      const users = await userService.getUsers();

      const userPostCounts = await Promise.all(
        Object.keys(users).map(async (userId) => {
          const posts = await userService.getUserPosts(userId);
          return {
            id: userId,
            name: users[userId],
            postCount: posts.length,
          };
        })
      );

      return userPostCounts
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, limit);
    } catch (error) {
      logger.error(`Error in userService.getTopUsers:`, error);
      throw error;
    }
  },
};

module.exports = userService;
