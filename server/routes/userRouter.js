const { Router } = require("express");
const {
  getAllUsers,
  getMe,
  patchMe,
  registerUser,
  activatePayments,
} = require("../controllers/UserController");
const hasValidToken = require("../middleware/hasValidToken");
const isAuthenticated = require("../middleware/isAuthenticated");
const hasPermission = require("../middleware/hasPermission");
const PERMISSIONS = require("../config/constants/PERMISSIONS");

const router = Router();

router.get(
  "/",
  isAuthenticated,
  hasPermission(PERMISSIONS.READ.USER),
  getAllUsers
);

router.post("/", hasValidToken, registerUser);

router.get("/me", isAuthenticated, getMe);

router.patch("/me", isAuthenticated, patchMe);

router.post("/me/activate/invoices", isAuthenticated, activatePayments);

module.exports = router;
