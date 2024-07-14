const {
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
} = require("../config/constants/PAGINATION");
const logger = require("../lib/logger");
const Account = require("../models/Account");
const flattenObj = require("../utils/flattenObject");

exports.createAccount = async (account, config = {}) => {
  logger.trace(`[ACCOUNT SERVICE] [CREATE ACCOUNT] - Called`);
  try {
    const result = await Account.create([account], {
      session: config?.session,
    });
    const newAccount = result[0];
    logger.trace(`[ACCOUNT SERVICE] [CREATE ACCOUNT] - Completed`);
    return newAccount;
  } catch (error) {
    throw new Error(
      `[ACCOUNT SERVICE] [CREATE ACCOUNT] - Encountered an error\n${error}`
    );
  }
};

// TODO: Add documentaion
exports.getAccountByQuery = async (query, config = {}) => {
  logger.trace(`[ACCOUNT SERVICE] [GET ACCOUNT] - Called`);
  try {
    const account = await Account.findOne(query)
      .lean()
      .session(config?.session);
    if (!account) {
      logger.debug(
        `[ACCOUNT SERVICE] [GET ACCOUNT] - No account matched the query`
      );
    } else {
      logger.debug(`[ACCOUNT SERVICE] [GET ACCOUNT] - Account found`);
    }
    logger.trace(`[ACCOUNT SERVICE] [GET ACCOUNT] - Completed`);
    return account;
  } catch (error) {
    throw new Error(
      `[ACCOUNT SERVICE] [GET ACCOUNT] - Encountered an error\n${error}`
    );
  }
};

// TODO: Add documentation
exports.getAccounts = async (query, config = {}) => {
  const { page = 1, limit = DEFAULT_PAGINATION_LIMIT, session = null } = config;
  logger.trace(`[ACOUNT SERVICE] [GET ACOUNTS] - Called`);
  const skip = (page - 1) * limit;
  try {
    const data = await Account.find(query)
      .sort()
      .limit(Math.min(limit, MAX_PAGINATION_LIMIT))
      .skip(skip)
      .lean()
      .session(session);
    const count = await Account.countDocuments();
    const docsLeft = count - page * limit;
    const result = {
      data,
      pagination: {
        hasMore: docsLeft > 0,
        currPage: page,
        limit: limit,
      },
    };
    logger.trace(`[ACOUNT SERVICE] [GET ACOUNTS] - Completed`);
    return result;
  } catch (error) {
    throw new Error(
      `[ACOUNT SERVICE] [GET ACOUNTS] - Encountered an error\n${error}`
    );
  }
};

// TODO: Add documentation
exports.getAccountById = async (id, config = {}) => {
  logger.trace(`[ACCOUNT SERVICE] [GET ACCOUNT BY ID] - Called`);
  try {
    const account = Account.findById(id).lean().session(config?.session);
    if (!account) {
      logger.debug(
        `[ACCOUNT SERVICE] [GET ACCOUNT] - No account with matching ID`
      );
    } else {
      logger.debug(`[ACCOUNT SERVICE] [GET ACCOUNT] - Account found`);
    }
    logger.trace(`[ACCOUNT SERVICE] [GET ACCOUNT] - Completed`);
    return account;
  } catch (error) {
    throw new Error(
      `[ACCOUNT SERVICE] [GET ACCOUNT BY ID] - Encountered an error\n${error}`
    );
  }
};

exports.accountExists = async (query, config = {}) => {
  logger.trace(`[ACCOUNT SERVICE] [ACCOUNT EXISTS] - Called`);

  try {
    const exists = await Account.exists(query).session(config?.session);
    logger.debug(
      `[ACCOUNT SERVICE] [ACCOUNT EXISTS] - ${
        exists ? "Account Exists" : "Account doesn't exists"
      }`
    );
    logger.trace(`[ACCOUNT SERVICE] [ACCOUNT EXISTS] - Completed`);
    return exists;
  } catch (error) {
    throw new Error(
      `[ACCOUNT SERVICE] [ACCOUNT EXISTS] - Encountered an error\n${error}`
    );
  }
};

// TODO: Add documentation
exports.patchAccount = async (id, data, config = {}) => {
  logger.trace(`[ACCOUNT SERVICE] [PATCH ACCOUNT] - Called`);

  const flatData = flattenObj(data);
  try {
    const patchedAccount = await Account.findByIdAndUpdate(id, flatData, {
      runValidators: true,
      new: true,
    })
      .lean()
      .session(config?.session);
    logger.trace(`[ACCOUNT SERVICE] [PATCH ACCOUNT] - Completed`);
    return patchedAccount;
  } catch (error) {
    throw new Error(
      `[ACCOUNT SERVICE] [PATCH ACCOUNT] - Encountered an error\n${error}`
    );
  }
};
