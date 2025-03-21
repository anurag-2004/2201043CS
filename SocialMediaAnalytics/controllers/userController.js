const userService = require("../services/userService");
const logger = require("../utils/logger");
const { HTTP_STATUS } = require("../utils/constants");

const userController = {
  getTopUsers: async (req, res, next) => {
    try {
      const { limit } = req.query;

      const topUsers = await userService.getTopUsers(limit);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          topUsers,
        },
      });
    } catch (error) {
      logger.error("Error in userController.getTopUsers:", error);
      next(error);
    }
  },
};

module.exports = userController;
