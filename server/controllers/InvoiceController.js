const logger = require("../../../BookWise/server/lib/logger");
const PaystackAPI = require("paystack-api");
const STATUS_CODES = require("../../../BookWise/server/config/constants/STATUS_CODES");
const SafeParseErrorFormatter = require("../../../BookWise/server/utils/safeParseErrorFormatter");
const request = require("request");
const {
  InvoiceCreationBodySchema,
  InvoicePatchSchema,
  InvoicesQuerySchema,
} = require("../../../BookWise/server/validation/invoiceSchemas");

const createInvoice = async (req, res) => {
  logger.trace(`[INVOICE CONTROLLER] [CREATE INVOICE] - Called`);

  try {
    let validatedData = InvoiceCreationBodySchema.safeParse(req.body);

    // If validation fails, return error response
    if (!validatedData.success) {
      logger.debug(`[INVOICE CONTROLLER] [CREATE INVOICE] - Invalid Payload`);
      const errorDetails = SafeParseErrorFormatter(validatedData);
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        error: true,
        message: "Invalid Payload",
        errors: errorDetails,
      });
    }

    // Create new invoice
    const { paystackKey } = res.user;
    const paystack = PaystackAPI(paystackKey);
    const {
      data: { email, amount, description, dueDate, currency },
    } = validatedData;
    const { data: customer } = await paystack.customer.create({
      email,
    });
    const { data } = await paystack.invoice.create({
      amount,
      description,
      currency,
      due_date: dueDate,
      customer: customer.customer_code,
    });

    logger.trace(`[INVOICE CONTROLLER] [CREATE INVOICE] - Completed`);
    return res.status(STATUS_CODES.CREATED).json({ error: false, data });
  } catch (error) {
    // Handle Errors
    logger.error(
      error,
      `[INVOICE CONTROLLER] [CREATE INVOICE] - Encountered an Error`
    );
    res.status(STATUS_CODES.SERVER_ERROR).send("INTERNAL SERVER ERROR");
  }
};

// TODO: Add documentation
const patchInvoice = async (req, res) => {
  logger.trace(`[INVOICE CONTROLLER] [PATCH INVOICE] - Called`);

  const payload = req.body;
  const { invoiceID } = req.params;

  if (!invoiceID) {
    logger.debug(
      `[INVOICE CONTROLLER] [PATCH INVOICE] - Missing Parameter: InvoiceID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Missing Parameter: InvoiceID" });
  }

  try {
    const validatedData = InvoicePatchSchema.safeParse(payload);

    if (!validatedData.success) {
      logger.debug("[INVOICE CONTROLER] [PATCH INVOICE] - Invalid Payload");
      const errorDetails = SafeParseErrorFormatter(validatedData);
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: true, message: "Invalid Query", errors: errorDetails });
      return;
    }

    const {
      data: { amount, currency, description, dueDate },
    } = validatedData;

    const { paystackKey } = res.user;
    const paystack = PaystackAPI(paystackKey);

    const { data: patchedInvoice } = await paystack.invoice.updateInvoice({
      id: invoiceID,
      amount,
      currency,
      description,
      due_date: dueDate,
    });

    if (!patchedInvoice) {
      logger.trace(`[INVOICE CONTROLLER] [PATCH INVOICE] - Invoice not found`);
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Invoice with id of '${invoiceID}' not found`,
      });
    }

    res
      .status(STATUS_CODES.SUCCESS)
      .json({ error: false, data: patchedInvoice });
    logger.trace("[INVOICE CONTROLER] [PATCH INVOICE] - Completed");
  } catch (error) {
    if (error.statusCode == "400") {
      logger.trace(`[INVOICE CONTROLLER] [PATCH INVOICE] - Invoice not found`);
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        error: true,
        message: error.error.message,
      });
    }
    logger.error(
      error,
      `[INVOICE CONTROLLER] [GET INVOICE] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

// TODO: Add documentation
const getInvoice = async (req, res) => {
  logger.trace(`[INVOICE CONTROLLER] [GET INVOICE] - Called`);

  const { invoiceID } = req.params;

  if (!invoiceID) {
    logger.debug(
      `[INVOICE CONTROLLER] [GET INVOICE] - Missing Parameter: InvoiceID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Missing Parameter: InvoiceID" });
  }

  try {
    const { paystackKey } = res.user;
    const paystack = PaystackAPI(paystackKey);

    const { data: invoice } = await paystack.invoice.get({
      invoice_id: invoiceID,
    });

    if (!invoice) {
      logger.trace(`[INVOICE CONTROLLER] [GET INVOICE] - Invoice not found`);
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Invoice with id of '${invoiceID}' not found`,
      });
    }

    res.status(STATUS_CODES.SUCCESS).json({ error: false, data: invoice });
    logger.trace("[INVOICE CONTROLER] [GET INVOICE] - Completed");
  } catch (error) {
    if (error.statusCode == "400") {
      logger.trace(`[INVOICE CONTROLLER] [GET INVOICE] - Invoice not found`);
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Invoice with id of '${invoiceID}' not found`,
      });
    }
    logger.error(
      error,
      `[INVOICE CONTROLLER] [GET INVOICE] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

// TODO: Add documentation
const getInvoices = async (req, res) => {
  logger.trace(`[INVOICE CONTROLLER] [GET INVOICE] - Called`);

  const { status, page, limit, from, to, currency } = req.query;

  const validatedData = InvoicesQuerySchema.safeParse({
    status,
    page,
    limit,
    from,
    to,
    currency,
  });

  if (!validatedData.success) {
    logger.debug("[INVOICE CONTROLER] [GET INVOICE] - Invalid Payload");
    const errorDetails = SafeParseErrorFormatter(validatedData);
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Invalid Query", errors: errorDetails });
    return;
  }

  try {
    const { paystackKey } = res.user;
    const paystack = PaystackAPI(paystackKey);

    const { data: invoices, meta } = await paystack.invoice.list({
      perPage: limit,
      page,
      from,
      to,
      status,
      currency,
    });

    res.status(STATUS_CODES.SUCCESS).json({
      error: false,
      data: invoices,
      pagination: {
        hasMore: meta.page < meta.pageCount,
        currPage: meta.page,
        limit: meta.perPage,
      },
    });
    logger.trace("[ACCOUNT CONTROLER] [GET ACCOUNTS] - Completed");
  } catch (error) {
    logger.error(
      error,
      `[ACCOUNT CONTROLER] [GET ACCOUNTS] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

// TODO: Add documentation
const deleteInvoice = async (req, res) => {
  logger.trace(`[INVOICE CONTROLLER] [DELETE INVOICE] - Called`);

  const { invoiceID } = req.params;
  if (!invoiceID) {
    logger.debug(
      `[INVOICE CONTROLLER] [DELTE INVOICE] - Missing Parameter: InvoiceID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Missing Parameter: InvoiceID" });
  }

  try {
    const { paystackKey } = res.user;
    const paystack = PaystackAPI(paystackKey);

    const { data: invoice } = await paystack.invoice.get({
      invoice_id: invoiceID,
    });

    if (!invoice) {
      logger.trace(`[INVOICE CONTROLLER] [GET INVOICE] - Invoice not found`);
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Invoice with id of '${invoiceID}' not found`,
      });
    }

    res.status(STATUS_CODES.SUCCESS).json({ error: false, message });
    logger.trace("[INVOICE CONTROLER] [DELETE INVOICE] - Completed");
  } catch (error) {
    if (error.statusCode == "400") {
      logger.trace(`[INVOICE CONTROLLER] [DELETE INVOICE] - Invoice not found`);
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Invoice with id of '${invoiceID}' not found`,
      });
    }
    logger.error(
      error,
      `[INVOICE CONTROLLER] [DELETE INVOICE] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

const downloadInvoice = async (req, res) => {
  logger.trace(`[INVOICE CONTROLLER] [DOWNLOAD INVOICE] - Called`);
  const { invoiceID } = req.params;

  if (!invoiceID) {
    logger.debug(
      `[INVOICE CONTROLLER] [DOWNLOAD INVOICE] - Missing Parameter: InvoiceID`
    );
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: true, message: "Missing Parameter: InvoiceID" });
  }

  try {
    const { paystackKey } = res.user;
    const paystack = PaystackAPI(paystackKey);

    const {
      data: { pdf_url },
    } = await paystack.invoice.get({
      invoice_id: invoiceID,
    });
    console.log(pdf_url);

    if (!pdf_url) {
      logger.trace(
        `[INVOICE CONTROLLER] [DOWNLOAD INVOICE] - Invoice not found`
      );
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Invoice with id of '${invoiceID}' not found`,
      });
    }
    res.setHeader(
      "content-disposition",
      `attachment; filename="invoice_${invoiceID}.pdf"`
    );
    res.setHeader("content-type", `application/pdf"`);
    request(`https://api.paystack.co/files/${pdf_url}`, {
      auth: {
        bearer: paystackKey,
      },
    }).pipe(res);
  } catch (error) {
    if (error.statusCode == "400") {
      logger.trace(
        `[INVOICE CONTROLLER] [DOWNLOAD INVOICE] - Invoice not found`
      );
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: true,
        message: `Invoice with id of '${invoiceID}' not found`,
      });
    }
    logger.error(
      error,
      `[INVOICE CONTROLLER] [DELETE INVOICE] - Encountered an Error`
    );
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: true, message: "INTERNAL SERVER ERROR" });
  }
};

module.exports = {
  createInvoice,
  patchInvoice,
  getInvoice,
  getInvoices,
  deleteInvoice,
  downloadInvoice,
};
