const postService = require("../services/postService");
const logger = require("../utils/logger");
const { HTTP_STATUS } = require("../utils/constants");

const postController = {
  getPosts: async (req, res, next) => {
    try {
      const { type } = req.query;
      let posts;

      if (type === "popular") {
        posts = await postService.getPopularPosts();
      } else {
        posts = await postService.getLatestPosts();
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          posts,
          type,
        },
      });
    } catch (error) {
      logger.error("Error in postController.getPosts:", error);
      next(error);
    }
  },
};

module.exports = postController;
