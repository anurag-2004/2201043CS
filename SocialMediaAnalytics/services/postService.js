const apiService = require("./apiService");
const userService = require("./userService");
const cache = require("../models/cache");
const logger = require("../utils/logger");

const postService = {
  getPostComments: async (postId) => {
    try {
      const cachedComments = cache.get("postComments", postId);

      if (cachedComments) {
        return cachedComments;
      }

      const comments = await apiService.getPostComments(postId);

      cache.set("postComments", postId, comments);

      return comments;
    } catch (error) {
      logger.error(
        `Error in postService.getPostComments for post ${postId}:`,
        error
      );
      throw error;
    }
  },

  getAllPosts: async () => {
    try {
      const users = await userService.getUsers();

      const allPostsPromises = Object.keys(users).map(async (userId) => {
        const posts = await userService.getUserPosts(userId);
        return posts.map((post) => ({
          ...post,
          userName: users[post.userid],
        }));
      });

      const postsArrays = await Promise.all(allPostsPromises);

      return postsArrays.flat();
    } catch (error) {
      logger.error("Error in postService.getAllPosts:", error);
      throw error;
    }
  },

  getPopularPosts: async () => {
    try {
      const allPosts = await postService.getAllPosts();

      const postsWithComments = await Promise.all(
        allPosts.map(async (post) => {
          const comments = await postService.getPostComments(post.id);
          return {
            ...post,
            commentCount: comments.length,
          };
        })
      );

      const maxComments = Math.max(
        ...postsWithComments.map((post) => post.commentCount),
        0
      );

      return postsWithComments
        .filter((post) => post.commentCount === maxComments)
        .sort((a, b) => b.id - a.id);
    } catch (error) {
      logger.error("Error in postService.getPopularPosts:", error);
      throw error;
    }
  },

  getLatestPosts: async (limit = 5) => {
    try {
      const allPosts = await postService.getAllPosts();

      return allPosts.sort((a, b) => b.id - a.id).slice(0, limit);
    } catch (error) {
      logger.error("Error in postService.getLatestPosts:", error);
      throw error;
    }
  },
};

module.exports = postService;
