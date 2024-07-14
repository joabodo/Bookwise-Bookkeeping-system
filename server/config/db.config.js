const mongoose = require("mongoose");
const logger = require("../lib/logger");

const MONGO_URI = process.env.MONGODB_CONNECTION_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.debug("[MONGODB] Connected to MongoDB");
  })
  .catch((error) => {
    logger.fatal(error, "[MONGODB] Error connecting to MongoDB");
  });
