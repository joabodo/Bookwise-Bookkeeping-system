const { Router } = require("express");
const hasValidToken = require("../middleware/hasValidToken");
const isAuthenticated = require("../middleware/isAuthenticated");
const hasPermission = require("../middleware/hasPermission");
const PERMISSIONS = require("../config/constants/PERMISSIONS");
const {
  getTransactions,
  createTransaction,
  patchTransaction,
  getTransaction,
} = require("../controllers/TransactionController");

const router = Router();

// TODO: ADD AUTHENTICATION AND AUTHORIZATION

router.get("/", getTransactions);
router.post("/", createTransaction);
router.get("/:transactionID", getTransaction);
router.patch("/:transactionID", patchTransaction);

module.exports = router;
