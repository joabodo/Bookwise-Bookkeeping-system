const COMMANDS = {
  HELP: {
    VALUE: "/start",
    DESCRIPTION: "View a list of all available commands",
  },
  ACCOUNTS: {
    VALUE: "/accounts",
    DESCRIPTION: "Perform Operations on your accounts",
  },
  TRANSACTIONS: {
    VALUE: "/transactions",
    DESCRIPTION: "Add or view transactions",
  },
  INVOICES: {
    VALUE: "/invoices",
    DESCRIPTION: "Send Invoices to customers",
  },
  EXIT: {
    VALUE: "/exit",
    DESCRIPTION: "Cancel any ongoing operation",
  },
};

module.exports = { COMMANDS };
