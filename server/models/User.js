const mongoose = require("mongoose");
const { z } = require("zod");
const roles = require("../config/constants/ROLES");
const Regex = require("../config/constants/REGEX");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    authID: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      immutable: true,
    },
    telegramID: {
      type: Schema.Types.String,
      sparse: true,
      index: true,
      trim: true,
    },
    name: {
      first: {
        type: String,
        lowercase: true,
        trim: true,
        validate: [
          {
            validator: (fname) =>
              z.string().regex(Regex.LETTERS_ONLY).safeParse(fname).success,
            message: "Name can only contain letters",
          },
        ],
      },
      last: {
        type: String,
        lowercase: true,
        trim: true,
        validate: [
          {
            validator: (fname) =>
              z.string().regex(Regex.LETTERS_ONLY).safeParse(fname).success,
            message: "Name can only contain letters",
          },
        ],
      },
    },
    email: {
      type: String,
      trim: true,
      required: "Email is required",
      unique: true,
      validate: {
        validator: (email) => {
          return z.string().email().safeParse(email).success;
        },
        message: "Invalid email format",
      },
    },
    mobileNumber: {
      type: String,
      required: "Mobile Number is required",
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      enum: {
        values: roles.map((role) => role.name),
        message: "{VALUE} is not a valid role",
      },
      default: "user",
      required: true,
      index: true,
    },
    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    onboarded: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentsEnabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    paystackKey: {
      type: String,
      required: () => this.paymentsEnabled,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    delete ret.uid;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
