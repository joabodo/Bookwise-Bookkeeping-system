const keys = {
  all: ["transactions"],
  filtered: (filters) => ["transactions", filters],
  account: (id, filters) => ["transactions", { accountID: id }, filters],
  single: (id) => ["transactions", { transactionID: id }],
};

export default keys;
