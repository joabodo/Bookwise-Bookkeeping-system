import authAxios from "api/authAxios";
// import { auth } from "services/firebase/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import meKeys from "./ME_KEYS";

const fetchMe = async (signal) => {
  const { data: user } = await authAxios.get(`/users/me`, { signal });
  return user.data;
};

const useMeQuery = () => {
  return useQuery({
    queryKey: meKeys.all,
    queryFn: ({ signal }) => fetchMe(signal),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15,
  });
};

export default useMeQuery;
