const STATUS_CODES = require("../config/constants/STATUS_CODES");
const UserServices = require("../services/UserServices");
const logger = require("../lib/logger");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const isAuthenticated = async (req, res, next) => {
  const authenticate = async (clerkAuthFunc, _req, _res, _next) =>
    clerkAuthFunc(_req, _res, _next);

  authenticate(ClerkExpressWithAuth(), req, res, async () => {
    try {
      const { auth } = req;
      if (!auth.userId) {
        logger.debug(
          "[MIDDLEWARE] [IS AUTHENTICATED] - Invalid Authorization Token"
        );
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          error: true,
          message: "Access Denied - Invalid Authorization Token",
        });
      }

      const user = await UserServices.getUserByQuery({ authID: auth.userId });

      if (!user) {
        logger.debug("[MIDDLEWARE] [IS AUTHENTICATED] - User not registered");
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          error: true,
          message: "Access Denied - User not registered",
        });
      }
      res.user = user;
      logger.trace("[MIDDLEWARE] [IS AUTHENTICATED] - Calling next()");
      next();
    } catch (error) {
      logger.debug(
        error,
        "[MIDDLEWARE] [IS AUTHENTICATED] - INTERNAL SERVER ERROR"
      );
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ error: true, message: "INTERNAL SERVER ERROR" });
    }
  });
};

module.exports = isAuthenticated;
