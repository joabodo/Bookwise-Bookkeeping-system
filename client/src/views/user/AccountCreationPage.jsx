import { SelectInput, StyledForm, TextInput } from "components/shared/forms";
import styles from "./AccountCreationPage.module.css";
import GridSection from "components/shared/GridSection";
import { useNavigate } from "react-router-dom";
import { BackLink, FlexCard, Loader } from "components/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AccountCreationSchema } from "utils/validationSchemas";
import SUPPORTED_CURRENCIES from "constants/SUPPORTED_CURRENCIES";
import { ACCOUNT_KEYS, useNewAccountMutation } from "hooks/tanstack/accounts";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const AccountCreationPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(AccountCreationSchema),
  });
  const mutation = useNewAccountMutation();
  const queryclient = useQueryClient();
  const navigate = useNavigate();
  const onSubmit = (data) => mutation.mutate(data);
  console.log(mutation.isSuccess);
  if (mutation.isSuccess) {
    queryclient.invalidateQueries(ACCOUNT_KEYS.all);
    toast.success("New Account Created");
    navigate("/accounts");
  }
  return (
    <>
      <div className={styles.banner} />
      <GridSection>
        <BackLink to={"/accounts"} className={styles.back}>
          Accounts
        </BackLink>
      </GridSection>
      <GridSection>
        <div className={styles.formWrapper}>
          <FlexCard className={styles.form}>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.header}>
                <h3>Add New Account</h3>
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
                {mutation.isPending ? <Loader /> : "Create New Account"}
              </button>
            </StyledForm>
          </FlexCard>
        </div>
      </GridSection>
    </>
  );
};
export default AccountCreationPage;
