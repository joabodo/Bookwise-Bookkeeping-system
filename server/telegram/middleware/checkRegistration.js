const { builtinModules } = require("module");
const { getUserByQuery, patchUser } = require("../../services/UserServices");
const telegram = require("../telegram");
const logger = require("../../lib/logger");
const runCommand = require("../commands");
const { COMMANDS } = require("../constants");

const checkRegistration = async (req, res, next) => {
  logger.trace(`[TELEGRAM MIDDLEWARE] [CHECK REGISTRATION] - Called`);

  const callbackQuery = req.body.callback_query;
  const message = req.body.message || callbackQuery?.message;
  const {
    chat: { id: chatID },
    contact,
  } = message;
  try {
    //   Check if the telegram userId had been registered
    let user = await getUserByQuery({ telegramID: chatID });
    if (!user) {
      if (contact) {
        logger.debug(
          `[TELEGRAM MIDDLEWARE] [CHECK REGISTRATION] - Registering`
        );
        const { phone_number: mobileNumber } = contact;
        const updatedUser = await patchUser(
          { $or: [{ mobileNumber }, { mobileNumber: `+${mobileNumber}` }] },
          { telegramID: chatID }
        );
        console.log(contact);
        console.log(mobileNumber);
        console.log(updatedUser);
        if (updatedUser) {
          logger.debug(
            `[TELEGRAM MIDDLEWARE] [CHECK REGISTRATION] - Registered`
          );
          await telegram.sendMessage(
            chatID,
            `Hi ${
              updatedUser.name?.first
                ? updatedUser.name.first
                    .split("")
                    .map((el, i) => (i === 0 ? el.toUpperCase() : el))
                    .join("")
                : "there"
            }!`,
            {
              reply_markup: {
                remove_keyboard: true,
              },
            }
          );
          runCommand(COMMANDS.HELP.VALUE, chatID);
        } else {
          await telegram.sendMessage(
            chatID,
            "I can't seem to find any account associated with this number.\nTo get started, Kindly sign up for an BookWise account at https://www.bookwise.com and ensure that this number is listed in your account.",
            {
              reply_markup: {
                keyboard: [[{ text: "Send my Number", request_contact: true }]],
              },
            }
          );
        }
      } else {
        logger.debug(
          `[TELEGRAM MIDDLEWARE] [CHECK REGISTRATION] - Not Registered`
        );
        await telegram.sendMessage(
          chatID,
          "Hi there!\nWelcome to the Bookwise telegram bot.\nTo get started, Kindly share your number with me for verification.",
          {
            reply_markup: {
              keyboard: [[{ text: "Send my Number", request_contact: true }]],
            },
          }
        );
      }
      res.sendStatus(200);
    } else {
      req.data = {
        message,
        callbackQuery,
        user,
      };
      next();
    }
  } catch (error) {
    res.sendStatus(200);
    logger.error(error, `[TELEGRAM] [ROUTER] - Encountered an Error`);
    await ErrorHandler.sendErrorMessage(chatID);
  }
};

module.exports = checkRegistration;
