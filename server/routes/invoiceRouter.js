const { Router } = require("express");
const {
  createInvoice,
  patchInvoice,
  getInvoice,
  getInvoices,
  deleteInvoice,
  downloadInvoice,
} = require("../controllers/InvoiceController");

const router = Router();

// TODO: ADD AUTHENTICATION AND AUTHORIZATION

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:invoiceID", getInvoice);
router.get("/:invoiceID/download", downloadInvoice);
router.patch("/:invoiceID", patchInvoice);
router.post("/archive/:invoiceID", deleteInvoice);

module.exports = router;
