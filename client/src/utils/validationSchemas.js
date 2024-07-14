import SUPPORTED_CURRENCIES from "constants/SUPPORTED_CURRENCIES";
import Regex from "./regex";
import { z } from "zod";

export const UserSignupSchema = z
  .object({
    firstName: z
      .string()
      .regex(Regex.LETTERS_ONLY, "Name can only contain letters")
      .trim()
      .refine((val) => isClean(val), "Name cannot contain profanity"),
    lastName: z
      .string()
      .regex(Regex.LETTERS_ONLY, "Name can only contain letters")
      .trim()
      .refine((val) => isClean(val), "Name cannot contain profanity"),
    email: z.string().email().trim(),
    password: z
      .string()
      .regex(
        Regex.PASSWORD,
        "Must contain 8+ characters, including at least 1 letter and 1 number"
      )
      .min(8, "Password is too short")
      .max(20, "Password is too long")
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const AccountCreationSchema = z.object({
  name: z
    .string()
    .regex(/.*[a-zA-Z].*/, "This field can't be empty")
    .trim(),
  description: z
    .string()
    .regex(/.*[a-zA-Z].*/, "This field can't be empty")
    .trim()
    .max(240, "Description can only contain a maximum of 240 characters"),
  currency: z.enum(SUPPORTED_CURRENCIES, {
    invalid_type_error: `Currency is not a supported ISO 3-Letter Currency Code (${SUPPORTED_CURRENCIES.map(
      (curr) => "'" + curr + "'"
    ).join(", ")})`,
  }),
});

const TransactionSchema = z.object({
  accountID: z.string(),
  date: z.string().date("Date must be in format 'YYY-MM-DD'"),
  type: z.string(),
  destinationAccountID: z.string().nullable(),
  tags: z.string().array(),
  description: z.string(),
  amount: z.coerce.number().gt(0, "Transaction amount must be greater than 0"),
});

export const TransactionCreationSchema = TransactionSchema.partial({
  description: true,
  destinationAccountID: true,
  tags: true,
});

export const InvoiceCreationSchema = z.object({
  email: z.string().email(),
  amount: z.coerce.number().min(0),
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

export const InvoicePatchSchema = InvoiceCreationSchema.omit({
  email: true,
}).partial();
