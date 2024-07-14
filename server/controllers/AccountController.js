const { default: mongoose } = require("mongoose");
const logger = require("../lib/logger");
const {
  AccountCreationBodySchema,
  AccountPatchSchema,
  AccountsQuerySchema,
} = require("../validation/accountSchemas");
const AccountServices = require("../services/AccountServices");
const STATUS_CODES = require("../config/constants/STATUS_CODES");
const SafeParseErrorFormatter = require("../utils/safeParseErrorFormatter");
const { ObjectIdSchema } = require("../validation/general");

const createAccount = async (req, res) => {
  logger.trace(`[ACCOUNT CONTROLLER] [CREATE ACCOUNT] - Called`);

  const session = await mongoose.startSession();

  try {
    let validatedData = AccountCreationBodySchema.safeParse(req.body);

    // If validation fails, return error response
    if (!validatedData.success) {
      logger.debug(`[ACCOUNT CONTROLLER] [CREATE ACCOUNT] - Invalid Payload`);
      const errorDetails = SafeParseErrorFormatter(validatedData);
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        error: true,
        message: "Invalid Payload",
        errors: errorDetails,
      });
    }

    const { user } = res;

    await session.withTransaction(async () => {
      const existingAccount = await AccountServices.getAccountByQuery(
        {
          name: validatedData.data.name,
          userID: user._id,
        },
        {
          session: session,
        }
      );

      //   If course exists, return conflic response
      if (existingAccount) {
        logger.debug(
          `[ACCOUNT CONTROLLER] [CREATE ACCOUNT] - Conflicting account exists`
        );
        const message = `Account with provided name already exists`;
        return res.status(STATUS_CODES.CONFLICT).json({ error: true, message });
      }

      // Create new course
      const { data: accountData } = validatedData;
      const slug = accountData.name.toLowerCase().replace(/\s/g, "-");
      console.log(slug);
      const newAccount = await AccountServices.createAccount(
        { ...accountData, slug, userID: user._id },
        {
          session: session,
        }
      );

      return res
        .status(STATUS_CODES.CREATED)
        .json({ error: false, data: newAccount });
    });

    logger.trace(`[ACCOUNT CONTROLLER] [CREATE ACCOUNT] - Completed`);
  } catch (error) {
    // Handle Errors
    logger.error(
      error,
      `[ACCOUNT CONTROLLER] [CREATE ACCOUNT] - Encountered an Error`
    );
    res.status(STATUS_CODES.SERVER_ERROR).send("INTERNAL SERVER ERROR");
  } finally {
    session.endSession();
  }
};

// TODO: Add documentation
const patchAccount = async (req, res) => {
  logger.trace(`[ACCOUNT CONTROLLER] [PATCH ACCOUNT] - Called`);

  const payload = req.body;
  const { accountID } = req.params;

  if (!accountID) {
    logger.debug(
      `[ACCOUNT CONTROLLER] [PATCH ACCOUNT] - Missing Parameter: AccountID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Missing Parameter: AccountID" });
  }

  const validatedObjectId = ObjectIdSchema.safeParse(accountID);

  if (!validatedObjectId.success) {
    logger.debug(
      `[ACCOUNT CONTROLLER] [PATCH ACCOUNT] - Invalid Parameter: AccountID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Invalid Parameter: AccountID" });
  }

  try {
    const validatedData = AccountPatchSchema.safeParse(payload);

    if (!validatedData.success) {
      logger.debug("[ACCOUNT CONTROLER] [PATCH ACCOUNT] - Invalid Payload");
      const errorDetails = SafeParseErrorFormatter(validatedData);
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: true, message: "Invalid Query", errors: errorDetails });
      return;
    }

    if (validatedData.data.name) {
      validatedData.data = {
        ...validatedData.data,
        slug: validatedData.data.name.toLowerCase().split(" ").join("-"),
      };
    }

    const { user } = res;

    const accountExists = AccountServices.accountExists({
      $and: [{ _id: accountID }, { userID: user._id }],
    });

    if (!accountExists) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: true, message: "Account not found" });
    }

    const patchedAccount = await AccountServices.patchAccount(
      validatedObjectId.data,
      validatedData.data
    );

    if (!patchedAccount) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Account with id of '${validatedObjectId.data}' not found`,
      });
    }

    res
      .status(STATUS_CODES.SUCCESS)
      .json({ error: false, data: patchedAccount });
    logger.trace("[ACCOUNT CONTROLER] [PATCH ACCOUNT] - Completed");
  } catch (error) {
    logger.error(
      error,
      `[ACCOUNT CONTROLLER] [PATCH ACCOUNT] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

// TODO: Add documentation
const getAccount = async (req, res) => {
  logger.trace(`[ACCOUNT CONTROLLER] [GET ACCOUNT] - Called`);

  const { accountID } = req.params;

  if (!accountID) {
    logger.debug(
      `[ACCOUNT CONTROLLER] [GET ACCOUNT] - Missing Parameter: AccountID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Missing Parameter: AccountID" });
  }

  const validatedObjectId = ObjectIdSchema.safeParse(accountID);

  if (!validatedObjectId.success) {
    logger.debug(
      `[ACCOUNT CONTROLLER] [GET ACCOUNT] - Invalid Parameter: AccountID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Invalid Parameter: AccountID" });
  }

  const { user } = res;

  const accountExists = AccountServices.accountExists({
    $and: [{ _id: accountID }, { userID: user._id }],
  });

  if (!accountExists) {
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .json({ error: true, message: "Account not found" });
  }

  try {
    const account = await AccountServices.getAccountById(
      validatedObjectId.data
    );

    if (!account) {
      logger.trace(`[ACCOUNT CONTROLLER] [GET ACCOUNT] - Account not found`);
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Account with id of '${validatedObjectId.data}' not found`,
      });
    }

    res.status(STATUS_CODES.SUCCESS).json({ error: false, data: account });
    logger.trace("[ACCOUNT CONTROLER] [GET ACCOUNT] - Completed");
  } catch (error) {
    logger.error(
      error,
      `[ACCOUNT CONTROLLER] [GET ACCOUNT] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

// TODO: Add documentation
const getAccounts = async (req, res) => {
  logger.trace(`[ACCOUNT CONTROLLER] [GET ACCOUNTS] - Called`);

  const { currency, page, limit } = req.query;

  const validatedData = AccountsQuerySchema.safeParse({
    currency,
    page,
    limit,
  });

  if (!validatedData.success) {
    logger.debug("[ACCOUNT CONTROLER] [GET ACCOUNTS] - Invalid Payload");
    const errorDetails = SafeParseErrorFormatter(validatedData);
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Invalid Query", errors: errorDetails });
    return;
  }

  // if (accountID) {
  //   const validatedObjectId = ObjectIdSchema.safeParse(accountID);

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

  if (currency) {
    const currencies = currency?.split(",").map((el) => {
      return { currency: el };
    });
    query.$and.push({ $or: currencies });
  }

  console.log(query);
  try {
    const accounts = await AccountServices.getAccounts(query, {
      page,
      limit,
    });

    res.status(STATUS_CODES.SUCCESS).json({ error: false, ...accounts });
    logger.trace("[ACCOUNT CONTROLER] [GET ACCOUNTS] - Completed");
  } catch (error) {
    logger.error(
      error,
      `[ACCOUNT CONTROLER] [GET ACCOUNTS] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

module.exports = { createAccount, patchAccount, getAccount, getAccounts };
