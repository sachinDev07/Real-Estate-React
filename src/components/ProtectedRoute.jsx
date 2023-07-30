import { Navigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import Profile from "../pages/Profile";
import Spinner from "./Spinner";

const ProtectedRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) return <Spinner />;

  return loggedIn ? <Profile /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
