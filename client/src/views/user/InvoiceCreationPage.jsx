import {
  DateInput,
  SelectInput,
  StyledForm,
  TextInput,
} from "components/shared/forms";
import styles from "./InvoiceCreationPage.module.css";
import GridSection from "components/shared/GridSection";
import { useNavigate } from "react-router-dom";
import { BackLink, FlexCard, Loader } from "components/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  AccountCreationSchema,
  InvoiceCreationSchema,
} from "utils/validationSchemas";
import SUPPORTED_CURRENCIES from "constants/SUPPORTED_CURRENCIES";
import { ACCOUNT_KEYS, useNewAccountMutation } from "hooks/tanstack/accounts";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNewInvoiceMutation, INVOICES_KEYS } from "hooks/tanstack/invoices";

const InvoiceCreationPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(InvoiceCreationSchema),
    defaultValues: {
      currency: "KES",
      amount: 0,
    },
  });
  const invoiceAmount = useWatch({ control, name: "amount" });
  const invoiceCurrency = useWatch({ control, name: "currency" });
  const mutation = useNewInvoiceMutation();
  const queryclient = useQueryClient();
  const navigate = useNavigate();
  const onSubmit = (data) => mutation.mutate(data);
  if (mutation.isSuccess) {
    queryclient.invalidateQueries(INVOICES_KEYS.all);
    toast.success("New Invoice Sent");
    navigate("/invoices");
  }
  return (
    <>
      <div className={styles.banner} />
      <GridSection>
        <BackLink to={"/invoices"} className={styles.back}>
          Invoices
        </BackLink>
      </GridSection>
      <GridSection>
        <div className={styles.formWrapper}>
          <FlexCard className={styles.form}>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.header}>
                <h3>Send New Invoice</h3>
                <p className="small-text">
                  Send a new Invoice and get paid in minutes. Fill in the
                  details below to get started
                </p>
              </div>
              <TextInput
                name={"email"}
                label={"Recipient Email"}
                placeholder={"johndoe@example.com"}
                required
                register={register}
                error={errors.email}
              />
              <TextInput
                name={"amount"}
                label={"Amount"}
                placeholder={"125000"}
                required
                register={register}
                error={errors.amount}
                number
                info={`The amount should be given in the subunit. (${invoiceCurrency} ${(
                  invoiceAmount / 100
                ).toFixed(2)})`}
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
              <DateInput
                name={"dueDate"}
                label={"Due Date"}
                register={register}
                error={errors.dueDate}
              />
              <button type="submit" className="primary--oxford-blue">
                {mutation.isPending ? <Loader /> : "Send Invoice"}
              </button>
            </StyledForm>
          </FlexCard>
        </div>
      </GridSection>
    </>
  );
};
export default InvoiceCreationPage;
