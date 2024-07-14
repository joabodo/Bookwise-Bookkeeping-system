import authAxios from "api/authAxios";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { TRANSACTION_KEYS } from ".";

const fetchTransactions = async (filters, signal) => {
  let filtersArr = [];
  if (filters?.types) {
    types.join(",");
    const filter = `types=${filters.types}`;
    filtersArr.push(filter);
  }
  if (filters?.from) {
    const filter = `from=${filters.from}`;
    filtersArr.push(filter);
  }
  if (filters?.to) {
    const filter = `to=${filters.to}`;
    filtersArr.push(filter);
  }
  if (filters?.page) {
    const filter = `page=${filters.page}`;
    filtersArr.push(filter);
  }
  if (filters?.limit) {
    const filter = `limit=${filters.limit}`;
    filtersArr.push(filter);
  }
  const { data: transactions } = await authAxios.get(
    `/transactions?${filtersArr.join("&")}`,
    { signal }
  );
  return transactions.data;
};

const useTransactionsQuery = (filters = {}) => {
  return useQuery({
    queryKey: TRANSACTION_KEYS.filtered(filters),
    queryFn: ({ signal }) => fetchTransactions(filters, signal),
    refetchInterval: 1000 * 60 * 10,
  });
};

export default useTransactionsQuery;
