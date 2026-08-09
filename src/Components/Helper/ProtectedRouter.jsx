import React from "react";
import { useUser } from "../../UserContext";
import { Navigate } from "react-router";

const ProtectedRouter = ({ children, allowOnboarding = false }) => {
  const { data, login } = useUser();
  if (login === true) {
    if (data?.onboarding_required && !allowOnboarding) {
      return <Navigate to="/conta/completar-perfil" replace />;
    }
    return children;
  } else if (login === false) {
    return <Navigate to="/login" />;
  } else {
    return <></>;
  }
};

export default ProtectedRouter;
