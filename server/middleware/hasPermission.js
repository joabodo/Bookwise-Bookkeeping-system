const ROLES = require("../config/constants/ROLES");
const STATUS_CODES = require("../config/constants/STATUS_CODES");
const logger = require("../lib/logger");

const hasPermission = (requiredPermission) => {
  return (req, res, next) => {
    logger.trace("[MIDDLEWARE] [HAS PERMISSION] - Callled");

    const { role: userRole } = res.user;

    if (!ROLES.some((role) => role.name === userRole)) {
      logger.debug("[MIDDLEWARE] [HAS PERMISSION] - No valid role set");
      return res.status(STATUS_CODES.FORBIDDEN).json({
        error: true,
        message: "Access Denied - No valid role set",
      });
    }

    const allowed = ROLES.some(
      (role) =>
        role.name === userRole && role.permissions.includes(requiredPermission)
    );

    if (!allowed) {
      logger.debug("[MIDDLEWARE] [HAS PERMISSION] - Inadequate Permissions");
      res.status(STATUS_CODES.FORBIDDEN).json({
        error: true,
        message: "Access Denied - Inadequate Permissions",
      });
      return;
    }

    logger.trace("[MIDDLEWARE] [HAS PERMISSION] - Passed");
    logger.trace("[MIDDLEWARE] [HAS PERMISSION] - Calling next()");
    next();
  };
};

module.exports = hasPermission;
