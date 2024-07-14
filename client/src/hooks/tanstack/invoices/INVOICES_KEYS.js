const keys = {
  all: ["invoices"],
  filtered: (filters) => ["invoices", filters],
  invoice: (invoiceID) => ["invoices", invoiceID],
};

export default keys;
