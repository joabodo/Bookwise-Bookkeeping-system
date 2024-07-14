import authAxios from "api/authAxios";
import { useQuery } from "@tanstack/react-query";
import ACCOUNT_KEYS from "./ACCOUNTS_KEYS";

const fetchTransactions = async (accountID, signal) => {
  const { data: account } = await authAxios.get(`/accounts/${accountID}`, {
    signal,
  });
  return account.data;
};

const useAccountQuery = (accountID) => {
  return useQuery({
    queryKey: ACCOUNT_KEYS.account(accountID),
    queryFn: ({ signal }) => fetchTransactions(accountID, signal),
    refetchInterval: 1000 * 60 * 15,
  });
};

export default useAccountQuery;
