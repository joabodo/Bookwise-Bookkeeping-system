import {
  DateInput,
  SelectInput,
  StyledForm,
  TextInput,
} from "components/shared/forms";
import styles from "./InvoiceCreationPage.module.css";
import GridSection from "components/shared/GridSection";
import { useNavigate, useParams } from "react-router-dom";
import { BackLink, FlexCard, Loader } from "components/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  AccountCreationSchema,
  InvoiceCreationSchema,
  InvoicePatchSchema,
} from "utils/validationSchemas";
import SUPPORTED_CURRENCIES from "constants/SUPPORTED_CURRENCIES";
import { ACCOUNT_KEYS, useNewAccountMutation } from "hooks/tanstack/accounts";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  useNewInvoiceMutation,
  INVOICES_KEYS,
  useInvoiceUpdateMutation,
  useInvoiceQuery,
} from "hooks/tanstack/invoices";
import { format } from "date-fns";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

const InvoiceEditPage = () => {
  const { invoiceID } = useParams();
  const { data: invoice } = useInvoiceQuery(invoiceID);
  console.log(invoice);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(InvoicePatchSchema),
    defaultValues: {
      email: invoice?.customer.email,
      currency: invoice?.currency,
      amount: invoice?.amount,
      description: invoice?.description,
      dueDate: invoice?.due_date
        ? format(new Date(invoice.due_date), "yyyy-MM-dd")
        : "",
    },
  });
  useEffect(() => {
    reset({
      email: invoice?.customer.email,
      currency: invoice?.currency,
      amount: invoice?.amount,
      description: invoice?.description,
      dueDate: invoice?.due_date
        ? format(new Date(invoice.due_date), "yyyy-MM-dd")
        : "",
    });
  }, [invoice]);
  const invoiceAmount = useWatch({ control, name: "amount" });
  const invoiceCurrency = useWatch({ control, name: "currency" });
  const mutation = useInvoiceUpdateMutation(invoiceID);
  const queryclient = useQueryClient();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    if (!invoice?.paid) {
      mutation.mutate(data);
    } else {
      toast.error("Can't update a paid invoice");
    }
  };
  if (mutation.isSuccess) {
    queryclient.invalidateQueries(INVOICES_KEYS.all);
    toast.success("Invoice Updated");
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
              {invoice ? (
                <>
                  <TextInput
                    name={"email"}
                    label={"Recipient Email"}
                    placeholder={"johndoe@example.com"}
                    disabled
                    required
                    register={register}
                    error={errors.email}
                  />
                  <TextInput
                    name={"amount"}
                    label={"Amount"}
                    placeholder={"125000"}
                    required
                    disabled={invoice?.paid}
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
                    disabled={invoice?.paid}
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
                    disabled={invoice?.paid}
                  />
                  <DateInput
                    name={"dueDate"}
                    label={"Due Date"}
                    register={register}
                    error={errors.dueDate}
                    disabled={invoice?.paid}
                  />
                </>
              ) : (
                <Loader />
              )}
              <button type="submit" className="primary--oxford-blue">
                {invoice?.paid ? (
                  <IoClose />
                ) : mutation.isPending ? (
                  <Loader />
                ) : (
                  "Send Invoice"
                )}
              </button>
            </StyledForm>
          </FlexCard>
        </div>
      </GridSection>
    </>
  );
};
export default InvoiceEditPage;
