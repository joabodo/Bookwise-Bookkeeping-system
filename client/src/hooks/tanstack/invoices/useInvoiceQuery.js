import authAxios from "api/authAxios";
import { useQuery } from "@tanstack/react-query";
import { INVOICES_KEYS } from ".";

const fetchInvoices = async (invoiceID, signal) => {
  const { data: invoice } = await authAxios.get(`/invoices/${invoiceID}`, {
    signal,
  });
  return invoice.data;
};

const useInvoiceQuery = (invoiceID) => {
  return useQuery({
    queryKey: INVOICES_KEYS.invoice(invoiceID),
    queryFn: ({ signal }) => fetchInvoices(invoiceID, signal),
    refetchInterval: 1000 * 60 * 10,
  });
};

export default useInvoiceQuery;
