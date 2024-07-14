import { useMutation } from "@tanstack/react-query";
import authAxios from "api/authAxios";

const useNewInvoiceMutation = () => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return authAxios.post("/invoices", data);
    },
  });
  return mutation;
};

export default useNewInvoiceMutation;
