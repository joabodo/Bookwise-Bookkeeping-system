const {
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
} = require("../config/constants/PAGINATION");
const logger = require("../lib/logger");
const Transaction = require("../models/Transaction");
const flattenObj = require("../utils/flattenObject");

// TODO: Add documentation
exports.createTransaction = async (transaction, config = {}) => {
  logger.trace(`[TRANSACTION SERVICE] [CREATE TRANSACTION] - Called`);
  try {
    const result = await Transaction.create([transaction], {
      session: config?.session,
    });
    const newTransaction = result[0];
    logger.trace(`[TRANSACTION SERVICE] [CREATE TRANSACTION] - Completed`);
    return newTransaction;
  } catch (error) {
    throw new Error(
      `[TRANSACTION SERVICE] [CREATE TRANSACTION] - Encountered an error\n${error}`
    );
  }
};

// TODO: Add documentation
exports.getTransactions = async (query, config = {}) => {
  const { page, limit, session = null } = config;
  logger.trace(`[TRANSACTIONS SERVICE] [GET TRANSACTIONS] - Called`);
  const skip = (page - 1) * limit;
  try {
    const data = await Transaction.find(query)
      .sort({ date: "desc", createdAt: "desc" })
      .limit(limit ? Math.min(limit, MAX_PAGINATION_LIMIT) : Infinity)
      .skip(page ? skip : null)
      .populate("accountID")
      .populate("destinationAccountID")
      .lean()
      .session(session);
    const count = await Transaction.countDocuments(query);
    const docsLeft = count - page * limit;
    const result = {
      data,
      pagination: {
        hasMore: docsLeft > 0,
        currPage: Number(page),
        limit: Number(limit),
      },
    };
    logger.trace(`[TRANSACTIONS SERVICE] [GET TRANSACTIONSS] - Completed`);
    return result;
  } catch (error) {
    throw new Error(
      `[TRANSACTIONS SERVICE] [GET TRANSACTIONSS] - Encountered an error\n${error}`
    );
  }
};

// // TODO: Add documentaion
// exports.getTransactionByQuery = async (query, config = {}) => {
//   logger.trace(`[TRANSACTION SERVICE] [GET TRANSACTION] - Called`);
//   try {
//     const course = await Transaction.findOne(query)
//       .lean()
//       .session(config?.session);
//     if (!course) {
//       logger.debug(
//         `[TRANSACTION SERVICE] [GET TRANSACTION] - No transaction matched the query`
//       );
//     } else {
//       logger.debug(
//         `[TRANSACTION SERVICE] [GET TRANSACTION] - Transaction found`
//       );
//     }
//     logger.trace(`[TRANSACTION SERVICE] [GET TRANSACTION] - Completed`);
//     return course;
//   } catch (error) {
//     throw new Error(
//       `[TRANSACTION SERVICE] [GET TRANSACTION] - Encountered an error\n${error}`
//     );
//   }
// };

// TODO: Add documentation
exports.getTransactionById = async (id, config = {}) => {
  logger.trace(`[TRANSACTION SERVICE] [GET TRANSACTION BY ID] - Called`);
  try {
    const transaction = Transaction.findById(id)
      .lean()
      .session(config?.session);
    if (!transaction) {
      logger.debug(
        `[TRANSACTION SERVICE] [GET TRANSACTION] - No transaction with matching ID`
      );
    } else {
      logger.debug(
        `[TRANSACTION SERVICE] [GET TRANSACTION] - Transaction found`
      );
    }
    logger.trace(`[TRANSACTION SERVICE] [GET TRANSACTION] - Completed`);
    return transaction;
  } catch (error) {
    throw new Error(
      `[TRANSACTION SERVICE] [GET TRANSACTION BY ID] - Encountered an error\n${error}`
    );
  }
};

exports.TransactionExists = async (query, config = {}) => {
  logger.trace(`[TRANSACTION SERVICE] [TRANSACTION EXISTS] - Called`);

  try {
    const exists = await Transaction.exists(query).session(config?.session);
    logger.debug(
      `[TRANSACTION SERVICE] [TRANSACTION EXISTS] - ${
        exists ? "Transaction Exists" : "Transaction doesn't exists"
      }`
    );
    logger.trace(`[TRANSACTION SERVICE] [TRANSACTION EXISTS] - Completed`);
    return exists;
  } catch (error) {
    throw new Error(
      `[TRANSACTION SERVICE] [TRANSACTION EXISTS] - Encountered an error\n${error}`
    );
  }
};

// TODO: Add documentation
exports.patchTransaction = async (id, data, config = {}) => {
  logger.trace(`[TRANSACTION SERVICE] [PATCH TRANSACTION] - Called`);

  const flatData = flattenObj(data);
  try {
    const patchedTransaction = await Transaction.findByIdAndUpdate(
      id,
      flatData,
      {
        runValidators: true,
        new: true,
      }
    )
      .lean()
      .session(config?.session);
    logger.trace(`[TRANSACTION SERVICE] [PATCH TRANSACTION] - Completed`);
    return patchedTransaction;
  } catch (error) {
    throw new Error(
      `[TRANSACTION SERVICE] [PATCH TRANSACTION] - Encountered an error\n${error}`
    );
  }
};
