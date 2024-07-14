const { z } = require("zod");
const { role, boolean } = require("./general");
const Regex = require("../config/constants/REGEX");

const UserSchema = z.object({
  authID: z.string().trim(),
  name: z
    .object({
      first: z
        .string()
        .trim()
        .regex(Regex.LETTERS_ONLY, "Name can only contain letters"),
      last: z
        .string()
        .trim()
        .regex(Regex.LETTERS_ONLY, "Name can only contain letters"),
    })
    .partial({ last: true }),
  email: z.string().trim().email(),
  mobileNumber: z.string(),
  role: role,
  isVerified: boolean,
  onboarded: boolean,
  paymentsEnabled: z.coerce.boolean(),
  paystackKey: z.string(),
});

/**ZOD Object representing expected data from client when registering a user */
const UserRegistrationBodySchema = UserSchema.pick({
  name: true,
  email: true,
  isVerified: true,
  authID: true,
  mobileNumber: true,
});

/**ZOD Object representing expected data from client when patching a user. */
const UserPatchBodySchema = UserSchema.pick({
  authID: true,
  name: true,
  email: true,
  mobileNumber: true,
  isVerified: true,
  onboarded: true,
}).partial();

const UserPaymentActivationSchema = UserSchema.pick({
  paystackKey: true,
});

/**ZOD Object representing valid queries from client when fetching a user */
const UserQuerySchema = z.object({
  authID: z.string().optional(),
  name: z
    .object({
      first: z.string(),
      last: z.string(),
    })
    .partial({ last: true })
    .optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  mobileNumber: z.string(),
});

/**ZOD Object representing valid queries from client when fetching multiple users. */
const UsersQuerySchema = UserSchema.pick({
  onboarded: true,
  isVerified: true,
  role: true,
})
  .extend({
    page: z.coerce.number().min(1),
    limit: z.coerce.number(),
  })
  .partial();

module.exports = {
  UserRegistrationBodySchema,
  UserPatchBodySchema,
  UserQuerySchema,
  UsersQuerySchema,
  UserPaymentActivationSchema,
};
