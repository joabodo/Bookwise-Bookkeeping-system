const { Router } = require("express");
const { authWebhooks, paystackWebhooks } = require("../webhooks");

const router = Router();

router.use("/clerk", authWebhooks);
router.use("/paystack/:email", paystackWebhooks);

module.exports = router;
