const logger = require("../lib/logger");
const telegram = require("./telegram");

const ErrorHandler = {
  sendErrorMessage: async (chatID, message = null) => {
    await telegram.sendMessage(
      chatID,
      `Oops...Something went wrong!${message ? `\n\n${message}` : ""}`
    );
  },
};

module.exports = ErrorHandler;
