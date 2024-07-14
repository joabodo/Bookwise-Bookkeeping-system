const { SafeParseError } = require("zod");

/**
 * @typedef {Array.<{message: String}>} SafeParseErrorFormatterResult
 *
 */

/**This function formats zod SafeParse Errors into a format more suitable for server responses
 * @param {SafeParseError} SafeParseError - zod SafeParseError
 * @returns {SafeParseErrorFormatterResult}
 *
 */
const SafeParseErrorFormatter = (safeParse) => {
  return safeParse.error.errors.map((issue) => ({
    message: `${issue.path.join(".")}: ${issue.message}`,
  }));
};

module.exports = SafeParseErrorFormatter;
