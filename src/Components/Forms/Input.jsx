import React from "react";
import styles from "./Input.module.css";
import Error from "../Helper/Error";

const Input = ({
  label,
  type,
  name,
  value,
  setValue,
  onChange,
  error,
  onBlur,
  placeholder,
  height,
}) => {
  const inputStyle = {
    height: height || "auto", // Se a altura não for fornecida, use "auto"
  };
  return (
    <div className={styles.wrapper}>
      <label htmlFor="" className={styles.label}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder ? placeholder : ""}
        style={inputStyle}
      />
      {error && <Error error={error} />}
    </div>
  );
};

export default Input;
