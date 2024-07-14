const Redis = require("redis");
const logger = require("../lib/logger");
const contextCache = Redis.createClient({ url: process.env.REDIS_URL });

const TTL = 5 * 60 * 1000; // 5 mins

const closeSocket = async function () {
  if (contextCache.isOpen) {
    await contextCache
      .disconnect()
      .then(() => logger.debug("Disconnected from cache"))
      .catch((error) => logger.error(error, "Error at closeSocket: "));
  } else {
    console.log("Connection is already closed");
  }
};

const openSocket = async function () {
  if (contextCache.isOpen) {
    logger.debug("Connection is already open");
  } else {
    await contextCache.connect().then(() => logger.debug("Connected to cache"));
  }
};

const setContext = async (chatID, { currCommand, data }) => {
  logger.trace(`[TELEGRAM] [CONTEXT HANDLER] [SET CONTEXT] - Called`);

  try {
    await openSocket();

    await contextCache.setEx(
      String(chatID),
      TTL,
      JSON.stringify({ currCommand, data })
    );
  } catch (error) {
    throw new Error(`Error setting context:\n${error.message}`);
  } finally {
    await closeSocket();
  }
};

const getContext = async (chatID) => {
  logger.trace(`[TELEGRAM] [CONTEXT HANDLER] [GET CONTEXT] - Called`);

  try {
    await openSocket();
    const context = await contextCache.get(String(chatID));

    if (context) {
      return JSON.parse(context);
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Error getting context:\n${error.message}`);
  } finally {
    await closeSocket();
  }
};

const deleteContext = async (chatID) => {
  logger.trace(`[TELEGRAM] [CONTEXT HANDLER] [DELETE CONTEXT] - Called`);

  try {
    await openSocket();
    await contextCache.del(String(chatID));
  } catch (error) {
    throw new Error(`Error deleting context:\n${error.message}`);
  } finally {
    await closeSocket();
  }
};

module.exports = {
  setContext,
  getContext,
  deleteContext,
};
