import styles from "./AccountsSummaryCard.module.css";
import { FlexCard, Loader } from "components/shared/ui";
import { format } from "date-fns";
import { useTransactionsByAccountQuery } from "hooks/tanstack/transactions";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const AccountsSummaryCard = ({ ID, name, createdAt, description }) => {
  const navigate = useNavigate();
  const { data: transactions } = useTransactionsByAccountQuery(ID);
  let totalIn = 0;
  let totalOut = 0;
  transactions?.forEach((transaction) => {
    const { type, amount, destinationAccountID } = transaction;
    if (type === "income") {
      totalIn += amount;
    }
    if (type === "expense") {
      totalOut += amount;
    }
    if (type === "transfer") {
      if (ID == destinationAccountID._id) {
        totalIn += amount;
      } else {
        totalOut += amount;
      }
    }
  }, 0);

  const cashflow = totalIn - totalOut;
  return (
    <>
      <FlexCard
        className={styles.accountCard}
        onClick={() => navigate(`/accounts/${ID}`)}
      >
        {transactions ? (
          <>
            <div className={styles.header}>
              <h3>{name}</h3>
              <BsThreeDots />
            </div>
            <div className={styles.info}>
              <h4>Cashflow:</h4>
              <span
                className={`heading-1 ${
                  cashflow < 0
                    ? "text-error-red"
                    : cashflow > 0
                    ? "text-success-green"
                    : ""
                }`}
              >{`${cashflow < 0 ? "-" : ""}$${Math.abs(cashflow).toFixed(
                2
              )}`}</span>
              <span className="small-text">
                {description && description != ""
                  ? description
                  : `Created on ${format(
                      new Date(createdAt),
                      "MMMM dd, yyyy"
                    )}`}
              </span>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </FlexCard>
    </>
  );
};
export default AccountsSummaryCard;
