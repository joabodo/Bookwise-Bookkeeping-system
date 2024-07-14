import { Header, Loader } from "components/shared/ui";
import styles from "./InvoicesPage.module.css";
import GridSection from "components/shared/GridSection";
import { Link } from "react-router-dom";
import { BiMailSend } from "react-icons/bi";
import { useActivatePaymentMutation, useMeQuery } from "hooks/tanstack/me";
import EmptyState from "components/shared/EmptyState";
import { useState } from "react";
import Modal from "components/shared/Modal";
import toast from "react-hot-toast";
import useInvoicesQuery from "hooks/tanstack/invoices/useInvoicesQuery";
import InvoicesTable from "components/shared/ui/InvoiceTable";
const InvoicesPage = () => {
  const { data: user } = useMeQuery();
  const mutation = useActivatePaymentMutation();
  const { paymentsEnabled } = user || false;
  const { data: invoices } = useInvoicesQuery(paymentsEnabled);
  const [openActivateModal, setOpenActivateModal] = useState(false);
  const [APIKey, setAPIKey] = useState("");
  const handleOpen = () => {
    setAPIKey("");
    setOpenActivateModal(true);
  };
  const handleClose = () => {
    setAPIKey("");
    setOpenActivateModal(false);
  };
  const activatePayments = () => {
    if (APIKey == "") {
      toast.error("API Key cannot be empty");
    } else {
      mutation.mutate({ paystackKey: APIKey });
    }
  };
  if (mutation.isSuccess) {
    toast.success("Invoices Activated");
    mutation.reset();
    handleClose();
  }
  if (mutation.isError) {
    toast.error("Invalid API Key");
    mutation.reset();
  }
  return (
    <>
      <Header />
      {user ? (
        paymentsEnabled ? (
          <>
            <GridSection>
              <Link
                to={"/invoices/new"}
                className={` button primary--oxford-blue ${styles.actionBtn}`}
              >
                <BiMailSend />
                Send Invoice
              </Link>
            </GridSection>
            <GridSection>
              {invoices ? <InvoicesTable invoices={invoices} /> : <Loader />}
            </GridSection>
          </>
        ) : (
          // Payments Activation Prompt
          <GridSection>
            <div className={styles.emptystateWrapper}>
              <EmptyState
                title={"Looks like you haven't enabled payments"}
                description={
                  "To enable payments, you must have an active paystack account and access to the API Keys"
                }
                buttonLabel={"Activate Payments"}
                onClick={handleOpen}
              />
            </div>
            <Modal
              open={openActivateModal}
              handleClose={handleClose}
              title={"Activate Payments"}
            >
              <div className={styles.modalContent}>
                <p>To enable payments, kindly enter your Paystack Secret Key</p>
                <input
                  type="text"
                  className="input"
                  onChange={(e) => setAPIKey(e.target.value)}
                />
                <button
                  className="primary primary--oxford-blue"
                  onClick={activatePayments}
                >
                  {mutation.isPending ? <Loader white /> : "Activate"}
                </button>
              </div>
            </Modal>
          </GridSection>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};
export default InvoicesPage;
