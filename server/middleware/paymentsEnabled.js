const STATUS_CODES = require("../config/constants/STATUS_CODES");
const logger = require("../lib/logger");

const paymentsEnabled = (req, res, next) => {
  if (!res.user) {
    logger.error(
      `[MIDDLEWARE] [PAYMENTS ENABLED] - "No valid user in response object"`
    );
    return res.sendStatus(STATUS_CODES.SERVER_ERROR);
  } else {
    const { paymentsEnabled } = res.user;
    if (!paymentsEnabled) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        error: true,
        message: "You have not yet activated payments module",
      });
    } else {
      next();
    }
  }
};

module.exports = paymentsEnabled;
