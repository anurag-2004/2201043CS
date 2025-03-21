const { ERROR_MESSAGES, HTTP_STATUS } = require("../utils/constants");
const { API_TOKEN } = require("../config/env");
const logger = require("../utils/logger");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Authentication failed: No Bearer token provided");
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    const token = authHeader.split(" ")[1];

    if (token !== API_TOKEN) {
      logger.warn("Authentication failed: Invalid token");
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

module.exports = {
  authenticate,
};
