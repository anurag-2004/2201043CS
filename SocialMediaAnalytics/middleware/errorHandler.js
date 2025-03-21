const { ERROR_MESSAGES, HTTP_STATUS } = require("../utils/constants");
const logger = require("../utils/logger");
const { IS_PRODUCTION } = require("../config/env");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  logger.error(`${statusCode} - ${message}`, {
    error: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(IS_PRODUCTION ? {} : { stack: err.stack }),
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = HTTP_STATUS.NOT_FOUND;
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};
