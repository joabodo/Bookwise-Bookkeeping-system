const { z } = require("zod");
const { ObjectIdSchema } = require("./general");
const TRANSACTION_TYPES = require("../config/constants/TRANSACTION_TYPES");

const refineSchema = (schema) =>
  schema.refine(
    (data) =>
      (data.type === TRANSACTION_TYPES.TRANSFER) ===
      !!data.destinationAccountID,
    {
      path: ["destinationAccountID"],
      message: `Destination Account ID is required for type ${TRANSACTION_TYPES.TRANSFER}`,
    }
  ); // Both true or both false

const TransactionSchema = z.object({
  _id: ObjectIdSchema.describe("Transaction Object Id"),
  id: ObjectIdSchema.describe("Transaction Object Id"),
  accountID: ObjectIdSchema.describe("Account ObjectId"),
  date: z.string().date("Date must be in format 'YYY-MM-DD'"),
  type: z.enum(Object.values(TRANSACTION_TYPES), {
    invalid_type_error: `Transaction type is not a valid type (${Object.values(
      TRANSACTION_TYPES
    )
      .map((type) => "'" + type + "'")
      .join(", ")})`,
  }),
  destinationAccountID: ObjectIdSchema.describe("Destination Account ObjectId"),
  tags: z.string().array(),
  description: z.string(),
  amount: z.number().gt(0, "Transaction amount must be greater than 0"),
});

const TransactionCreationSchema = refineSchema(
  TransactionSchema.omit({
    _id: true,
    id: true,
  }).partial({
    description: true,
    destinationAccountID: true,
    tags: true,
  })
);

const TransactionPatchSchema = refineSchema(
  TransactionSchema.omit({
    _id: true,
    id: true,
  }).partial()
);

const TransactionQuerySchema = TransactionSchema.pick({
  _id: true,
  id: true,
});

const TransactionsQuerySchema = TransactionSchema.pick({
  accountID: true,
  type: true,
})
  .extend({
    from: z.string().date("Expected date in format 'YYYY-MM-DD"),
    to: z.string().date("Expected date in format 'YYYY-MM-DD"),
    page: z.coerce.number(),
    limit: z.coerce.number(),
  })
  .partial();

module.exports = {
  TransactionCreationSchema,
  TransactionPatchSchema,
  TransactionQuerySchema,
  TransactionsQuerySchema,
};
