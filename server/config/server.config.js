const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const logger = require("../lib/logger");
const pinoHTTP = require("pino-http");

/**Server Port */
const PORT = process.env.PORT || 3000;

/**CORS Allowed Origins */
const environment = process.env.VERCEL_ENV;

let origins;

switch (environment) {
  case "production":
    origins = [
      "https://www.ftsgdiscipleship.com",
      "https://ftsgdiscipleship.com",
      "https://client-blond-two-76.vercel.app",
    ];
    break;
  case "development":
    origins = [
      "http://localhost:5173",
      "http://localhost:4173",
      "http://192.168.100.12:5173",
    ];
    break;
  default:
    throw new Error("VERCEL_ENV is not defined");
}

const allowedOrigins = origins;

/** Returns an Express app instance with server configurations*/
const ExpressConfig = () => {
  logger.trace("[SERVER CONFIG] [EXPRESS CONFIG] - Called");
  process.on("uncaughtException", (err) => {
    logger.fatal(err, "Uncaught exception detected");
  });

  process.on("unhandledRejection", (err) => {
    logger.fatal(err, "Unhandled rejection detected");
  });

  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  const options = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
  app.use(
    pinoHTTP({
      logger,
      serializers: {
        req: (req) => {
          if (process.env.VERCEL_ENV === "development") {
            return `${req.method} ${req.url}`;
          } else {
            return req;
          }
        },
        res: (res) => {
          if (process.env.VERCEL_ENV === "development") {
            return `Status Code - ${res.statusCode} | Body - ${res.data}`;
          } else {
            return res;
          }
        },
        responseTime: (time) => `Response Time - ${time}ms`,
        err: (err) => {
          if (process.env.VERCEL_ENV === "development") {
            return `Error - ${err.message}`;
          } else {
            return err;
          }
        },
      },
    })
  );
  app.use(cors(options));
  app.use(helmet());
  app.use(compression());
  logger.trace("[SERVER CONFIG] [EXPRESS CONFIG] - Completed");
  return app;
};

module.exports = { ExpressConfig, PORT };
