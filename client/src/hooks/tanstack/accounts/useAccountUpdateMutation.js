import { useMutation } from "@tanstack/react-query";
import authAxios from "api/authAxios";
import { ACCOUNT_KEYS } from ".";

const useAccountUpdateMutation = (accountID) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return authAxios.patch(`/accounts/${accountID}`, data);
    },
  });
  return mutation;
};

export default useAccountUpdateMutation;
