const mongoose = require("mongoose");
const { z } = require("zod");
const REGEX = require("../config/constants/REGEX");
const SUPPORTED_CURRENCIES = require("../config/constants/SUPPORTED_CURRENCIES");

const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 90,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      validate: {
        validator: (slug) =>
          z
            .string()
            .refine((val) => !REGEX.WHITESPACE.test(val))
            .safeParse(slug).success,
        message: "Account slug cannot contain whitespace",
      },
    },
    description: {
      type: String,
      required: false,
      trim: true,
      default: "",
      maxLength: [
        240,
        "Description can only contain a maximum of 240 characters",
      ],
    },
    userID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: SUPPORTED_CURRENCIES,
        message: "{VALUE} is not a supported currency",
      },
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.index({ userID: 1, name: 1 }, { unique: true });
accountSchema.index({ userID: 1, slug: 1 }, { unique: true });

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
