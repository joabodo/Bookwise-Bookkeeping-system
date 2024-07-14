const express = require("express");
const logger = require("../lib/logger");
const telegram = require("./telegram");
const { verify, checkRegistration } = require("./middleware");
const ErrorHandler = require("./ErrorHandler");
const runCommand = require("./commands");
const { getContext } = require("./contextHandler");
const { COMMANDS } = require("./constants");

// const contextHandler = require("../controllers/bot/contextController");
// const commandMap = require("../controllers/bot/commands");

const telegramRouter = express.Router();

telegramRouter.post("/", verify, checkRegistration, async (req, res) => {
  logger.trace("[TELEGRAM] [ROUTER] - Called");
  const payload = req.data;
  const {
    message: {
      chat: { id: chatID },
      entities,
      text,
    },
  } = payload;
  try {
    const isCommand = entities?.at(0)?.type === "bot_command";
    if (isCommand) {
      // Run Command
      const command = text.slice(entities[0].offset, entities[0].length);
      runCommand(command, chatID, payload);
    } else {
      // Not a command
      // Check context for previous running command
      const context = await getContext(chatID);
      // If previous running command, resume
      if (context) {
        // Resume from context
        runCommand(context.currCommand, chatID, payload, context);
      } else {
        // No valid command or context
        // Resolve inline button clicks
        if (payload.callbackQuery?.id)
          telegram.answerCallbackQuery(payload.callbackQuery?.id);
        await telegram.sendMessage(
          chatID,
          `That doesn't seems to be a valid command. Try ${COMMANDS.HELP.VALUE} for a list of all valid commands I can help you with`
        );
      }
    }
    res.sendStatus(200);
  } catch (error) {
    logger.error(error, `[TELEGRAM] [ROUTER] - Encountered an Error`);
    await ErrorHandler.sendErrorMessage(chatID);
  }
});

module.exports = telegramRouter;
