const TelegramBot = require("node-telegram-bot-api");

const telegram = new TelegramBot(process.env.TELEGRAM_TOKEN);

module.exports = telegram;
