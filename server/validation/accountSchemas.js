const { z } = require("zod");
const { role, boolean, ObjectIdSchema } = require("./general");
const Regex = require("../config/constants/REGEX");
const SUPPORTED_CURRENCIES = require("../config/constants/SUPPORTED_CURRENCIES");

const AccountSchema = z.object({
  name: z.string().trim(),
  slug: z.string().trim(),
  description: z
    .string()
    .trim()
    .max(240, "Description can only contain a maximum of 240 characters"),
  userID: ObjectIdSchema.describe("User ObjectId"),
  currency: z.enum(SUPPORTED_CURRENCIES, {
    invalid_type_error: `Currency is not a supported ISO 3-Letter Currency Code (${SUPPORTED_CURRENCIES.map(
      (curr) => "'" + curr + "'"
    ).join(", ")})`,
  }),
});

const AccountCreationBodySchema = AccountSchema.omit({
  slug: true,
  userID: true,
}).partial({
  description: true,
});

const AccountPatchSchema = AccountSchema.omit({
  slug: true,
  userID: true,
}).partial();

const AccountsQuerySchema = AccountSchema.pick({
  currency: true,
})
  .extend({
    page: z.coerce.number(),
    limit: z.coerce.number(),
  })
  .partial();

module.exports = {
  AccountCreationBodySchema,
  AccountPatchSchema,
  AccountsQuerySchema,
};
