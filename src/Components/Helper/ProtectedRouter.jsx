import React from "react";
import { useUser } from "../../UserContext";
import { Navigate } from "react-router-dom";

const ProtectedRouter = ({ children }) => {
  const { login } = useUser();
  if (login === true) {
    return children;
  } else if (login === false) {
    return <Navigate to="/login" />;
  } else {
    return <></>;
  }
};

export default ProtectedRouter;
