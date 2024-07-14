import { useNavigate, useParams } from "react-router-dom";
import styles from "./AccountDetailsPage.module.css";
import { useAccountQuery } from "hooks/tanstack/accounts";
import GridSection from "components/shared/GridSection";
import { BackLink, Loader, TransactionTable } from "components/shared/ui";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/base";
import { BsThreeDots } from "react-icons/bs";
import { useTransactionsByAccountQuery } from "hooks/tanstack/transactions";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";

const AccountDetailsPage = () => {
  const { accountID } = useParams();
  const { data: account } = useAccountQuery(accountID);
  const { data: transactions } = useTransactionsByAccountQuery(accountID);
  const navigate = useNavigate();
  let totalIncome = 0;
  let totalExpense = 0;
  transactions?.forEach((transaction) => {
    const { type, amount, _accountID, _destinationAccountID } = transaction;
    if (type === "income") {
      totalIncome += amount;
    }

    if (type === "transfer" && accountID === _accountID) {
      totalExpense += amount;
    }

    if (type === "transfer" && accountID === _destinationAccountID) {
      totalIncome += amount;
    }

    if (type === "expense") {
      totalExpense += amount;
    }
  }, 0);
  return (
    <>
      <GridSection>
        <BackLink to={"/accounts"}>Accounts</BackLink>
      </GridSection>
      {account ? (
        <>
          <GridSection>
            <div className={styles.header}>
              <div className={styles.info}>
                <h2>{account.name}</h2>
                <p>{account.description}</p>
              </div>
              <Dropdown>
                <MenuButton className={styles.dropdownBtn}>
                  <BsThreeDots />
                </MenuButton>
                <Menu className={styles.dropdown}>
                  <MenuItem
                    className={styles.dropdownItem}
                    onClick={() => navigate(`/accounts/edit/${accountID}`)}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem className={styles.dropdownItem}>Delete</MenuItem>
                </Menu>
              </Dropdown>
            </div>
          </GridSection>
          <GridSection>
            <div className={styles.summaries}>
              <div className={`${styles.summaryCard} ${styles.income}`}>
                <div className={styles.icon}>
                  <IoIosArrowDropupCircle />
                </div>
                <div className={styles.summary}>
                  <h2>
                    <span>{account.currency}</span>
                    {totalIncome}
                  </h2>
                  <p className="small-text">Money In</p>
                </div>
              </div>
              <div className={`${styles.summaryCard} ${styles.expense}`}>
                <div className={styles.icon}>
                  <IoIosArrowDropdownCircle />
                </div>
                <div className={styles.summary}>
                  <h2>
                    <span>{account.currency}</span>
                    {totalExpense}
                  </h2>
                  <p className="small-text">Money Out</p>
                </div>
              </div>
            </div>
          </GridSection>
          <GridSection>
            {transactions ? (
              <TransactionTable transactions={transactions} />
            ) : (
              <Loader />
            )}
          </GridSection>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default AccountDetailsPage;
