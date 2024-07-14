const TRANSACTION_TYPES = require("../../config/constants/TRANSACTION_TYPES");
const Transaction = require("../../models/Transaction");
const { faker } = require("@faker-js/faker");

const genRandDate = (from, to) => {
  const date = new Date(faker.date.between({ from, to }));
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

module.exports = async (amount) => {
  const userID = "6676b9836e4a4d1ffa17a3e8";
  const accountID = "6676b6f6be6434f2ae0940dc";
  const newTransactions = [];
  let createdTransactions = [];
  try {
    for (let i = 0; i < amount; i++) {
      const newTransaction = {
        userID,
        accountID,
        type: faker.helpers.arrayElement(Object.values(TRANSACTION_TYPES)),
        amount: Number(faker.string.numeric({ length: { min: 3, max: 5 } })),
        date: `${genRandDate("2024-06-01", "2024-07-01")}`,
      };
      if (newTransaction.type === TRANSACTION_TYPES.TRANSFER)
        newTransaction.destinationAccountID = "6676d831ccc6e0533b210768";
      newTransactions.push(newTransaction);
    }
    const start = new Date().getTime();
    createdTransactions = await Transaction.create(newTransactions);
    const end = new Date().getTime();
    const seconds = ((end - start) / 1000).toFixed(2);
    console.log(seconds + "ms");
  } catch (error) {
    console.error(error.message);
  } finally {
    return createdTransactions;
  }
};
