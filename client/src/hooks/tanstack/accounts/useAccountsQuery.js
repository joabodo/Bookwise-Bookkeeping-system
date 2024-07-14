import authAxios from "api/authAxios";
import { useQuery } from "@tanstack/react-query";
import ACCOUNT_KEYS from "./ACCOUNTS_KEYS";

const fetchTransactions = async (filters, signal) => {
  let filtersArr = [];
  if (filters?.currency) {
    types.join(",");
    const filter = `types=${filters.currency}`;
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
  const { data: accounts } = await authAxios.get(
    `/accounts?${filtersArr.join("&")}`,
    { signal }
  );
  return accounts.data;
};

const useAccountsQuery = (filters = {}) => {
  return useQuery({
    queryKey: ACCOUNT_KEYS.filtered(filters),
    queryFn: ({ signal }) => fetchTransactions(filters, signal),
    refetchInterval: 1000 * 60 * 5,
  });
};

export default useAccountsQuery;
