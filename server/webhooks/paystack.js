const crypto = require("crypto");
const STATUS_CODES = require("../config/constants/STATUS_CODES");
const logger = require("../lib/logger");
const paystack = require("../lib/paystack");
const { getUserByQuery } = require("../services/UserServices");
const telegram = require("../telegram/telegram");
const paystackWebhooks = async (req, res) => {
  const { email: userEmail } = req.params;
  var hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash == req.headers["x-paystack-signature"]) {
    try {
      // Retrieve the request's body
      const event = req.body;
      const { event: eventName, data } = event;
      switch (eventName) {
        case "charge.success":
          // Send telegram notification
          const {
            amount,
            customer: { email },
            currency,
          } = data;
          const message = `Payment Notification💵\n\nYou have recieved ${currency} ${(
            amount / 100
          ).toFixed(2)} from ${email}.`;
          console.log(userEmail);
          const user = await getUserByQuery({ email: userEmail });
          if (user) {
            user.telegramID &&
              user.telegramID != "" &&
              (await telegram.sendMessage(user.telegramID, message));
          }
          break;
        default:
          logger.debug(`[WEBHOOKS] [PAYSTACK] - Unsubscribed event`);
          break;
      }
    } catch (error) {
      if (error.statusCode == "400") {
        logger.trace(
          `[INVOICE CONTROLLER] [DELETE INVOICE] - Invoice not found`
        );
        return res.status(STATUS_CODES.NOT_FOUND).json({
          error: true,
          message: `Invoice with id of '${invoiceID}' not found`,
        });
      }
      logger.error(error, `[WEBHOOKS] [PAYSTACK] - Encountered an Error`);
    } finally {
      return res.status(200).send("OK");
    }
  }
  return res.sendStatus(STATUS_CODES.FORBIDDEN);
};

module.exports = paystackWebhooks;
