const STATUS_CODES = require("../../../BookWise/server/config/constants/STATUS_CODES");
const _ = require("lodash");
const mongoose = require("mongoose");
const logger = require("../../../BookWise/server/lib/logger");
const SafeParseErrorFormatter = require("../../../BookWise/server/utils/safeParseErrorFormatter");
const TransactionServices = require("../../../BookWise/server/services/TransactionServices");
const {
  ObjectIdSchema,
} = require("../../../BookWise/server/validation/general");
const {
  TransactionCreationSchema,
  TransactionsQuerySchema,
  TransactionPatchSchema,
} = require("../../../BookWise/server/validation/transactionSchemas");

// TODO: Add documentation
const createTransaction = async (req, res) => {
  logger.trace("[TRANSACTION CONTROLER] [CREATE TRANSACTION] - Called");

  // Start a new database session
  const session = await mongoose.startSession();

  try {
    let validatedData = TransactionCreationSchema.safeParse(req.body);

    // If validation fails, return error response
    if (!validatedData.success) {
      logger.debug(
        `[TRANSACTION CONTROLLER] [CREATE TRANSACTION] - Invalid Payload`
      );
      const errorDetails = SafeParseErrorFormatter(validatedData);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: true,
        message: "Invalid Payload",
        errors: errorDetails,
      });
      return;
    }

    validatedData = validatedData.data;

    await session.withTransaction(async () => {
      // Create new course
      const { user } = res;
      const newTransaction = await TransactionServices.createTransaction(
        { ...validatedData, userID: user._id },

        {
          session: session,
        }
      );

      return res
        .status(STATUS_CODES.CREATED)
        .json({ error: false, data: newTransaction });
    });

    logger.trace(`[TRANSACTION CONTROLLER] [CREATE TRANSACTION] - Completed`);
  } catch (error) {
    // Handle Errors
    logger.error(
      error,
      `[TRANSACTION CONTROLLER] [CREATE TRANSACTION] - Encountered an Error`
    );
    res.status(STATUS_CODES.SERVER_ERROR).send("INTERNAL SERVER ERROR");
  } finally {
    session.endSession();
  }
};

// TODO: Add documentation
const getTransactions = async (req, res) => {
  logger.trace(`[COURSE CONTROLLER] [GET COURSE] - Called`);

  const { type, from, to, page, limit } = req.query;

  const { accountID } = req.params;

  const validatedData = TransactionsQuerySchema.safeParse({
    from,
    to,
    page,
    limit,
    accountID,
    type,
  });

  if (!validatedData.success) {
    logger.debug(
      "[TRANSACTION CONTROLER] [PATCH TRANSACTION] - Invalid Payload"
    );
    const errorDetails = SafeParseErrorFormatter(validatedData);
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Invalid Query", errors: errorDetails });
    return;
  }

  // if (TransactionID) {
  //   const validatedObjectId = ObjectIdSchema.safeParse(TransactionID);

  //   if (!validatedObjectId.success) {
  //     logger.debug(
  //       `[COURSE CONTROLLER] [GET COURSE] - Invalid Parameter: CourseId`
  //     );
  //     console.log(validatedObjectId.data);
  //     return res
  //       .status(STATUS_CODES.BAD_REQUEST)
  //       .json({ error: true, message: "Invalid Parameter: CourseId" });
  //   }
  // }

  // Formatting query
  const { user } = res;
  const query = { $and: [{ userID: user._id }] };
  if (accountID) {
    query.$and.push({
      $or: [{ accountID }, { destinationAccountID: accountID }],
    });
  }

  if (type) {
    const transactionTypes = type?.split(",").map((el) => {
      return { type: el };
    });
    query.$and.push({ $or: transactionTypes });
  }

  if (from) {
    query.$and.push({ date: { $gte: from } });
  }

  if (to) {
    query.$and.push({ date: { $lte: to } });
  }

  console.log(query);
  try {
    const transactions = await TransactionServices.getTransactions(query, {
      page,
      limit,
    });

    res.status(STATUS_CODES.SUCCESS).json({ error: false, ...transactions });
    logger.trace("[COURSE CONTROLER] [GET COURSE] - Completed");
  } catch (error) {
    logger.error(
      error,
      `[COURSE CONTROLLER] [GET COURSE] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

// TODO: Add documentation
const patchTransaction = async (req, res) => {
  logger.trace(`[TRANSACTION CONTROLLER] [PATCH TRANSACTION] - Called`);

  const payload = req.body;
  const { transactionID } = req.params;

  if (!transactionID) {
    logger.debug(
      `[TRANSACTION CONTROLLER] [PATCH TRANSACTION] - Missing Parameter: TransactionID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Missing Parameter: TransactionID" });
  }

  const validatedObjectId = ObjectIdSchema.safeParse(transactionID);

  if (!validatedObjectId.success) {
    logger.debug(
      `[TRANSACTION CONTROLLER] [PATCH TRANSACTION] - Invalid Parameter: TransactionID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Invalid Parameter: TransactionID" });
  }

  try {
    const validatedData = TransactionPatchSchema.safeParse(payload);

    if (!validatedData.success) {
      logger.debug(
        "[TRANSACTION CONTROLER] [PATCH TRANSACTION] - Invalid Payload"
      );
      const errorDetails = SafeParseErrorFormatter(validatedData);
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: true, message: "Invalid Query", errors: errorDetails });
      return;
    }

    const { user } = res;

    const transactionExists = TransactionServices.TransactionExists({
      $and: [{ _id: transactionID }, { userID: user._id }],
    });

    if (!transactionExists) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: true, message: "Transaction not found" });
    }

    logger.error(validatedData.data);

    const patchedTransaction = await TransactionServices.patchTransaction(
      validatedObjectId.data,
      validatedData.data
    );

    if (!patchedTransaction) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Transaction with id of '${validatedObjectId.data}' not found`,
      });
    }

    res
      .status(STATUS_CODES.SUCCESS)
      .json({ error: false, data: patchedTransaction });
    logger.trace("[TRANSACTION CONTROLER] [PATCH TRANSACTION] - Completed");
  } catch (error) {
    logger.error(
      error,
      `[TRANSACTION CONTROLLER] [PATCH TRANSACTION] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

// TODO: Add documentation
const getTransaction = async (req, res) => {
  logger.trace(`[TRANSACTION CONTROLLER] [GET TRANSACTION] - Called`);

  const { transactionID } = req.params;

  if (!transactionID) {
    logger.debug(
      `[TRANSACTION CONTROLLER] [GET TRANSACTION] - Missing Parameter: TransactionID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Missing Parameter: TransactionID" });
  }

  const validatedObjectId = ObjectIdSchema.safeParse(transactionID);

  if (!validatedObjectId.success) {
    logger.debug(
      `[TRANSACTION CONTROLLER] [GET TRANSACTION] - Invalid Parameter: TransactionID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Invalid Parameter: TransactionID" });
  }

  const { user } = res;

  const transactionExists = TransactionServices.TransactionExists({
    $and: [{ _id: transactionID }, { userID: user._id }],
  });

  if (!transactionExists) {
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .json({ error: true, message: "Transaction not found" });
  }

  try {
    const transaction = await TransactionServices.getTransactionById(
      validatedObjectId.data
    );

    if (!transaction) {
      logger.trace(
        `[TRANSACTION CONTROLLER] [GET TRANSACTION] - Transaction not found`
      );
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Transaction with id of '${validatedObjectId.data}' not found`,
      });
    }

    res.status(STATUS_CODES.SUCCESS).json({ error: false, data: transaction });
    logger.trace("[TRANSACTION CONTROLER] [GET TRANSACTION] - Completed");
  } catch (error) {
    logger.error(
      error,
      `[TRANSACTION CONTROLLER] [GET TRANSACTION] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  patchTransaction,
};
