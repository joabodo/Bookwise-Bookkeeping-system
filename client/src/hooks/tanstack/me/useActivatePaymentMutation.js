import authAxios from "api/authAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import meKeys from "./ME_KEYS";

const useActivatePaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => authAxios.post("/users/me/activate/invoices", data),
    onSuccess: () => {
      queryClient.invalidateQueries(meKeys.all);
    },
  });
};

export default useActivatePaymentMutation;
