import { Navigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import Profile from "../pages/Profile";

const ProtectedRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) return <h1>Loading...</h1>;

  return loggedIn ? <Profile /> :  <Navigate to="/sign-in" />;
  
};

export default ProtectedRoute;
