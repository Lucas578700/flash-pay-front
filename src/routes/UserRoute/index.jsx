import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

import Content from "../../components/Content";

const UserRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <CircularProgress />;

  return user ? <Content /> : <Navigate to="/" />;
};

export default UserRoute;
