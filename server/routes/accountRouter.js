const { Router } = require("express");
const hasValidToken = require("../middleware/hasValidToken");
const isAuthenticated = require("../middleware/isAuthenticated");
const hasPermission = require("../middleware/hasPermission");
const PERMISSIONS = require("../config/constants/PERMISSIONS");
const {
  createAccount,
  patchAccount,
  getAccount,
  getAccounts,
} = require("../controllers/AccountController");
const {
  createTransaction,
  getTransactions,
} = require("../controllers/TransactionController");

const router = Router();

// TODO: ADD AUTHENTICATION AND AUTHORIZATION

router.get("/", getAccounts);

router.post("/", createAccount);

router.get("/:accountID", getAccount);

router.patch("/:accountID", patchAccount);

router.delete("/:accountID", (req, res) => {
  res.send("Under development");
});

router.get("/:accountID/transactions", getTransactions);

router.post("/:accountID/transactions", createTransaction);

module.exports = router;
