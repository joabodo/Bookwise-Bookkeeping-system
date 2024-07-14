import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

/**This RFC conditonally renders the nodes if there exists a valid user in the auth context and the user is verified.
 *
 * If there is no logged in user, it navigates to signin page with callbackURL set to the pathname of child route.
 *
 * If user is not verified, it navigates to verification page except where "noVerification" had ben set to true
 *
 * @example
 * <ProtectedRoute>
 *  <UserOnlyRoute/>
 * </ProtectedRoute>
 *
 * <ProtectedRoute noVerification>
 *  <CanAccessWithoutVerification/>
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <>
      <SignedOut>
        <Navigate
          to={`/signin${pathname != "/" ? `?redirect_url=${pathname}` : ""}`}
        />
      </SignedOut>
      <SignedIn>{children}</SignedIn>
    </>
  );
};

export default ProtectedRoute;
