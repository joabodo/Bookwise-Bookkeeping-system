const mongoose = require("mongoose");
const TRANSACTION_TYPES = require("../config/constants/TRANSACTION_TYPES");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    accountID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account",
      required: true,
    },
    userID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: mongoose.SchemaTypes.Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: Object.values(TRANSACTION_TYPES),
        message: "{VALUE} is not a valid transaction type",
      },
    },
    destinationAccountID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account",
      required: () => this.type === TRANSACTION_TYPES.TRANSFER,
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: (amount) => {
          return amount > 0;
        },
        message: "Transaction amount must be greater than 0",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
