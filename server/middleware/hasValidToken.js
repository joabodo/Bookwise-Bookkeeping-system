const StatusCodes = require("../config/constants/STATUS_CODES");
const { verifyIDToken } = require("../lib/firebase/functions");
const logger = require("../lib/logger");
const { Request, Response, NextFunction } = require("express");

/**
 * Middleware function to verify a user's ID token and attach it to the request object.

 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @param {NextFunction} next The Express next function.
 * @returns {void}

 * @description
 * This middleware checks for an "Authorization" header in the request. If present, it extracts the token and verifies it.

 * If the token is valid, the decoded token is attached to the `res.user` property and the middleware chain continues using `next()`.

 * If the token is invalid or not provided, an error response with status code 401 (Unauthorized) is sent with an appropriate message. Additionally, the error is logged using the `logger.error`

 */
const hasVaildToken = (req, res, next) => {
  logger.trace("[MIDDLEWARE] [HAS VALID TOKEN] - Callled");

  const token = req.header("Authorization")?.split(" ")[1] || null;

  if (!token) {
    logger.debug("[MIDDLEWARE] [HAS VALID TOKEN] - No valid credentials set");
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: true,
      message: "Access Denied - No valid credentials set",
    });
  }

  verifyIDToken(token)
    .then((decodedToken) => {
      res.user = decodedToken;
      logger.trace("[MIDDLEWARE] [HAS VALID TOKEN] - Passed");
      logger.trace("[MIDDLEWARE] [HAS VALID TOKEN] - Calling next()");
      next();
    })
    .catch((error) => {
      logger.debug(
        error,
        "[MIDDLEWARE] [HAS VALID TOKEN] - Invalid Credentials"
      );
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: true, message: "Access Denied - Invalid token" });
    });
};

module.exports = hasVaildToken;
