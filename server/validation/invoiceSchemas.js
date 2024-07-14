const { z } = require("zod");
const { role, boolean, ObjectIdSchema } = require("./general");
const Regex = require("../config/constants/REGEX");
const SUPPORTED_CURRENCIES = require("../config/constants/SUPPORTED_CURRENCIES");

const InvoiceSchema = z.object({
  email: z.string().email(),
  amount: z.number().min(0),
  description: z
    .string()
    .trim()
    .max(240, "Description can only contain a maximum of 240 characters"),
  currency: z.enum(SUPPORTED_CURRENCIES, {
    invalid_type_error: `Currency is not a supported ISO 3-Letter Currency Code (${SUPPORTED_CURRENCIES.map(
      (curr) => "'" + curr + "'"
    ).join(", ")})`,
  }),
  dueDate: z.string().date("Expected date in format 'YYYY-MM-DD"),
});

const InvoiceCreationBodySchema = InvoiceSchema;

const InvoicePatchSchema = InvoiceSchema.omit({
  email: true,
}).partial();

const InvoicesQuerySchema = InvoiceSchema.pick({
  currency: true,
})
  .extend({
    status: z.coerce.boolean(),
    page: z.coerce.number(),
    limit: z.coerce.number(),
    from: z.string().date("Expected date in format 'YYYY-MM-DD"),
    to: z.string().date("Expected date in format 'YYYY-MM-DD"),
  })
  .partial();

module.exports = {
  InvoiceCreationBodySchema,
  InvoicePatchSchema,
  InvoicesQuerySchema,
};
