import { useContext } from "react";
import { AuthContext } from "contexts/AuthProvider";

const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("useAuth was called outside of its Provider");

  return authContext;
};

export default useAuth;
