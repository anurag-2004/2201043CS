const { ERROR_MESSAGES, HTTP_STATUS } = require("../utils/constants");

const validate = (schema, type = "body") => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[type]);

      if (!result.success) {
        const formattedErrors = result.error.errors.map((error) => ({
          path: error.path.join("."),
          message: error.message,
        }));

        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_MESSAGES.INVALID_REQUEST,
          details: formattedErrors,
        });
      }

      req[type] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  validate,
};
