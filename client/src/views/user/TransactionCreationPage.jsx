import {
  DateInput,
  SelectInput,
  StyledForm,
  TextInput,
} from "components/shared/forms";
import styles from "./AccountCreationPage.module.css";
import GridSection from "components/shared/GridSection";
import { useNavigate } from "react-router-dom";
import { BackLink, FlexCard, Loader } from "components/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { TransactionCreationSchema } from "utils/validationSchemas";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  ACCOUNT_KEYS,
  useAccountsQuery,
  useNewAccountMutation,
} from "hooks/tanstack/accounts";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  TRANSACTION_KEYS,
  useNewTransactionMutation,
} from "hooks/tanstack/transactions";

const TransactionCreationPage = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(TransactionCreationSchema),
  });
  const transactionAccount = useWatch({ control, name: "accountID" });
  const transactionType = useWatch({ control, name: "type" });
  if (transactionType != "transfer") setValue("destinationAccountID", null);
  const { data: accounts } = useAccountsQuery();
  const mutation = useNewTransactionMutation();
  const queryclient = useQueryClient();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    console.log("Submitted");
    mutation.mutate(data);
  };
  console.log(transactionAccount);
  console.log(transactionType);
  if (mutation.isSuccess) {
    queryclient.invalidateQueries(TRANSACTION_KEYS.all);
    toast.success("Transaction Recorded");
    navigate("/transactions");
  }
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
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.header}>
                <h3>Record New transaction</h3>
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
                <option value="" selected></option>
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
                <option value="" selected></option>
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
                <option value="" selected></option>
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
                {mutation.isPending ? <Loader /> : "Record Transaction"}
              </button>
            </StyledForm>
          </FlexCard>
        </div>
      </GridSection>
    </>
  );
};
export default TransactionCreationPage;