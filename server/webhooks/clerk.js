const { Router } = require("express");
const { Webhook } = require("svix");
const logger = require("../lib/logger");
const STATUS_CODES = require("../config/constants/STATUS_CODES");
const { registerUser, patchUser } = require("../controllers/UserController");

const router = Router();

router.post("/", (req, res) => {
  logger.trace(`[WEBHOOKS] [CLERK] - Clerk webhook called`);
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    logger.error(`[WEBHOOKS] [CLERK] - Webhook secret not found in .env`);
    return res.status(STATUS_CODES.SERVER_ERROR).send();
  }

  const headers = req.headers;
  const payload = req.body;

  // Get the Svix headers for verification
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  // If there are no Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    logger.debug(`[WEBHOOKS] [CLERK] - Required svix headers not found`);
    return res.status(STATUS_CODES.BAD_REQUEST).send();
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    });
  } catch (error) {
    logger.error(
      `[WEBHOOKS] [CLERK] - Error verifying webhook:\n${error.message}`
    );
    return res.status(STATUS_CODES.BAD_REQUEST).send();
  }

  const primaryEmail = evt?.data?.email_addresses?.find(
    (email) => email.id === evt.data.primary_email_address_id
  );

  const primaryMobile = evt?.data?.phone_numbers?.at(0);

  const formattedBody = {
    authID: evt.data?.id,
    name: {
      first: evt.data?.first_name,
      last: evt.data?.last_name,
    },
    email: primaryEmail?.email_address,
    // mobileNumber: primaryMobile?.phone_number || null,
    // mobileNumber: primaryMobile?.phone_number?.replace(/\D/g, ""),
    mobileNumber: primaryMobile?.phone_number,
    isVerified: primaryEmail?.verification.status === "verified",
  };

  switch (evt.type) {
    case "user.created":
      logger.trace(`[WEBHOOKS] [CLERK] - Event type: user.created`);
      registerUser({ ...req, body: formattedBody }, res);
      break;
    case "user.updated":
      logger.trace(`[WEBHOOKS] [CLERK] - Event type: user.updated`);
      logger.trace(`[WEBHOOKS] [CLERK] - Event type: user.updated`);
      patchUser({ ...req, body: formattedBody }, res);
      break;
    case "user.deleted":
      logger.trace(`[WEBHOOKS] [CLERK] - Event type: user.deleted`);
    // TODO: Add account deletion use case
    default:
      logger.debug(`[WEBHOOKS] [CLERK] - Unrecognized event type: ${evt.type}`);
      return res.status(STATUS_CODES.SUCCESS).send("Unrecognized event type");
  }
});

module.exports = router;
