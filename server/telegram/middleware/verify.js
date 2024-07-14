const logger = require("../../lib/logger");

const verify = (req, res, next) => {
  logger.trace(`[TELEGRAM] [VERIFY] - Called`);
  const authToken = req.headers["x-telegram-bot-api-secret-token"];

  if (authToken === process.env.TELEGRAM_AUTH_TOKEN) {
    logger.trace(`[TELEGRAM] [VERIFY] - Verification Passed`);
    next();
  } else {
    logger.trace(`[TELEGRAM] [VERIFY] - Verification Failed`);
    return res.sendStatus(200);
  }
};

module.exports = verify;
