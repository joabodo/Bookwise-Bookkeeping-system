require("dotenv/config");
require("./config/db.config");
const { PORT, ExpressConfig } = require("./config/server.config");
const userRouter = require("./routes/userRouter.js");
const logger = require("./lib/logger.js");
const {
  webhookRouter,
  accountRouter,
  transactionRouter,
  invoiceRouter,
} = require("./routes/index.js");
const isAuthenticated = require("./middleware/isAuthenticated.js");
const paymentsEnabled = require("./middleware/paymentsEnabled");
const telegramRouter = require("./telegram/router.js");

const app = ExpressConfig();

/******** ROUTES ********/

app.get("/", (req, res) => res.status(200).send("Server is up on running"));

app.use("/webhooks", webhookRouter);

app.use("/users", isAuthenticated, userRouter);

app.use("/accounts", isAuthenticated, accountRouter);

app.use("/transactions", isAuthenticated, transactionRouter);

app.use("/invoices", isAuthenticated, paymentsEnabled, invoiceRouter);

app.use("/telegram", telegramRouter);

/*************************/
/*************************/

// SEEDING
// seedTransactions(100);

/******** START SERVER ********/
app.listen(PORT, () => {
  logger.debug(`[SERVER]: Server listening on port ${PORT}`);
});
/*****************************/
/*****************************/

module.exports = app;
