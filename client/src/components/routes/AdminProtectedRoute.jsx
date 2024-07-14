import useAuth from "hooks/context/auth/useAuth";
import { ProtectedRoute } from ".";
import ADMIN_ROLES from "constants/ADMIN_ROLES";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      {ADMIN_ROLES.includes(user.role.toLowerCase()) ? (
        children
      ) : (
        <h1>Forbidden</h1>
      )}
    </ProtectedRoute>
  );
};
export default AdminProtectedRoute;
