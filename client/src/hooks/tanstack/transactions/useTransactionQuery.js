import authAxios from "api/authAxios";
import { useQuery } from "@tanstack/react-query";
import { TRANSACTION_KEYS } from ".";

const fetchTransaction = async (transactionID, signal) => {
  const { data: transaction } = await authAxios.get(
    `/transactions/${transactionID}`,
    {
      signal,
    }
  );
  return transaction.data;
};

const useTransactionQuery = (transactionID) => {
  return useQuery({
    queryKey: TRANSACTION_KEYS.single(transactionID),
    queryFn: ({ signal }) => fetchTransaction(transactionID, signal),
    refetchInterval: 1000 * 60 * 10,
  });
};

export default useTransactionQuery;
