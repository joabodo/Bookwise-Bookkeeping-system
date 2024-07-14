import { useMutation } from "@tanstack/react-query";
import authAxios from "api/authAxios";

const useTransactionUpdateMutation = (transactionID) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      Object.keys(data).forEach((key) => {
        if (data[key] == "" || !data[key]) delete data[key];
      });
      console.log(data);
      return authAxios.patch(`/transactions/${transactionID}`, data);
    },
  });
  return mutation;
};

export default useTransactionUpdateMutation;
