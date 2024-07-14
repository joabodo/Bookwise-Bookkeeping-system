const { ClientSession } = require("mongodb");
const {
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
} = require("../config/constants/PAGINATION");
const logger = require("../lib/logger");
const User = require("../models/User");
const flattenObj = require("../utils/flattenObject");

/**
 * @typedef {Object} PaginatedResult
 * @property {Results[]} data - Array od results
 * @property {Object} pagination - Pagination Object
 * @property {Boolean} pagination.hasMore - "True" if there are results to be fetched
 * @property {Integer} pagination.currPage - Current returned page
 * @property {Integer} pagination.limit - Limit of returned page
 */

/**Get paginated list of all users that satisfy the query
 * @async
 * @function
 * @param {Object} query - Object containing queries in "key":"value" pairs
 * @param {Boolean} [query.leaderBoardEnabled] - Set to "true"/"false" to get users who have leaderboard enabled/disabled
 * @param {Boolean} [query.pushEnabled] - Set to "true"/"false" to get users who have push notifications enabled/disabled
 * @param {Boolean} [query.onboarded] - Set to "true"/"false" to get users who have/haven't been onboarded
 * @param {Boolean} [query.isVerified] - Set to "true"/"false" to get users whose email has/hasn't been verified
 * @param {String} [query.role] - Get users assigned a certain role
 * @param {string} [query.country] - Get users who registered in a given country
 * @param {Object} [config] - Service Configurations
 * @param {Integer} [config.page] - Page to fetch
 * @param {Integer} [config.limit] - Number or results per page.
 * @param {ClientSession} [config.session] - mongodb session
 * @returns {PaginatedResult}
 */
exports.getUsers = async (query, config = null) => {
  logger.trace("[USER SERVICE] [GET USERS] - Called");
  try {
    let limit = config?.limit || DEFAULT_PAGINATION_LIMIT;
    const page = config?.page || 1;
    const session = config?.session || null;
    limit = Math.min(limit, MAX_PAGINATION_LIMIT);
    const skip = (page - 1) * limit;
    const data = await User.find(query)
      .sort()
      .limit(limit)
      .skip(skip)
      .lean()
      .session(session);
    const count = await User.countDocuments(query);
    const docsLeft = count - page * limit;
    console.log(docsLeft);
    const result = {
      data,
      pagination: {
        hasMore: docsLeft > 0,
        currPage: page,
        limit: limit,
      },
    };
    logger.trace("[USER SERVICE] [GET USERS] - Completed");
    return result;
  } catch (error) {
    throw new Error(
      `[USER SERVICE] [GET USERS] - Encountered an error\n${error}`
    );
  }
};

//
//
//

/**Get first user that satisfies the query or, where query is null, the first user returned
 * @async
 * @function
 * @param {Object} [query] - Object containing queries in "key":"value" pairs
 * @param {String} [query.authID] - User Firebase UID
 * @param {Object} [query.name]
 * @param {String} query.name.first
 * @param {String} [query.name.last]
 * @param {String} [query.email]
 * @param {Object} [config] - Service Configurations
 * @param {ClientSession} [config.session] - mongodb session
 *
 * @return {UserObject}
 */
exports.getUserByQuery = async (query = null, config) => {
  logger.trace(`[USER SERVICE] [GET USER] - Called`);
  try {
    const user = await User.findOne(query).lean().session(config?.session);

    if (!user) {
      logger.debug(`[USER SERVICE] [GET USER] - No user matched the query`);
    } else {
      logger.debug(`[USER SERVICE] [GET USER] - User found`);
    }
    logger.trace(`[USER SERVICE] [GET USER] - Completed`);
    return user;
  } catch (error) {
    throw new Error(
      `[USER SERVICE] [GET USER] - Encountered an error\n${error}`
    );
  }
};

//
//
//

/**This function checks if a user who satisfies the query exists in the database
 * @async
 * @function
 * @param {Object} [query] - Object containing queries in "key":"value" pairs
 * @param {String} [query.authID] - User CLerk ID
 * @param {Object} [query.name]
 * @param {String} query.name.first
 * @param {String} [query.name.last]
 * @param {String} [query.email]
 * @param {Object} [config] - Service Configurations
 * @param {ClientSession} [config.session] - mongodb session
 * @return {Boolean}
 */
exports.userExists = async (query, config) => {
  logger.trace("[USER SERVICE] [USER EXISTS] - Called");
  try {
    const exists = await User.exists(query).session(config?.session);
    logger.debug(
      `[USER SERVICE] [USER EXISTS] - ${
        exists ? "User exists" : "User doesn't exists"
      } `
    );
    logger.trace("[USER SERVICE] [USER EXISTS] - Completed");
    return exists;
  } catch (error) {
    throw new Error(
      `[USER SERVICE] [USER EXISTS] - Encountered an error\n${error}`
    );
  }
};

//
//
//

/**Add user to database
 * @async
 * @param {Object} user - Initial user object to add to database
 * @param {String} user.uid
 * @param {Object} user.name
 * @param {String} user.name.first
 * @param {String} [user.name.last]
 * @param {String} user.username
 * @param {String} user.email
 * @param {String} user.country - ISO 3166 Alpha-3 Format
 * @param {Object} [config] - Service Configurations
 * @param {ClientSession} [config.session] - mongodb session
 * @returns {UserObject}
 */
exports.createUser = async (user, config = {}) => {
  logger.trace("[USER SERVICE] [CREATE USER] - Called");
  try {
    const result = await User.create([user], { session: config?.session });
    const newUser = result[0] || null;
    logger.trace("[USER SERVICE] [CREATE USER] - Completed");
    return newUser;
  } catch (error) {
    throw new Error(
      `[USER SERVICE] [CREATE USER] - Encountered an error\n${error}`
    );
  }
};

//
//
//

// TODO: Add documentation
exports.patchUser = async (filter, data, config = null) => {
  logger.trace("[USER SERVICE] [PATCH USER] - Called");
  try {
    const flatData = flattenObj(data);
    const patchedUser = await User.findOneAndUpdate(filter, flatData, {
      runValidators: true,
      new: true,
    })
      .lean()
      .session(config?.session);
    logger.trace("[USER SERVICE] [PATCH USER] - Completed");
    return patchedUser;
  } catch (error) {
    throw new Error(
      `[USER SERVICE] [PATCH USER] - Encountered an error\n${error}`
    );
  }
};
