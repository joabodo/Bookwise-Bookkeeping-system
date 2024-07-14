import {
  DateInput,
  SelectInput,
  StyledForm,
  TextInput,
} from "components/shared/forms";
import styles from "./TransactionEditPage.module.css";
import GridSection from "components/shared/GridSection";
import { useNavigate, useParams } from "react-router-dom";
import { BackLink, FlexCard, Loader } from "components/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { TransactionCreationSchema } from "utils/validationSchemas";
import { useAccountsQuery } from "hooks/tanstack/accounts";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  TRANSACTION_KEYS,
  useTransactionQuery,
  useTransactionUpdateMutation,
} from "hooks/tanstack/transactions";
import { format } from "date-fns";
import { useEffect } from "react";

const TransactionEditPage = () => {
  const { transactionID } = useParams();
  const { data: transaction } = useTransactionQuery(transactionID);
  const { data: accounts } = useAccountsQuery();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(TransactionCreationSchema),
    defaultValues: {
      accountID: transaction?.accountID,
      type: transaction?.type,
      destinationAccountID: transaction?.destinationAccountID || "",
      amount: transaction?.amount.toString(),
      date: transaction?.date
        ? format(new Date(transaction.date), "yyyy-MM-dd")
        : "",
      description: transaction?.description,
    },
  });
  useEffect(() => {
    reset({
      accountID: transaction?.accountID,
      type: transaction?.type,
      destinationAccountID: transaction?.destinationAccountID || "",
      amount: transaction?.amount.toString(),
      date: transaction?.date
        ? format(new Date(transaction.date), "yyyy-MM-dd")
        : "",
      description: transaction?.description,
    });
  }, [transaction]);
  const transactionAccount = useWatch({ control, name: "accountID" });
  const transactionType = useWatch({ control, name: "type" });
  if (transactionType != "transfer") setValue("destinationAccountID", null);

  const mutation = useTransactionUpdateMutation(transactionID);
  const queryclient = useQueryClient();
  const navigate = useNavigate();

  if (mutation.isSuccess) {
    queryclient.invalidateQueries(TRANSACTION_KEYS.all);
    toast.success("Transaction Updated");
    navigate("/transactions");
  }

  const onSubmit = (data) => {
    console.log(data);
    mutation.mutate(data);
  };
  return (
    <>
      <div className={styles.banner} />
      <GridSection>
        <BackLink to={"/transactions"} className={styles.back}>
          Transactions
        </BackLink>
      </GridSection>
      <GridSection>
        <div className={styles.formWrapper}>
          <FlexCard className={styles.form}>
            {transaction && accounts ? (
              <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.header}>
                  <h3>Update Transaction</h3>
                  {/* <p className="small-text">
                  Create a new account to manage your finances effortlessly.
                  Fill in the details below to get started
                </p> */}
                </div>
                <SelectInput
                  name={"accountID"}
                  label={"Account"}
                  required
                  register={register}
                  error={errors.accountID}
                >
                  <option value=""></option>
                  {accounts &&
                    accounts.map((account) => (
                      <option key={account.id} value={account._id}>
                        {account.name}
                      </option>
                    ))}
                </SelectInput>
                <SelectInput
                  name={"type"}
                  label={"Transaction Type"}
                  required
                  register={register}
                  error={errors.type}
                >
                  <option value=""></option>
                  {["Income", "Expense", "Transfer"].map((type) => (
                    <option key={type} value={type.toLowerCase()}>
                      {type}
                    </option>
                  ))}
                </SelectInput>
                <SelectInput
                  name={"destinationAccountID"}
                  label={"Account to Transfer to"}
                  required={transactionType === "transfer"}
                  disabled={transactionType !== "transfer"}
                  register={register}
                  error={errors.destinationAccountID}
                >
                  <option value=""></option>
                  {accounts &&
                    accounts
                      .filter((account) => account._id !== transactionAccount)
                      .map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.name}
                        </option>
                      ))}
                </SelectInput>
                <TextInput
                  number
                  name={"amount"}
                  label={"Amount"}
                  register={register}
                  error={errors.amount}
                  required
                />
                <DateInput
                  name={"date"}
                  label={"Transaction Date"}
                  register={register}
                  error={errors.date}
                />
                <TextInput
                  name={"description"}
                  label={"Description"}
                  placeholder={"What's the purpose of this transaction..."}
                  register={register}
                  error={errors.description}
                />
                <button type="submit" className="primary--oxford-blue">
                  {mutation.isPending ? <Loader /> : "Save Transaction"}
                </button>
              </StyledForm>
            ) : (
              <Loader />
            )}
          </FlexCard>
        </div>
      </GridSection>
    </>
  );
};
export default TransactionEditPage;
