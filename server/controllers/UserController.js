const express = require("express");
const mongoose = require("mongoose");
const PaystackAPI = require("paystack-api");
const {
  UsersQuerySchema,
  UserRegistrationBodySchema,
  UserQuerySchema,
  UserPatchBodySchema,
  UserPaymentActivationSchema,
} = require("../../../BookWise/server/validation/userSchemas");
const STATUS_CODES = require("../../../BookWise/server/config/constants/STATUS_CODES");
const UserServices = require("../../../BookWise/server/services/UserServices");
const logger = require("../../../BookWise/server/lib/logger");
const SafeParseErrorFormatter = require("../../../BookWise/server/utils/safeParseErrorFormatter");
const _ = require("lodash");

/**Handles request for a list of users
 * @param {express.Request} req Express HTTP Request
 * @param {express.Response} res Express HTTP Response
 */
const getAllUsers = async (req, res) => {
  logger.trace("[USER CONTROLER] [GET ALL USERS] - Called");
  const validatedQuery = UsersQuerySchema.safeParse(req.query);

  if (!validatedQuery.success) {
    logger.debug("[USER CONTROLER] [GET ALL USERS] - Invalid Query");
    const errorDetails = SafeParseErrorFormatter(validatedQuery);
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Invalid Query", errors: errorDetails });
    return;
  }

  const { page, limit, ...query } = validatedQuery.data;

  try {
    const result = await UserServices.getUsers(query, { page, limit });
    logger.trace("[USER CONTROLER] [GET ALL USERS] - Completed");
    res.status(STATUS_CODES.SUCCESS).json({ error: false, ...result });
  } catch (error) {
    logger.error(
      error,
      `[USER CONTROLER] [GET ALL USERS] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

//
//
//

/**Handles request for a specific user
 * @param {express.Request} req Express HTTP Request
 * @param {express.Response} res Express HTTP Response
 */
const getUser = async (req, res) => {
  logger.trace("[USER CONTROLER] [GET USER] - Called");
  const validatedQuery = UserQuerySchema.safeParse(req.query);

  if (!validatedQuery.success) {
    logger.debug("[USER CONTROLER] [GET USER] - Invalid Query");
    const errorDetails = SafeParseErrorFormatter(validatedQuery);
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Invalid Query", errors: errorDetails });
    return;
  }

  const query = validatedQuery.data;

  try {
    const result = await UserServices.getUserByQuery(query);
    logger.trace("[USER CONTROLER] [GET USER] - Completed");
    res.status(STATUS_CODES.SUCCESS).json({ error: false, data: result });
  } catch (error) {
    logger.error(error, `[USER CONTROLER] [GET USER] - Encountered an Error`);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

//
//
//

/**Handles request from a user for the same user
 * @param {express.Request} req Express HTTP Request
 * @param {express.Response} res Express HTTP Response
 */
const getMe = async (req, res) => {
  logger.trace("[USER CONTROLER] [GET ME] - Called");
  const { _id } = res.user;
  try {
    const result = await UserServices.getUserByQuery({ _id });
    logger.trace("[USER CONTROLER] [GET ME] - Completed");
    res.status(STATUS_CODES.SUCCESS).json({ error: false, data: result });
  } catch (error) {
    logger.error(error, `[USER CONTROLER] [GET ME] - Encountered an Error`);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

//
//
//

/**
 * Handles request to register a user.
 *
 * This function handles incoming requests to register a user by processing the request body,
 * validating the data, checking for existing users, creating a new user if none exists,
 * and setting custom user claims. It also ensures transactions are properly managed.
 *
 * @param {express.Request} req - Express HTTP Request object.
 * @param {express.Response} res - Express HTTP Response object.
 * @returns {void}
 */
const registerUser = async (req, res) => {
  logger.trace("[USER CONTROLER] [REGISTER USER] - Called");

  // Start a new database session
  const session = await mongoose.startSession();

  try {
    // Validate request body using UserRegistrationBodySchema
    const validatedData = UserRegistrationBodySchema.safeParse(req.body);

    console.log(req.body);

    // If validation fails, return error response
    if (!validatedData.success) {
      logger.debug("[USER CONTROLER] [REGISTER USER] - Invalid Payload");
      const errorDetails = SafeParseErrorFormatter(validatedData);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: true,
        message: "Invalid Payload",
        errors: errorDetails,
      });
      return;
    }

    // Prepare data for user creation, including merging with user ID and verification status
    const sanitizedData = { ...validatedData.data };

    const shouldBeUnique = _.pick(sanitizedData, "authID", "email");

    // Convert unique fields to an array for database query
    const shouldBeUniqueArr = Object.keys(shouldBeUnique).map((key) => ({
      [key]: shouldBeUnique[key],
    }));

    // Perform database operations within a transaction
    await session.withTransaction(async () => {
      // Check if a user with provided unique fields already exists
      const existingUser = await UserServices.getUserByQuery(
        {
          $or: shouldBeUniqueArr,
        },
        { session: session }
      );

      // If user exists, return conflict response
      if (existingUser) {
        logger.debug(`[USER CONTROLLER] [REGISTER USER] - User already exists`);

        // Identify common fields causing conflict
        const commonFields = Object.keys(shouldBeUnique)
          .filter(
            (key) =>
              shouldBeUnique[key].toString() === existingUser[key]?.toString()
          )
          .join(", ");

        const message = `User with provided ${commonFields} already exists`;
        res.status(STATUS_CODES.CONFLICT).json({ error: true, message });
        return;
      }

      // Create a new user and set custom user claims
      const newUser = await UserServices.createUser(sanitizedData, {
        session: session,
      });
      res.status(STATUS_CODES.CREATED).json({ error: false, data: newUser });
    });

    logger.trace("[USER CONTROLER] [REGISTER USER] - Completed");
  } catch (error) {
    // Handle errors
    logger.error(
      error,
      `[USER CONTROLLER] [REGISTER USER] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  } finally {
    // End the session
    await session.endSession();
  }
};

const patchUser = async (req, res) => {
  logger.trace(`[USER CONTROLLER] [PATCH ME] - Called`);
  const payload = req.body;

  try {
    const validatedData = UserPatchBodySchema.safeParse(payload);

    if (!validatedData.success) {
      logger.debug("[USER CONTROLER] [PATCH ME] - Invalid Payload");
      const errorDetails = SafeParseErrorFormatter(validatedData);
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: true, message: "Invalid Query", errors: errorDetails });
      return;
    }

    let filter;

    if (res.user?.dbid) {
      filter = { _id: res.user.dbid };
    } else if (validatedData.data.authID) {
      filter = { authID: validatedData.data.authID };
    } else {
      throw new Error("No valid filter");
    }

    const patchedUser = await UserServices.patchUser(
      filter,
      validatedData.data
    );

    res.status(STATUS_CODES.SUCCESS).json({ error: false, data: patchedUser });
    logger.trace("[USER CONTROLER] [PATCH ME] - Completed");
  } catch (error) {
    logger.error(error, `[USER CONTROLLER] [PATCH ME] - Encountered an Error`);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};
const patchMe = async (req, res) => {
  logger.trace(`[USER CONTROLLER] [PATCH ME] - Called`);
  const payload = req.body;

  try {
    const validatedData = UserPatchBodySchema.safeParse(payload);

    if (!validatedData.success) {
      logger.debug("[USER CONTROLER] [PATCH ME] - Invalid Payload");
      const errorDetails = SafeParseErrorFormatter(validatedData);
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: true, message: "Invalid Query", errors: errorDetails });
      return;
    }

    const patchedUser = await UserServices.patchUser(
      res.user._id,
      validatedData.data
    );

    res.status(STATUS_CODES.SUCCESS).json({ error: false, data: patchedUser });
    logger.trace("[USER CONTROLER] [PATCH ME] - Completed");
  } catch (error) {
    logger.error(error, `[USER CONTROLLER] [PATCH ME] - Encountered an Error`);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

const activatePayments = async (req, res) => {
  logger.trace(`[USER CONTROLLER] [ACTIVATE PAYMENTS] - Called`);
  const payload = req.body;

  try {
    const validatedData = UserPaymentActivationSchema.safeParse(payload);

    if (!validatedData.success) {
      logger.debug("[USER CONTROLER] [ACTIVATE PAYMENTS] - Invalid Payload");
      const errorDetails = SafeParseErrorFormatter(validatedData);
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: true, message: "Invalid Query", errors: errorDetails });
      return;
    }

    const { data } = validatedData;

    const paystack = PaystackAPI(data.paystackKey);

    const test = await paystack.invoice.list();

    console.log(test);

    if (!test) {
      logger.debug("[USER CONTROLER] [ACTIVATE PAYMENTS] - Invalid Key");
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: true, message: "Invalid Key" });
    }

    const patchedUser = await UserServices.patchUser(res.user._id, {
      paymentsEnabled: true,
      paystackKey: data.paystackKey,
    });

    res.status(STATUS_CODES.SUCCESS).json({ error: false, data: patchedUser });
    logger.trace("[USER CONTROLER] [ACTIVATE PAYMENTS] - Completed");
  } catch (error) {
    if (error.type == "StatusCodeError") {
      logger.debug("[USER CONTROLER] [ACTIVATE PAYMENTS] - Invalid Key");
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: true, message: "Invalid Key" });
    }
    logger.error(
      error,
      `[USER CONTROLLER] [ACTIVATE PAYMENTS] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  getMe,
  registerUser,
  patchMe,
  patchUser,
  activatePayments,
};
