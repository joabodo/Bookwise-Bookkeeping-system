import { useMutation } from "@tanstack/react-query";
import authAxios from "api/authAxios";
import { ACCOUNT_KEYS } from ".";

const useNewAccountMutation = () => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return authAxios.post("/accounts", data);
    },
  });
  return mutation;
};

export default useNewAccountMutation;
