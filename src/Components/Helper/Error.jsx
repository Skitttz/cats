import React from "react";
import styles from "./Error.module.css";

const Error = ({ error }) => {
  if (error === "Failed to fetch") {
    error = "Falha com o servidor, tente novamente mais tarde.";
  }
  if (!error) return null;
  return <p className={`${styles.errorText} animeDown`}>{error}</p>;
};

export default Error;
