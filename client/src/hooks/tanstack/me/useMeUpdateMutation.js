import authAxios from "api/authAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import meKeys from "./ME_KEYS";

const useMeUpdateMutation = (data) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ signal }) => authAxios.patch("/users/me", data, { signal }),
    onSuccess: (data) => {
      queryClient.setQueryData(meKeys.all, data.data);
    },
  });
};

export default useMeUpdateMutation;
