import SearchBar from "components/shared/search/SearchBar";
import styles from "./TransactionsPage.module.css";
import GridSection from "components/shared/GridSection";
import { Header, Loader, TransactionTable } from "components/shared/ui";
import { useTransactionsQuery } from "hooks/tanstack/transactions";
import { BiPlus } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EmptyState from "components/shared/EmptyState";

const TransactionsPage = () => {
  const { data: transactions } = useTransactionsQuery();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  useEffect(() => {
    const filtered =
      transactions?.filter((transaction) => {
        return (
          transaction.description
            ?.toLowerCase()
            .replace(" ", "")
            .startsWith(search.toLowerCase()) ||
          transaction.accountID.name
            .toLowerCase()
            .replace(" ", "")
            .startsWith(search.toLowerCase()) ||
          transaction.destinationAccountID?.name
            .toLowerCase()
            .replace(" ", "")
            .startsWith(search.toLowerCase())
        );
      }) || [];
    setFilteredTransactions(filtered);
  }, [search, transactions]);
  return (
    <>
      <Header />
      <GridSection>
        <SearchBar
          search={search}
          setSearch={setSearch}
          className={styles.searchBar}
          placeholder={"Search Transactions..."}
        />
        <Link
          to={"/transactions/new"}
          className={` button primary--oxford-blue ${styles.actionBtn}`}
        >
          <BiPlus />
          Record Transaction
        </Link>
      </GridSection>
      <GridSection>
        {transactions ? (
          transactions.length > 0 ? (
            <TransactionTable transactions={filteredTransactions} />
          ) : (
            <div className={styles.emptystateWrapper}>
              <EmptyState
                title={"No Transactions Yet"}
                description={
                  "It looks like you haven't recorded any transactions yet. This page will display all types of transactions (income, expense, transfer) as they are recorded. Create a transaction to get started"
                }
                buttonLabel={"Record Transaction"}
                onClick={() => navigate("/transactions/new")}
              />
            </div>
          )
        ) : (
          <Loader />
        )}
      </GridSection>
    </>
  );
};
export default TransactionsPage;
