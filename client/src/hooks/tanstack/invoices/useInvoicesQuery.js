import authAxios from "api/authAxios";
import { useQuery } from "@tanstack/react-query";
import INVOICES_KEYS from "./INVOICES_KEYS";

const fetchInvoices = async (filters, signal) => {
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
  if (filters?.from) {
    const filter = `from=${filters.from}`;
    filtersArr.push(filter);
  }
  if (filters?.to) {
    const filter = `to=${filters.to}`;
    filtersArr.push(filter);
  }
  if (filters?.currency) {
    const filter = `currency=${filters.currency}`;
    filtersArr.push(filter);
  }
  const { data: invoices } = await authAxios.get(
    `/invoices?${filtersArr.join("&")}`,
    { signal }
  );
  return invoices.data;
};

const useInvoicesQuery = (enabled, filters = {}) => {
  return useQuery({
    queryKey: INVOICES_KEYS.filtered(filters),
    queryFn: ({ signal }) => fetchInvoices(filters, signal),
    enabled: !!enabled,
    refetchInterval: 1000 * 60 * 5,
  });
};

export default useInvoicesQuery;
