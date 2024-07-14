const pino = require("pino");

module.exports = pino({
  level: process.env.PINO_LOG_LEVEL || "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      "name",
      "username",
      "email",
      "country",
      "user.name",
      "user.username",
      "user.email",
      "user.country",
      "*.name",
      "*.username",
      "*.email",
      "*.country",
    ],
    remove: true,
  },
});
