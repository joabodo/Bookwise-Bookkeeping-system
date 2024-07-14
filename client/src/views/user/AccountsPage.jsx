import GridSection from "components/shared/GridSection";
import styles from "./AccountsPage.module.css";
import { FlexCard, Header, Loader } from "components/shared/ui";
import { useAccountsQuery } from "hooks/tanstack/accounts";
import { BsThreeDots } from "react-icons/bs";
import { AccountsSummaryCard } from "components/accounts";
import { BiPlus } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import LoadScreen from "components/overlays/LoadScreen";
import EmptyState from "components/shared/EmptyState";

const AccountsPage = () => {
  const { data: accounts } = useAccountsQuery();
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <GridSection>
        <Link
          to={"/accounts/new"}
          className={` button primary--oxford-blue ${styles.actionBtn}`}
        >
          <BiPlus />
          Add Account
        </Link>
      </GridSection>
      <GridSection>
        {accounts ? (
          accounts.length > 0 ? (
            accounts.map((account) => (
              <AccountsSummaryCard
                key={account._id}
                ID={account._id}
                name={account.name}
                description={account.description}
                createdAt={account.createdAt}
              />
            ))
          ) : (
            <div className={styles.emptystateWrapper}>
              <EmptyState
                title={"Seems so empty in here"}
                description={
                  "You don't seem to have any accounts yet. Create an account to get started"
                }
                buttonLabel={"Add an account"}
                onClick={() => navigate("/accounts/new")}
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
export default AccountsPage;
