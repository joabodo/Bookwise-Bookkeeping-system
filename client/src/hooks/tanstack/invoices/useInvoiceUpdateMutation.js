import { useMutation } from "@tanstack/react-query";
import authAxios from "api/authAxios";

const useInvoiceUpdateMutation = (invoiceID) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      Object.keys(data).forEach((key) => {
        if (data[key] == "" || !data[key]) delete data[key];
      });
      console.log(data);
      return authAxios.patch(`/invoices/${invoiceID}`, data);
    },
  });
  return mutation;
};

export default useInvoiceUpdateMutation;
