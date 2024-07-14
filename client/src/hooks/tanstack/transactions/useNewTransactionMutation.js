import { useMutation } from "@tanstack/react-query";
import authAxios from "api/authAxios";
import { TRANSACTION_KEYS } from ".";

const useNewTransactionMutation = () => {
  const mutation = useMutation({
    mutationFn: (data) => {
      Object.keys(data).forEach((key) => {
        if (data[key] == "" || !data[key]) delete data[key];
      });
      return authAxios.post("/transactions", data);
    },
  });
  return mutation;
};

export default useNewTransactionMutation;
