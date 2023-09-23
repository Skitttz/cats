import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import LoginCreate from "./LoginCreate";
import LoginPasswordLost from "./LoginPasswordLost";
import LoginPasswordReset from "./LoginPasswordReset";
import { useUser } from "../../UserContext";
import styles from "./Login.module.css";
import NotFound404 from "../Helper/404/NotFound404";

const Login = () => {
  const { login } = useUser();
  if (login === true) {
    return <Navigate to="/conta" />;
  } else if (login === false) {
    return (
      <section className={styles.login}>
        <div className={styles.forms}>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="criar" element={<LoginCreate />} />
            <Route path="recuperar" element={<LoginPasswordLost />} />
            <Route path="redefinir" element={<LoginPasswordReset />} />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </div>
      </section>
    );
  } else {
    return <></>;
  }
};

export default Login;
