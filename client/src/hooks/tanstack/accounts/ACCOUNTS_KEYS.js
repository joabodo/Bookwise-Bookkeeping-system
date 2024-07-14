const keys = {
  all: ["accounts"],
  filtered: (filters) => ["accounts", filters],
  account: (accountID) => ["accounts", accountID],
};

export default keys;
