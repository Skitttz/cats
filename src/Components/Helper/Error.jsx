import React from 'react';
import styles from './Error.module.css';

const Error = ({ error }) => {
  if (error === 'Failed to fetch') {
    error =
      'Ops! ocorreu um problema ao buscar os dados. Por favor, tente novamente mais tarde.';
  }
  if (!error || error === 'Token Inválido') return null;
  return <p className={`${styles.errorText} animeDown`}>{error}</p>;
};

export default Error;
