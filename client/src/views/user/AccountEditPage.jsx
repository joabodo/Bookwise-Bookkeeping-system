import { SelectInput, StyledForm, TextInput } from "components/shared/forms";
import styles from "./AccountCreationPage.module.css";
import GridSection from "components/shared/GridSection";
import { useNavigate, useParams } from "react-router-dom";
import { BackLink, FlexCard, Loader } from "components/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AccountCreationSchema } from "utils/validationSchemas";
import SUPPORTED_CURRENCIES from "constants/SUPPORTED_CURRENCIES";
import {
  ACCOUNT_KEYS,
  useAccountQuery,
  useAccountUpdateMutation,
  useNewAccountMutation,
} from "hooks/tanstack/accounts";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const AccountEditPage = () => {
  const { accountID } = useParams();
  const { data: account } = useAccountQuery(accountID);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(AccountCreationSchema),
    defaultValues: {
      name: account?.name,
      currency: account?.currency,
      description: account?.description,
    },
  });
  const mutation = useAccountUpdateMutation(accountID);
  const queryclient = useQueryClient();
  const navigate = useNavigate();
  const onSubmit = (data) => mutation.mutate(data);
  console.log(mutation.isSuccess);
  if (mutation.isSuccess) {
    queryclient.invalidateQueries(ACCOUNT_KEYS.all);
    toast.success("Update Successful");
    navigate(`/accounts/${accountID}`);
  }
  return (
    <>
      <div className={styles.banner} />
      <GridSection>
        <BackLink to={`/accounts/${accountID}`} className={styles.back}>
          {account ? account.name : "Account"}
        </BackLink>
      </GridSection>
      <GridSection>
        <div className={styles.formWrapper}>
          <FlexCard className={styles.form}>
            {account ? (
              <>
                <StyledForm onSubmit={handleSubmit(onSubmit)}>
                  <div className={styles.header}>
                    <h3>Edit Account</h3>
                    <p className="small-text">
                      Create a new account to manage your finances effortlessly.
                      Fill in the details below to get started
                    </p>
                  </div>
                  <TextInput
                    name={"name"}
                    label={"Account Name"}
                    placeholder={"Account Name"}
                    required
                    register={register}
                    error={errors.name}
                  />
                  <SelectInput
                    name={"currency"}
                    label={"Currency"}
                    required
                    register={register}
                    error={errors.currency}
                  >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <option
                        key={currency}
                        value={currency}
                        selected={currency === "KES"}
                      >
                        {currency}
                      </option>
                    ))}
                  </SelectInput>
                  <TextInput
                    name={"description"}
                    label={"Description"}
                    placeholder={"This account would be used for..."}
                    register={register}
                    error={errors.description}
                    required
                  />
                  <button type="submit" className="primary--oxford-blue">
                    {mutation.isPending ? <Loader /> : "Save"}
                  </button>
                </StyledForm>
              </>
            ) : (
              <Loader />
            )}
          </FlexCard>
        </div>
      </GridSection>
    </>
  );
};
export default AccountEditPage;
